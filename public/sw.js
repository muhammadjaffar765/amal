// Small service worker: lets Noor open offline after the first visit.
const CACHE = 'noor-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/favicon.svg'])));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const save = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.pathname.endsWith('.mp3')) return; // let audio stream normally

  const dataHost = ['api.alquran.cloud', 'api.aladhan.com', 'cdn.jsdelivr.net'].includes(url.hostname);
  if (dataHost || req.mode === 'navigate') {
    // network first, fall back to the saved copy
    e.respondWith(
      fetch(req)
        .then((res) => save(req, res))
        .catch(() => caches.match(req).then((hit) => hit || caches.match('/')))
    );
    return;
  }
  if (url.origin === self.location.origin || url.hostname.startsWith('fonts.g')) {
    // static files: saved copy first
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => save(req, res))));
  }
});
