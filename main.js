import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';

// PrimeVue Theme CSS
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);

// Configure PrimeVue
app.use(PrimeVue, {
  ripple: true,
  inputStyle: 'outlined',
});

app.mount('#app');
