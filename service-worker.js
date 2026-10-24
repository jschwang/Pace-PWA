const CACHE_NAME = "Pace-PWA-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./index.js",
  "./manifest.json",
  "./Pace-PWA-small.png",
  "./Pace-PWA-Big.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => {
            return key !== CACHE_NAME;
          })
          .map((key) => {
            return caches.delete(key);
          }),
      );
    }),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheResponse) => {
      return cacheResponse || fetch(e.request);
    }),
  );
});
