// // service-worker.js

// Name of the cache
const CACHE_NAME = 'beks-coding-club-cache-v1';

// List of files to cache (static assets)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/index.css',
    '/index.js',
    '/StudentDashboard/logo.jpg',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap',
    'https://code.iconify.design/iconify-icon/1.0.8/iconify-icon.min.js',
    'https://code.iconify.design/3/3.1.0/iconify.min.js',
    'https://img.freepik.com/premium-vector/multinational-business-team_171919-1385.jpg'
];

// Install event: Cache static assets when the service worker is installed
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return Promise.all(
                    STATIC_ASSETS.map((asset) => {
                        return fetch(asset, { mode: 'no-cors' })
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch ${asset}`);
                                }
                                return cache.put(asset, response);
                            })
                            .catch((error) => {
                                console.warn(`Service Worker: Skipping cache for ${asset} due to ${error}`);
                            });
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Static caching complete');
            })
            .catch((error) => {
                console.error('Service Worker: Caching failed', error);
            })
    );
    self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event: Serve cached files or fetch from network, no API caching
self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

    // Skip chrome-extension:// requests
    if (requestUrl.startsWith('chrome-extension://')) {
        console.log(`Service Worker: Skipping chrome-extension request: ${requestUrl}`);
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log(`Service Worker: Serving from cache: ${requestUrl}`);
                    return cachedResponse;
                }

                console.log(`Service Worker: Fetching from network: ${requestUrl}`);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Only cache if the request is in STATIC_ASSETS
                        if (STATIC_ASSETS.includes(requestUrl)) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache)
                                        .catch((error) => {
                                            console.error(`Service Worker: Failed to cache ${requestUrl}`, error);
                                        });
                                });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.log(`Service Worker: Network fetch failed for ${requestUrl}, offline`, error);
                        return caches.match('/index.html'); // Fallback
                    });
            })
            .catch((error) => {
                console.error(`Service Worker: Cache match failed for ${requestUrl}`, error);
                return fetch(event.request); // Fallback to network
            })
    );
});