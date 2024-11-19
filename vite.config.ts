import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-mapbox': ['mapbox-gl'],
            'vendor-utils': ['jspdf', 'jspdf-autotable'],
            'vendor-icons': ['lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      target: 'esnext'
    },
    server: {
      host: 'localhost',
      port: 5173,
      strictPort: false,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_APP_URL || 'http://localhost:5173',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      cors: true,
      hmr: {
        overlay: true
      }
    },
    preview: {
      port: 5173,
      strictPort: false
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@supabase/supabase-js',
        'mapbox-gl',
        'lucide-react'
      ]
    },
    define: {
      'process.env': env
    }
  };
});