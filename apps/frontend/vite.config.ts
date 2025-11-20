// eslint-env node
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import tanstackRouter from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const skipNitro = process.env.SKIP_NITRO === 'true'

  const plugins: any[] = [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ]

  if (!skipNitro) {
    // import dynamique pour éviter les effets de bord au chargement
    const { nitroV2Plugin } = await import('@tanstack/nitro-v2-vite-plugin')
    plugins.unshift(nitroV2Plugin())
  }

  const cwd = process.cwd()
  // si on est lancé depuis la racine du repo, construire à partir de apps/frontend
  const maybeFrontend = path.resolve(cwd, 'apps/frontend')
  const root = (cwd.endsWith(`${path.sep}apps${path.sep}frontend`) || cwd.endsWith('apps/frontend')) ? cwd : maybeFrontend

  return {
    root,
    plugins,
    resolve: {
      alias: {
        '~': resolve(root, './src'),
      },
    },
    server: {
      fs: {
        // autoriser uniquement le dossier frontend — empêche l'analyse du backend
        allow: [root],
      },
    },
  }
})
