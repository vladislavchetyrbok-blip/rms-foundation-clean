// sw.js - Progressive Web App (PWA) Service Worker for RMS Foundation
const CACHE_NAME = 'rms-foundation-v4';
const ASSETS_TO_CACHE = [
  './index.html',
  './index.css',
  './script.js',
  './data.js',
  './ai_widget.js',
  './i18n.js',
  './gallery.html',
  './honor_wall.html',
  './join.html',
  './military_request.html',
  './transparency.html',
  './stories.html',
  './shop.html',
  './training.html',
  './rehab.html',
  './international.html',
  './memorial.html',
  './auctions.html',
  './battles.html',
  './b2b.html',
  './podcasts.html',
  './profile.html',
  './drone_hub.html',
  './mobile_hospitals.html',
  './energy_shield.html',
  './veteran_business.html',
  './donor_hub.html',
  './legal_aid.html',
  './animals_rescue.html',
  './children_future.html',
  './eco_defense.html',
  './map.html',
  './support.html',
  './admin.html',
  './admin.js',
  './admin.css',
  './logo.png',
  './favicon.png',
  './hero.png',
  './drone.png',
  './med.png',
  './honor_cargo.jpg',
  './honor_driver.jpg',
  './honor_logistics.jpg',
  './honor_media.jpg',
  './honor_patron.jpg',
  './work_baby_food.jpg',
  './work_hospital_ward.jpg',
  './work_kids_toys.jpg',
  './work_medical_aid.jpg',
  './work_rehab_chairs.jpg'
];

// Install Event - Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core foundation assets...');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[Service Worker] Some assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Keep documents and code fresh, keep media cache-friendly offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const request = event.request;
  const url = new URL(request.url);
  const shouldRefreshFirst =
    request.mode === 'navigate' ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css');

  if (shouldRefreshFirst) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        // Optionally cache dynamically fetched pages
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for HTML navigation when offline
        if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
