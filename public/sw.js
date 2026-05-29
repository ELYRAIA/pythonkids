const CACHE = "pythonkids-v2";
const STATIC_CACHE = "pythonkids-static-v2";

const PRECACHE_PAGES = [
  "/",
  "/levels/0",
  "/levels/1",
  "/levels/2",
  "/levels/3",
  "/levels/4",
  "/levels/5",
  "/challenges",
  "/editor",
  "/profile",
  "/leaderboard",
  "/shop",
  "/projects",
  "/pet",
  "/parent",
  "/stats",
  "/battle-pass",
  "/certificate",
  "/detente",
  "/quiz",
  "/duel",
  "/offline.html",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    Promise.all([
      caches.open(CACHE).then((c) => c.addAll(PRECACHE_PAGES).catch(() => {})),
    ])
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // API routes : réseau uniquement, pas de cache
  if (url.pathname.startsWith("/api/")) return;

  // Assets Next.js statiques (hachés, immutables) : cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(e.request);
        if (cached) return cached;
        const res = await fetch(e.request).catch(() => null);
        if (res && res.ok) cache.put(e.request, res.clone());
        return res ?? new Response("Not found", { status: 404 });
      })
    );
    return;
  }

  // Pages et autres ressources : stale-while-revalidate
  // Retourne le cache immédiatement, met à jour en arrière-plan
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);

      const networkFetch = fetch(e.request)
        .then((res) => {
          if (res.ok) cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) {
        // Mise à jour en arrière-plan sans bloquer
        networkFetch.catch(() => {});
        return cached;
      }

      // Pas en cache : attendre le réseau
      const res = await networkFetch;
      if (res) return res;

      // Réseau inaccessible et rien en cache : page offline
      if (e.request.mode === "navigate") {
        const offline = await cache.match("/offline.html");
        if (offline) return offline;
      }

      return new Response("Hors ligne", { status: 503 });
    })
  );
});

// Push notifications
self.addEventListener("push", (e) => {
  if (!e.data) return;
  let payload;
  try { payload = e.data.json(); } catch { payload = { title: "PythonKids", body: e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(payload.title ?? "PythonKids", {
      body: payload.body ?? "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url ?? "/" },
      tag: "pythonkids-reminder",
      renotify: true,
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
