<template>
  <div id="app">
    <RackDesigner
      :initial-rack-height="24"
      :initial-rack-name="'Home Lab Rack'"
      @rack-updated="handleRackUpdate"
      @device-added="handleDeviceAdded"
      @device-removed="handleDeviceRemoved"
      @device-moved="handleDeviceMoved"
    />
  </div>
</template>

<script setup>
import RackDesigner from './RackDesigner.vue';

// Example event handlers demonstrating the new props and events
function handleRackUpdate(data) {
  console.log('Rack updated:', data);
}

function handleDeviceAdded(data) {
  console.log('Device added:', data.device.name, 'at position', data.device.position);
}

function handleDeviceRemoved(data) {
  console.log('Device removed:', data.device.name);
}

function handleDeviceMoved(data) {
  console.log('Device moved:', data.device.name, 'from', data.oldPosition, 'to', data.newPosition);
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
}
</style>
