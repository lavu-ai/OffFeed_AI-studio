export type Topic = 
  | "Indian Politics"
  | "Economy & Markets"
  | "International Affairs"
  | "Law & Constitution"
  | "Environment"
  | "Science & Technology"
  | "Defence & Security"
  | "Social Policy"
  | "State Politics"
  | "Business & Corporate";

export type UseCase = 
  | "General Citizen"
  | "IAS / UPSC Preparation"
  | "Legal & Policy Professional"
  | "Finance & Business";

export interface Source {
  name: string;
  url: string;
}

export interface Perspective {
  label: string;
  content: string;
  source: string;
}

export interface LocalImpact {
  category: string;
  label: string;
  content: string;
}

export interface Story {
  id: string;
  type: 'clip' | 'brief';
  topic: Topic;
  headline: string;
  summary: string;
  source: string;
  author: string;
  timestamp: string;
  thumbnail?: string;
  videoUrl?: string;
  perspectives: {
    panelA: Perspective;
    panelB: Perspective;
  };
  sources: Source[];
  localImpacts?: LocalImpact[];
  creatorId?: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  background: string;
  parameters: {
    id: string;
    label: string;
    type: 'slider' | 'toggle' | 'select';
    options?: string[];
    min?: number;
    max?: number;
    defaultValue: any;
  }[];
}

export interface SimulationOutcome {
  id: string;
  title: string;
  content: string;
  confidence: 'High' | 'Medium' | 'Speculative';
}

export interface Message {
  id: string;
  sender: 'user' | 'askSochX';
  text: string;
  timestamp: string;
  sources?: string[];
}

export interface BriefMeRequest {
  id?: string;
  topic?: Topic;
  status: 'idle' | 'pending' | 'generating' | 'ready' | 'completed';
  timestamp?: string;
  prompt: string;
  format: 'text' | 'audio';
  content?: string;
}

export interface VideoGenerationRequest {
  id: string;
  prompt: string;
  status: 'idle' | 'pending' | 'polling' | 'completed' | 'failed';
  progressMessage?: string;
  videoUrl?: string;
  aspectRatio: '16:9' | '9:16';
  resolution: '720p' | '1080p';
  error?: string;
}

export interface UserProfile {
  username: string;
  useCase: UseCase;
  topics: Topic[];
  sources: string[];
  credibilityScore: number;
  piecesPublished: number;
  verificationHistory: number;
  language?: string;
  consumption: {
    mostRead: { topic: Topic; percentage: number }[];
    clipsVsBriefs?: { clips: number; briefs: number };
    formatSplit?: { clips: number; briefs: number };
    askSochXConversations: number;
    factChecksRun: number;
    readingStreak?: number;
    diversityScore?: number;
  };
}
