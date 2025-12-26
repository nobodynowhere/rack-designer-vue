import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';

// PrimeIcons CSS
import 'primeicons/primeicons.css';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);

// Configure PrimeVue with Aura theme (PrimeVue 4.x)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false,
    }
  },
  ripple: true,
});

app.mount('#app');
