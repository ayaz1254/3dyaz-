"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCart, getCartTotal, getCartCount, clearCart } from "@/lib/cart";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [items, setItems] = useState(getCart());
  const [count, setCount] = useState(getCartCount());
  const [total, setTotal] = useState(getCartTotal());

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"TRANSFER" | "COD" | "CREDIT_CARD">("TRANSFER");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [appliedCode, setAppliedCode] = useState("");

  // Card form state
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const threeDSContainer = useRef<HTMLDivElement>(null);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrTitle, setAddrTitle] = useState("");
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrDistrict, setAddrDistrict] = useState("");
  const [addrFull, setAddrFull] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (session?.user) {
      fetchAddresses();
    }
  }, [session, status]);

  async function fetchAddresses() {
    setItems(getCart());
    setCount(getCartCount());
    setTotal(getCartTotal());
    const res = await fetch("/api/user/addresses");
    if (res.ok) {
      const data = await res.json();
      setAddresses(data);
      if (data.length > 0) setSelectedAddress(data[0].id);
    }
  }

  async function addAddress(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: addrTitle,
        fullName: addrName,
        phone: addrPhone,
        city: addrCity,
        district: addrDistrict,
        fullAddress: addrFull,
      }),
    });

    if (res.ok) {
      setShowAddressForm(false);
      resetAddressForm();
      fetchAddresses();
    }
  }

  function resetAddressForm() {
    setAddrTitle("");
    setAddrName("");
    setAddrPhone("");
    setAddrCity("");
    setAddrDistrict("");
    setAddrFull("");
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponError("");

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, totalAmount: getCartTotal() }),
    });

    const data = await res.json();
    if (data.valid) {
      setCouponDiscount(data.discountAmount);
      setAppliedCode(data.code);
      setCouponError("");
    } else {
      setCouponDiscount(0);
      setAppliedCode("");
      setCouponError(data.error || "Geçersiz kupon");
    }
  }

  // Format card number with spaces
  function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  // Format expiry as MM/YY
  function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  // Render 3DS form from iyzico HTML content
  function renderThreeDSForm(base64Html: string) {
    const html = atob(base64Html);
    const temp = document.createElement("div");
    temp.innerHTML = html;
    const form = temp.querySelector("form");
    if (form) {
      form.style.display = "none";
      document.body.appendChild(form);
      // Script'ler innerHTML'de çalışmaz, form'u manuel submit ediyoruz
      setTimeout(() => form.submit(), 300);
    }
  }

  async function initiateCardPayment(orderData: {
    items: any[];
    addressId: string;
    card: { cardHolderName: string; cardNumber: string; expireMonth: string; expireYear: string; cvc: string };
    couponCode: string | null;
    notes: string | null;
  }) {
    setLoading(true);
    setError("");

    const res = await fetch("/api/payment/iyzico-init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ödeme başlatılamadı");
      setLoading(false);
      return;
    }

    clearCart();

    if (data.threeDSHtmlContent) {
      // Render bank 3DS form — user will be redirected
      renderThreeDSForm(data.threeDSHtmlContent);
    } else {
      // No 3DS needed (unusual for iyzico but handle gracefully)
      router.push(`/siparis/${data.orderId}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAddress) {
      setError("Lütfen bir adres seçin");
      return;
    }

    if (paymentMethod === "CREDIT_CARD") {
      // Validate card fields
      if (!cardHolder.trim()) { setError("Kart üzerindeki isim gerekli"); return; }
      const cardDigits = cardNumber.replace(/\s/g, "");
      if (cardDigits.length < 16) { setError("Geçerli kart numarası girin"); return; }
      if (cardExpiry.length < 5) { setError("Geçerli son kullanma tarihi girin"); return; }
      if (cardCvc.length < 3) { setError("Geçerli CVC girin"); return; }

      const [expMonth, expYear] = cardExpiry.split("/");

      await initiateCardPayment({
        items,
        addressId: selectedAddress,
        card: {
          cardHolderName: cardHolder,
          cardNumber: cardDigits,
          expireMonth: expMonth,
          expireYear: expYear,
          cvc: cardCvc,
        },
        couponCode: appliedCode || null,
        notes: notes || null,
      });
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        addressId: selectedAddress,
        paymentMethod,
        couponCode: appliedCode || null,
        notes: notes || null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      clearCart();
      router.push(`/siparis/${data.orderId}`);
    } else {
      const data = await res.json();
      setError(data.error || "Sipariş oluşturulamadı");
    }
    setLoading(false);
  }

  if (status === "loading") return <div className="p-8 text-center">Yükleniyor...</div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="mb-4 text-lg text-gray-500">Sepetiniz boş</p>
        <button onClick={() => router.push("/urunler")} className="text-blue-600 hover:underline">
          Alışverişe Başla
        </button>
      </div>
    );
  }

  const shipping = total >= 500 ? 0 : 49.9;
  const grandTotal = Math.max(0, total + shipping - couponDiscount);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Siparişi Tamamla</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Address + Payment */}
        <div className="space-y-6">
          {/* Address */}
          <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
            <h2 className="mb-3 font-semibold">Teslimat Adresi</h2>

            {addresses.length > 0 && !showAddressForm && (
              <div className="space-y-2">
                {addresses.map((addr: any) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer rounded-lg border p-3 text-sm ${
                      selectedAddress === addr.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="mt-0.5 mr-2"
                    />
                    <div>
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-gray-500">{addr.fullAddress}</p>
                      <p className="text-gray-500">
                        {addr.district}, {addr.city} - {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Yeni Adres Ekle
                </button>
              </div>
            )}

            {showAddressForm && (
              <div className="space-y-3">
                <input
                  required
                  value={addrTitle}
                  onChange={(e) => setAddrTitle(e.target.value)}
                  placeholder="Adres Başlığı (Ev / İş)"
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
                  />
                  <input
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="Telefon"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="İl"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
                  />
                  <input
                    required
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    placeholder="İlçe"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
                  />
                </div>
                <textarea
                  required
                  value={addrFull}
                  onChange={(e) => setAddrFull(e.target.value)}
                  placeholder="Adres (cadde, sokak, mahalle, apartman...)"
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addAddress}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
            <h2 className="mb-3 font-semibold">Ödeme Yöntemi</h2>
            <div className="space-y-2">
              <label
                className={`flex cursor-pointer rounded-lg border p-3 text-sm ${
                  paymentMethod === "CREDIT_CARD"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="CREDIT_CARD"
                  checked={paymentMethod === "CREDIT_CARD"}
                  onChange={() => setPaymentMethod("CREDIT_CARD")}
                  className="mt-0.5 mr-2"
                />
                <div>
                  <p className="font-medium">Kredi Kartı</p>
                  <p className="text-gray-500">3D Secure ile güvenli ödeme</p>
                </div>
              </label>

              {paymentMethod === "CREDIT_CARD" && (
                <div className="mt-3 space-y-3 rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
                  <input
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Kart Üzerindeki İsim"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
                    autoComplete="cc-name"
                  />
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="Kart Numarası"
                    className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
                    autoComplete="cc-number"
                    inputMode="numeric"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="AA/YY"
                      className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
                      autoComplete="cc-exp"
                      inputMode="numeric"
                    />
                    <input
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="CVC"
                      className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
                      autoComplete="cc-csc"
                      inputMode="numeric"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Kart bilgileriniz 3D Secure ile güvenli şekilde işlenir, sistemimizde saklanmaz.
                  </p>
                </div>
              )}

              <label
                className={`flex cursor-pointer rounded-lg border p-3 text-sm ${
                  paymentMethod === "TRANSFER"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="TRANSFER"
                  checked={paymentMethod === "TRANSFER"}
                  onChange={() => setPaymentMethod("TRANSFER")}
                  className="mt-0.5 mr-2"
                />
                <div>
                  <p className="font-medium">Havale / EFT</p>
                  <p className="text-gray-500">
                    Sipariş onayından sonra IBAN&apos;a havale yapın
                  </p>
                </div>
              </label>
              <label
                className={`flex cursor-pointer rounded-lg border p-3 text-sm ${
                  paymentMethod === "COD"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mt-0.5 mr-2"
                />
                <div>
                  <p className="font-medium">Kapıda Ödeme</p>
                  <p className="text-gray-500">Kuryeye teslimatta nakit/kart ile ödeyin</p>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
            <h2 className="mb-3 font-semibold">Sipariş Notu</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="İsteğe bağlı not ekleyin..."
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
            />
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="rounded-lg border bg-white p-4 dark:bg-gray-950">
          <h2 className="mb-3 font-semibold">Sipariş Özeti</h2>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 py-2">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500">{item.quantity} adet</p>
                </div>
                <p className="text-sm font-medium">
                  {(item.price * item.quantity).toFixed(2)} ₺
                </p>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-4 border-t pt-4">
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Kupon kodu"
                className="flex-1 rounded-lg border px-3 py-2 text-sm dark:bg-gray-900"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={!couponCode.trim() || !!appliedCode}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-800"
              >
                Uygula
              </button>
            </div>
            {couponError && <p className="mt-1 text-xs text-red-600">{couponError}</p>}
            {appliedCode && (
              <div className="mt-2 flex items-center justify-between rounded bg-green-50 p-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                <span>Kupon {appliedCode} uygulandı</span>
                <button
                  type="button"
                  onClick={() => {
                    setCouponDiscount(0);
                    setAppliedCode("");
                    setCouponCode("");
                  }}
                  className="text-xs underline"
                >
                  Kaldır
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Ürün Toplamı ({count} adet)</span>
              <span>{total.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo</span>
              <span>{shipping === 0 ? "Ücretsiz" : `${shipping.toFixed(2)} ₺`}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>İndirim</span>
                <span>-{couponDiscount.toFixed(2)} ₺</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Toplam</span>
              <span>{grandTotal.toFixed(2)} ₺</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedAddress}
            className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sipariş oluşturuluyor..." : "Siparişi Onayla"}
          </button>

          {paymentMethod === "TRANSFER" && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200">
              <p className="font-medium">Havale/EFT Bilgisi:</p>
              <p>Siparişiniz oluşturulduktan sonra IBAN bilgilerimiz ekranda gösterilecektir.</p>
            </div>
          )}

          {paymentMethod === "CREDIT_CARD" && (
            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              <p className="font-medium">Güvenli Ödeme:</p>
              <p>Ödeme 3D Secure ile korunur. Bankanızın yönlendirmesiyle güvenli sayfaya aktarılacaksınız.</p>
            </div>
          )}

          {/* Hidden container for 3DS form rendering */}
          <div ref={threeDSContainer} style={{ display: "none" }} />
        </div>
      </form>
    </div>
  );
}
