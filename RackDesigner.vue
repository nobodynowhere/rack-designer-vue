<template>
  <div class="rack-designer">
    <div class="toolbar mb-3">
      <Toolbar>
        <template #start>
          <h2 class="m-0">Rack Designer</h2>
        </template>
        <template #center>
          <div class="d-flex gap-2">
            <Button
              label="Add Device"
              icon="pi pi-plus"
              @click="showAddDeviceDialog = true"
              severity="success"
            />
            <Button
              label="Export PNG"
              icon="pi pi-download"
              @click="exportToPNG"
              severity="secondary"
            />
            <Button
              label="Export PDF"
              icon="pi pi-file-pdf"
              @click="exportToPDF"
              severity="secondary"
            />
            <Button
              label="Share"
              icon="pi pi-share-alt"
              @click="showShareDialog = true"
              severity="info"
            />
            <Button
              label="Clear"
              icon="pi pi-trash"
              @click="clearRack"
              severity="danger"
            />
          </div>
        </template>
        <template #end>
          <div class="d-flex align-items-center gap-2">
            <label for="rack-height">Rack Units:</label>
            <InputNumber
              id="rack-height"
              v-model="rackHeight"
              :min="10"
              :max="52"
              showButtons
              buttonLayout="horizontal"
              :step="1"
              style="width: 150px"
            >
              <template #incrementbuttonicon>
                <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                <span class="pi pi-minus" />
              </template>
            </InputNumber>
          </div>
        </template>
      </Toolbar>
    </div>

    <div class="rack-container">
      <div class="row">
        <!-- Device Library Sidebar -->
        <div class="col-md-3">
          <Card>
            <template #title>Device Library</template>
            <template #content>
              <div class="device-search mb-3">
                <InputText
                  v-model="deviceSearchQuery"
                  placeholder="Search devices..."
                  class="w-100"
                >
                  <template #left>
                    <i class="pi pi-search" />
                  </template>
                </InputText>
              </div>
              
              <ScrollPanel style="height: calc(100vh - 300px)">
                <div class="device-library">
                  <div
                    v-for="device in filteredDevices"
                    :key="device.id"
                    class="device-item"
                    draggable="true"
                    @dragstart="handleDragStart($event, device)"
                  >
                    <div class="device-preview">
                      <img
                        v-if="device.image"
                        :src="device.image"
                        :alt="device.name"
                        class="device-image"
                      />
                      <div v-else class="device-placeholder">
                        <i class="pi pi-server" style="font-size: 2rem" />
                      </div>
                    </div>
                    <div class="device-info">
                      <div class="device-name">{{ device.name }}</div>
                      <div class="device-meta">
                        <Tag :value="`${device.uHeight}U`" severity="info" />
                        <Tag :value="device.manufacturer" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollPanel>
            </template>
          </Card>
        </div>

        <!-- Rack Visualization -->
        <div class="col-md-9">
          <Card>
            <template #title>
              <div class="d-flex justify-content-between align-items-center">
                <span>{{ rackName }}</span>
                <Button
                  text
                  icon="pi pi-pencil"
                  @click="editRackName"
                  size="small"
                />
              </div>
            </template>
            <template #content>
              <div ref="rackElement" class="rack-view">
                <div class="rack-frame">
                  <div
                    v-for="u in rackHeight"
                    :key="`u-${u}`"
                    class="rack-unit"
                    :class="{
                      'occupied': isUnitOccupied(u),
                      'drop-target': isDragOver && canDropAtPosition(u)
                    }"
                    :data-u-position="u"
                    @dragover="handleDragOver($event, u)"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop($event, u)"
                  >
                    <div class="u-label">U{{ u }}</div>
                    <div class="u-content">
                      <template v-if="getDeviceAtPosition(u)">
                        <div
                          class="installed-device"
                          :style="getDeviceStyle(getDeviceAtPosition(u))"
                          @click="selectDevice(getDeviceAtPosition(u))"
                          :class="{ 'selected': selectedDevice?.instanceId === getDeviceAtPosition(u)?.instanceId }"
                        >
                          <img
                            v-if="getDeviceAtPosition(u).image"
                            :src="getDeviceAtPosition(u).image"
                            :alt="getDeviceAtPosition(u).name"
                            class="installed-device-image"
                          />
                          <div v-else class="installed-device-placeholder">
                            <i class="pi pi-server" />
                          </div>
                          <div class="installed-device-info">
                            <span class="device-label">{{ getDeviceAtPosition(u).label || getDeviceAtPosition(u).name }}</span>
                            <Button
                              icon="pi pi-times"
                              text
                              rounded
                              severity="danger"
                              size="small"
                              class="remove-btn"
                              @click.stop="removeDevice(getDeviceAtPosition(u))"
                            />
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Add Device Dialog -->
    <Dialog
      v-model:visible="showAddDeviceDialog"
      header="Add Device"
      :modal="true"
      :style="{ width: '50vw' }"
    >
      <div class="add-device-form">
        <div class="mb-3">
          <label for="device-select" class="form-label">Select Device</label>
          <Dropdown
            id="device-select"
            v-model="selectedDeviceToAdd"
            :options="availableDevices"
            optionLabel="name"
            placeholder="Choose a device"
            class="w-100"
            filter
          >
            <template #option="slotProps">
              <div class="d-flex align-items-center gap-2">
                <span>{{ slotProps.option.name }}</span>
                <Tag :value="`${slotProps.option.uHeight}U`" severity="info" />
              </div>
            </template>
          </Dropdown>
        </div>
        
        <div class="mb-3">
          <label for="device-label" class="form-label">Device Label</label>
          <InputText
            id="device-label"
            v-model="deviceLabel"
            placeholder="e.g., Mail Server"
            class="w-100"
          />
        </div>
        
        <div class="mb-3">
          <label for="u-position" class="form-label">U Position (from bottom)</label>
          <InputNumber
            id="u-position"
            v-model="deviceUPosition"
            :min="1"
            :max="rackHeight"
            showButtons
            class="w-100"
          />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancel" @click="showAddDeviceDialog = false" severity="secondary" />
        <Button label="Add" @click="addDeviceToRack" :disabled="!canAddDevice" />
      </template>
    </Dialog>

    <!-- Share Dialog -->
    <Dialog
      v-model:visible="showShareDialog"
      header="Share Rack Layout"
      :modal="true"
      :style="{ width: '50vw' }"
    >
      <div class="share-content">
        <div class="mb-3">
          <label class="form-label">Share URL</label>
          <div class="input-group">
            <InputText
              :modelValue="shareUrl"
              readonly
              class="w-100"
            />
            <Button
              icon="pi pi-copy"
              @click="copyShareUrl"
              label="Copy"
            />
          </div>
        </div>
        
        <div class="text-center">
          <canvas ref="qrCanvas" />
          <p class="text-muted mt-2">Scan QR code to open on mobile</p>
        </div>
      </div>
    </Dialog>

    <!-- Device Properties Panel -->
    <Sidebar v-model:visible="showDeviceProperties" position="right" :style="{ width: '400px' }">
      <template #header>
        <h3>Device Properties</h3>
      </template>
      
      <div v-if="selectedDevice" class="device-properties">
        <div class="mb-3">
          <label class="form-label">Device Label</label>
          <InputText
            v-model="selectedDevice.label"
            class="w-100"
            @input="updateRackState"
          />
        </div>
        
        <div class="mb-3">
          <label class="form-label">Position</label>
          <InputNumber
            v-model="selectedDevice.position"
            :min="1"
            :max="rackHeight"
            showButtons
            class="w-100"
            @input="moveDevice"
          />
        </div>
        
        <Divider />
        
        <div class="device-details">
          <h4>Device Information</h4>
          <p><strong>Name:</strong> {{ selectedDevice.name }}</p>
          <p><strong>Manufacturer:</strong> {{ selectedDevice.manufacturer }}</p>
          <p><strong>Height:</strong> {{ selectedDevice.uHeight }}U</p>
          <p><strong>Model:</strong> {{ selectedDevice.model }}</p>
        </div>
        
        <Divider />
        
        <Button
          label="Remove Device"
          icon="pi pi-trash"
          severity="danger"
          class="w-100"
          @click="removeDevice(selectedDevice)"
        />
      </div>
    </Sidebar>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';
import Sidebar from 'primevue/sidebar';
import ScrollPanel from 'primevue/scrollpanel';
import Tag from 'primevue/tag';
import Divider from 'primevue/divider';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Props
const props = defineProps({
  initialRackHeight: {
    type: Number,
    default: 42,
    validator: (value) => value >= 10 && value <= 52
  },
  initialRackName: {
    type: String,
    default: 'Server Rack'
  },
  deviceLibrary: {
    type: Array,
    default: null
  }
});

// Events
const emit = defineEmits(['rack-updated', 'device-added', 'device-removed', 'device-moved']);

// State
const rackHeight = ref(props.initialRackHeight);
const rackName = ref(props.initialRackName);
const installedDevices = ref([]);
const selectedDevice = ref(null);
const deviceSearchQuery = ref('');
const isDragOver = ref(false);
const draggedDevice = ref(null);
const dropTargetU = ref(null);

// Dialogs
const showAddDeviceDialog = ref(false);
const showShareDialog = ref(false);
const showDeviceProperties = ref(false);

// Add device form
const selectedDeviceToAdd = ref(null);
const deviceLabel = ref('');
const deviceUPosition = ref(1);

// Refs
const rackElement = ref(null);
const qrCanvas = ref(null);

// Sample device library (in a real app, this would come from NetBox or an API)
// Use props.deviceLibrary if provided, otherwise use default devices
const defaultDevices = [
  {
    id: '1',
    name: 'Dell PowerEdge R740',
    manufacturer: 'Dell',
    model: 'R740',
    uHeight: 2,
    image: null, // Would have actual image URL
  },
  {
    id: '2',
    name: 'HP ProLiant DL380 Gen10',
    manufacturer: 'HP',
    model: 'DL380 Gen10',
    uHeight: 2,
    image: null,
  },
  {
    id: '3',
    name: 'Cisco Catalyst 9300',
    manufacturer: 'Cisco',
    model: 'C9300-48P',
    uHeight: 1,
    image: null,
  },
  {
    id: '4',
    name: 'Synology RS2421+',
    manufacturer: 'Synology',
    model: 'RS2421+',
    uHeight: 2,
    image: null,
  },
  {
    id: '5',
    name: 'APC Smart-UPS 3000',
    manufacturer: 'APC',
    model: 'SMT3000RM2U',
    uHeight: 2,
    image: null,
  },
  {
    id: '6',
    name: 'Ubiquiti Dream Machine Pro',
    manufacturer: 'Ubiquiti',
    model: 'UDM-Pro',
    uHeight: 1,
    image: null,
  },
  {
    id: '7',
    name: 'Dell PowerEdge R640',
    manufacturer: 'Dell',
    model: 'R640',
    uHeight: 1,
    image: null,
  },
  {
    id: '8',
    name: 'Supermicro SuperServer',
    manufacturer: 'Supermicro',
    model: '6028R-TRT',
    uHeight: 2,
    image: null,
  },
];

const availableDevices = ref(props.deviceLibrary || defaultDevices);

// Computed
const filteredDevices = computed(() => {
  if (!deviceSearchQuery.value) return availableDevices.value;
  
  const query = deviceSearchQuery.value.toLowerCase();
  return availableDevices.value.filter(device =>
    device.name.toLowerCase().includes(query) ||
    device.manufacturer.toLowerCase().includes(query) ||
    device.model.toLowerCase().includes(query)
  );
});

const shareUrl = computed(() => {
  const state = encodeRackState();
  return `${window.location.origin}${window.location.pathname}?rack=${state}`;
});

const canAddDevice = computed(() => {
  return selectedDeviceToAdd.value && deviceUPosition.value && 
         canPlaceDevice(deviceUPosition.value, selectedDeviceToAdd.value.uHeight);
});

// Methods
function isUnitOccupied(u) {
  return installedDevices.value.some(device => {
    const startU = device.position;
    const endU = device.position + device.uHeight - 1;
    return u >= startU && u <= endU;
  });
}

function getDeviceAtPosition(u) {
  return installedDevices.value.find(device => device.position === u);
}

function canDropAtPosition(u) {
  if (!draggedDevice.value) return false;
  return canPlaceDevice(u, draggedDevice.value.uHeight);
}

function canPlaceDevice(position, height) {
  if (position < 1 || position + height - 1 > rackHeight.value) {
    return false;
  }
  
  // Check for overlaps
  for (let u = position; u < position + height; u++) {
    if (isUnitOccupied(u)) {
      return false;
    }
  }
  
  return true;
}

function handleDragStart(event, device) {
  draggedDevice.value = device;
  event.dataTransfer.effectAllowed = 'copy';
}

function handleDragOver(event, u) {
  event.preventDefault();
  isDragOver.value = true;
  dropTargetU.value = u;
  
  if (canDropAtPosition(u)) {
    event.dataTransfer.dropEffect = 'copy';
  } else {
    event.dataTransfer.dropEffect = 'none';
  }
}

function handleDragLeave() {
  isDragOver.value = false;
  dropTargetU.value = null;
}

function handleDrop(event, u) {
  event.preventDefault();
  isDragOver.value = false;

  if (draggedDevice.value && canDropAtPosition(u)) {
    const device = {
      ...draggedDevice.value,
      instanceId: Date.now() + Math.random(),
      position: u,
      label: draggedDevice.value.name,
    };

    installedDevices.value.push(device);
    emit('device-added', { device, devices: installedDevices.value });
    updateRackState();
  }

  draggedDevice.value = null;
  dropTargetU.value = null;
}

function getDeviceStyle(device) {
  if (!device) return {};
  
  return {
    height: `${device.uHeight * 100}%`,
  };
}

function selectDevice(device) {
  selectedDevice.value = device;
  showDeviceProperties.value = true;
}

function removeDevice(device) {
  const index = installedDevices.value.findIndex(d => d.instanceId === device.instanceId);
  if (index !== -1) {
    installedDevices.value.splice(index, 1);
    if (selectedDevice.value?.instanceId === device.instanceId) {
      selectedDevice.value = null;
      showDeviceProperties.value = false;
    }
    emit('device-removed', { device, devices: installedDevices.value });
    updateRackState();
  }
}

function moveDevice() {
  if (!selectedDevice.value) return;

  const device = selectedDevice.value;
  const oldPosition = device.position;
  const newPosition = device.position;

  // Remove from current position temporarily
  const index = installedDevices.value.findIndex(d => d.instanceId === device.instanceId);
  const tempDevice = installedDevices.value.splice(index, 1)[0];

  // Check if new position is valid
  if (canPlaceDevice(newPosition, device.uHeight)) {
    tempDevice.position = newPosition;
    installedDevices.value.push(tempDevice);
    emit('device-moved', { device: tempDevice, oldPosition, newPosition, devices: installedDevices.value });
    updateRackState();
  } else {
    // Restore to original position
    installedDevices.value.push(tempDevice);
    alert('Cannot move device to this position - space is occupied or out of bounds');
  }
}

function addDeviceToRack() {
  if (!canAddDevice.value) return;

  const device = {
    ...selectedDeviceToAdd.value,
    instanceId: Date.now() + Math.random(),
    position: deviceUPosition.value,
    label: deviceLabel.value || selectedDeviceToAdd.value.name,
  };

  installedDevices.value.push(device);
  emit('device-added', { device, devices: installedDevices.value });
  updateRackState();

  // Reset form
  showAddDeviceDialog.value = false;
  selectedDeviceToAdd.value = null;
  deviceLabel.value = '';
  deviceUPosition.value = 1;
}

function clearRack() {
  if (confirm('Are you sure you want to clear all devices from the rack?')) {
    installedDevices.value = [];
    selectedDevice.value = null;
    updateRackState();
  }
}

function editRackName() {
  const newName = prompt('Enter rack name:', rackName.value);
  if (newName) {
    rackName.value = newName;
    updateRackState();
  }
}

async function exportToPNG() {
  if (!rackElement.value) return;
  
  try {
    const canvas = await html2canvas(rackElement.value, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    
    const link = document.createElement('a');
    link.download = `${rackName.value.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    alert('Failed to export PNG');
  }
}

async function exportToPDF() {
  if (!rackElement.value) return;
  
  try {
    const canvas = await html2canvas(rackElement.value, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${rackName.value.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export PDF');
  }
}

async function generateQRCode() {
  if (!qrCanvas.value) return;
  
  try {
    await QRCode.toCanvas(qrCanvas.value, shareUrl.value, {
      width: 256,
      margin: 2,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

function copyShareUrl() {
  navigator.clipboard.writeText(shareUrl.value).then(() => {
    alert('Share URL copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function encodeRackState() {
  const state = {
    name: rackName.value,
    height: rackHeight.value,
    devices: installedDevices.value.map(d => ({
      id: d.id,
      position: d.position,
      label: d.label,
    })),
  };
  
  return btoa(JSON.stringify(state));
}

function decodeRackState(encoded) {
  try {
    const state = JSON.parse(atob(encoded));
    rackName.value = state.name || 'Server Rack';
    rackHeight.value = state.height || 42;
    
    // Restore devices
    installedDevices.value = state.devices.map(deviceState => {
      const deviceTemplate = availableDevices.value.find(d => d.id === deviceState.id);
      if (deviceTemplate) {
        return {
          ...deviceTemplate,
          instanceId: Date.now() + Math.random(),
          position: deviceState.position,
          label: deviceState.label,
        };
      }
      return null;
    }).filter(Boolean);
  } catch (error) {
    console.error('Failed to decode rack state:', error);
  }
}

function updateRackState() {
  // Emit rack-updated event with current state
  emit('rack-updated', {
    name: rackName.value,
    height: rackHeight.value,
    devices: installedDevices.value
  });

  // Update URL with current state
  const state = encodeRackState();
  const url = new URL(window.location.href);
  url.searchParams.set('rack', state);
  window.history.replaceState({}, '', url.toString());
}

// Lifecycle
onMounted(() => {
  // Load state from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const rackState = urlParams.get('rack');
  
  if (rackState) {
    decodeRackState(rackState);
  }
});

watch(showShareDialog, (visible) => {
  if (visible) {
    setTimeout(() => {
      generateQRCode();
    }, 100);
  }
});
</script>

<style scoped>
.rack-designer {
  padding: 20px;
  min-height: 100vh;
  background: #f8f9fa;
}

.rack-container {
  margin-top: 20px;
}

/* Device Library */
.device-library {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
}

.device-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  transform: translateY(-2px);
}

.device-item:active {
  cursor: grabbing;
}

.device-preview {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 4px;
}

.device-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.device-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device-name {
  font-weight: 600;
  font-size: 14px;
}

.device-meta {
  display: flex;
  gap: 6px;
}

/* Rack View */
.rack-view {
  background: #2c3e50;
  padding: 20px;
  border-radius: 8px;
}

.rack-frame {
  background: #34495e;
  border: 4px solid #2c3e50;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column-reverse;
}

.rack-unit {
  height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #546e7a;
  position: relative;
  transition: background-color 0.2s;
}

.rack-unit:last-child {
  border-bottom: none;
}

.rack-unit.drop-target {
  background-color: rgba(76, 175, 80, 0.2);
}

.u-label {
  width: 40px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #ecf0f1;
  flex-shrink: 0;
}

.u-content {
  flex: 1;
  height: 100%;
  position: relative;
}

.installed-device {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #5a67d8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.installed-device:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.installed-device.selected {
  border-color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.4);
}

.installed-device-image {
  height: 100%;
  object-fit: contain;
  margin-right: 12px;
}

.installed-device-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
}

.installed-device-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
}

.device-label {
  font-weight: 600;
  font-size: 14px;
}

.remove-btn {
  opacity: 0;
  transition: opacity 0.2s;
}

.installed-device:hover .remove-btn {
  opacity: 1;
}

/* Device Properties */
.device-properties {
  padding: 16px 0;
}

.device-details p {
  margin: 8px 0;
  color: #495057;
}

/* Share Dialog */
.share-content {
  padding: 16px 0;
}

.input-group {
  display: flex;
  gap: 8px;
}

canvas {
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
  }
  
  .rack-container .row {
    flex-direction: column;
  }
  
  .rack-container .col-md-3,
  .rack-container .col-md-9 {
    width: 100%;
    max-width: 100%;
  }
}
</style>
