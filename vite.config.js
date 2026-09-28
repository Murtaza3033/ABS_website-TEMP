import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only: serve the Vercel functions in api/*.js from the Vite dev server so
// forms work under `npm run dev`. Production uses Vercel's own runtime.
function apiDevServer() {
  return {
    name: 'api-dev-server',
    apply: 'serve',
    configureServer(server) {
      // Server-only vars (no VITE_ prefix) never reach the browser bundle.
      // Keys we loaded are tracked so a .env edit (which restarts Vite in the
      // same process) refreshes them, while real shell env vars still win.
      const loaded = (globalThis.__apiDevEnvKeys ??= new Set())
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const [key, value] of Object.entries(env)) {
        if (key.startsWith('VITE_')) continue
        if (process.env[key] === undefined || loaded.has(key)) {
          process.env[key] = value
          loaded.add(key)
        }
      }

      server.middlewares.use('/api', async (req, res) => {
        const name = req.url.split('?')[0].replace(/^\/+|\/+$/g, '')
        const notFound = () => { res.statusCode = 404; res.setHeader('Content-Type', 'application/json'); res.end('{"ok":false,"error":"not_found"}') }
        if (!/^[a-z0-9-]+$/i.test(name) || !fs.existsSync(path.resolve('api', `${name}.js`))) return notFound()

        const handler = (await server.ssrLoadModule(`/api/${name}.js`)).default

        let raw = ''
        for await (const chunk of req) raw += chunk
        req.body = raw
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (data) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)) }

        try {
          await handler(req, res)
        } catch (err) {
          server.config.logger.error(err.stack || String(err))
          if (!res.headersSent) { res.statusCode = 500; res.end() }
        }
      })
    },
  }
}

// React Compiler enabled via the Babel plugin (React 19 target).
// https://react.dev/learn/react-compiler/installation
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),
    apiDevServer(),
  ],
})
