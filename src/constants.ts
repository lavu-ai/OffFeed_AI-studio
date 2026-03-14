import { Story, Topic, UserProfile } from './types';

export const TOPICS: Topic[] = [
  'Indian Politics',
  'Economy & Markets',
  'International Affairs',
  'Law & Constitution',
  'Environment',
  'Science & Technology',
  'Defence & Security',
  'Social Policy',
  'State Politics',
  'Business & Corporate'
];

export const SEED_STORIES: Story[] = [
  {
    id: '1',
    type: 'brief',
    topic: 'Indian Politics',
    headline: 'New Economic Policy Reforms Announced for 2024',
    summary: 'The government has unveiled a comprehensive roadmap targeting manufacturing incentives and labor law simplifications to boost GDP growth.',
    source: 'The Hindu',
    author: 'Aditi Rao',
    timestamp: '2h ago',
    sources: [
      { name: 'Reuters', url: '#' },
      { name: 'PIB', url: '#' },
      { name: 'Economic Times', url: '#' }
    ],
    perspectives: {
      panelA: {
        label: 'Government Position',
        content: 'Officials maintain that these reforms are essential for "future-proofing" the economy. The Ministry of Finance stated that the emphasis on digital growth will bridge the urban-rural divide.',
        source: 'PIB India'
      },
      panelB: {
        label: 'Opposition View',
        content: 'Critics argue the reforms lack immediate relief for the agrarian sector and might lead to temporary inflationary pressure due to GST adjustments.',
        source: 'National Herald'
      }
    },
    localImpacts: [
      { category: 'City', label: 'Mumbai', content: 'Expected surge in manufacturing hub investments near the outskirts.' },
      { category: 'Profession', label: 'SME Owners', content: 'Simplified labor laws could reduce compliance costs by up to 15%.' }
    ]
  },
  {
    id: '2',
    type: 'clip',
    topic: 'Economy & Markets',
    headline: 'Global Trade Summit: Key Takeaways on Maritime Routes',
    summary: 'Leaders at the Global Trade Summit discussed new maritime corridors to bypass traditional bottlenecks in the Red Sea.',
    thumbnail: 'https://picsum.photos/seed/trade/800/450',
    source: 'Economic Times',
    author: 'Vikram Singh',
    timestamp: '3h ago',
    sources: [
      { name: 'Bloomberg', url: '#' },
      { name: 'WSJ', url: '#' }
    ],
    perspectives: {
      panelA: {
        label: 'Industry View',
        content: 'Shipping giants welcome the diversification of routes, noting it reduces insurance premiums and transit times for global freight.',
        source: 'Maersk Insights'
      },
      panelB: {
        label: 'Environmental View',
        content: 'Conservationists warn that new corridors could disturb sensitive marine ecosystems and increase carbon emissions from longer alternative paths.',
        source: 'Ocean Watch'
      }
    },
    creatorId: 'c2'
  },
  {
    id: '3',
    type: 'brief',
    topic: 'International Affairs',
    headline: 'New Peace Accord Drafted for Middle East Security',
    summary: 'Five nations have co-signed a preliminary framework focused on regional stability and non-proliferation of weapons.',
    source: 'Reuters',
    author: 'Sarah Jenkins',
    timestamp: '5h ago',
    sources: [
      { name: 'Al Jazeera', url: '#' },
      { name: 'BBC', url: '#' }
    ],
    perspectives: {
      panelA: {
        label: 'Diplomatic View',
        content: 'The accord represents a breakthrough in multi-lateral cooperation, focusing on economic integration as a deterrent to conflict.',
        source: 'UN News'
      },
      panelB: {
        label: 'Security Analyst View',
        content: 'Skeptics point out the lack of enforcement mechanisms and the exclusion of key regional non-state actors as major weaknesses.',
        source: 'Stratfor'
      }
    }
  },
  {
    id: '4',
    type: 'clip',
    topic: 'Environment',
    headline: 'The Hidden Impact of Carbon Offsets on Biodiversity',
    summary: 'A new study suggests that monoculture tree plantations used for carbon offsets are failing to support local wildlife populations.',
    thumbnail: 'https://picsum.photos/seed/forest/800/450',
    source: 'National Geographic',
    author: 'Elena Gilbert',
    timestamp: '8h ago',
    sources: [
      { name: 'Nature', url: '#' },
      { name: 'Science Daily', url: '#' }
    ],
    perspectives: {
      panelA: {
        label: 'Corporate View',
        content: 'Companies argue that large-scale planting is the most efficient way to achieve net-zero targets quickly while funding land restoration.',
        source: 'Carbon Trust'
      },
      panelB: {
        label: 'Ecologist View',
        content: 'Experts advocate for "rewilding" and protecting existing old-growth forests, which store more carbon and support complex food webs.',
        source: 'WWF'
      }
    }
  },
  {
    id: '5',
    type: 'brief',
    topic: 'Law & Constitution',
    headline: 'Supreme Court Re-evaluates Privacy Rights in Digital Age',
    summary: 'A seven-judge bench is reviewing the limits of state surveillance and individual data sovereignty in the context of new AI tools.',
    source: 'Bar and Bench',
    author: 'Karan Mehra',
    timestamp: '12h ago',
    sources: [
      { name: 'LiveLaw', url: '#' },
      { name: 'The Wire', url: '#' }
    ],
    perspectives: {
      panelA: {
        label: 'State Position',
        content: 'The government argues that limited surveillance is necessary for national security and preventing cyber-terrorism in an encrypted world.',
        source: 'Ministry of Home Affairs'
      },
      panelB: {
        label: 'Civil Rights View',
        content: 'Privacy advocates maintain that any surveillance must be proportional, transparent, and subject to strict judicial oversight.',
        source: 'Internet Freedom Foundation'
      }
    }
  }
  // ... adding more to reach 15 total in a real scenario, but for now 5 solid ones
];

export const DEFAULT_USER: UserProfile = {
  username: 'Alex Thompson',
  useCase: 'IAS / UPSC Preparation',
  credibilityScore: 850,
  piecesPublished: 128,
  verificationHistory: 45,
  topics: ['Indian Politics', 'Economy & Markets', 'International Affairs'],
  sources: ['The Hindu', 'Reuters', 'PIB'],
  language: 'English',
  consumption: {
    mostRead: [
      { topic: 'International Affairs', percentage: 75 },
      { topic: 'Economy & Markets', percentage: 55 },
      { topic: 'Environment', percentage: 30 }
    ],
    formatSplit: { briefs: 65, clips: 35 },
    askOConversations: 24,
    factChecksRun: 12
  }
};
