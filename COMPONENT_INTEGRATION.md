# Self-Contained Component Integration Guide

This guide explains how to copy the RackDesigner component directly into your existing Vue 3 project and use it with a reactive `rackModel`.

## Quick Start

### 1. Copy Files to Your Project

Copy these files/folders to your project:

```
your-project/
├── src/
│   ├── components/
│   │   └── RackDesigner.vue          # Main component
│   ├── composables/
│   │   └── useRackExport.js          # Export functionality (optional)
│   └── data/
│       └── devices.js                # Device library (optional, can customize)
```

**Required:**
- `components/RackDesigner.vue` - The main component

**Optional (component has defaults):**
- `composables/useRackExport.js` - Export to PDF/PNG/QR features
- `data/devices.js` - Default device library

### 2. Install Required Dependencies

```bash
npm install primevue@^4.5.0 @primevue/themes@^4.5.0 primeicons@^7.0.0
npm install html2canvas jspdf qrcode  # Optional: for export features
```

### 3. Configure PrimeVue (main.js or main.ts)

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// Import PrimeVue components used by RackDesigner
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import ScrollPanel from 'primevue/scrollpanel';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';

// Import PrimeIcons
import 'primeicons/primeicons.css';

const app = createApp(App);

// Configure PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// Register PrimeVue components globally
app.component('Dialog', Dialog);
app.component('Drawer', Drawer);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Select', Select);
app.component('Textarea', Textarea);
app.component('ScrollPanel', ScrollPanel);
app.component('Tag', Tag);
app.component('Divider', Divider);

app.mount('#app');
```

## Usage with rackModel Prop

### Basic Usage

```vue
<script setup>
import { ref } from 'vue';
import RackDesigner from '@/components/RackDesigner.vue';

// Create a reactive rack model
const myRack = ref({
  name: 'Production Rack 1',
  height: 42,
  devices: []
});

// Optional: handle updates
function handleRackUpdate(updatedRack) {
  console.log('Rack updated:', updatedRack);
  // Save to database, etc.
}
</script>

<template>
  <div>
    <h1>My Datacenter</h1>
    <RackDesigner
      :rack-model="myRack"
      @rack-updated="handleRackUpdate"
    />
  </div>
</template>
```

### Advanced Usage with Custom Devices

```vue
<script setup>
import { ref } from 'vue';
import RackDesigner from '@/components/RackDesigner.vue';

// Your custom device library
const customDevices = ref([
  {
    id: 'server-1',
    name: 'Custom Server 2U',
    manufacturer: 'Dell',
    model: 'R740',
    uHeight: 2,
    category: 'Server',
    deviceType: 'server',
  },
  {
    id: 'chassis-1',
    name: 'Custom Chassis',
    manufacturer: 'Cisco',
    model: 'UCS 5108',
    uHeight: 6,
    category: 'Chassis',
    deviceType: 'chassis',
    slots: { count: 8, rows: 2, columns: 4 },
  },
]);

// Rack model with initial devices
const rack = ref({
  name: 'Server Room A - Rack 1',
  height: 42,
  devices: [
    {
      instanceId: Date.now(),
      id: 'server-1',
      name: 'Web Server',
      manufacturer: 'Dell',
      model: 'R740',
      uHeight: 2,
      position: 40, // Bottom U position
      label: 'WEB-01',
      deviceType: 'server',
    }
  ]
});
</script>

<template>
  <RackDesigner
    :rack-model="rack"
    :device-library="customDevices"
  />
</template>
```

### Loading from API

```vue
<script setup>
import { ref, onMounted } from 'vue';
import RackDesigner from '@/components/RackDesigner.vue';

const rack = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    // Load rack configuration from your API
    const response = await fetch('/api/racks/1');
    const data = await response.json();

    rack.value = {
      name: data.name,
      height: data.height,
      devices: data.devices.map(device => ({
        instanceId: device.id,
        id: device.device_type_id,
        name: device.name,
        manufacturer: device.manufacturer,
        model: device.model,
        uHeight: device.u_height,
        position: device.position,
        label: device.label,
        deviceType: device.type,
        // For chassis
        slots: device.slots,
        blades: device.blades || [],
      }))
    };
  } catch (error) {
    console.error('Failed to load rack:', error);
  } finally {
    loading.value = false;
  }
});

async function saveRack(updatedRack) {
  await fetch('/api/racks/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedRack)
  });
}
</script>

<template>
  <div>
    <p v-if="loading">Loading rack configuration...</p>
    <RackDesigner
      v-else
      :rack-model="rack"
      @rack-updated="saveRack"
    />
  </div>
</template>
```

### Using with Vuex/Pinia Store

```vue
<script setup>
import { computed } from 'vue';
import { useRackStore } from '@/stores/rack';
import RackDesigner from '@/components/RackDesigner.vue';

const rackStore = useRackStore();

// Two-way binding with store
const rack = computed({
  get: () => rackStore.currentRack,
  set: (value) => rackStore.updateRack(value)
});

function handleDeviceAdded(event) {
  rackStore.logChange('Device added', event.device);
}

function handleDeviceMoved(event) {
  rackStore.logChange('Device moved', event);
}
</script>

<template>
  <RackDesigner
    :rack-model="rack"
    @device-added="handleDeviceAdded"
    @device-moved="handleDeviceMoved"
  />
</template>
```

## Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `rackModel` | Object | No | `{ name: 'Server Rack', height: 42, devices: [] }` | Complete rack configuration |
| `initialRackName` | String | No | `'Server Rack'` | Rack name (ignored if rackModel provided) |
| `initialRackHeight` | Number | No | `42` | Rack height in U (ignored if rackModel provided) |
| `deviceLibrary` | Array | No | Built-in devices | Array of available devices |

### rackModel Structure

```javascript
{
  name: 'Rack Name',          // Rack display name
  height: 42,                 // Rack height in U (10-52)
  devices: [                  // Array of installed devices
    {
      instanceId: 123,        // Unique instance ID
      id: 'device-id',        // Device type ID
      name: 'Device Name',    // Device name
      manufacturer: 'Dell',   // Manufacturer
      model: 'R740',          // Model
      uHeight: 2,             // Height in U
      position: 10,           // Bottom U position
      label: 'WEB-01',        // Custom label
      deviceType: 'server',   // 'server', 'chassis', or 'blade'

      // For chassis only:
      slots: {
        count: 8,
        rows: 2,
        columns: 4
      },
      blades: [               // Installed blades
        {
          slot: 1,
          id: 'blade-id',
          name: 'Blade Server',
          label: 'BLADE-01',
          // ... other blade properties
        }
      ]
    }
  ]
}
```

## Component Events

| Event | Payload | Description |
|-------|---------|-------------|
| `rack-updated` | `{ name, height, devices }` | Emitted when any rack property changes |
| `device-added` | `{ device, devices }` | Emitted when device added |
| `device-removed` | `{ device, devices }` | Emitted when device removed |
| `device-moved` | `{ device, oldPosition, newPosition, devices }` | Emitted when device repositioned |
| `blade-added` | `{ chassis, blade, devices }` | Emitted when blade added to chassis |
| `blade-removed` | `{ chassis, blade, devices }` | Emitted when blade removed |

## File Structure in Your Project

```
your-project/
├── src/
│   ├── components/
│   │   └── RackDesigner.vue          # Copy this
│   ├── composables/                  # Optional
│   │   └── useRackExport.js
│   ├── data/                         # Optional (or customize)
│   │   └── devices.js
│   ├── views/
│   │   └── RackManagement.vue        # Your page using the component
│   └── main.js                       # PrimeVue setup
```

## Customization

### Custom Device Library

Don't copy `data/devices.js`. Instead, provide your own:

```vue
<script setup>
const myDevices = ref([
  // Your custom devices
]);
</script>

<template>
  <RackDesigner :device-library="myDevices" />
</template>
```

### Disable Export Features

If you don't need PDF/PNG/QR export:

1. Don't install `html2canvas`, `jspdf`, `qrcode`
2. Don't copy `composables/useRackExport.js`
3. The component will hide export buttons automatically

### Custom Styling

Override CSS in your component:

```vue
<style scoped>
/* Your custom styles */
:deep(.rack-designer) {
  --rack-bg-color: #2c3e50;
}

:deep(.installed-device) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
```

## Minimal Setup (No Optional Features)

If you only want basic rack management:

**Install:**
```bash
npm install vue@^3.4.0 primevue@^4.5.0 @primevue/themes@^4.5.0 primeicons@^7.0.0
```

**Copy:**
- `components/RackDesigner.vue`

**Usage:**
```vue
<script setup>
import { ref } from 'vue';
import RackDesigner from '@/components/RackDesigner.vue';

const rack = ref({
  name: 'My Rack',
  height: 42,
  devices: []
});
</script>

<template>
  <RackDesigner :rack-model="rack" />
</template>
```

## Troubleshooting

### "Cannot find module 'primevue/...'"
Install PrimeVue and register components in main.js

### "useRackExport is not defined"
Either copy `composables/useRackExport.js` or remove export features

### Device library is empty
Provide custom devices via `:device-library` prop

### Styles not working
Import PrimeIcons CSS: `import 'primeicons/primeicons.css'`

### TypeScript errors
Copy `types.ts` to your project or create type definitions

## Migration from Standalone App

If you were using this as a standalone app and want to integrate it:

1. Copy `components/RackDesigner.vue` to your project
2. Install dependencies
3. Configure PrimeVue in your main.js
4. Use with v-model pattern:

```vue
<script setup>
import { ref } from 'vue';
import RackDesigner from '@/components/RackDesigner.vue';

const rack = ref(null);

// Load from your existing data
onMounted(() => {
  rack.value = loadRackFromDatabase();
});
</script>

<template>
  <RackDesigner :rack-model="rack" />
</template>
```

## Next Steps

- See `CUSTOM_DEVICES.md` for device injection examples
- See `README.md` for feature documentation
- Check component props in `RackDesigner.vue` for all options
