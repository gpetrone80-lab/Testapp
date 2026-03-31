const CACHE_NAME = 'phfr-v2';

// List of local assets to cache for offline use
// Ensure these paths match your folder structure exactly
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './images/icons/icon-192x192.png',
  './images/icons/icon-512x512.png'
];

// Install the Service Worker and cache essential files
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active one immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Cache hit - return response, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return the cached file if found, otherwise perform a network fetch
      return response || fetch(event.request);
    })
  );
});

// Activate and clean up old caches to save space
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting Old Cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});