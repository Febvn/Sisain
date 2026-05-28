// Self-destruct service worker.
// Versi lama (sisain-v2) memakai strategi cache-first dan menahan JS bundle lama
// di browser, sehingga update kode tidak pernah sampai ke user. SW ini menghapus
// semua cache lama lalu mendaftarkan unregister diri sendiri, sehingga browser
// kembali fetch langsung dari network.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Hapus semua cache yang ada (termasuk sisain-v2).
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));

    // Ambil alih semua client yang terbuka.
    await self.clients.claim();

    // Self-unregister supaya browser tidak menjalankan SW ini lagi.
    await self.registration.unregister();

    // Paksa reload semua tab supaya pakai JS terbaru dari network.
    const clientsList = await self.clients.matchAll({ type: 'window' });
    for (const client of clientsList) {
      client.navigate(client.url);
    }
  })());
});

// Selama transisi, lewatkan semua request langsung ke network (no cache).
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request).catch(() => new Response('', { status: 504 })));
});
