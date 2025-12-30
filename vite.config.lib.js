import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'RackDesigner',
      fileName: (format) => `rack-designer.${format}.js`,
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['vue', 'primevue', '@primevue/themes', 'primeicons', 'bootstrap', 'html2canvas', 'jspdf', 'qrcode'],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        globals: {
          vue: 'Vue',
          primevue: 'PrimeVue',
          '@primevue/themes': 'PrimeVueThemes',
          primeicons: 'PrimeIcons',
          bootstrap: 'Bootstrap',
          html2canvas: 'html2canvas',
          jspdf: 'jspdf',
          qrcode: 'QRCode',
        },
        // Export CSS separately
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'rack-designer.css';
          return assetInfo.name;
        },
      },
    },
    outDir: 'lib',
    emptyOutDir: true,
  },
});
