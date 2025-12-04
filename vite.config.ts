
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis do arquivo .env ou do ambiente
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Tenta pegar a chave do loadEnv ou diretamente do process.env (comum em CI/CD)
  const apiKey = env.API_KEY || process.env.API_KEY;

  return {
    plugins: [react()],
    define: {
      // Injeta a chave no código final. Se for undefined, ficará undefined (e o service tratará isso)
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})
