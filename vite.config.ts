import { defineConfig } from 'vite'
import honox from 'honox/vite'
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        manifest: true,
        rollupOptions: {
          input: ['./app/client.ts', './app/static/style.css'],
          output: {
            entryFileNames: 'static/[name].js',
            assetFileNames: 'static/[name].[ext]'
          }
        },
        outDir: './dist',
        emptyOutDir: false
      }
    }
  }
  return {
    plugins: [
      honox(),
      pages(),
      devServer({
        adapter,
        entry: 'app/server.ts'
      })
    ],
    resolve: {
      alias: {
        '@': '/app'
      }
    }
  }
})
