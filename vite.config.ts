
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis do arquivo .env ou do ambiente
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Tenta pegar a chave do loadEnv, do process.env (CI/CD), ou usa a chave fornecida (Hardcoded Fallback)
  // ATENÇÃO: Em produção comercial, evite hardcode de chaves. Use variáveis de ambiente do Vercel.
  const rawApiKey = env.API_KEY || process.env.API_KEY || "AIzaSyCLbgF-4MIPgQcnegUNfd5_5vAeZlVIJSc";
  const apiKey = rawApiKey.trim();

  return {
    plugins: [react()],
    define: {
      // Injeta a chave no código final.
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})