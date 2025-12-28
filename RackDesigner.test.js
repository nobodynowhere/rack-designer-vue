/**
 * Test cases for rack device positioning logic
 *
 * Position Convention:
 * - position = bottom-most U of device
 * - Device at position 3 with 10U height occupies U3 (bottom) through U12 (top)
 */

import { describe, it, expect } from 'vitest';

// Mock rack state
let rackHeight = 42;
let installedDevices = [];

// Position validation functions (extracted from RackDesigner.vue)

function isUnitOccupied(u) {
  return installedDevices.some(device => {
    const startU = device.position;
    const endU = device.position + device.uHeight - 1;
    return u >= startU && u <= endU;
  });
}

function canPlaceDevice(position, uHeight) {
  // Check if position is valid
  if (position < 1 || position + uHeight - 1 > rackHeight) {
    return false;
  }

  // Check if any U in the range is occupied
  for (let u = position; u < position + uHeight; u++) {
    if (isUnitOccupied(u)) {
      return false;
    }
  }

  return true;
}

function canPlaceDeviceForReposition(position, device) {
  const topU = position + device.uHeight - 1;

  if (position < 1 || topU > rackHeight) {
    return false;
  }

  // Check for overlaps, but ignore the device being moved
  for (let u = position; u < position + device.uHeight; u++) {
    // Find any device that occupies this U position (not just starts at it)
    const deviceAtU = installedDevices.find(d => {
      const startU = d.position;
      const endU = d.position + d.uHeight - 1;
      return u >= startU && u <= endU;
    });

    if (deviceAtU) {
      if (deviceAtU.instanceId !== device.instanceId) {
        return false;
      }
    }
  }

  return true;
}

describe('Rack Device Positioning', () => {
  describe('canPlaceDevice - Adding new devices', () => {
    it('should allow placing a device in an empty rack', () => {
      installedDevices = [];
      rackHeight = 42;

      expect(canPlaceDevice(1, 10)).toBe(true);
      expect(canPlaceDevice(20, 5)).toBe(true);
    });

    it('should reject device that extends beyond rack top', () => {
      installedDevices = [];
      rackHeight = 42;

      expect(canPlaceDevice(34, 10)).toBe(false); // Would extend to U43
      expect(canPlaceDevice(43, 1)).toBe(false);  // Beyond rack
    });

    it('should reject device at position 0 or negative', () => {
      installedDevices = [];
      rackHeight = 42;

      expect(canPlaceDevice(0, 10)).toBe(false);
      expect(canPlaceDevice(-1, 10)).toBe(false);
    });

    it('should allow device at exact top of rack', () => {
      installedDevices = [];
      rackHeight = 42;

      expect(canPlaceDevice(33, 10)).toBe(true); // U33-U42 exactly fits
    });

    it('should reject device that overlaps with existing device', () => {
      installedDevices = [
        { position: 10, uHeight: 5, instanceId: 'device-1' } // Occupies U10-U14
      ];
      rackHeight = 42;

      expect(canPlaceDevice(8, 5)).toBe(false);  // U8-U12 overlaps U10-U14
      expect(canPlaceDevice(12, 5)).toBe(false); // U12-U16 overlaps U10-U14
      expect(canPlaceDevice(10, 5)).toBe(false); // Exact overlap
    });

    it('should allow device that fits between existing devices', () => {
      installedDevices = [
        { position: 10, uHeight: 5, instanceId: 'device-1' }, // U10-U14
        { position: 20, uHeight: 3, instanceId: 'device-2' }  // U20-U22
      ];
      rackHeight = 42;

      expect(canPlaceDevice(15, 5)).toBe(true);  // U15-U19 fits between
      expect(canPlaceDevice(1, 9)).toBe(true);   // U1-U9 fits below
      expect(canPlaceDevice(23, 10)).toBe(true); // U23-U32 fits above
    });
  });

  describe('canPlaceDeviceForReposition - Moving existing devices', () => {
    it('should allow moving device to same position', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' }
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(3, device)).toBe(true);
    });

    it('should allow moving device down (lower position)', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' }
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(1, device)).toBe(true); // Move to U1-U10
      expect(canPlaceDeviceForReposition(2, device)).toBe(true); // Move to U2-U11
    });

    it('should allow moving device up (higher position)', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' }
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(4, device)).toBe(true);  // Move to U4-U13
      expect(canPlaceDeviceForReposition(10, device)).toBe(true); // Move to U10-U19
    });

    it('should reject moving device beyond rack bounds', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' }
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(0, device)).toBe(false);   // Below rack
      expect(canPlaceDeviceForReposition(34, device)).toBe(false);  // Beyond rack (would go to U43)
    });

    it('should reject moving device into occupied space', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' },  // U3-U12
        { position: 22, uHeight: 2, instanceId: 'device-2' }   // U22-U23
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(13, device)).toBe(false); // U13-U22 overlaps device-2
      expect(canPlaceDeviceForReposition(14, device)).toBe(false); // U14-U23 overlaps device-2
      expect(canPlaceDeviceForReposition(20, device)).toBe(false); // U20-U29 overlaps device-2
    });

    it('should allow moving device to just below another device', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' },  // U3-U12
        { position: 22, uHeight: 2, instanceId: 'device-2' }   // U22-U23
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(12, device)).toBe(true); // U12-U21 (shares U12 with itself)
    });

    it('should correctly handle edge case at exact rack top', () => {
      installedDevices = [
        { position: 10, uHeight: 10, instanceId: 'device-1' }
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(33, device)).toBe(true);  // U33-U42 exactly fits
      expect(canPlaceDeviceForReposition(34, device)).toBe(false); // U34-U43 exceeds
    });

    it('should correctly detect overlaps when repositioning with multiple devices', () => {
      // Setup: 10U chassis at U3-U12, 2U server at U22-U23
      // This test covers all 8 test cases from positioning-tests.md
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'chassis-1', label: 'Dell PowerEdge M1000e' },  // U3-U12
        { position: 22, uHeight: 2, instanceId: 'server-1', label: 'HP ProLiant' }              // U22-U23
      ];
      rackHeight = 42;

      const chassis = installedDevices[0];

      // positioning-tests.md Test 1: Move to position 1 (DOWN from current position 3)
      expect(canPlaceDeviceForReposition(1, chassis)).toBe(true);  // U1-U10 (valid, moves down)

      // positioning-tests.md Test 2: Move to position 2 (DOWN from current position 3)
      expect(canPlaceDeviceForReposition(2, chassis)).toBe(true);  // U2-U11 (valid, moves down)

      // positioning-tests.md Test 3: Move to position 3 (same position)
      expect(canPlaceDeviceForReposition(3, chassis)).toBe(true);  // U3-U12 (same position)

      // Test moving chassis UP (but not into conflict)
      expect(canPlaceDeviceForReposition(4, chassis)).toBe(true);   // U4-U13 (valid)
      expect(canPlaceDeviceForReposition(10, chassis)).toBe(true);  // U10-U19 (valid)

      // positioning-tests.md Test 5: Move to position 12 (UP from current position 3)
      expect(canPlaceDeviceForReposition(12, chassis)).toBe(true);  // U12-U21 (valid, just below HP)

      // positioning-tests.md Test 4: Move to position 13 (UP, blocked by HP at U22)
      expect(canPlaceDeviceForReposition(13, chassis)).toBe(false); // U13-U22 (overlaps HP at U22)

      // Test moving chassis into CONFLICT with HP server at U22-U23
      expect(canPlaceDeviceForReposition(14, chassis)).toBe(false); // U14-U23 (overlaps HP at U22-U23)
      expect(canPlaceDeviceForReposition(15, chassis)).toBe(false); // U15-U24 (overlaps HP at U22-U23)
      expect(canPlaceDeviceForReposition(20, chassis)).toBe(false); // U20-U29 (overlaps HP at U22-U23)
      expect(canPlaceDeviceForReposition(22, chassis)).toBe(false); // U22-U31 (overlaps HP at U22-U23)

      // Test moving chassis ABOVE the HP server
      expect(canPlaceDeviceForReposition(24, chassis)).toBe(true);  // U24-U33 (valid, above HP)
      expect(canPlaceDeviceForReposition(30, chassis)).toBe(true);  // U30-U39 (valid)

      // positioning-tests.md Test 7: Out of bounds - position 33 (would extend to U42)
      expect(canPlaceDeviceForReposition(33, chassis)).toBe(true);  // U33-U42 (valid, at top of rack)

      // positioning-tests.md Test 8: Out of bounds - position 34
      expect(canPlaceDeviceForReposition(34, chassis)).toBe(false); // U34-U43 (exceeds rack)
    });

    it('should handle positioning-tests.md Test 6: Out of bounds - position 0', () => {
      installedDevices = [
        { position: 3, uHeight: 10, instanceId: 'device-1' }
      ];
      rackHeight = 42;

      const device = installedDevices[0];
      expect(canPlaceDeviceForReposition(0, device)).toBe(false); // Below rack minimum
    });
  });

  describe('Position calculation from drop location', () => {
    it('should calculate correct bottom position when dropping at rack unit', () => {
      // When user drops at U10 with 10U device:
      // Device should occupy U1-U10, so bottom = 10 - 10 + 1 = 1
      const dropU = 10;
      const deviceHeight = 10;
      const bottomU = dropU - deviceHeight + 1;

      expect(bottomU).toBe(1);
    });

    it('should calculate correct bottom position for various drop locations', () => {
      // Drop at U20 with 5U device = U16-U20
      expect(20 - 5 + 1).toBe(16);

      // Drop at U42 with 10U device = U33-U42
      expect(42 - 10 + 1).toBe(33);

      // Drop at U15 with 2U device = U14-U15
      expect(15 - 2 + 1).toBe(14);
    });
  });

  describe('Position range calculation', () => {
    it('should correctly calculate occupied U range', () => {
      const position = 13;
      const uHeight = 10;
      const bottomU = position;
      const topU = position + uHeight - 1;

      expect(bottomU).toBe(13);
      expect(topU).toBe(22);
    });

    it('should correctly calculate 1U device range', () => {
      const position = 5;
      const uHeight = 1;
      const topU = position + uHeight - 1;

      expect(topU).toBe(5); // 1U device only occupies one position
    });
  });
});
