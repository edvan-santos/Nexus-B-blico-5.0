
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Substitui apenas a chave da API. A definição global de process.env vazia foi removida
      // para evitar conflitos, confiando no polyfill do index.html para o runtime.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
