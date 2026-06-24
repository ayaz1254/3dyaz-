"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
  user: { name: string | null };
  productId: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingOnly, setPendingOnly] = useState(true);

  useEffect(() => {
    const url = pendingOnly ? "/api/reviews?pending=true" : "/api/reviews";
    fetch(url)
      .then((r) => r.json())
      .then(setReviews);
  }, [pendingOnly]);

  async function handleApproval(id: string, approved: boolean) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: approved }),
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Yorumlar</h1>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={pendingOnly}
            onChange={() => setPendingOnly(!pendingOnly)}
            className="rounded"
          />
          Sadece onay bekleyenler
        </label>
      </div>

      {reviews.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          {pendingOnly ? "Onay bekleyen yorum yok." : "Henüz yorum yok."}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border bg-white p-4 dark:bg-gray-950"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                    </span>
                    <span className="text-sm font-medium">
                      {review.user.name || "Anonim"}
                    </span>
                    {!review.isApproved && (
                      <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                        Bekliyor
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!review.isApproved && (
                    <button
                      onClick={() => handleApproval(review.id, true)}
                      className="rounded bg-green-100 px-3 py-1 text-xs text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                    >
                      Onayla
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="rounded bg-red-100 px-3 py-1 text-xs text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                  >
                    Sil
                  </button>
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
