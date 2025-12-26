/**
 * Sample device library data
 * In production, this would come from NetBox API or similar
 */

export const sampleDevices = [
  // Servers
  {
    id: 'dell-r740',
    name: 'Dell PowerEdge R740',
    manufacturer: 'Dell',
    model: 'R740',
    uHeight: 2,
    category: 'Server',
    image: null,
  },
  {
    id: 'dell-r640',
    name: 'Dell PowerEdge R640',
    manufacturer: 'Dell',
    model: 'R640',
    uHeight: 1,
    category: 'Server',
    image: null,
  },
  {
    id: 'dell-r740xd',
    name: 'Dell PowerEdge R740xd',
    manufacturer: 'Dell',
    model: 'R740xd',
    uHeight: 2,
    category: 'Server',
    image: null,
  },
  {
    id: 'hp-dl380-gen10',
    name: 'HP ProLiant DL380 Gen10',
    manufacturer: 'HP',
    model: 'DL380 Gen10',
    uHeight: 2,
    category: 'Server',
    image: null,
  },
  {
    id: 'hp-dl360-gen10',
    name: 'HP ProLiant DL360 Gen10',
    manufacturer: 'HP',
    model: 'DL360 Gen10',
    uHeight: 1,
    category: 'Server',
    image: null,
  },
  {
    id: 'supermicro-6028r',
    name: 'Supermicro SuperServer',
    manufacturer: 'Supermicro',
    model: '6028R-TRT',
    uHeight: 2,
    category: 'Server',
    image: null,
  },
  
  // Network Switches
  {
    id: 'cisco-c9300-48p',
    name: 'Cisco Catalyst 9300',
    manufacturer: 'Cisco',
    model: 'C9300-48P',
    uHeight: 1,
    category: 'Network',
    image: null,
  },
  {
    id: 'cisco-c9500-48y4c',
    name: 'Cisco Catalyst 9500',
    manufacturer: 'Cisco',
    model: 'C9500-48Y4C',
    uHeight: 1,
    category: 'Network',
    image: null,
  },
  {
    id: 'juniper-ex4300',
    name: 'Juniper EX4300',
    manufacturer: 'Juniper',
    model: 'EX4300-48P',
    uHeight: 1,
    category: 'Network',
    image: null,
  },
  {
    id: 'arista-7050sx3',
    name: 'Arista 7050SX3',
    manufacturer: 'Arista',
    model: '7050SX3-48YC8',
    uHeight: 1,
    category: 'Network',
    image: null,
  },
  
  // Storage
  {
    id: 'synology-rs2421+',
    name: 'Synology RS2421+',
    manufacturer: 'Synology',
    model: 'RS2421+',
    uHeight: 2,
    category: 'Storage',
    image: null,
  },
  {
    id: 'qnap-ts-1685',
    name: 'QNAP TS-1685',
    manufacturer: 'QNAP',
    model: 'TS-1685',
    uHeight: 2,
    category: 'Storage',
    image: null,
  },
  {
    id: 'netapp-fas2720',
    name: 'NetApp FAS2720',
    manufacturer: 'NetApp',
    model: 'FAS2720',
    uHeight: 2,
    category: 'Storage',
    image: null,
  },
  
  // UPS/Power
  {
    id: 'apc-smt3000rm2u',
    name: 'APC Smart-UPS 3000',
    manufacturer: 'APC',
    model: 'SMT3000RM2U',
    uHeight: 2,
    category: 'Power',
    image: null,
  },
  {
    id: 'apc-srt5krmxlt',
    name: 'APC Smart-UPS SRT 5000',
    manufacturer: 'APC',
    model: 'SRT5KRMXLT',
    uHeight: 3,
    category: 'Power',
    image: null,
  },
  {
    id: 'eaton-9px3000rt',
    name: 'Eaton 9PX 3000',
    manufacturer: 'Eaton',
    model: '9PX3000RT',
    uHeight: 2,
    category: 'Power',
    image: null,
  },
  
  // Firewalls/Security
  {
    id: 'palo-alto-pa-3220',
    name: 'Palo Alto PA-3220',
    manufacturer: 'Palo Alto',
    model: 'PA-3220',
    uHeight: 1,
    category: 'Security',
    image: null,
  },
  {
    id: 'fortinet-fg-600e',
    name: 'Fortinet FortiGate 600E',
    manufacturer: 'Fortinet',
    model: 'FG-600E',
    uHeight: 1,
    category: 'Security',
    image: null,
  },
  
  // Patch Panels
  {
    id: 'patch-panel-48',
    name: '48-Port Patch Panel',
    manufacturer: 'Generic',
    model: '48PORT-CAT6',
    uHeight: 1,
    category: 'Patch Panel',
    image: null,
  },
  {
    id: 'patch-panel-24',
    name: '24-Port Patch Panel',
    manufacturer: 'Generic',
    model: '24PORT-CAT6',
    uHeight: 1,
    category: 'Patch Panel',
    image: null,
  },
  
  // Console/KVM
  {
    id: 'kvm-8port',
    name: '8-Port KVM Switch',
    manufacturer: 'Generic',
    model: 'KVM-8PORT',
    uHeight: 1,
    category: 'KVM',
    image: null,
  },
  {
    id: 'startech-rackconsole',
    name: 'StarTech Rack Console',
    manufacturer: 'StarTech',
    model: 'RKCOND17HD',
    uHeight: 1,
    category: 'Console',
    image: null,
  },
  
  // Ubiquiti
  {
    id: 'udm-pro',
    name: 'UniFi Dream Machine Pro',
    manufacturer: 'Ubiquiti',
    model: 'UDM-Pro',
    uHeight: 1,
    category: 'Network',
    image: null,
  },
  {
    id: 'usw-pro-48-poe',
    name: 'UniFi Switch Pro 48 PoE',
    manufacturer: 'Ubiquiti',
    model: 'USW-Pro-48-POE',
    uHeight: 1,
    category: 'Network',
    image: null,
  },
  
  // Blanks
  {
    id: 'blank-1u',
    name: '1U Blank Panel',
    manufacturer: 'Generic',
    model: '1U-BLANK',
    uHeight: 1,
    category: 'Blank',
    image: null,
  },
  {
    id: 'blank-2u',
    name: '2U Blank Panel',
    manufacturer: 'Generic',
    model: '2U-BLANK',
    uHeight: 2,
    category: 'Blank',
    image: null,
  },
];

/**
 * Get devices by category
 */
export function getDevicesByCategory(category) {
  return sampleDevices.filter(device => device.category === category);
}

/**
 * Get all unique categories
 */
export function getCategories() {
  const categories = new Set(sampleDevices.map(d => d.category));
  return Array.from(categories).sort();
}

/**
 * Search devices
 */
export function searchDevices(query) {
  if (!query) return sampleDevices;
  
  const lowercaseQuery = query.toLowerCase();
  return sampleDevices.filter(device =>
    device.name.toLowerCase().includes(lowercaseQuery) ||
    device.manufacturer.toLowerCase().includes(lowercaseQuery) ||
    device.model.toLowerCase().includes(lowercaseQuery) ||
    device.category.toLowerCase().includes(lowercaseQuery)
  );
}
