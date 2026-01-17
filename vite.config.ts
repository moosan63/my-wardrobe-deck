import { defineConfig } from 'vite'
import honox from 'honox/vite'
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
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
