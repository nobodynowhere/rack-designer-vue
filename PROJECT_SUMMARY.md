# Vue Rack Designer - Project Summary

This is a complete Vue.js port of the Rackarr project - a visual rack layout designer for homelabbers.

## What's Included

### Core Components
- **RackDesigner.vue** - Main component with full drag-and-drop functionality
- **App.vue** - Example root component showing how to use it
- **main.js** - Vue app initialization with PrimeVue setup

### Supporting Files
- **composables/useRackManager.js** - Reusable rack management logic
- **data/devices.js** - Sample device library with 30+ devices
- **api/deviceAPI.js** - NetBox and custom API integration examples
- **types.ts** - TypeScript type definitions

### Configuration
- **package.json** - All required dependencies
- **vite.config.js** - Vite build configuration
- **index.html** - HTML entry point

### Documentation
- **README.md** - Complete documentation
- **QUICKSTART.md** - Step-by-step setup guide

## Key Features Implemented

✅ Drag & drop interface for devices
✅ Adjustable rack heights (10U-52U)
✅ Device library with search
✅ PNG export (via html2canvas)
✅ PDF export (via jsPDF)
✅ URL-based sharing with QR codes
✅ Device property editing
✅ Visual feedback for valid/invalid drops
✅ Responsive design with Bootstrap
✅ PrimeVue components throughout

## Quick Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## File Structure

```
rack-designer/
├── RackDesigner.vue          # Main component
├── App.vue                   # Example usage
├── main.js                   # App entry point
├── index.html                # HTML template
├── package.json              # Dependencies
├── vite.config.js            # Build config
├── types.ts                  # TypeScript types
├── composables/
│   └── useRackManager.js     # Rack logic composable
├── data/
│   └── devices.js            # Sample device library
├── api/
│   └── deviceAPI.js          # API integration examples
├── README.md                 # Full documentation
└── QUICKSTART.md             # Setup guide
```

## Technology Stack

- **Vue 3** - Composition API
- **PrimeVue 3.50+** - UI component library
- **Bootstrap 5** - Grid system and utilities
- **html2canvas** - PNG export
- **jsPDF** - PDF generation
- **qrcode** - QR code generation
- **Vite** - Build tool

## Next Steps

1. **Add Real Device Images**: Replace placeholder images with actual device photos
2. **API Integration**: Connect to NetBox or your device database
3. **Persistence**: Add localStorage or backend API for saving racks
4. **Features**: Consider adding power monitoring, cable management, etc.

## Differences from Original Rackarr

The original Rackarr is built with Svelte. This Vue port maintains the same functionality while leveraging:
- Vue 3 Composition API for reactive state
- PrimeVue for rich UI components
- Bootstrap for responsive layouts
- Modular composables for code reuse

## Component Props (Ready for Extension)

The component is designed to accept props for customization:
- initialRackHeight
- initialRackName  
- deviceLibrary
- Events: @rack-updated, @device-added, etc.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Tested with latest browser versions

## License

MIT - Same as original Rackarr project

## Credits

- Original Rackarr: https://github.com/Rackarr/Rackarr
- Device data compatible with NetBox devicetype-library
- Built for r/homelab and r/selfhosted communities

---

Need help? Check QUICKSTART.md for detailed setup instructions!
