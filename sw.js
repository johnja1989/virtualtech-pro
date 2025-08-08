/**
 * VirtualTech Pro - Service Worker
 * PWA functionality with caching strategies
 */

const CACHE_NAME = "virtualtech-pro-v1.0.0";
const STATIC_CACHE = "static-v1.0.0";
const DYNAMIC_CACHE = "dynamic-v1.0.0";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/main.js",
  "/manifest.json",
  "/images/logo.png",
  "/images/favicon.ico",
  // Add other critical assets
];

// Assets to cache on demand
const DYNAMIC_ASSETS = [
  "/images/portfolio/",
  "/images/about/",
  "/assets/documents/",
];

// Network-first strategies for these patterns
const NETWORK_FIRST_PATTERNS = [/\/api\//, /\/contact/, /\/form/];

// Cache-first strategies for these patterns
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /\.(?:css|js)$/,
  /\/fonts\//,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("SW: Install event");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("SW: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("SW: Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error("SW: Error caching static assets:", err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("SW: Activate event");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log("SW: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log("SW: Old caches cleaned up");
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  // Apply appropriate caching strategy
  if (isNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else if (isCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network First Strategy
async function networkFirst(request) {
  const cacheName = DYNAMIC_CACHE;

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful response
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("SW: Network failed, trying cache:", request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/index.html");
    }

    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cacheName = STATIC_CACHE;

  // Check cache first
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    // Fallback to network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("SW: Cache first failed:", error);
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cacheName = DYNAMIC_CACHE;

  // Get from cache immediately
  const cachedResponse = await caches.match(request);

  // Update cache in background
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log("SW: Background update failed:", error);
      return null;
    });

  // Return cached version immediately, or wait for network
  return cachedResponse || networkResponsePromise;
}

// Helper functions
function isNetworkFirst(pathname) {
  return NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isCacheFirst(pathname) {
  return CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(pathname));
}

// Background sync for form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "contact-form") {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  try {
    // Get pending form submissions from IndexedDB
    const submissions = await getPendingSubmissions();

    for (const submission of submissions) {
      try {
        const response = await fetch("/contact", {
          method: "POST",
          body: submission.data,
        });

        if (response.ok) {
          await removePendingSubmission(submission.id);
          console.log("SW: Form submission synced successfully");
        } else {
          console.error("SW: Form submission failed:", response.status);
        }
      } catch (error) {
        console.error("SW: Sync error:", error);
      }
    }
  } catch (error) {
    console.error("SW: Background sync failed:", error);
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: "/images/icons/icon-192x192.png",
    badge: "/images/icons/icon-72x72.png",
    vibrate: [200, 100, 200],
    data: {
      url: "/",
    },
    actions: [
      {
        action: "open",
        title: "Ver sitio",
        icon: "/images/icons/icon-72x72.png",
      },
      {
        action: "close",
        title: "Cerrar",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("VirtualTech Pro", options)
  );
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "content-update") {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    // Check for content updates
    const response = await fetch("/api/content-version");
    const { version } = await response.json();

    // Compare with stored version and update if needed
    const storedVersion = await getStoredVersion();

    if (version !== storedVersion) {
      console.log("SW: New content available, updating cache");
      await updateCache();
      await storeVersion(version);
    }
  } catch (error) {
    console.error("SW: Content update failed:", error);
  }
}

// Cache update function
async function updateCache() {
  const cache = await caches.open(STATIC_CACHE);

  for (const asset of STATIC_ASSETS) {
    try {
      const response = await fetch(asset);
      if (response.ok) {
        await cache.put(asset, response);
      }
    } catch (error) {
      console.error("SW: Failed to update asset:", asset, error);
    }
  }
}

// IndexedDB helpers for offline form storage
async function getPendingSubmissions() {
  // Implementation would use IndexedDB to store/retrieve pending submissions
  return [];
}

async function removePendingSubmission(id) {
  // Implementation would remove submission from IndexedDB
}

async function getStoredVersion() {
  // Implementation would get version from IndexedDB
  return null;
}

async function storeVersion(version) {
  // Implementation would store version in IndexedDB
}

// Error handling
self.addEventListener("error", (event) => {
  console.error("SW: Global error:", event.error);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("SW: Unhandled promise rejection:", event.reason);
  event.preventDefault();
});

// Debugging helpers
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_CACHE_SIZE") {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ size });
    });
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    clearAllCaches().then(() => {
      event.ports[0].postMessage({ cleared: true });
    });
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
}

// Performance monitoring
const performanceEntries = [];

self.addEventListener("fetch", (event) => {
  const startTime = performance.now();

  event.respondWith(
    (async () => {
      const response = await handleRequest(event.request);
      const endTime = performance.now();

      // Log performance data
      performanceEntries.push({
        url: event.request.url,
        method: event.request.method,
        duration: endTime - startTime,
        timestamp: Date.now(),
        fromCache: response.headers.get("x-from-cache") === "true",
      });

      // Keep only last 100 entries
      if (performanceEntries.length > 100) {
        performanceEntries.shift();
      }

      return response;
    })()
  );
});

async function handleRequest(request) {
  // Main request handling logic would go here
  // This is a placeholder that delegates to the appropriate strategy

  const url = new URL(request.url);

  if (isNetworkFirst(url.pathname)) {
    return networkFirst(request);
  } else if (isCacheFirst(url.pathname)) {
    return cacheFirst(request);
  } else {
    return staleWhileRevalidate(request);
  }
}

console.log("SW: Service Worker loaded successfully");
