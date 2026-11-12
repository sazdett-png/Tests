const CACHE_NAME = 'sait-tests-v4';

// Список файлов для кэширования. 
// Если у тебя CSS и JS внутри index.html, достаточно только его и иконок.
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Установка: кэшируем нужные файлы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш открыт');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Активация: удаляем старые версии кэша, если мы поменяли CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов: сначала ищем в кэше, если нет — идем в сеть
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если нашли в кэше — возвращаем
        if (response) {
          return response;
        }
        // Иначе качаем из сети
        return fetch(event.request);
      })
  );
});
