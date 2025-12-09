import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'
import tanstackRouter from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import path from 'path'

const __dirname = path.resolve()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nitroV2Plugin(),
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
})
