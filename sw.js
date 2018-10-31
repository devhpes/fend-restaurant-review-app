
var staticCacheName = 'rs-static-v1.1';

// Installing the service worker
self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function (cache) {
        return cache.addAll([
          '/',
          'img/1.jpg',
          'img/2.jpg',
          'img/3.jpg',
          'img/4.jpg',
          'img/5.jpg',
          'img/6.jpg',
          'img/7.jpg',
          'img/8.jpg',
          'img/9.jpg',
          'img/10.jpg',
          'js/main.js',
          'js/dbhelper.js',
          'js/restaurant_info.js',
          'data/restaurants.json',
          'css/styles.css',
          'css/normalize.css',
          'https://fonts.googleapis.com/css?family=Roboto',
        ]);
      })
    );
  });

  // Activating the service worker using activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('rs-') &&
                 cacheName != staticCacheName;
        //Deleting any caches which is not needed
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//Adding fetch and responding caches
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        //Cloning the request
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic' || fetchRequest.method === "POST") {
              return response;
            }

            //Cloning the response
            var responseToCache = response.clone();

            caches.open(staticCacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Skip waiting service worker and become an active one
self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});