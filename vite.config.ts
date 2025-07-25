import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_API_URL': JSON.stringify(
        mode === 'production' 
          ? 'https://backend-portfolio-production-39a1.up.railway.app'
          : 'http://localhost:5000'
      )
    }
  }
})
