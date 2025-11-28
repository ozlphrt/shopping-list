import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/shopping-list/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Disable service worker in development to allow HMR to work
      devOptions: {
        enabled: false
      },
      includeAssets: [],
      manifest: {
        name: 'Shopping List',
        short_name: 'Shopping',
        description: 'Real-time shared grocery shopping list',
        theme_color: '#182235',
        background_color: '#182235',
        display: 'standalone',
        orientation: 'portrait',
        start_url: process.env.NODE_ENV === 'production' ? '/shopping-list/' : '/',
        scope: process.env.NODE_ENV === 'production' ? '/shopping-list/' : '/',
        icons: [
          {
            src: '192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Firebase Firestore requests for offline support
            urlPattern: /^https:\/\/.*\.firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 3
            }
          },
          {
            // Cache Firebase Auth requests
            urlPattern: /^https:\/\/.*\.firebaseapp\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-auth-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 3
            }
          }
        ]
      }
    })
  ],
  server: {
    hmr: {
      overlay: true
    }
  }
})

