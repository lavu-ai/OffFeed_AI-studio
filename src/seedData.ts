import { SimulationScenario } from './types';

export const SCENARIOS: SimulationScenario[] = [
  {
    id: 's1',
    title: 'The Great Himalayan Glacial Retreat',
    description: 'Simulate the impact of accelerated glacial melting on North Indian river systems and agriculture.',
    background: 'https://picsum.photos/seed/himalayas/1920/1080',
    parameters: [
      { id: 'temp', label: 'Global Temp Rise (°C)', type: 'slider', min: 1.5, max: 4.0, defaultValue: 2.0 },
      { id: 'policy', label: 'Water Management Policy', type: 'select', options: ['Status Quo', 'Aggressive Storage', 'River Interlinking'], defaultValue: 'Status Quo' },
      { id: 'tech', label: 'Drought-Resistant Crops', type: 'toggle', defaultValue: false }
    ]
  },
  {
    id: 's2',
    title: 'Digital Rupee: Full Adoption',
    description: 'What happens if the e-Rupee replaces physical cash for 90% of transactions?',
    background: 'https://picsum.photos/seed/digitalrupee/1920/1080',
    parameters: [
      { id: 'privacy', label: 'Privacy Level', type: 'select', options: ['Full Anonymity', 'Partial Tracking', 'Full Audit'], defaultValue: 'Partial Tracking' },
      { id: 'offline', label: 'Offline Capability', type: 'toggle', defaultValue: true },
      { id: 'interest', label: 'Interest on CBDC', type: 'slider', min: 0, max: 5, defaultValue: 0 }
    ]
  },
  {
    id: 's3',
    title: 'Semi-Conductor Superpower',
    description: 'Simulate India capturing 15% of the global semiconductor market by 2035.',
    background: 'https://picsum.photos/seed/chips/1920/1080',
    parameters: [
      { id: 'subsidy', label: 'Govt Subsidy Level (%)', type: 'slider', min: 10, max: 50, defaultValue: 25 },
      { id: 'talent', label: 'Reverse Brain Drain Rate', type: 'slider', min: 1, max: 10, defaultValue: 3 },
      { id: 'water', label: 'Industrial Water Access', type: 'select', options: ['Restricted', 'Priority', 'Unlimited'], defaultValue: 'Priority' }
    ]
  }
];
