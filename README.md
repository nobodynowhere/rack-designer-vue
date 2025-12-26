# Rack Designer Vue Component

A Vue.js component for visualizing and designing server rack layouts, ported from the original [Rackarr](https://github.com/Rackarr/Rackarr) project. Built with Vue 3, PrimeVue, and Bootstrap.

## Features

- 🎯 **Drag & Drop** - Drag devices from the library directly into rack positions
- 📏 **Flexible Rack Heights** - Support for 10U to 52U racks
- 🖼️ **Export Options** - Export to PNG, PDF, or share via URL/QR code
- 🔗 **URL-based Sharing** - Rack state is encoded in the URL for easy sharing
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Device Library** - Pre-configured devices with search functionality
- ⚙️ **Device Management** - Add, edit, move, and remove devices easily

## Installation

### 1. Install Dependencies

```bash
npm install vue primevue primeicons bootstrap html2canvas jspdf qrcode
```

### 2. Configure PrimeVue

In your `main.js` or `main.ts`:

```javascript
import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';

// PrimeVue CSS
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(PrimeVue);
app.mount('#app');
```

### 3. Use the Component

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

## Usage

### Basic Usage

The component works out of the box with no configuration required:

```vue
<RackDesigner />
```

### Adding Custom Devices

You can customize the device library by modifying the `availableDevices` array in the component:

```javascript
const availableDevices = ref([
  {
    id: '1',
    name: 'Dell PowerEdge R740',
    manufacturer: 'Dell',
    model: 'R740',
    uHeight: 2,
    image: '/images/dell-r740.png', // Optional image URL
  },
  // Add more devices...
]);
```

### Loading State from URL

The component automatically loads rack state from the URL parameter `?rack=`. You can share rack layouts by copying the URL when the "Share" button is clicked.

### Exporting

- **PNG Export**: Click "Export PNG" to download the rack as an image
- **PDF Export**: Click "Export PDF" to download the rack as a PDF
- **Share**: Click "Share" to get a shareable URL and QR code

## Device Library Integration

To integrate with NetBox or other device libraries:

```javascript
// Example: Fetch devices from an API
import { ref, onMounted } from 'vue';

const availableDevices = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/device-types');
    const devices = await response.json();
    
    availableDevices.value = devices.map(device => ({
      id: device.id,
      name: device.name,
      manufacturer: device.manufacturer.name,
      model: device.model,
      uHeight: device.u_height,
      image: device.front_image || device.rear_image,
    }));
  } catch (error) {
    console.error('Failed to load devices:', error);
  }
});
```

## Component Props (Future Enhancement)

The component can be extended to accept props:

```vue
<RackDesigner
  :initial-rack-height="42"
  :initial-rack-name="My Data Center Rack"
  :device-library="customDevices"
  @rack-updated="handleRackUpdate"
/>
```

## Customization

### Styling

The component uses scoped styles. You can override colors and dimensions by targeting the CSS classes:

```css
/* Change rack background */
.rack-view {
  background: #1a1a1a !important;
}

/* Change device colors */
.installed-device {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%) !important;
}
```

### Device Images

To use custom device images, ensure your images are accessible and update the `image` property in your device objects:

```javascript
{
  id: '1',
  name: 'Dell PowerEdge R740',
  image: 'https://your-cdn.com/images/dell-r740-front.png',
  // ... other properties
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Features Breakdown

### Drag and Drop
- Drag devices from the library
- Drop them into valid rack positions
- Visual feedback for valid/invalid drop zones
- Automatic overlap detection

### Device Management
- Add devices via dialog or drag-and-drop
- Edit device labels
- Move devices to different positions
- Remove devices from rack
- Select devices to view properties

### Export & Sharing
- PNG export using html2canvas
- PDF export using jsPDF
- URL-based state encoding
- QR code generation for mobile sharing

### Rack Configuration
- Adjustable rack height (10U - 52U)
- Custom rack naming
- Clear all devices
- U-position numbering (bottom to top)

## Known Limitations

1. **Device Images**: Default implementation uses placeholders. You'll need to provide actual device images.
2. **State Persistence**: State is URL-based only. For persistent storage, integrate with localStorage or a backend.
3. **Collaboration**: No real-time collaboration features (yet).

## Troubleshooting

### Images not displaying
Ensure your image URLs are accessible and CORS-enabled:
```javascript
image: 'https://your-domain.com/images/device.png'
```

### Export not working
Make sure html2canvas and jsPDF are properly installed:
```bash
npm install html2canvas jspdf
```

### QR Code not generating
Verify qrcode package is installed:
```bash
npm install qrcode
```

## Development

### Run in Development Mode

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

## License

MIT License - feel free to use in your projects!

## Credits

- Original Rackarr project: https://github.com/Rackarr/Rackarr
- Built with Vue 3 and PrimeVue
- Device images compatible with NetBox devicetype-library

## Contributing

Contributions welcome! Areas for improvement:
- Real device image integration
- Backend API integration
- Collaborative editing
- More export formats (SVG, JSON)
- Device templates and presets
- Cable management visualization
- Power consumption tracking
