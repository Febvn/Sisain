const CACHE_NAME = 'sisain-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
});

self.addEventListener('fetch', event => {
  // Cache first, then network for static assets
  // Network first, then cache for other requests to ensure fresh data
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        // Cache images and other assets dynamically
        if (event.request.url.startsWith('http') && (event.request.method === 'GET')) {
           const responseClone = networkResponse.clone();
           caches.open(CACHE_NAME).then(cache => {
             cache.put(event.request, responseClone);
           });
        }
        return networkResponse;
      }).catch(() => {
        // Optional: Return a fallback offline page
      });
    })
  );
});
