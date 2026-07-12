const CACHE_NAME = 'mn-portfolio-v6';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/it/',
  '/it/index.html',
  '/404.html',
  '/assets/styles.css?v=6',
  '/assets/i18n.js?v=6',
  '/assets/app.js?v=6',
  '/assets/favicon.svg?v=6',
  '/assets/apple-touch-icon.png?v=6',
  '/assets/icon-192.png?v=6',
  '/assets/icon-512.png?v=6',
  '/site.webmanifest?v=6',
  '/site-it.webmanifest?v=6',
  '/humans.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/hire-me.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all([
    self.skipWaiting(),
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  ]));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const fallback = url.pathname.startsWith('/it/') ? '/it/index.html' : '/index.html';
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => caches.match(fallback))
    );
    return;
  }

  const network = fetch(request);
  const refresh = network.then((response) => {
    if (!response.ok) return undefined;
    const copy = response.clone();
    return caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  });
  event.waitUntil(refresh.catch(() => undefined));
  event.respondWith(caches.match(request).then((cached) => cached || network));
});
