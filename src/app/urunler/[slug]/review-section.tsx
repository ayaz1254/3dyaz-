"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null };
}

export function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then(setReviews);
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((t, r) => t + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment: comment || undefined }),
    });

    if (res.ok) {
      setMessage("Yorumunuz alındı. Onaylandıktan sonra yayınlanacaktır.");
      setComment("");
      const updated = await fetch(`/api/reviews?productId=${productId}`).then((r) => r.json());
      setReviews(updated);
    } else {
      const data = await res.json();
      setMessage(data.error || "Yorum gönderilemedi");
    }
    setLoading(false);
  }

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="mb-6 text-xl font-bold">Yorumlar</h2>

      {/* Average rating */}
      {reviews.length > 0 && (
        <div className="mb-6 flex items-center gap-3 text-sm">
          <span className="text-2xl font-bold text-yellow-500">{avgRating}</span>
          <span className="text-yellow-500">{starsDisplay(Math.round(parseFloat(avgRating || "0")))}</span>
          <span className="text-gray-500">({reviews.length} yorum)</span>
        </div>
      )}

      {/* Review list */}
      <div className="mb-8 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">Henüz yorum yapılmamış.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border bg-white p-4 dark:bg-gray-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-sm">{starsDisplay(review.rating)}</span>
                  <span className="text-sm font-medium">{review.user.name || "Anonim"}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review form */}
      {session?.user ? (
        <form onSubmit={handleSubmit} className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h3 className="mb-3 font-semibold">Yorum Yap</h3>

          <div className="mb-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Yorumunuz (isteğe bağlı)"
            rows={3}
            maxLength={1000}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />

          {message && (
            <p className={`mt-2 text-sm ${message.includes("alındı") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500">Yorum yapmak için giriş yapmalısınız.</p>
      )}
    </div>
  );
}

function starsDisplay(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
