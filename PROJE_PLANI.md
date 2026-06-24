# 3D Magza - Proje Planı

> 3D baskı ürünleri satan e-ticaret platformu
> Hazırlanma Tarihi: 23 Haziran 2026

---

## 1. Proje Vizyonu

3D baskı meraklısı bir girişimcinin, kendi yazıcılarında bastığı modelleri satabileceği, aynı zamanda müşterilerin kendi modellerini yükleyip baskı siparişi verebileceği modern bir e-ticaret platformu.

---

## 2. Tech Stack

| Alan | Teknoloji | Sebep |
|------|-----------|-------|
| **Frontend** | Next.js 16 (App Router) | Tek dil, SEO dostu, modern React |
| **Stil** | Tailwind CSS v4 + shadcn/ui | Hızlı UI, özelleştirilebilir |
| **Backend** | Next.js API Routes + Server Actions | Tek repo, monolith başla |
| **Database** | PostgreSQL + Prisma ORM | Tip güvenli, modern ORM |
| **Auth** | NextAuth.js v5 | Kolay entegrasyon, credential + OAuth |
| **Dosya** | AWS S3 | Güvenilir, ölçeklenebilir depolama |
| **Validation** | Zod v4 | Schema bazlı doğrulama |
| **Deploy** | Vercel | Tek tık, otomatik CI/CD |

---

## 3. MVP Kapsamı

### 3.1. Kullanıcı Tipleri

| Rol | Açıklama |
|-----|----------|
| **Ziyaretçi** | Kayıt olmamış kullanıcı - ürünleri görür, sepete ekler |
| **Müşteri** | Kayıtlı kullanıcı - sipariş verir, takip eder, model yükler |
| **Admin** | Site yöneticisi - ürün, sipariş, upload yönetimi |

### 3.2. MVP Özellikleri (Must-Have)

**Katalog & Ürünler**
- [ ] Ürün listeleme (grid/liste, kategoriler, filtreleme)
- [ ] Ürün detay sayfası (görsel, açıklama, fiyat, boyut)
- [ ] Kategori bazlı gezinti
- [ ] Ürün arama
- [ ] Stok durumu gösterme

**Kullanıcı Sistemi**
- [ ] Kayıt olma (e-posta + şifre)
- [ ] Giriş / çıkış
- [ ] Şifre sıfırlama
- [ ] Müşteri paneli (sipariş geçmişi, profil)

**Sepet & Sipariş**
- [ ] Sepete ekle/çıkar
- [ ] Adres bilgisi girme
- [ ] Havale bildirimi (dekont yükle)
- [ ] Kapıda ödeme seçeneği
- [ ] Sipariş onay sayfası
- [ ] Sipariş durumu takibi

**Custom Upload (Öne Çıkan Özellik)**
- [ ] Müşteri STL/OBJ/3MF dosyası yükleme
- [ ] Boyut/renk tercihi belirtme
- [ ] Admin inceleme + fiyat teklifi
- [ ] Müşteri onay/red
- [ ] Onaylanınca siparişe dönüşme

**Admin Paneli**
- [ ] Ürün CRUD
- [ ] Kategori yönetimi
- [ ] Sipariş listesi + durum güncelleme
- [ ] Custom upload talepleri yönetimi
- [ ] Müşteri listesi
- [ ] Kargo takip girişi

### 3.3. Sonraki Sürümler

| Özellik | Sürüm |
|---------|-------|
| Online ödeme (kredi kartı) | v2 |
| Dijital model indirme (STL satışı) | v2 |
| E-posta bildirimleri | v2 |
| Puan/değerlendirme | v2 |
| İndirim kuponları | v3 |
| Çoklu dil desteği | v3 |
| Blog / haberler | v3 |
| 3D model viewer (tarayıcıda) | v3 |

---

## 4. Veritabanı Şeması

### Modeller

**User** - Müşteri ve admin hesapları
**Account / Session** - NextAuth.js için
**Address** - Teslimat adresleri
**Category** - Ürün kategorileri (hiyerarşik)
**Product** - Ürünler (fiyat, stok, görsel, boyut)
**Order** - Siparişler (durum, ödeme yöntemi, kargo)
**OrderItem** - Sipariş kalemleri
**Payment** - Ödeme bilgileri (havale dekontu)
**CustomUpload** - Müşteri model yükleme talepleri

### İlişkiler

```
User 1──N Address
User 1──N Order
User 1──N CustomUpload
Category 1──N Product
Order 1──N OrderItem
Order 1──1 Payment
Product 1──N OrderItem
CustomUpload N──1 Order (opsiyonel)
Category N──1 Category (parent - hiyerarşi)
```

---

## 5. Klasör Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Giriş/kayıt sayfaları
│   ├── (shop)/             # Alışveriş sayfaları (public)
│   ├── dashboard/          # Müşteri paneli
│   ├── admin/              # Admin paneli
│   └── api/                # API route'ları
├── components/             # Paylaşılan bileşenler
│   ├── ui/                 # shadcn/ui
│   ├── layout/             # Header, Footer, Sidebar
│   ├── product/            # Ürün bileşenleri
│   ├── cart/               # Sepet bileşenleri
│   ├── order/              # Sipariş bileşenleri
│   ├── upload/             # Dosya yükleme bileşenleri
│   └── shared/             # Genel bileşenler
├── lib/                    # Utility'ler
├── actions/                # Server Actions
├── schemas/                # Zod şemaları
├── types/                  # TypeScript tipleri
└── hooks/                  # Custom React hooks
```

---

## 6. API Route'ları

| Route | Metod | Açıklama |
|-------|-------|----------|
| `api/auth/*` | - | NextAuth.js auth |
| `api/products` | GET | Ürün listele (filtre + pagination) |
| `api/products` | POST | Yeni ürün (admin) |
| `api/products/[id]` | GET/PUT/DELETE | Ürün işlemleri |
| `api/categories` | GET | Kategoriler |
| `api/orders` | GET/POST | Sipariş listele/oluştur |
| `api/orders/[id]` | GET/PUT | Sipariş detay/güncelle |
| `api/uploads` | GET/POST | Upload listele/oluştur |
| `api/uploads/[id]` | GET/PUT | Upload detay/değerlendir |
| `api/payments/transfer` | POST | Havale bildirimi |
| `api/admin/stats` | GET | Admin istatistik |

---

## 7. Custom Upload Süreci

```
1. Müşteri dosya yükler → Status: PENDING
2. Admin inceler → Status: REVIEWING
3. Admin fiyat verir/reddeder → Status: PRICED / REJECTED
4. Müşteri teklifi onaylar → Status: APPROVED → Sipariş oluşur
5. Sipariş normal akışa girer
```

---

## 8. Geliştirme Sırası

| Aşama | İş | Agent |
|-------|---|-------|
| **1** | Prisma şeması + DB migration | Backend-dev |
| **2** | NextAuth kurulumu + login/register | Backend-dev |
| **3** | Admin paneli iskeleti (layout, sidebar) | Frontend-dev |
| **4** | Ürün CRUD + kategori yönetimi | Backend-dev + Frontend-dev |
| **5** | Ürün listeleme + detay sayfası (public) | Frontend-dev |
| **6** | Sepet sistemi | Frontend-dev + Backend-dev |
| **7** | Sipariş akışı + ödeme | Backend-dev |
| **8** | Custom upload sistemi | Backend-dev + Frontend-dev |
| **9** | Müşteri paneli (sipariş takibi) | Frontend-dev |
| **10** | Güvenlik denetimi | Güvenlikçi |
| **11** | Testler | Dedektif |
| **12** | Kod incelemesi | Reviewer |
| **13** | Dokümantasyon | Scribe |
| **14** | Deploy (Vercel) | - |
