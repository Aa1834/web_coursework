const CACHE_NAME = 'cw-v1';
const OFFLINE_URL = 'webpages/offline.html';
const CACHEABLE = [
    '/',
    '/manifest.json',
    'webpages/index.html',
    'webpages/offline.html'
];

async function installEvent(event) {
    const cache = await caches.open(CACHE_NAME);
    console.log('Caching files during install');
    await cache.addAll(CACHEABLE);
}

self.addEventListener('install', event => {
    console.log('Service worker installing...');
    event.waitUntil(installEvent(event));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

async function fetchEvent(event) {
    try {
        if (event.request.method !== 'GET') {
            return fetch(event.request); // Skip caching for non-GET requests
        }
        if (!event.request.url.startsWith('http')){
            return fetch(event.request);
        }
        const cacheRes = await caches.match(event.request);
        if (cacheRes) {
            return cacheRes; // Return the cached response if it exists
        }
        const fetchRes = await fetch(event.request);
        if (fetchRes && fetchRes.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, fetchRes.clone()); // Cache the response
        }
        return fetchRes; // Return the network response
    } catch (error) {
        console.error('Fetch event error:', error);
        const offlineRes = await caches.match(OFFLINE_URL);
        if (offlineRes) {
            return offlineRes;
        }
        return new Response('Offline page not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' },
        });
    }
}

self.addEventListener('fetch', event => {
    console.log('Fetch event for:', event.request.url);
    event.respondWith(fetchEvent(event));
});