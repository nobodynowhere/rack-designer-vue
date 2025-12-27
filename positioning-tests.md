# Rack Device Positioning Test Cases

## Test Setup
- Rack height: 42U
- Position convention: Position = bottom-most U of device
- Device at position 3 with 10U height occupies U3 (bottom) through U12 (top)

## Current Test Scenario
- Device: Dell PowerEdge M1000e (10U)
- Current position: 3 (occupies U3-U12)
- Blocking device: HP ProLiant at U22-U23 (2U)

## Test Cases for `canPlaceDeviceForReposition(position, device)`

### Test 1: Move to position 1 (DOWN from current position 3)
**Input:**
- position: 1
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- installedDevices: [{ position: 3, uHeight: 10, instanceId: 'device-1' }]

**Expected calculation:**
- New range: U1-U10 (position 1 + 10U - 1 = U1 to U10)
- Current range: U3-U12
- Overlap: U3-U10 (same device, should be ignored)
- New space needed: U1-U2 (must be empty)

**Expected result:** TRUE (should be allowed)

### Test 2: Move to position 2 (DOWN from current position 3)
**Input:**
- position: 2
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- installedDevices: [{ position: 3, uHeight: 10, instanceId: 'device-1' }]

**Expected calculation:**
- New range: U2-U11
- Current range: U3-U12
- Overlap: U3-U11 (same device)
- New space needed: U2 (must be empty)

**Expected result:** TRUE (should be allowed)

### Test 3: Move to position 3 (same position)
**Input:**
- position: 3
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- installedDevices: [{ position: 3, uHeight: 10, instanceId: 'device-1' }]

**Expected calculation:**
- New range: U3-U12
- Current range: U3-U12
- Overlap: U3-U12 (same device, all overlap)
- New space needed: none

**Expected result:** TRUE (should be allowed)

### Test 4: Move to position 13 (UP, blocked by HP at U22)
**Input:**
- position: 13
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- installedDevices: [
  { position: 3, uHeight: 10, instanceId: 'device-1' },
  { position: 22, uHeight: 2, instanceId: 'device-2' }
]

**Expected calculation:**
- New range: U13-U22
- Current range: U3-U12
- Overlap: none
- Conflict: U22 is occupied by different device (HP ProLiant)

**Expected result:** FALSE (blocked by HP at U22)

### Test 5: Move to position 12 (UP from current position 3)
**Input:**
- position: 12
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- installedDevices: [
  { position: 3, uHeight: 10, instanceId: 'device-1' },
  { position: 22, uHeight: 2, instanceId: 'device-2' }
]

**Expected calculation:**
- New range: U12-U21
- Current range: U3-U12
- Overlap: U12 (same device)
- New space needed: U13-U21 (must be empty)

**Expected result:** TRUE (should be allowed, U22-U23 don't conflict)

### Test 6: Out of bounds - position 0
**Input:**
- position: 0
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }

**Expected result:** FALSE (position < 1)

### Test 7: Out of bounds - position 33 (would extend to U42)
**Input:**
- position: 33
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- rackHeight: 42

**Expected calculation:**
- New range: U33-U42 (33 + 10 - 1 = 42)

**Expected result:** TRUE (just fits at top of rack)

### Test 8: Out of bounds - position 34
**Input:**
- position: 34
- device: { position: 3, uHeight: 10, instanceId: 'device-1' }
- rackHeight: 42

**Expected calculation:**
- New range: U34-U43 (extends beyond rack)

**Expected result:** FALSE (extends beyond rack height)

## Current Function Implementation

```javascript
function canPlaceDeviceForReposition(position, device) {
  // Bounds check
  if (position < 1 || position + device.uHeight - 1 > rackHeight.value) {
    return false;
  }

  // Check for overlaps, but ignore the device being moved
  for (let u = position; u < position + device.uHeight; u++) {
    // Find any device that occupies this U position
    const deviceAtU = installedDevices.value.find(d => {
      const startU = d.position;
      const endU = d.position + d.uHeight - 1;
      return u >= startU && u <= endU;
    });

    // If found a different device, it's blocked
    if (deviceAtU && deviceAtU.instanceId !== device.instanceId) {
      return false;
    }
  }

  return true;
}
```

## Analysis

The function logic appears correct:
1. ✅ Bounds checking is correct
2. ✅ Loop iterates through all U positions the device would occupy
3. ✅ Finds any device occupying each U position
4. ✅ Ignores the device being moved (by instanceId comparison)

## Debugging Question

If the logic is correct, why can't the user move from U3 to U1?

**Possible issues:**
1. The drag/drop event handlers might not be firing for U1 and U2
2. Visual rendering might be blocking access to those rack units
3. The `canDropAtPosition` function might not be called during drag over U1/U2
4. Z-index or pointer-events might still be blocking those positions
