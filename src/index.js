import RackDesigner from '../RackDesigner.vue';

// Export the component
export { RackDesigner };

// Export as default for convenience
export default RackDesigner;

// Install function for Vue.use()
export function install(app) {
  app.component('RackDesigner', RackDesigner);
}
