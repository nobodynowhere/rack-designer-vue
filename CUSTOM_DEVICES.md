# Custom Devices and Chassis Guide

## Injecting Custom Devices

The RackDesigner component accepts a `deviceLibrary` prop that allows you to provide your own custom devices and chassis.

## Device Structure

### Standard Server/Device

```javascript
{
  id: 'unique-id',              // Unique identifier
  name: 'Device Display Name',   // Full name shown in UI
  manufacturer: 'Manufacturer',  // e.g., 'Dell', 'HP', 'Cisco'
  model: 'Model Number',         // e.g., 'R740', 'DL380'
  uHeight: 2,                    // Height in rack units (1-52)
  category: 'Server',            // Category for filtering
  deviceType: 'server',          // 'server', 'chassis', or 'blade'
  image: null,                   // Optional: URL to device image
}
```

### Chassis Device

```javascript
{
  id: 'dell-m1000e',
  name: 'Dell PowerEdge M1000e',
  manufacturer: 'Dell',
  model: 'M1000e',
  uHeight: 10,                   // Chassis height in rack units
  category: 'Chassis',
  deviceType: 'chassis',
  image: null,
  slots: {
    count: 16,                   // Total number of blade slots
    rows: 4,                     // Number of rows (for grid layout)
    columns: 4,                  // Number of columns
  }
}
```

### Blade Server

```javascript
{
  id: 'dell-m640',
  name: 'Dell PowerEdge M640',
  manufacturer: 'Dell',
  model: 'M640',
  uHeight: 0,                    // Blades don't occupy rack units
  deviceType: 'blade',
  slotHeight: 1,                 // How many chassis slots this blade occupies
  image: null,
}
```

## Usage Examples

### Example 1: Simple Custom Device Library

```vue
<script setup>
import { ref } from 'vue';
import { RackDesigner } from 'rack-designer-vue';

const myDevices = ref([
  // Servers
  {
    id: 'my-server-1',
    name: 'Custom Server 1U',
    manufacturer: 'Acme Corp',
    model: 'AS-1000',
    uHeight: 1,
    category: 'Server',
    deviceType: 'server',
  },
  {
    id: 'my-server-2',
    name: 'Custom Server 2U',
    manufacturer: 'Acme Corp',
    model: 'AS-2000',
    uHeight: 2,
    category: 'Server',
    deviceType: 'server',
  },
  // Network devices
  {
    id: 'my-switch',
    name: 'Custom 48-Port Switch',
    manufacturer: 'Acme Corp',
    model: 'SW-48',
    uHeight: 1,
    category: 'Network',
    deviceType: 'server',
  },
]);
</script>

<template>
  <RackDesigner :device-library="myDevices" />
</template>
```

### Example 2: Fetching Devices from API

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { RackDesigner } from 'rack-designer-vue';

const devices = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetch from your API
    const response = await fetch('/api/rack-devices');
    const data = await response.json();

    // Transform API data to device format
    devices.value = data.map(device => ({
      id: device.device_id,
      name: device.display_name,
      manufacturer: device.manufacturer,
      model: device.model_number,
      uHeight: device.rack_units,
      category: device.device_category,
      deviceType: device.type,
      image: device.image_url,
    }));
  } catch (error) {
    console.error('Failed to load devices:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading">Loading devices...</div>
    <RackDesigner v-else :device-library="devices" />
  </div>
</template>
```

### Example 3: Custom Chassis with Blades

```vue
<script setup>
import { ref } from 'vue';
import { RackDesigner } from 'rack-designer-vue';

const customDevices = ref([
  // Chassis
  {
    id: 'custom-chassis-1',
    name: 'Custom Blade Chassis 6U',
    manufacturer: 'Acme Corp',
    model: 'BC-6000',
    uHeight: 6,
    category: 'Chassis',
    deviceType: 'chassis',
    slots: {
      count: 8,      // 8 blade slots
      rows: 2,       // 2 rows
      columns: 4,    // 4 columns
    }
  },
  // Compatible blade servers
  {
    id: 'custom-blade-1',
    name: 'Custom Blade Server',
    manufacturer: 'Acme Corp',
    model: 'BS-1000',
    uHeight: 0,
    deviceType: 'blade',
    slotHeight: 1,   // Occupies 1 chassis slot
  },
  {
    id: 'custom-blade-2',
    name: 'Custom Double-Height Blade',
    manufacturer: 'Acme Corp',
    model: 'BS-2000',
    uHeight: 0,
    deviceType: 'blade',
    slotHeight: 2,   // Occupies 2 chassis slots
  },
  // Regular servers
  {
    id: 'server-1',
    name: 'Regular Rack Server',
    manufacturer: 'Acme Corp',
    model: 'RS-2000',
    uHeight: 2,
    category: 'Server',
    deviceType: 'server',
  },
]);
</script>

<template>
  <RackDesigner :device-library="customDevices" />
</template>
```

### Example 4: NetBox Integration

```vue
<script setup>
import { ref, onMounted } from 'vue';
import { RackDesigner } from 'rack-designer-vue';

const netboxDevices = ref([]);

async function fetchNetBoxDevices() {
  const response = await fetch('https://netbox.example.com/api/dcim/device-types/', {
    headers: {
      'Authorization': 'Token YOUR_NETBOX_TOKEN',
      'Accept': 'application/json',
    }
  });

  const data = await response.json();

  // Transform NetBox device types to RackDesigner format
  netboxDevices.value = data.results.map(deviceType => ({
    id: deviceType.id.toString(),
    name: deviceType.display,
    manufacturer: deviceType.manufacturer.name,
    model: deviceType.model,
    uHeight: deviceType.u_height,
    category: deviceType.manufacturer.name, // or use custom categorization
    deviceType: 'server', // Determine based on your logic
    image: null,
  }));
}

onMounted(() => {
  fetchNetBoxDevices();
});
</script>

<template>
  <RackDesigner :device-library="netboxDevices" />
</template>
```

### Example 5: Mixed Device Library with Categories

```vue
<script setup>
import { ref } from 'vue';
import { RackDesigner } from 'rack-designer-vue';

const enterpriseDevices = ref([
  // Compute - Servers
  {
    id: 'srv-001',
    name: 'Application Server',
    manufacturer: 'Dell',
    model: 'PowerEdge R740',
    uHeight: 2,
    category: 'Compute',
    deviceType: 'server',
  },
  {
    id: 'srv-002',
    name: 'Database Server',
    manufacturer: 'HP',
    model: 'ProLiant DL380 Gen10',
    uHeight: 2,
    category: 'Compute',
    deviceType: 'server',
  },

  // Compute - Chassis
  {
    id: 'chassis-001',
    name: 'Blade Chassis',
    manufacturer: 'Cisco',
    model: 'UCS 5108',
    uHeight: 6,
    category: 'Compute',
    deviceType: 'chassis',
    slots: {
      count: 8,
      rows: 2,
      columns: 4,
    }
  },
  {
    id: 'blade-001',
    name: 'Application Blade',
    manufacturer: 'Cisco',
    model: 'UCS B200 M5',
    uHeight: 0,
    deviceType: 'blade',
    slotHeight: 1,
  },

  // Networking
  {
    id: 'net-001',
    name: 'Core Switch',
    manufacturer: 'Cisco',
    model: 'Catalyst 9500',
    uHeight: 1,
    category: 'Network',
    deviceType: 'server',
  },
  {
    id: 'net-002',
    name: 'Access Switch',
    manufacturer: 'Cisco',
    model: 'Catalyst 9300',
    uHeight: 1,
    category: 'Network',
    deviceType: 'server',
  },

  // Storage
  {
    id: 'stor-001',
    name: 'SAN Storage',
    manufacturer: 'NetApp',
    model: 'FAS2720',
    uHeight: 2,
    category: 'Storage',
    deviceType: 'server',
  },

  // Power
  {
    id: 'pwr-001',
    name: 'UPS',
    manufacturer: 'APC',
    model: 'Smart-UPS 3000',
    uHeight: 2,
    category: 'Power',
    deviceType: 'server',
  },

  // Security
  {
    id: 'sec-001',
    name: 'Firewall',
    manufacturer: 'Palo Alto',
    model: 'PA-3220',
    uHeight: 1,
    category: 'Security',
    deviceType: 'server',
  },
]);
</script>

<template>
  <RackDesigner :device-library="enterpriseDevices" />
</template>
```

## Device Categories

The component uses the `category` field for filtering in the UI. Common categories include:

- `Server` - Rack-mount servers
- `Chassis` - Blade chassis
- `Network` - Switches, routers
- `Storage` - SANs, NAS devices
- `Power` - UPS, PDUs
- `Security` - Firewalls, security appliances
- `Patch Panel` - Patch panels
- `KVM` - KVM switches
- `Console` - Console servers
- `Blank` - Blank panels

You can use any category names that fit your organization's needs.

## Device Images

To add custom images to devices:

```javascript
{
  id: 'my-device',
  name: 'My Custom Device',
  // ... other properties
  image: 'https://example.com/images/device.png',
  // or use a local image:
  image: '/assets/devices/my-device.png',
}
```

## Real-Time Device Updates

You can update the device library dynamically:

```vue
<script setup>
import { ref } from 'vue';
import { RackDesigner } from 'rack-designer-vue';

const devices = ref([/* initial devices */]);

function addNewDevice(device) {
  devices.value.push(device);
}

function removeDevice(deviceId) {
  devices.value = devices.value.filter(d => d.id !== deviceId);
}

function updateDevice(deviceId, updates) {
  const index = devices.value.findIndex(d => d.id === deviceId);
  if (index !== -1) {
    devices.value[index] = { ...devices.value[index], ...updates };
  }
}
</script>

<template>
  <RackDesigner :device-library="devices" />
</template>
```

## TypeScript Support

If using TypeScript, import the types:

```typescript
import type { Device, ChassisDevice, BladeServer } from 'rack-designer-vue/types';

const myDevices: Device[] = [
  {
    id: 'server-1',
    name: 'My Server',
    manufacturer: 'Dell',
    model: 'R740',
    uHeight: 2,
    category: 'Server',
    deviceType: 'server',
    image: null,
  } as Device,
];
```

## Best Practices

1. **Use unique IDs** - Ensure each device has a globally unique `id`
2. **Consistent naming** - Use consistent manufacturer and model naming
3. **Validate uHeight** - Ensure uHeight is between 1-52 for rack devices
4. **Proper deviceType** - Use 'server', 'chassis', or 'blade' correctly
5. **Chassis slot configuration** - Ensure rows × columns = count for chassis
6. **Image optimization** - Use compressed images for better performance
7. **Category consistency** - Use consistent category names for better filtering
8. **Blade compatibility** - Document which blades work with which chassis

## Common Patterns

### Loading from Database

```javascript
// Fetch devices from your database
const devices = await db.query(`
  SELECT
    id,
    name,
    manufacturer,
    model,
    rack_units as uHeight,
    category,
    CASE
      WHEN is_chassis THEN 'chassis'
      WHEN is_blade THEN 'blade'
      ELSE 'server'
    END as deviceType
  FROM equipment_catalog
`);
```

### Dynamic Categorization

```javascript
function categorizeDevice(device) {
  if (device.name.toLowerCase().includes('switch')) {
    return 'Network';
  } else if (device.name.toLowerCase().includes('ups')) {
    return 'Power';
  } else if (device.name.toLowerCase().includes('storage')) {
    return 'Storage';
  }
  return 'Server';
}
```

### Chassis Validation

```javascript
function validateChassis(chassis) {
  if (!chassis.slots) {
    throw new Error('Chassis must have slots configuration');
  }

  const { count, rows, columns } = chassis.slots;

  if (rows * columns !== count) {
    throw new Error(`Slot configuration invalid: ${rows} × ${columns} ≠ ${count}`);
  }

  return true;
}
```
