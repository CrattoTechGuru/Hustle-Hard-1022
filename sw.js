// Minimal service worker: caches the app shell so it installs as a PWA and
// the last-loaded page still renders if you go offline. Listing data itself
// still needs a network round-trip to Supabase -- this only makes the app
// shell (HTML/CSS/JS) load instantly and work offline.

const CACHE_NAME = 'hustle-hard-shell-v1'
const SHELL_ASSETS = ['./', './index.html', './manifest.json', './favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Never intercept Supabase API/storage calls -- always go to the network for those.
  if (event.request.url.includes('supabase.co')) return

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ||
        fetch(event.request).then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          return response
        }).catch(() => cached)
    )
  )
})
