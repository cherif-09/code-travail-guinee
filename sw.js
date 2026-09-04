/* Service worker — Code du Travail Guinée
   Rend la plateforme utilisable hors connexion.
   À chaque mise à jour du contenu, incrémentez CACHE_VERSION. */
const CACHE_VERSION = 'ctg-v1';
const CACHE = CACHE_VERSION;

/* Fichiers de l'application à garder en cache (« app shell » + données) */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './articles.json',
  './explanations.json',
  './themes.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png',
  './favicon-32.png',
  './favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isJSON = url.pathname.endsWith('.json') || url.pathname.endsWith('.webmanifest');
  const isDoc = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/');

  /* Données JSON : « stale-while-revalidate » — on sert vite depuis le cache
     et on rafraîchit en arrière-plan quand on est en ligne. */
  if (isJSON) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            if (res && res.ok) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  /* Page HTML : réseau d'abord (pour recevoir les mises à jour),
     repli sur le cache si hors connexion. */
  if (isDoc) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  /* Le reste (icônes, polices…) : cache d'abord, réseau en repli. */
  event.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        if (res && res.ok && (url.origin === location.origin || url.hostname.includes('gstatic'))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached)
    )
  );
});
