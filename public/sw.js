// Self-destruct service worker.
// Versi lama (sisain-v2) memakai strategi cache-first dan menahan JS bundle lama.
// SW ini hanya melakukan kerja saat masih ada cache lama, lalu menghapus dirinya.
// Setelah cache bersih, eksekusi berikutnya tidak melakukan apa-apa (mencegah loop).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const hadOldCache = keys.length > 0;

    if (hadOldCache) {
      await Promise.all(keys.map((key) => caches.delete(key)));
    }

    await self.clients.claim();
    await self.registration.unregister();

    // Hanya paksa reload kalau ada cache lama yang baru dibersihkan.
    // Kalau sudah bersih dari awal, jangan reload — supaya tidak loop.
    if (hadOldCache) {
      const clientsList = await self.clients.matchAll({ type: 'window' });
      for (const client of clientsList) {
        client.navigate(client.url);
      }
    }
  })());
});

// Selama transisi, lewatkan semua request langsung ke network.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).catch(() => new Response('', { status: 504 })));
});
