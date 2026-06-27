"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GlassCard } from "@/components/glass-card";

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
    <div>
      <h2 className="mb-8 text-2xl font-bold text-white">Yorumlar</h2>

      {/* Average rating */}
      {reviews.length > 0 && avgRating && (
        <GlassCard glowColor="rgba(250, 204, 21, 0.06)">
          <div className="flex items-center gap-4 p-5">
            <span className="text-4xl font-bold text-yellow-400">{avgRating}</span>
            <div>
              <div className="text-lg text-yellow-400">
                {starsDisplay(Math.round(parseFloat(avgRating)))}
              </div>
              <span className="text-sm text-gray-500">({reviews.length} yorum)</span>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Review list */}
      <div className="mb-8 mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">Henüz yorum yapılmamış.</p>
        ) : (
          reviews.map((review) => (
            <GlassCard key={review.id} glowColor="rgba(255,255,255,0.03)">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#05cc47]/20 text-xs font-medium text-[#05cc47]">
                      {(review.user.name || "A")[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-200">
                      {review.user.name || "Anonim"}
                    </span>
                    <span className="text-sm text-yellow-400">{starsDisplay(review.rating)}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-400">{review.comment}</p>
                )}
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Review form */}
      {session?.user ? (
        <GlassCard glowColor="rgba(5, 204, 71, 0.06)">
          <form onSubmit={handleSubmit} className="p-5">
            <h3 className="mb-4 font-semibold text-white">Yorum Yap</h3>

            <div className="mb-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-gray-600"
                  }`}
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
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#05cc47]/50"
            />

            {message && (
              <p
                className={`mt-3 text-sm ${
                  message.includes("alındı") ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-xl bg-[#05cc47] px-8 py-2.5 text-sm font-medium text-black shadow-lg shadow-[#05cc47]/20 transition hover:bg-[#05cc47]/90 hover:shadow-[#05cc47]/40 disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Gönder"}
            </button>
          </form>
        </GlassCard>
      ) : (
        <GlassCard glowColor="rgba(255,255,255,0.03)">
          <div className="p-5 text-center">
            <p className="text-sm text-gray-500">
              Yorum yapmak için giriş yapmalısınız.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function starsDisplay(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
