import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// A API da Câmara nem sempre envia o cabeçalho de CORS, então o navegador
// bloqueia algumas respostas. O proxy faz a chamada pelo próprio servidor do Vite.
const proxyCamara = {
  '/api-camara': {
    target: 'https://dadosabertos.camara.leg.br',
    changeOrigin: true,
    rewrite: (caminho) => caminho.replace(/^\/api-camara/, '/api/v2'),
  },
}

// https://vite.dev/config/
export default defineConfig({
  server: { proxy: proxyCamara },
  preview: { proxy: proxyCamara },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
