"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      fetchProfile();
    }
  }, [session, status]);

  async function fetchProfile() {
    const res = await fetch("/api/user/profile");
    if (res.ok) {
      const data = await res.json();
      setName(data.name || "");
      setPhone(data.phone || "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    if (res.ok) {
      setMessage("Profil güncellendi");
    } else {
      setMessage("Güncelleme başarısız");
    }
    setLoading(false);
  }

  if (status === "loading") return <div className="p-8 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profil</h1>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-lg border bg-white p-6 dark:bg-gray-950">
        {message && (
          <p className="text-sm text-green-600">{message}</p>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Ad Soyad</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">E-posta</label>
          <input
            value={email}
            disabled
            className="w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Telefon</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XX XXX XX XX"
            className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
