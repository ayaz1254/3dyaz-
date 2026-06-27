const CACHE = "3dmagza-v1";
const CACHEABLE = [
  "/",
  "/urunler",
  "/blog",
  "/ozel-figur",
  "/sss",
  "/iletisim",
  "/kvkk",
  "/iade",
  "/kargo",
  "/favoriler",
  "/sepet",
  "/yukle",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
];

// Install: cache core pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(CACHEABLE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // Don't cache API calls or admin pages
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin/")) {
    event.respondWith(fetch(request));
    return;
  }

  // Skip non-cacheable schemes
  if (!request.url.startsWith("http")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || new Response("Offline", { status: 503 });
        });
      })
  );
});
