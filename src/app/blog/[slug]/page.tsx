"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { GlassCard } from "@/components/glass-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { useEffect, useState } from "react";

interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  category: string | null;
  author: string | null;
  published: boolean;
  createdAt: string;
}

const fallbackData: Record<string, { title: string; content: string[]; image: string; category: string }> = {
  "3d-baski-teknolojisi-nedir": {
    title: "3D Baskı Teknolojisi Nedir? Nasıl Çalışır?",
    category: "Teknoloji",
    image: "/images/blog/3d-baski-teknolojisi.svg",
    content: [
      "3D baskı, dijital bir modeli katman katman ekleyerek fiziksel bir nesneye dönüştüren üretim teknolojisidir. Geleneksel üretim yöntemlerinin aksine, 3D baskıda malzeme eksiltme yerine ekleme yapılır, bu da minimum atık anlamına gelir.",
      "Teknoloji, 1980'lerde ortaya çıkmış olmasına rağmen son yıllarda maliyetlerin düşmesi ve malzeme çeşitliliğinin artmasıyla birlikte hem endüstriyel hem de hobi amaçlı kullanımda büyük bir patlama yaşamıştır.",
      "3D baskı süreci temel olarak üç adımdan oluşur: Modelleme, Dilimleme ve Baskı. İlk adımda, bir 3D model oluşturulur veya hazır bir model indirilir. Bu modeller STL, OBJ veya 3MF gibi formatlarda olabilir.",
      "İkinci adım olan dilimlemede, 3D model özel bir yazılım (dilimleyici) tarafından ince katmanlara ayrılır. Her katman, yazıcının izleyeceği yolu belirleyen G-kodu talimatlarına dönüştürülür.",
      "Son adımda ise 3D yazıcı, bu talimatları takip ederek malzemeyi katman katman eritir veya sertleştirir ve fiziksel nesneyi oluşturur. Katman kalınlığı genellikle 0.1mm ile 0.3mm arasında değişir.",
      "Günümüzde 3D baskı; prototipleme, tıp (protez ve implantlar), otomotiv, havacılık, mimari, eğitim ve kişisel kullanım gibi çok geniş bir yelpazede uygulama alanı bulmaktadır.",
    ],
  },
  "pla-vs-petg-vs-abs": {
    title: "PLA vs PETG vs ABS: Doğru Filament Seçimi",
    category: "Malzeme",
    image: "/images/blog/filament-rehberi.svg",
    content: [
      "3D baskı dünyasına adım attığınızda karşınıza çıkan ilk büyük karar: Hangi filament türünü kullanmalıyım? PLA, PETG ve ABS en yaygın kullanılan üç filament türüdür ve her birinin kendine özgü avantajları vardır.",
      "PLA (Polilaktik Asit): En kolay baskı yapılan filament türüdür. Mısır nişastası gibi yenilenebilir kaynaklardan üretilir, biyolojik olarak parçalanabilir ve baskı sırasında neredeyse hiç koku çıkarmaz. Düşük sıcaklıkta (190-220°C) baskı yapılır ve yatak ısıtması gerektirmez. Mekanik dayanımı orta düzeydedir ve UV ışınlarına karşı hassastır.",
      "PETG (Polietilen Tereftalat Glikol): PLA'nın kolay baskılanabilirliği ile ABS'nin dayanıklılığını birleştirir. PETG, PLA'dan daha dayanıklıdır, daha esnektir ve kimyasallara karşı daha dirençlidir. Baskı sıcaklığı 220-250°C arasındadır ve yatak ısıtması önerilir. Gıda ile temas eden ürünler için uygundur.",
      "ABS (Akrilonitril Bütadien Stiren): LEGO bloklarının da hammaddesi olan ABS, yüksek dayanıklılık ve darbe direnci sunar. Baskı sırasında büzülme (çekme) yapabilir ve hafif bir koku çıkarır, bu nedenle iyi havalandırma gerektirir. Baskı sıcaklığı 230-260°C arasındadır ve ısıtmalı yatak şarttır.",
      "Hangi filamenti seçmelisiniz? Eğer yeni başlıyorsanız PLA ile başlayın. Daha dayanıklı, fonksiyonel parçalar için PETG ideal. Yüksek sıcaklık veya darbe dayanımı gereken projelerde ABS tercih edin. Projenizin ihtiyaçlarına göre doğru filament seçimi, başarılı bir baskının anahtarıdır.",
    ],
  },
  "3d-baski-ozel-hediye-fikirleri": {
    title: "3D Baskı ile Özel Hediye Fikirleri",
    category: "İlham",
    image: "/images/blog/hediye-fikirleri.svg",
    content: [
      "Sevdiklerinize verebileceğiniz en anlamlı hediyeler, onlar için özel olarak tasarlanmış ve üretilmiş olanlardır. 3D baskı teknolojisi, kişiselleştirilmiş hediyeler oluşturmak için harika fırsatlar sunar.",
      "Fotoğraftan Heykelcik: En popüler 3D baskı hediye seçeneği. Sevdiklerinizin fotoğraflarından 3D model çıkararak gerçekçi heykelcikler yaptırabilirsiniz. Doğum günü, yıldönümü veya özel anılar için mükemmel bir seçenek.",
      "Kişiselleştirilmiş Anahtarlık: İsim, tarih veya özel bir mesaj içeren anahtarlıklar. Küçük ama anlamlı hediyeler arayanlar için ideal. Renk ve tasarım seçenekleriyle tamamen kişiselleştirilebilir.",
      "Özel Kupa Bardak: Sevdiğiniz birinin en sevdiği karakter, hayvan veya desen şeklinde tasarlanmış kupa bardaklar. Günlük kullanım için pratik ve anlamlı bir hediye.",
      "Masaüstü Figürleri: Oyun karakterleri, süper kahramanlar veya özel tasarım figürler. Oyun severler ve koleksiyoncular için harika bir hediye seçeneği. İstediğiniz boyut ve renkte üretilebilir.",
      "Takı ve Aksesuarlar: 3D baskı ile küpe, kolye, bileklik ve yüzük gibi takılar üretebilirsiniz. Hafif, konforlu ve tamamen size özel tasarımlar.",
    ],
  },
  "fdm-vs-sla-karsilastirmasi": {
    title: "FDM vs SLA: Hangisi Sizin İçin Uygun?",
    category: "Teknoloji",
    image: "/images/blog/fdm-vs-sla.svg",
    content: [
      "3D baskı denilince akla gelen iki ana teknoloji vardır: FDM (Fused Deposition Modeling) ve SLA (Stereolithography). Her iki teknoloji de katmanlı üretim yapmakla birlikte, çalışma prensipleri ve sonuç ürünler oldukça farklıdır.",
      "FDM, eritilmiş filamentin bir nozuldan katman katman biriktirilmesi prensibiyle çalışır. En yaygın ve ekonomik 3D baskı teknolojisidir. PLA, PETG, ABS, TPU gibi geniş malzeme seçeneği sunar. Mekanik dayanımı yüksektir ancak yüzey kalitesi SLA kadar iyi değildir.",
      "SLA ise sıvı reçineyi UV ışını ile sertleştirerek çalışır. Çok yüksek çözünürlük ve pürüzsüz yüzey kalitesi sunar. Diş hekimliği, kuyumculuk ve minyatür modelleme gibi hassasiyet gerektiren alanlarda tercih edilir. Ancak malzeme maliyeti daha yüksektir ve son işlem gerektirir.",
      "Hangi teknoloji sizin için uygun? Eğer fonksiyonel parçalar, prototipler veya büyük boyutlu nesneler üretmek istiyorsanız FDM ideal. Detaylı minyatürler, yüksek hassasiyetli modeller veya pürüzsüz yüzeyler gerekiyorsa SLA daha iyi bir seçimdir.",
    ],
  },
  "ucretsiz-3d-modelleme-yazilimlari": {
    title: "3D Modelleme İçin En İyi Ücretsiz Yazılımlar",
    category: "Eğitim",
    image: "/images/blog/3d-modelleme-yazilimlari.svg",
    content: [
      "3D modelleme dünyasına adım atmak için yüksek bütçelere ihtiyacınız yok. İşte tamamen ücretsiz, profesyonel kalitede 3D modelleme yapabileceğiniz en iyi yazılımlar.",
      "Blender: Açık kaynaklı 3D modelleme dünyasının tartışmasız lideri. Modelleme, heykel, animasyon, render ve video düzenleme gibi her şeyi tek bir pakette sunar. Öğrenme eğrisi dik olsa da, sonsuz olanaklar sunar.",
      "Tinkercad: Autodesk'in web tabanlı, tamamen ücretsiz 3D modelleme aracı. Başlangıç seviyesi için mükemmeldir. Basit geometrik şekillerle çalışır ve 3D baskı için hazır modeller oluşturmayı kolaylaştırır.",
      "Fusion 360 (Kişisel Kullanım): Autodesk'in profesyonel CAD yazılımı, hobi amaçlı ve kişisel kullanım için ücretsizdir. Endüstriyel tasarım ve mühendislik odaklıdır. Parametrik modelleme ile hassas parçalar oluşturabilirsiniz.",
      "FreeCAD: Açık kaynaklı, parametrik bir CAD modelleyicidir. Mühendislik ve ürün tasarımı için idealdir. Fusion 360'a açık kaynaklı bir alternatif arayanlar için iyi bir seçenektir.",
    ],
  },
  "basarili-3d-baski-icin-ipuclari": {
    title: "3D Baskıda Başarılı Çıktı İçin 10 İpucu",
    category: "İpucu",
    image: "/images/blog/baski-ipuclari.svg",
    content: [
      "3D baskıda başarılı sonuçlar almak için bilmeniz gereken en önemli ipuçlarını sizler için derledik. İster yeni başlayın ister deneyimli olun, bu ipuçları baskı kalitenizi artıracaktır.",
      "1. İlk katman kritiktir: İlk katmanın yapışması, tüm baskının başarısını belirler. Yatak seviyenizi mutlaka doğru ayarlayın ve ilk katman hızını düşürün.",
      "2. Doğru dilimleyici ayarları: Her model farklıdır. Dilimleyici ayarlarınızı (katman yüksekliği, doluluk oranı, destek yapıları) modele göre optimize edin.",
      "3. Filamentinizi kuru tutun: Nemli filament kötü baskı kalitesine yol açar. Filamentinizi hava geçirmez bir kapta silika jel ile saklayın.",
      "4. Baskı yatağını temiz tutun: Yağ, toz ve kalıntılar yapışmayı engeller. Baskı öncesi yatağı izopropil alkol ile temizleyin.",
      "5. Uygun sıcaklık ayarları: Her filament markası farklı sıcaklık gerektirir. Bir sıcaklık kulesi testi yaparak ideal sıcaklığı bulun.",
      "6. Soğutma fanını doğru kullanın: PLA için tam fan, PETG için düşük fan, ABS için fansız baskı önerilir. Fan ayarları baskı kalitesini doğrudan etkiler.",
      "7. Hız ve kalite dengesi: Yüksek hız her zaman iyi değildir. Karmaşık modellerde hızı düşürerek kaliteyi artırabilirsiniz.",
      "8. Destek yapılarını optimize edin: Gereksiz desteklerden kaçının. Mümkünse modelinizi desteksiz basılabilecek şekilde tasarlayın.",
      "9. Düzenli bakım: Nozul temizliği, gergi bant ayarları ve yağlama gibi rutin bakımlar yazıcınızın ömrünü uzatır ve baskı kalitesini korur.",
      "10. Deney yapmaktan korkmayın: Her baskı bir öğrenme fırsatıdır. Başarısız baskılardan ders çıkarın, ayarlarınızı not alın ve sürekli iyileştirin.",
    ],
  },
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BlogPostDetail | null) => {
        if (data) {
          setPost(data);
        } else {
          setPost(null);
        }
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const fallback = slug ? fallbackData[slug] : null;

  if (!loading && !post && !fallback) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div className="mb-6 text-6xl">🔍</div>
        <h1 className="mb-2 text-2xl font-bold text-white">Yazı Bulunamadı</h1>
        <p className="mb-6 text-gray-400">Aradığınız blog yazısı mevcut değil.</p>
        <Link
          href="/blog"
          className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
        >
          Blog&apos;a Dön
        </Link>
      </div>
    );
  }

  const displayTitle = post?.title || fallback?.title || "";
  const displayCategory = post?.category || fallback?.category || "Genel";
  const displayImage = post?.image || fallback?.image || "/images/blog/default.svg";
  const contentLines = fallback?.content || (post?.content ? post.content.split("\n").filter(Boolean) : []);

  return (
    <div className="flex flex-1 flex-col">
      {/* Back link */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-cyan-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Blog&apos;a Dön
        </Link>
      </div>

      {/* Hero Image */}
      <section className="relative px-4 pt-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-2xl border border-white/10"
          >
            <img
              src={displayImage}
              alt={displayTitle}
              className="h-[300px] w-full object-cover md:h-[400px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                {displayCategory}
              </span>
              {post?.createdAt && (
                <span className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
              {post?.author && (
                <span className="text-xs text-gray-500">· {post.author}</span>
              )}
            </div>

            <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
              {displayTitle}
            </h1>
          </motion.div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-4 w-full rounded bg-white/10" />
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {contentLines.map((paragraph, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <p className="leading-relaxed text-gray-300">{paragraph}</p>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Share / CTA */}
          <ScrollReveal delay={0.3}>
            <GlassCard glowColor="rgba(56, 189, 248, 0.1)" className="mt-12">
              <div className="flex flex-col items-center px-6 py-8 text-center">
                <h3 className="mb-2 text-lg font-bold text-white">
                  Bu yazı ilginizi çekti mi?
                </h3>
                <p className="mb-6 max-w-md text-sm text-gray-400">
                  3D baskı projenizi hayata geçirmek için hemen sipariş verin.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/urunler"
                    className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
                  >
                    Ürünleri İncele
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:border-white/40"
                  >
                    Diğer Yazılar
                  </Link>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
