# Installation Guide

## Installing in Your Project

### Option 1: Install from npm (when published)

```bash
npm install rack-designer-vue
```

### Option 2: Install from GitHub

```bash
npm install git+https://github.com/nobodynowhere/rack-designer-vue.git
```

### Option 3: Local Installation (for development)

1. Clone the repository:
```bash
git clone https://github.com/nobodynowhere/rack-designer-vue.git
cd rack-designer-vue
```

2. Build the library:
```bash
npm install
npm run build:lib
```

3. In your project, install from local path:
```bash
npm install /path/to/rack-designer-vue
```

Or use npm link:
```bash
# In rack-designer-vue directory
npm link

# In your project directory
npm link rack-designer-vue
```

## Required Peer Dependencies

Make sure you have these dependencies installed in your project:

```bash
npm install vue@^3.4.0 primevue@^4.5.0 @primevue/themes@^4.5.0 primeicons@^7.0.0
```

## Usage

### 1. Global Registration (main.js or main.ts)

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

// Import RackDesigner
import RackDesigner from 'rack-designer-vue';
import 'rack-designer-vue/style.css';

// Import PrimeVue components used by RackDesigner
import Dialog from 'primevue/dialog';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';

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

// Register RackDesigner globally
app.component('RackDesigner', RackDesigner);

app.mount('#app');
```

### 2. Local Component Registration

```vue
<script setup>
import { ref } from 'vue';
import { RackDesigner } from 'rack-designer-vue';
import 'rack-designer-vue/style.css';

const rackData = ref(null);

function handleRackUpdate(data) {
  rackData.value = data;
  console.log('Rack updated:', data);
}
</script>

<template>
  <div>
    <RackDesigner
      initial-rack-name="Server Rack 1"
      :initial-rack-height="42"
      @rack-updated="handleRackUpdate"
    />
  </div>
</template>
```

### 3. Using with Options API

```vue
<template>
  <div>
    <RackDesigner
      :initial-rack-name="rackName"
      :initial-rack-height="rackHeight"
      @rack-updated="handleRackUpdate"
      @device-moved="handleDeviceMoved"
    />
  </div>
</template>

<script>
import { RackDesigner } from 'rack-designer-vue';
import 'rack-designer-vue/style.css';

export default {
  name: 'MyRackPage',
  components: {
    RackDesigner,
  },
  data() {
    return {
      rackName: 'Production Rack',
      rackHeight: 42,
    };
  },
  methods: {
    handleRackUpdate(data) {
      console.log('Rack configuration:', data);
    },
    handleDeviceMoved({ device, oldPosition, newPosition }) {
      console.log(`Device moved from U${oldPosition} to U${newPosition}`);
    },
  },
};
</script>
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialRackName` | String | `'My Rack'` | Initial name for the rack |
| `initialRackHeight` | Number | `42` | Initial height of the rack in U (10-52) |

## Component Events

| Event | Payload | Description |
|-------|---------|-------------|
| `rack-updated` | `{ name, height, devices }` | Emitted when rack configuration changes |
| `device-added` | `{ device, devices }` | Emitted when a device is added to the rack |
| `device-removed` | `{ device, devices }` | Emitted when a device is removed |
| `device-moved` | `{ device, oldPosition, newPosition, devices }` | Emitted when a device is repositioned |
| `blade-added` | `{ chassis, blade, devices }` | Emitted when a blade is added to a chassis |
| `blade-removed` | `{ chassis, blade, devices }` | Emitted when a blade is removed |

## Features

- ✅ Drag and drop devices from library
- ✅ Reposition devices within rack
- ✅ Chassis/blade server support
- ✅ Custom device creation
- ✅ Export to PDF
- ✅ Export to PNG
- ✅ Generate QR code for sharing
- ✅ JSON import/export
- ✅ Position validation
- ✅ Responsive design

## Styling

The component uses Bootstrap 5 and PrimeVue themes. You can customize the appearance by:

1. Overriding CSS variables
2. Using PrimeVue theme customization
3. Adding custom CSS classes

Example custom styling:

```css
/* In your main CSS file */
.rack-designer {
  --rack-bg-color: #2c3e50;
  --device-color: #3498db;
}
```

## TypeScript Support

TypeScript definitions are included. Import types:

```typescript
import { RackDesigner } from 'rack-designer-vue';
import type { Device, ChassisDevice, BladeServer } from 'rack-designer-vue/types';
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 14+

## License

MIT
