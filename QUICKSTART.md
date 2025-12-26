# Quick Start Guide

Get the Rack Designer Vue component up and running in minutes.

## 1. Installation

### Option A: Start from Scratch

```bash
# Create a new Vue project
npm create vite@latest my-rack-designer -- --template vue

# Navigate to project
cd my-rack-designer

# Install dependencies
npm install primevue primeicons bootstrap html2canvas jspdf qrcode
```

### Option B: Add to Existing Project

```bash
npm install primevue primeicons bootstrap html2canvas jspdf qrcode
```

## 2. Setup

### Configure PrimeVue (main.js)

```javascript
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';

// Styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(PrimeVue);
app.mount('#app');
```

## 3. Add Component Files

Copy these files to your project:

```
src/
├── components/
│   └── RackDesigner.vue
├── composables/
│   └── useRackManager.js
├── data/
│   └── devices.js
├── api/
│   └── deviceAPI.js (optional)
└── types.ts (optional, for TypeScript)
```

## 4. Use the Component

```vue
<template>
  <div id="app">
    <RackDesigner />
  </div>
</template>

<script setup>
import RackDesigner from './components/RackDesigner.vue';
</script>
```

## 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Basic Usage Examples

### Example 1: Default Configuration

```vue
<template>
  <RackDesigner />
</template>
```

### Example 2: Custom Device Library

```vue
<script setup>
import { ref } from 'vue';
import RackDesigner from './components/RackDesigner.vue';

// Load your custom devices
const customDevices = ref([
  {
    id: '1',
    name: 'My Server',
    manufacturer: 'Dell',
    model: 'R740',
    uHeight: 2,
    image: '/images/server.png',
  },
  // ... more devices
]);
</script>

<template>
  <RackDesigner />
</template>
```

### Example 3: With API Integration

```vue
<script setup>
import { ref, onMounted } from 'vue';
import RackDesigner from './components/RackDesigner.vue';
import { NetBoxDeviceAPI } from './api/deviceAPI';

const devices = ref([]);
const loading = ref(true);

onMounted(async () => {
  const api = new NetBoxDeviceAPI(
    'https://netbox.example.com',
    'your-token'
  );
  
  devices.value = await api.fetchDeviceTypes();
  loading.value = false;
});
</script>

<template>
  <div v-if="loading">Loading devices...</div>
  <RackDesigner v-else />
</template>
```

## Common Customizations

### Change Rack Colors

```vue
<style>
.rack-view {
  background: #1a1a1a !important;
}

.installed-device {
  background: linear-gradient(135deg, #your-color 0%, #your-color-2 100%) !important;
}
</style>
```

### Default Rack Height

Modify in RackDesigner.vue:
```javascript
const rackHeight = ref(42); // Change to your preferred default
```

### Add Real Device Images

Update your device data:
```javascript
{
  id: 'dell-r740',
  name: 'Dell PowerEdge R740',
  image: 'https://your-cdn.com/images/dell-r740.png',
  // ... other properties
}
```

## Features Overview

### Drag and Drop
1. Click and drag devices from the library
2. Drop onto valid rack positions
3. Visual feedback shows where device will go

### Add Devices Manually
1. Click "Add Device" button
2. Select device from dropdown
3. Choose position and label
4. Click "Add"

### Export
- **PNG**: Click "Export PNG" - saves as image
- **PDF**: Click "Export PDF" - saves as PDF document
- **Share**: Click "Share" - get URL and QR code

### Device Management
- Click device in rack to select
- Edit label in sidebar
- Move device to new position
- Remove device from rack

## Troubleshooting

### Devices not appearing
- Check console for errors
- Verify device data format matches schema
- Ensure images are accessible (CORS)

### Export not working
- Verify html2canvas and jsPDF are installed
- Check browser console for errors
- Try different browser

### Styling issues
- Ensure all CSS imports are in correct order
- Check for conflicting global styles
- Verify PrimeVue theme is loaded

### TypeScript errors
- Copy types.ts to your project
- Import types where needed:
  ```typescript
  import type { Device, InstalledDevice } from './types';
  ```

## Next Steps

1. **Customize Device Library**
   - Add your own devices
   - Load from NetBox API
   - Add device images

2. **Persist Rack Configurations**
   - Save to localStorage
   - Integrate with backend API
   - Use IndexedDB for offline support

3. **Add More Features**
   - Cable management visualization
   - Power consumption tracking
   - Temperature monitoring
   - Multiple racks management

## Need Help?

- Check the full README.md for detailed documentation
- Review the API integration examples
- Look at the composable usage patterns
- Examine the types file for data structures

## Project Structure

```
my-rack-designer/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   └── RackDesigner.vue    # Main component
│   ├── composables/
│   │   └── useRackManager.js   # Rack logic
│   ├── data/
│   │   └── devices.js          # Sample devices
│   ├── api/
│   │   └── deviceAPI.js        # API integrations
│   ├── App.vue                 # Root component
│   └── main.js                 # Entry point
├── index.html
├── package.json
└── vite.config.js
```

Happy rack designing! 🚀
