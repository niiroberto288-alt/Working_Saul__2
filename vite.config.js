import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// AttachTrack Rwanda - Vite configuration.
// Route-level code splitting is enforced by dynamic imports in src/router/index.js.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // True only when the deployer explicitly opts in. Combined with
    // import.meta.env.DEV this lets Rollup drop the demo dataset (and its demo
    // passwords) from production bundles entirely - see src/composables/useAuth.js.
    define: {
      __DEMO_BUILD__: JSON.stringify(env.VITE_DEMO_MODE === 'true'),
    },
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      reportCompressedSize: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@supabase') || id.includes('postgrest') || id.includes('gotrue')) {
                return 'vendor-supabase'
              }
              return 'vendor-core'
            }
            return undefined
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: false,
      // The hosted preview serves the app from a *.e2b.app subdomain.
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    },
  }
})
