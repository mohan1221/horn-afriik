/* Horn Afriik service worker: offline app shell + cached fonts.
   Bump VERSION on every release (and the ?v= query in index.html). */
const VERSION = '1.3.0';
const SHELL = `ha-shell-${VERSION}`;
const FONTS = 'ha-fonts';
const MEDIA = 'ha-media';

const PRECACHE = [
  './',
  'index.html',
  `assets/css/styles.css?v=${VERSION}`,
  `assets/js/sb.js?v=${VERSION}`,
  `assets/js/app.js?v=${VERSION}`,
  'manifest.webmanifest',
  'assets/img/classroom.jpg',
  'icons/logo.png',
  'icons/emblem.png',
  'icons/favicon-48.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('ha-shell-') && k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Page navigations: network first so releases show up, cached shell when offline.
  if (req.mode === 'navigate') {
    const isApp = /\/(index\.html)?$/.test(url.pathname);
    event.respondWith(
      fetch(req)
        .then(res => { if (isApp && res.ok) { const copy = res.clone(); caches.open(SHELL).then(c => c.put('index.html', copy)); } return res; })
        .catch(() => isApp ? caches.match('index.html') : caches.match(req))
    );
    return;
  }

  // Lesson images from Supabase Storage: cache first, so they work offline once seen.
  if (url.hostname.endsWith('.supabase.co') && url.pathname.startsWith('/storage/v1/object/public/') && req.destination === 'image') {
    event.respondWith(
      caches.open(MEDIA).then(cache => cache.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
        return res;
      })))
    );
    return;
  }

  // Google Fonts: stale-while-revalidate.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONTS).then(cache => cache.match(req).then(hit => {
        const net = fetch(req).then(res => { cache.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }

  // Same-origin static files: cache first.
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
  }
});
