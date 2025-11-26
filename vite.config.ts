import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual (ex: development, production)
  // O terceiro argumento '' garante que carregaremos todas as vars, não apenas as com prefixo VITE_
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Isso substitui 'process.env.API_KEY' pelo valor real da string durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})