const CACHE = 'muhasaba-v11';
const ASSETS = [
 "./",
 "./index.html",
 "./main.css",
 "./main.js",
 "./manifest.json",
 "./icon-192.png",
 "./icon-512.png",
 "./ZCPUNR5S.jpg",
 "./V4AKSKLO.ttf",
 "./NGUTT33D.ttf",
 "./3H6SIXQI.ttf",
 "./IMRJKNAJ.ttf",
 "./LFN3QLXR.ttf",
 "./GT-America-Standard-Regular.woff2",
 "./GT-America-Standard-Medium.woff2",
 "./GT-America-Standard-Bold.woff2",
 "./SeasonMix-Regular.woff2",
 "./SeasonMix-Medium.woff2",
 "./aime-300.woff2",
 "./aime-700.woff2",
 "./aime-800.woff2",
 "./melange-grotesk-350.woff2",
 "./melange-grotesk-400.woff2",
 "./melange-grotesk-500.woff2",
 "./melange-grotesk-600.woff2",
 "./aime-400.woff2"
];
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    const p = new URL(e.request.url).pathname;
    if (p.endsWith('/update.html') || p.endsWith('/sw.js')) { e.respondWith(fetch(e.request)); return; }
    const core = e.request.mode === 'navigate' || p.endsWith('/') || p.endsWith('/index.html') || p.endsWith('/main.js') || p.endsWith('/main.css');
    if (core) {
        e.respondWith(
            fetch(e.request).then((res) => {
                if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
                return res;
            }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html')))
        );
        return;
    }
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
            if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
            return res;
        }).catch(() => caches.match('./index.html')))
    );
});
