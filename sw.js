// Service Worker pour l'assistance du Trail de St Jacques
const CACHE_NAME = 'st-jacques-assistance-v2'; // Changement de version pour forcer le smartphone à se mettre à jour

// La liste des fichiers gravés dans le téléphone (Tu as renommé le HTML en index.html)
const ASSETS = [
  './',
  './index.html',      // Modifié ici
  './manifest.json',  // Ajouté ici (indispensable pour que l'icône reste disponible hors-ligne)
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Si un seul de ces fichiers renvoie une erreur 404, l'installation échoue.
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(() => {
      // Fallback de secours si le réseau coupe complètement
      return caches.match('./index.html'); // Modifié ici
    })
  );
});