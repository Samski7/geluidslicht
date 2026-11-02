// Geluidslicht: werkt ook offline nadat de app één keer geladen is.
// Pas je een bestand aan, verhoog dan het versienummer: zo haalt de app de nieuwe bestanden op.
const PREFIX = 'geluidslicht-';
const CACHE = PREFIX + 'v8';
const OLD_PREFIXES = [PREFIX, 'decibelmeter-'];
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', event => {
  // 'reload' gaat langs de browsercache heen, zodat een nieuwe versie echt de nieuwe bestanden bewaart.
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  // Enkel eigen oude caches opruimen: op github.io delen alle apps van één gebruiker hetzelfde domein.
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k !== CACHE && OLD_PREFIXES.some(p => k.startsWith(p)))
        .map(k => caches.delete(k))))
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

// Cache-first: eerst de cache, anders het netwerk (en dat dan bewaren, bv. de lettertypes van Google Fonts).
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(hit => hit || fetch(request).then(res => store(request, res)))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(hit => hit || fetch(request).then(res => store(request, res)))
  );
});
