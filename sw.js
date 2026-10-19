// Geluidslicht: werkt ook offline nadat de app één keer geladen is.
const CACHE = 'geluidslicht-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(request, response) {
  if (response && (response.ok || response.type === 'opaque')) {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // De pagina zelf: eerst het netwerk (zo komen updates meteen binnen), anders de cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(res => store(request, res)).catch(() => caches.match(request).then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Iconen, manifest en lettertypes: eerst de cache.
  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(res => store(request, res)))
  );
});
