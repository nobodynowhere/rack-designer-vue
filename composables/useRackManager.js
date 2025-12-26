/**
 * Composable for managing rack state and device operations
 */
import { ref, computed } from 'vue';

export function useRackManager(initialHeight = 42) {
  const rackHeight = ref(initialHeight);
  const installedDevices = ref([]);
  const selectedDevice = ref(null);

  /**
   * Check if a specific U position is occupied
   */
  const isUnitOccupied = (u) => {
    return installedDevices.value.some(device => {
      const startU = device.position;
      const endU = device.position + device.uHeight - 1;
      return u >= startU && u <= endU;
    });
  };

  /**
   * Get the device at a specific U position (if any)
   */
  const getDeviceAtPosition = (u) => {
    return installedDevices.value.find(device => device.position === u);
  };

  /**
   * Check if a device can be placed at a specific position
   */
  const canPlaceDevice = (position, height, excludeDeviceId = null) => {
    // Check bounds
    if (position < 1 || position + height - 1 > rackHeight.value) {
      return false;
    }

    // Check for overlaps (excluding the device being moved)
    for (let u = position; u < position + height; u++) {
      const occupyingDevice = installedDevices.value.find(device => {
        if (excludeDeviceId && device.instanceId === excludeDeviceId) {
          return false; // Exclude the device being moved
        }
        const startU = device.position;
        const endU = device.position + device.uHeight - 1;
        return u >= startU && u <= endU;
      });

      if (occupyingDevice) {
        return false;
      }
    }

    return true;
  };

  /**
   * Add a device to the rack
   */
  const addDevice = (device, position, label = null) => {
    if (!canPlaceDevice(position, device.uHeight)) {
      throw new Error('Cannot place device at this position');
    }

    const installedDevice = {
      ...device,
      instanceId: Date.now() + Math.random(),
      position,
      label: label || device.name,
    };

    installedDevices.value.push(installedDevice);
    return installedDevice;
  };

  /**
   * Remove a device from the rack
   */
  const removeDevice = (deviceOrId) => {
    const id = typeof deviceOrId === 'object' 
      ? deviceOrId.instanceId 
      : deviceOrId;

    const index = installedDevices.value.findIndex(d => d.instanceId === id);
    
    if (index !== -1) {
      const removed = installedDevices.value.splice(index, 1)[0];
      
      if (selectedDevice.value?.instanceId === id) {
        selectedDevice.value = null;
      }
      
      return removed;
    }
    
    return null;
  };

  /**
   * Move a device to a new position
   */
  const moveDevice = (deviceOrId, newPosition) => {
    const id = typeof deviceOrId === 'object' 
      ? deviceOrId.instanceId 
      : deviceOrId;

    const device = installedDevices.value.find(d => d.instanceId === id);
    
    if (!device) {
      throw new Error('Device not found');
    }

    if (!canPlaceDevice(newPosition, device.uHeight, id)) {
      throw new Error('Cannot move device to this position');
    }

    device.position = newPosition;
    return device;
  };

  /**
   * Update device label
   */
  const updateDeviceLabel = (deviceOrId, newLabel) => {
    const id = typeof deviceOrId === 'object' 
      ? deviceOrId.instanceId 
      : deviceOrId;

    const device = installedDevices.value.find(d => d.instanceId === id);
    
    if (device) {
      device.label = newLabel;
      return device;
    }
    
    return null;
  };

  /**
   * Clear all devices from the rack
   */
  const clearAllDevices = () => {
    installedDevices.value = [];
    selectedDevice.value = null;
  };

  /**
   * Get rack utilization statistics
   */
  const rackStats = computed(() => {
    const totalU = rackHeight.value;
    const usedU = installedDevices.value.reduce((sum, device) => sum + device.uHeight, 0);
    const freeU = totalU - usedU;
    const utilization = (usedU / totalU) * 100;

    return {
      totalU,
      usedU,
      freeU,
      utilization: Math.round(utilization * 10) / 10,
      deviceCount: installedDevices.value.length,
    };
  });

  /**
   * Get available space blocks (consecutive free U positions)
   */
  const availableSpaces = computed(() => {
    const spaces = [];
    let currentStart = null;
    let currentSize = 0;

    for (let u = 1; u <= rackHeight.value; u++) {
      if (!isUnitOccupied(u)) {
        if (currentStart === null) {
          currentStart = u;
        }
        currentSize++;
      } else {
        if (currentStart !== null) {
          spaces.push({ start: currentStart, size: currentSize });
          currentStart = null;
          currentSize = 0;
        }
      }
    }

    // Add last space if rack ends with free units
    if (currentStart !== null) {
      spaces.push({ start: currentStart, size: currentSize });
    }

    return spaces;
  });

  /**
   * Find next available position for a device of given height
   */
  const findNextAvailablePosition = (deviceHeight) => {
    for (const space of availableSpaces.value) {
      if (space.size >= deviceHeight) {
        return space.start;
      }
    }
    return null;
  };

  /**
   * Export rack state
   */
  const exportState = () => {
    return {
      height: rackHeight.value,
      devices: installedDevices.value.map(d => ({
        id: d.id,
        position: d.position,
        label: d.label,
        name: d.name,
        manufacturer: d.manufacturer,
        model: d.model,
        uHeight: d.uHeight,
      })),
    };
  };

  /**
   * Import rack state
   */
  const importState = (state, deviceLibrary) => {
    if (!state || !state.devices) {
      throw new Error('Invalid state data');
    }

    rackHeight.value = state.height || 42;
    installedDevices.value = [];

    state.devices.forEach(deviceState => {
      // Try to find the device in the library
      const deviceTemplate = deviceLibrary.find(d => d.id === deviceState.id);
      
      if (deviceTemplate) {
        const device = {
          ...deviceTemplate,
          instanceId: Date.now() + Math.random(),
          position: deviceState.position,
          label: deviceState.label,
        };
        installedDevices.value.push(device);
      }
    });
  };

  return {
    // State
    rackHeight,
    installedDevices,
    selectedDevice,
    
    // Computed
    rackStats,
    availableSpaces,
    
    // Methods
    isUnitOccupied,
    getDeviceAtPosition,
    canPlaceDevice,
    addDevice,
    removeDevice,
    moveDevice,
    updateDeviceLabel,
    clearAllDevices,
    findNextAvailablePosition,
    exportState,
    importState,
  };
}
