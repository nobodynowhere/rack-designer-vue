/**
 * Type definitions for Rack Designer Component
 */

export interface Device {
  /** Unique identifier for the device type */
  id: string;
  
  /** Display name of the device */
  name: string;
  
  /** Manufacturer name */
  manufacturer: string;
  
  /** Model number/name */
  model: string;
  
  /** Height in rack units (U) */
  uHeight: number;
  
  /** Optional image URL for device visualization */
  image?: string | null;
}

export interface InstalledDevice extends Device {
  /** Unique instance identifier for this installed device */
  instanceId: number | string;
  
  /** Position in rack (U number from bottom) */
  position: number;
  
  /** Custom label for this device instance */
  label: string;
}

export interface RackState {
  /** Name/identifier for the rack */
  name: string;
  
  /** Total height of the rack in U */
  height: number;
  
  /** Array of devices installed in the rack */
  devices: Array<{
    id: string;
    position: number;
    label: string;
  }>;
}

export interface RackDesignerProps {
  /** Initial height of the rack in U (default: 42) */
  initialRackHeight?: number;
  
  /** Initial name for the rack (default: 'Server Rack') */
  initialRackName?: string;
  
  /** Custom device library to use instead of default */
  deviceLibrary?: Device[];
  
  /** Load rack state from encoded string */
  initialState?: string;
}

export interface RackDesignerEmits {
  /** Emitted when rack state changes */
  'rack-updated': [state: RackState];
  
  /** Emitted when a device is added */
  'device-added': [device: InstalledDevice];
  
  /** Emitted when a device is removed */
  'device-removed': [device: InstalledDevice];
  
  /** Emitted when a device is moved */
  'device-moved': [device: InstalledDevice, oldPosition: number, newPosition: number];
  
  /** Emitted when export is triggered */
  'export': [format: 'png' | 'pdf' | 'svg', data: string];
}

export interface DragEvent extends Event {
  dataTransfer: DataTransfer;
}

export interface DropEventHandler {
  (event: DragEvent, uPosition: number): void;
}
