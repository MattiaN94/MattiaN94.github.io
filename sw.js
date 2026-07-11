const CACHE_NAME = 'mn-portfolio-v4';
const CORE_ASSETS = [
  './',
  'index.html',
  '404.html',
  'assets/styles.css?v=4',
  'assets/app.js?v=4',
  'assets/favicon.svg?v=4',
  'assets/apple-touch-icon.png?v=4',
  'assets/icon-192.png?v=4',
  'assets/icon-512.png?v=4',
  'site.webmanifest?v=4',
  'humans.txt',
  'llms.txt',
  'llms-full.txt',
  'hire-me.txt'
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
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
