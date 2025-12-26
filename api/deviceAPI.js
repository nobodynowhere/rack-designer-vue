/**
 * Example API integration for fetching devices from NetBox or custom backend
 */

// NetBox API Integration Example
export class NetBoxDeviceAPI {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    };
  }

  /**
   * Fetch device types from NetBox
   */
  async fetchDeviceTypes(params = {}) {
    const queryParams = new URLSearchParams({
      limit: params.limit || 100,
      offset: params.offset || 0,
      ...params,
    });

    const response = await fetch(
      `${this.baseUrl}/api/dcim/device-types/?${queryParams}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`NetBox API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform NetBox format to component format
    return data.results.map(device => ({
      id: device.id.toString(),
      name: `${device.manufacturer.name} ${device.model}`,
      manufacturer: device.manufacturer.name,
      model: device.model,
      uHeight: device.u_height,
      image: device.front_image || device.rear_image || null,
      // Additional NetBox fields
      partNumber: device.part_number,
      slug: device.slug,
      description: device.description,
    }));
  }

  /**
   * Search device types
   */
  async searchDeviceTypes(query) {
    return this.fetchDeviceTypes({ q: query });
  }

  /**
   * Get device types by manufacturer
   */
  async getDevicesByManufacturer(manufacturerSlug) {
    return this.fetchDeviceTypes({ manufacturer: manufacturerSlug });
  }
}

// Custom Backend API Example
export class CustomDeviceAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all devices
   */
  async fetchDevices() {
    const response = await fetch(`${this.baseUrl}/api/devices`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Save rack configuration
   */
  async saveRackConfig(rackId, config) {
    const response = await fetch(`${this.baseUrl}/api/racks/${rackId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Load rack configuration
   */
  async loadRackConfig(rackId) {
    const response = await fetch(`${this.baseUrl}/api/racks/${rackId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get all rack configurations
   */
  async listRacks() {
    const response = await fetch(`${this.baseUrl}/api/racks`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }
}

// Usage Example in Vue Component
/*
<script setup>
import { ref, onMounted } from 'vue';
import { NetBoxDeviceAPI } from './api/deviceAPI';

const deviceAPI = new NetBoxDeviceAPI(
  'https://netbox.example.com',
  'your-api-token-here'
);

const availableDevices = ref([]);
const loading = ref(false);
const error = ref(null);

onMounted(async () => {
  loading.value = true;
  try {
    availableDevices.value = await deviceAPI.fetchDeviceTypes();
  } catch (err) {
    error.value = err.message;
    console.error('Failed to load devices:', err);
  } finally {
    loading.value = false;
  }
});
</script>
*/

// Cache wrapper for API calls
export class CachedDeviceAPI {
  constructor(api, cacheDuration = 300000) { // 5 minutes default
    this.api = api;
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  async fetchDevices() {
    const cacheKey = 'all_devices';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const data = await this.api.fetchDevices();
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  clearCache() {
    this.cache.clear();
  }
}

// Offline support with IndexedDB
export class OfflineDeviceStorage {
  constructor(dbName = 'RackDesigner', version = 1) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores
        if (!db.objectStoreNames.contains('devices')) {
          db.createObjectStore('devices', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('racks')) {
          db.createObjectStore('racks', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveDevices(devices) {
    const transaction = this.db.transaction(['devices'], 'readwrite');
    const store = transaction.objectStore('devices');

    for (const device of devices) {
      store.put(device);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getDevices() {
    const transaction = this.db.transaction(['devices'], 'readonly');
    const store = transaction.objectStore('devices');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveRack(rack) {
    const transaction = this.db.transaction(['racks'], 'readwrite');
    const store = transaction.objectStore('racks');
    const request = store.put(rack);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getRacks() {
    const transaction = this.db.transaction(['racks'], 'readonly');
    const store = transaction.objectStore('racks');
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}
