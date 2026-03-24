// Service Worker for Livorno Prosopography Database
const CACHE_NAME = "livorno-prosopography-v4";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./LICENSE.md",
  "./help.md",
];

// Install event - cache resources
self.addEventListener("install", function (event) {
  console.log("[ServiceWorker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("[ServiceWorker] Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log("[ServiceWorker] Install complete");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", function (event) {
  console.log("[ServiceWorker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("[ServiceWorker] Removing old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(function () {
        console.log("[ServiceWorker] Activate complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        console.log("[ServiceWorker] Serving from cache:", event.request.url);
        return response;
      }

      // Clone the request
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then(function (response) {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // Clone the response
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(function (error) {
          console.log("[ServiceWorker] Fetch failed:", error);
          // Return offline page or default response
          return caches.match("./index.html");
        });
    }),
  );
});

// Listen for messages from the client
self.addEventListener("message", function (event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});

console.log("[ServiceWorker] Script loaded");
