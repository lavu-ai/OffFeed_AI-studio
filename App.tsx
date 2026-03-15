import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  ChevronRight, 
  Check, 
  Menu as MenuIcon, 
  MessageSquare, 
  Home, 
  Search, 
  ShieldCheck, 
  User,
  X,
  Play,
  Share2,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Send,
  Paperclip,
  Mic,
  MoreVertical,
  Settings,
  Bookmark,
  LogOut,
  Zap,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { Topic, UseCase, Story, UserProfile, Message, LocalImpact, BriefMeRequest, SimulationScenario } from './types';
import { TOPICS, SEED_STORIES, DEFAULT_USER } from './constants';
import { SCENARIOS } from './seedData';

// --- Components ---

const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <div className={`font-black tracking-tighter ${size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'}`}>
    <span className="text-soch-blue">Soch</span>
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = ''
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}) => {
  const baseStyles = "flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 px-6 py-4";
  const variants = {
    primary: "bg-soch-blue text-white shadow-lg shadow-soch-blue/20 disabled:bg-slate-300 disabled:shadow-none",
    secondary: "bg-navy-deep text-white",
    outline: "border-2 border-soch-blue text-soch-blue",
    ghost: "text-slate-500"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Onboarding ---

const Onboarding = ({ onComplete }: { onComplete: (profile: Partial<UserProfile>) => void }) => {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [useCase, setUseCase] = useState<UseCase | ''>('');

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onComplete({ topics: selectedTopics, useCase: useCase || 'General Citizen' });
  };

  const handleSkip = () => {
    onComplete({ topics: TOPICS.slice(0, 3), useCase: 'General Citizen' });
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-12">
        <Logo size="sm" />
        <button 
          onClick={handleSkip}
          className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-navy-deep transition-colors"
        >
          Skip to Feed
        </button>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <h1 className="text-4xl font-black mb-4 leading-tight">What matters to you?</h1>
            <p className="text-slate-500 mb-8 font-medium">Select topics to personalize your AI-verified feed.</p>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              {TOPICS.map(topic => (
                <div 
                  key={`topic-select-${topic}`}
                  onClick={() => {
                    if (selectedTopics.includes(topic)) {
                      setSelectedTopics(selectedTopics.filter(t => t !== topic));
                    } else {
                      setSelectedTopics([...selectedTopics, topic]);
                    }
                  }}
                  className={`p-4 rounded-[24px] border-2 transition-all cursor-pointer flex flex-col justify-between h-32 relative ${
                    selectedTopics.includes(topic) 
                      ? 'border-soch-blue bg-soch-blue/5' 
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${selectedTopics.includes(topic) ? 'bg-soch-blue text-white' : 'bg-white text-slate-300'}`}>
                    {selectedTopics.includes(topic) ? <Check size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <div className={`font-black text-sm leading-tight ${selectedTopics.includes(topic) ? 'text-soch-blue' : 'text-navy-deep'}`}>
                    {topic}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <h1 className="text-4xl font-black mb-4 leading-tight">Your perspective?</h1>
            <p className="text-slate-500 mb-8 font-medium">We'll tailor the depth and context of your news briefs.</p>
            
            <div className="space-y-3 mb-8">
              {[
                { title: 'General Citizen', desc: 'Unbiased, high-quality daily news.' },
                { title: 'IAS / UPSC Preparation', desc: 'Exam-ready policy and current affairs.' },
                { title: 'Legal & Policy Professional', desc: 'Deep dives into legislation and law.' },
                { title: 'Finance & Business', desc: 'Market-shaping economic updates.' }
              ].map(item => (
                <div 
                  key={`usecase-${item.title}`}
                  onClick={() => setUseCase(item.title as UseCase)}
                  className={`p-5 rounded-[24px] border-2 transition-all cursor-pointer flex items-center gap-4 ${
                    useCase === item.title 
                      ? 'border-soch-blue bg-soch-blue/5' 
                      : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${useCase === item.title ? 'border-soch-blue bg-soch-blue' : 'border-slate-200'}`}>
                    {useCase === item.title && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="font-black text-base">{item.title}</div>
                    <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="mt-auto pt-6">
        <Button 
          onClick={handleNext} 
          disabled={step === 1 && selectedTopics.length === 0}
          className="w-full py-6 text-lg"
        >
          {step === 2 ? 'Start Reading' : 'Continue'}
        </Button>
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2].map(i => (
            <div 
              key={`dot-${i}`} 
              className={`h-1.5 rounded-full transition-all ${step === i ? 'w-8 bg-soch-blue' : 'w-1.5 bg-slate-200'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Feed ---

const ClipCard = ({ 
  story, 
  onOpen, 
  onAskSochX, 
  isSaved, 
  onToggleSave 
}: { 
  story: Story; 
  onOpen: () => void; 
  onAskSochX: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
    <div className="relative aspect-video bg-slate-200" onClick={onOpen}>
      {story.thumbnail && <img src={story.thumbnail} alt={story.headline} className="w-full h-full object-cover" />}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/90 p-3 rounded-full shadow-lg">
          <Play fill="#0A1628" size={24} />
        </div>
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
        className={`absolute top-4 right-4 p-2 rounded-full shadow-md backdrop-blur-md transition-all ${isSaved ? 'bg-soch-blue text-white' : 'bg-white/80 text-navy-deep'}`}
      >
        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
      </button>
    </div>
    <div className="p-5">
      <div className="inline-block px-3 py-1 bg-soch-blue/10 text-soch-blue text-xs font-black rounded-full mb-3">
        {story.topic.toUpperCase()}
      </div>
      <h3 className="text-xl font-black leading-tight mb-2" onClick={onOpen}>{story.headline}</h3>
      <div className="flex items-center text-slate-400 text-xs font-bold mb-4">
        <span>{story.source}</span>
        <span className="mx-2">•</span>
        <span>{story.timestamp}</span>
      </div>
      <Button variant="outline" onClick={onAskSochX} className="w-full py-3 text-sm">
        Ask Soch X
      </Button>
    </div>
  </div>
);

const BriefCard = ({ 
  story, 
  onOpen, 
  onAskSochX, 
  isSaved, 
  onToggleSave 
}: { 
  story: Story; 
  onOpen: () => void; 
  onAskSochX: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 mb-6 relative">
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
        className={`absolute top-5 right-5 p-2 rounded-full transition-all ${isSaved ? 'text-soch-blue' : 'text-slate-300'}`}
      >
        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
      </button>

      <div className="inline-block px-3 py-1 bg-soch-blue/10 text-soch-blue text-xs font-black rounded-full mb-3">
        {story.topic.toUpperCase()}
      </div>
      <h3 className="text-2xl font-black leading-tight mb-3" onClick={onOpen}>{story.headline}</h3>
      <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">{story.summary}</p>
      <div className="flex items-center text-slate-400 text-xs font-bold mb-4">
        <span>{story.source}</span>
        <span className="mx-2">•</span>
        <span>{story.timestamp}</span>
        <div className="ml-auto flex gap-2">
          <span className="flex items-center gap-1 text-soch-blue">
            <CheckCircle2 size={12} /> Factual
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} /> Perspectives
          </span>
        </div>
      </div>
      <Button variant="outline" onClick={onAskSochX} className="w-full py-3 text-sm">
        Ask Soch X
      </Button>
    </div>
  );
};

// --- Story View ---

const StoryView = ({ 
  story, 
  onClose, 
  onAskSochX, 
  isSaved, 
  onToggleSave 
}: { 
  story: Story; 
  onClose: () => void; 
  onAskSochX: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<'facts' | 'perspectives'>('facts');

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-white z-[150] flex flex-col overflow-y-auto"
    >
      <div className="sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b border-slate-100">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <Logo size="sm" />
        <div className="flex gap-2">
          <button 
            onClick={onToggleSave} 
            className={`p-2 rounded-full transition-all ${isSaved ? 'text-soch-blue' : 'text-slate-400'}`}
          >
            <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button className="p-2"><Share2 /></button>
        </div>
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-black leading-tight mb-4">{story.headline}</h1>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-slate-200" />
          <div>
            <div className="font-bold text-sm">{story.author}</div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{story.source} • {story.timestamp}</div>
          </div>
        </div>

        <div className="flex border-b border-slate-100 mb-8">
          <button 
            onClick={() => setActiveTab('facts')}
            className={`flex-1 py-3 font-black text-sm uppercase tracking-widest ${activeTab === 'facts' ? 'text-soch-blue border-b-4 border-soch-blue' : 'text-slate-400'}`}
          >
            Facts
          </button>
          <button 
            onClick={() => setActiveTab('perspectives')}
            className={`flex-1 py-3 font-black text-sm uppercase tracking-widest ${activeTab === 'perspectives' ? 'text-soch-blue border-b-4 border-soch-blue' : 'text-slate-400'}`}
          >
            Perspectives
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'facts' ? (
            <motion.div 
              key="facts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-8">
                <div className="text-xs font-black text-soch-blue uppercase tracking-widest mb-4">The Facts</div>
                <p className="text-lg leading-relaxed text-navy-deep font-medium">
                  {story.summary}
                </p>
              </div>

              {story.localImpacts && story.localImpacts.length > 0 && (
                <div className="mb-8 p-6 bg-soch-blue/5 rounded-3xl border border-soch-blue/10">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-soch-blue" />
                    <div className="text-xs font-black text-soch-blue uppercase tracking-widest">Local Impact AI</div>
                  </div>
                  <div className="space-y-4">
                    {story.localImpacts.map((impact, idx) => (
                      <div key={`impact-${idx}`}>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{impact.category}: {impact.label}</div>
                        <p className="text-sm text-navy-deep font-bold leading-relaxed">{impact.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sources</div>
                <div className="flex flex-wrap gap-2">
                  {story.sources.map(s => (
                    <div key={`source-${s.name}`} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold flex items-center gap-2">
                      {s.name} <ExternalLink size={12} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="perspectives"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="text-xs font-black text-soch-blue uppercase tracking-widest mb-3">{story.perspectives.panelA.label}</div>
                <p className="text-slate-700 leading-relaxed mb-4">{story.perspectives.panelA.content}</p>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Source: {story.perspectives.panelA.source}</div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="text-xs font-black text-soch-blue uppercase tracking-widest mb-3">{story.perspectives.panelB.label}</div>
                <p className="text-slate-700 leading-relaxed mb-4">{story.perspectives.panelB.content}</p>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Source: {story.perspectives.panelB.source}</div>
              </div>

              <p className="text-center text-[10px] text-slate-400 italic px-8">
                Soch does not take a position. These panels present the strongest case each side makes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t border-slate-100 pb-32">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl">Comments</h3>
            <span className="text-slate-400 text-sm font-bold">42</span>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
              <div>
                <div className="font-bold text-sm mb-1">Rajesh Kumar</div>
                <p className="text-sm text-slate-600">The green energy credits are a game changer for local startups. Long overdue!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4">
        <div 
          onClick={onAskSochX}
          className="bg-slate-50 rounded-full py-3 px-6 flex items-center gap-3 cursor-pointer border border-slate-100"
        >
          <div className="w-6 h-6 bg-soch-blue rounded-lg flex items-center justify-center text-white font-black text-[10px]">X</div>
          <span className="text-slate-400 font-bold text-sm">Ask Soch X anything about this story...</span>
          <Send size={18} className="ml-auto text-soch-blue" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Ask Soch X Chat Drawer ---

const DigitalRupeeTracker = () => (
  <div className="bg-navy-deep rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10">
      <TrendingUp size={80} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Live Tracker</div>
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Digital Rupee (e₹)</div>
      </div>
      <div className="flex items-end gap-3 mb-2">
        <div className="text-4xl font-black">₹14.2B</div>
        <div className="text-emerald-400 text-sm font-bold mb-1 flex items-center gap-1">
          <TrendingUp size={14} /> +12.4%
        </div>
      </div>
      <p className="text-xs text-white/60 font-medium leading-relaxed">Total transaction volume in the retail pilot phase across 15 cities.</p>
    </div>
  </div>
);

const HimalayanMeltRate = () => (
  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6 relative overflow-hidden">
    <div className="absolute -bottom-4 -right-4 opacity-5 text-navy-deep">
      <Zap size={120} />
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest">Critical Alert</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Himalayan Glaciers</div>
      </div>
      <div className="flex items-end gap-3 mb-2">
        <div className="text-4xl font-black text-navy-deep">0.5m</div>
        <div className="text-rose-500 text-sm font-bold mb-1 flex items-center gap-1">
          <AlertCircle size={14} /> /year
        </div>
      </div>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">Average vertical thinning rate. 75% of Himalayan ice could disappear by 2100.</p>
    </div>
  </div>
);

const AskSochXChat = ({ story, onClose }: { story?: Story; onClose: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'askSochX',
      text: story 
        ? "What would you like to know about this story?" 
        : "Hello! I'm Soch X. How can I help you understand the news today?",
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFactCheckMode, setIsFactCheckMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = story ? [
    `What are the potential impacts of this ${story.topic.toLowerCase()} change?`,
    `What are the arguments against this ${story.topic.toLowerCase()}?`,
    "Can you explain the background of this story?",
    "Who are the key stakeholders involved?"
  ] : [
    "What's the top story today?",
    "Explain the current economic situation.",
    "Help me understand international relations."
  ];

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg: Message = { id: `user-${Date.now()}-${Math.random()}`, sender: 'user', text: textToSend, timestamp: 'Just now' };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setShowSuggestions(false);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const systemPrompt = `You are 'Soch X', Soch's AI thinking partner. 
      Rules:
      1. Neutrality is absolute. Never take a side.
      2. Cite ALL factual claims in brackets like [Source: Name, Date].
      3. Always present multiple perspectives for complex issues.
      4. If you don't know, say so.
      5. No sycophantic openers. Be warm but direct.
      6. Use the user's context: ${story ? `Currently viewing: ${story.headline}` : 'General browsing'}.
      ${isFactCheckMode ? 'MODE: FACT-CHECK. Go claim by claim. Label: Verified, Grey Area, Disputed.' : ''}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: newMessages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const aiText = response.text;
      
      // Extract sources if any (format: [Source: name, date])
      const sourceRegex = /\[Source:\s*([^\]]+)\]/g;
      const foundSources: string[] = [];
      let match;
      while ((match = sourceRegex.exec(aiText)) !== null) {
        foundSources.push(match[1]);
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}-${Math.random()}`,
        sender: 'askSochX',
        text: aiText,
        timestamp: 'Just now',
        sources: foundSources.length > 0 ? [...new Set(foundSources)] : undefined
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Ask Soch X Error:", error);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'askSochX',
        text: "I'm having trouble connecting to my intelligence core right now. Please try again in a moment.",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsFactCheckMode(false);
    }
  };

  useEffect(() => {
    if (input.length > 0) setShowSuggestions(false);
    else if (messages.length === 1) setShowSuggestions(true);
  }, [input, messages]);

  const isUrl = (str: string) => /^(https?:\/\/)/.test(str);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 z-[200] bg-black/40 flex flex-col justify-end"
    >
      <div className="bg-white rounded-t-[40px] h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 flex justify-between items-center border-b border-slate-50 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-soch-blue rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-soch-blue/20">X</div>
            <div>
              <div className="font-black text-lg">Ask Soch X</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thinking Partner</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400"><X /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.sender === 'user' ? 'bg-soch-blue text-white rounded-3xl rounded-tr-none' : 'bg-white border border-slate-100 text-navy-deep rounded-3xl rounded-tl-none'} p-5 shadow-sm`}>
                <div className="text-sm leading-relaxed font-medium">
                  <Markdown>{m.text}</Markdown>
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Sources Cited</div>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map(s => (
                        <span key={`ai-source-${s}`} className="text-[10px] font-bold text-soch-blue bg-soch-blue/5 px-2 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 text-navy-deep rounded-3xl rounded-tl-none p-5 flex items-center gap-2 shadow-sm">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-soch-blue rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-soch-blue rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-soch-blue rounded-full" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="flex flex-col gap-2 pt-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Suggested Questions</div>
              {suggestions.map((s, i) => (
                <button 
                  key={`suggest-${i}`}
                  onClick={() => handleSend(s)}
                  className="text-left p-4 rounded-2xl bg-white border border-slate-100 text-sm font-bold text-navy-deep hover:bg-soch-blue/5 hover:border-soch-blue/20 transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex gap-2 mb-4">
            {input.length > 20 && (
              <button 
                onClick={() => setIsFactCheckMode(!isFactCheckMode)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  isFactCheckMode ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                Fact-Check Mode {isFactCheckMode ? 'ON' : 'OFF'}
              </button>
            )}
            {isUrl(input) && (
              <div className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                URL Detected
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 bg-slate-50 rounded-3xl p-2 pl-4 border-2 border-slate-100 focus-within:border-soch-blue transition-all">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask Soch X anything..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-navy-deep"
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all ${isLoading || !input.trim() ? 'bg-slate-300' : 'bg-soch-blue shadow-lg shadow-soch-blue/20'}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Discover Tab ---

const DiscoverTab = ({ onOpenStory, onAskSochX }: { onOpenStory: (s: Story) => void; onAskSochX: (s: Story) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'clips' | 'briefs'>('all');

  const filteredStories = SEED_STORIES.filter(s => {
    const matchesSearch = s.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'clips' && s.type === 'clip') || 
                         (activeFilter === 'briefs' && s.type === 'brief');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex-1 flex flex-col p-6">
      <h1 className="text-3xl font-black mb-6">Discover</h1>
      
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search topics, sources, or stories..."
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-navy-deep focus:ring-2 focus:ring-soch-blue/20 transition-all"
        />
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {['all', 'clips', 'briefs'].map(filter => (
          <button 
            key={`filter-${filter}`}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
              activeFilter === filter ? 'bg-soch-blue text-white' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 pb-24">
        {filteredStories.map(story => (
          <div key={`discover-${story.id}`} className="relative group">
            <div 
              onClick={() => onOpenStory(story)}
              className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                {story.thumbnail ? (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                    <img src={story.thumbnail} alt="" className="w-full h-full object-cover" />
                    {story.type === 'clip' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play size={16} className="text-white fill-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                    <MessageSquare size={24} className="text-slate-200" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-black text-soch-blue uppercase tracking-widest mb-1">{story.topic}</div>
                  <h4 className="font-black text-sm leading-tight mb-2 line-clamp-2">{story.headline}</h4>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{story.source}</div>
                </div>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onAskSochX(story); }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-100 rounded-2xl shadow-lg flex items-center justify-center text-soch-blue hover:scale-110 transition-all z-10"
            >
              <Zap size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Simulator Tab ---

const SimulatorTab = () => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [outcome, setOutcome] = useState<any>(null);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setOutcome(null);
    
    // Mock simulation delay
    setTimeout(() => {
      setIsSimulating(false);
      setOutcome({
        title: "High Confidence Outcome",
        impact: "Accelerated glacial retreat could lead to a 20% reduction in winter crop yields across the Indo-Gangetic plain by 2040.",
        confidence: "High",
        badge: "Based on IPCC AR6 & Local Hydrological Models"
      });
    }, 3000);
  };

  if (selectedScenario) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-navy-deep z-[300] flex flex-col text-white"
      >
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <button onClick={() => setSelectedScenario(null)} className="p-2 bg-white/10 rounded-full"><ArrowLeft /></button>
          <div className="text-center">
            <div className="text-[10px] font-black uppercase tracking-widest text-soch-blue">Simulator Arena</div>
            <div className="font-black">Scenario: {selectedScenario.id.toUpperCase()}</div>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-3xl font-black mb-4">{selectedScenario.title}</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">{selectedScenario.description}</p>

          <div className="space-y-8 mb-12">
            {selectedScenario.parameters.map(param => (
              <div key={`param-${param.id}`} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black uppercase tracking-widest opacity-60">{param.label}</label>
                  {param.type === 'slider' && <span className="text-soch-blue font-black">{param.defaultValue}</span>}
                </div>
                {param.type === 'slider' && (
                  <input type="range" min={param.min} max={param.max} step={0.1} className="w-full accent-soch-blue" />
                )}
                {param.type === 'select' && (
                  <div className="grid grid-cols-1 gap-2">
                    {param.options?.map(opt => (
                      <button 
                        key={`opt-${opt}`}
                        className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                          opt === param.defaultValue ? 'border-soch-blue bg-soch-blue/10 text-white' : 'border-white/5 bg-white/5 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {param.type === 'toggle' && (
                  <button className="w-full p-4 rounded-2xl border-2 border-white/5 bg-white/5 flex justify-between items-center">
                    <span className="font-bold text-slate-400">Enabled</span>
                    <div className={`w-12 h-6 rounded-full p-1 transition-all ${param.defaultValue ? 'bg-soch-blue' : 'bg-slate-700'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${param.defaultValue ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>

          {isSimulating ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 border-4 border-soch-blue border-t-transparent rounded-full animate-spin mb-6" />
              <h3 className="font-black text-xl mb-2">Running Complex Simulation...</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Calculating multi-variable outcomes</p>
            </div>
          ) : outcome ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white/5 rounded-[40px] border border-white/10 mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase">{outcome.confidence} Confidence</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase">{outcome.badge}</div>
              </div>
              <h3 className="text-2xl font-black mb-4">{outcome.title}</h3>
              <p className="text-lg leading-relaxed text-slate-300 font-medium mb-6">{outcome.impact}</p>
              <Button onClick={() => setOutcome(null)} variant="outline" className="w-full border-white/20 text-white">Reset Parameters</Button>
            </motion.div>
          ) : (
            <Button onClick={handleRunSimulation} className="w-full py-6 text-xl mb-12">Enter Simulation</Button>
          )}

          <div className="text-center pb-12">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Simulated Scenario — Not a Forecast.</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 bg-navy-deep min-h-screen text-white">
      <h1 className="text-3xl font-black mb-2">Simulator</h1>
      <p className="text-slate-400 mb-8 font-medium">Explore "What If" scenarios using our multi-perspective AI engine.</p>

      <div className="space-y-6 pb-24">
        {SCENARIOS.map(scenario => (
          <div 
            key={`scenario-${scenario.id}`}
            onClick={() => setSelectedScenario(scenario)}
            className="relative rounded-[40px] overflow-hidden aspect-[4/5] group cursor-pointer"
          >
            <img src={scenario.background} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-black mb-3 leading-tight">{scenario.title}</h3>
              <p className="text-sm text-slate-300 mb-6 line-clamp-2">{scenario.description}</p>
              <div className="flex items-center gap-2 text-soch-blue font-black text-xs uppercase tracking-widest">
                Enter Simulation <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Verify Tab ---

const VerifyTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<'community' | 'ai'>('community');
  const [factCheckInput, setFactCheckInput] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<{
    text: string;
    citations: { title: string; url: string }[];
  } | null>(null);

  const handleFactCheck = async () => {
    if (!factCheckInput.trim()) return;
    setIsChecking(true);
    setFactCheckResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [{
          role: 'user',
          parts: [{ text: `Fact-check the following content. Go claim by claim on the most significant assertions. Label each: Verified (supported by primary sources), Grey Area (opinion or unverifiable), Disputed (contradicted by primary sources). Show your sources for each assessment. Present the output as a structured analysis. Content: ${factCheckInput}` }]
        }],
        config: {
          systemInstruction: "You are a professional fact-checker. Be objective, cite primary sources, and use the labels: Verified, Grey Area, Disputed.",
          temperature: 0.2,
        },
      });

      const aiText = response.text;
      // Mock citations for now as Gemini doesn't return structured URLs easily without grounding
      setFactCheckResult({
        text: aiText,
        citations: [
          { title: "Official Gazette of India", url: "#" },
          { title: "Supreme Court Repository", url: "#" }
        ]
      });
    } catch (error) {
      console.error("Fact Check Error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-6">
        <h1 className="text-3xl font-black mb-6">Verify</h1>
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveSubTab('community')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'community' ? 'bg-white shadow-sm text-navy-deep' : 'text-slate-400'}`}
          >
            Community
          </button>
          <button 
            onClick={() => setActiveSubTab('ai')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'ai' ? 'bg-white shadow-sm text-navy-deep' : 'text-slate-400'}`}
          >
            AI Fact-Check
          </button>
        </div>

        {activeSubTab === 'community' ? (
          <div className="space-y-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center px-4">
              Flag a specific claim. Not a whole article. If a sentence is wrong, prove it with a source.
            </p>
            
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-soch-blue/10 text-soch-blue text-[10px] font-black rounded-full uppercase">Open</div>
                <div className="text-[10px] font-bold text-slate-400">2h ago</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border-l-4 border-soch-blue mb-4">
                <p className="text-sm font-bold italic">"The GDP growth rate for Q3 has been revised downwards to 4.2%."</p>
              </div>
              <div className="text-xs font-bold text-soch-blue mb-6 flex items-center gap-1">
                View Article <ExternalLink size={10} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-4 bg-soch-blue text-white rounded-2xl font-black text-sm shadow-lg shadow-soch-blue/20">Valid Flag</button>
                <button className="py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-sm">Invalid Flag</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 mb-6">
              <button className="flex-1 py-3 border-2 border-soch-blue bg-soch-blue/5 text-soch-blue rounded-2xl font-bold text-sm">Paste URL / Text</button>
            </div>

            <div className="bg-slate-50 rounded-3xl p-4 border-2 border-slate-200 focus-within:border-soch-blue transition-all">
              <textarea 
                value={factCheckInput}
                onChange={e => setFactCheckInput(e.target.value)}
                placeholder="Paste news content or URL here..."
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-navy-deep h-32 resize-none"
              />
            </div>

            <Button 
              onClick={handleFactCheck} 
              disabled={isChecking || !factCheckInput.trim()}
              className="w-full py-5 text-lg"
            >
              {isChecking ? 'Verifying Claims...' : 'Run Deep Fact-Check'}
            </Button>

            {isChecking && (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 border-4 border-soch-blue border-t-transparent rounded-full animate-spin mb-6" />
                <h3 className="font-black text-lg mb-2">Analyzing Primary Sources...</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tracing claims to origin</p>
              </div>
            )}

            {factCheckResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8 border-t border-slate-100"
              >
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Analysis Result</div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 mb-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm leading-relaxed font-medium">
                      <Markdown>{factCheckResult.text}</Markdown>
                    </div>
                  </div>
                </div>
                
                <div className="text-[10px] font-black text-slate-400 uppercase mb-4">Citations Panel</div>
                <div className="space-y-3">
                  {factCheckResult.citations.map((cite, i) => (
                    <div key={`cite-${i}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-bold">{cite.title}</span>
                      <ExternalLink size={14} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!factCheckResult && !isChecking && (
              <div className="pt-8 border-t border-slate-100">
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Legend</div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase">Verified</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-[10px] font-bold uppercase">Grey Area</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-bold uppercase">Disputed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Profile ---

const ProfileTab = () => {
  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-black">Profile</h1>
        <button className="p-2 bg-slate-50 rounded-full"><Settings size={20} /></button>
      </div>

      <div className="flex flex-col items-center mb-12">
        <div className="w-24 h-24 rounded-full bg-slate-200 mb-4 border-4 border-soch-blue/10" />
        <h2 className="text-2xl font-black">{DEFAULT_USER.username}</h2>
        <p className="text-soch-blue font-bold text-sm uppercase tracking-widest">{DEFAULT_USER.useCase}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-soch-blue p-6 rounded-[32px] text-white shadow-xl shadow-soch-blue/20">
          <div className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">Credibility Score</div>
          <div className="text-4xl font-black mb-1">{DEFAULT_USER.credibilityScore}</div>
          <div className="text-[10px] font-bold bg-white/20 inline-block px-2 py-1 rounded-full">+12% this month</div>
        </div>
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col justify-center">
            <div className="text-2xl font-black">{DEFAULT_USER.piecesPublished}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase">Published</div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col justify-center">
            <div className="text-2xl font-black">{DEFAULT_USER.verificationHistory}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase">Verifications</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[40px] p-8 mb-8 shadow-sm">
        <h3 className="font-black text-xl mb-8">My Consumption</h3>
        
        <div className="space-y-6 mb-12">
          {DEFAULT_USER.consumption.mostRead.map(item => (
            <div key={`stat-${item.topic}`}>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>{item.topic}</span>
                <span>{item.percentage}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-soch-blue" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 mb-3">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-soch-blue" strokeWidth="4" strokeDasharray="65, 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black">65%</div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">Briefs vs Clips</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xl font-black">{DEFAULT_USER.consumption.askSochXConversations}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Ask Soch X Conv.</div>
            </div>
            <div>
              <div className="text-xl font-black">{DEFAULT_USER.consumption.factChecksRun}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Fact Checks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Messenger ---

const Messenger = ({ onClose }: { onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-white z-[250] flex flex-col"
    >
      <div className="p-6 flex items-center gap-4 border-b border-slate-50">
        <button onClick={onClose} className="p-2"><ArrowLeft /></button>
        <h1 className="text-2xl font-black">Messenger</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {[
          { name: 'Karan Mehra', msg: 'Check this out, very relevant to our discussion.', time: '12m ago', unread: true },
          { name: 'Sarah Jenkins', msg: 'The peace accord draft looks solid.', time: '1h ago', unread: false }
        ].map(chat => (
          <div key={`chat-list-${chat.name}`} className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-full bg-slate-100 shrink-0" />
            <div className="flex-1 border-b border-slate-50 pb-6">
              <div className="flex justify-between mb-1">
                <div className="font-black">{chat.name}</div>
                <div className="text-[10px] font-bold text-slate-400">{chat.time}</div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500 line-clamp-1">{chat.msg}</p>
                {chat.unread && <div className="w-2 h-2 bg-soch-blue rounded-full" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Side Menu ---

const SideMenu = ({ isOpen, onClose, onNavigate }: { isOpen: boolean; onClose: () => void; onNavigate: (screen: string) => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-deep/40 backdrop-blur-sm z-[300]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[80%] bg-white z-[310] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex justify-end">
              <button onClick={onClose} className="p-2 bg-slate-50 rounded-full"><X /></button>
            </div>

            <div className="px-8 mb-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 mb-4" />
              <div className="font-black text-2xl mb-1">{DEFAULT_USER.username}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Premium Member</div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              {[
                { label: 'Profile', icon: User, screen: 'profile' },
                { label: 'Topic Preferences', icon: Settings, screen: 'topics' },
                { label: 'Saved Articles', icon: Bookmark, screen: 'saved' },
                { label: 'Messenger', icon: MessageSquare, screen: 'messenger' },
                { label: 'Upgrade to Premium', icon: Zap, screen: 'premium', highlight: true }
              ].map(item => (
                <button 
                  key={`nav-${item.label}`}
                  onClick={() => {
                    onNavigate(item.screen);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${item.highlight ? 'bg-navy-deep text-white shadow-lg' : 'hover:bg-slate-50 text-navy-deep'}`}
                >
                  <item.icon size={20} className={item.highlight ? 'text-soch-blue' : ''} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-8 border-t border-slate-100">
              <button className="flex items-center gap-4 text-rose-500 font-bold">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Brief Me ---

const BriefMe = () => {
  const [request, setRequest] = useState<BriefMeRequest>({
    prompt: '',
    format: 'text',
    status: 'idle'
  });

  const handleGenerate = () => {
    if (!request.prompt.trim()) return;
    setRequest({ ...request, status: 'generating' });
    setTimeout(() => {
      setRequest({ 
        ...request, 
        status: 'ready', 
        content: `Based on your intent to understand news as a ${request.prompt}, here is your personalized brief: The Union Budget focuses on infrastructure, which means more public works contracts in Delhi. The new AI policy will impact your curriculum next semester...` 
      });
    }, 2000);
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 p-8 mb-8 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-soch-blue/5 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-navy-deep rounded-2xl flex items-center justify-center text-white">
          <Zap size={20} className="text-soch-blue" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Brief Me</h2>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personalised Intelligence</div>
        </div>
      </div>

      {request.status === 'idle' && (
        <div className="space-y-6">
          <p className="text-sm text-slate-500 font-medium">Tell us who you are and what you need. AI will frame today's news for your specific context.</p>
          <div className="bg-slate-50 rounded-3xl p-4 border border-slate-100">
            <textarea 
              value={request.prompt}
              onChange={e => setRequest({ ...request, prompt: e.target.value })}
              placeholder="e.g., Explain today's news for a law student in Delhi..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-navy-deep h-24 resize-none"
            />
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setRequest({ ...request, format: 'text' })}
              className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${request.format === 'text' ? 'bg-navy-deep text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              Text Brief
            </button>
            <button 
              onClick={() => setRequest({ ...request, format: 'audio' })}
              className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${request.format === 'audio' ? 'bg-navy-deep text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              Audio Brief
            </button>
          </div>
          <Button onClick={handleGenerate} className="w-full py-5">Generate My Brief</Button>
        </div>
      )}

      {request.status === 'generating' && (
        <div className="py-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 border-4 border-soch-blue border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="font-black text-lg mb-2">Processing Intent...</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Framing news for your context</p>
        </div>
      )}

      {request.status === 'ready' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-sm leading-relaxed text-navy-deep font-medium italic mb-4">"Your brief as a {request.prompt}"</p>
            <p className="text-sm leading-relaxed text-slate-600">{request.content}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setRequest({ ...request, status: 'idle' })} className="flex-1">New Prompt</Button>
            <Button className="flex-1">Save Brief</Button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Morning Brief ---

const MorningBrief = ({ stories, onOpen }: { stories: Story[]; onOpen: (story: Story) => void }) => {
  return (
    <div className="bg-navy-deep rounded-[40px] p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-soch-blue/20 blur-3xl rounded-full -mr-16 -mt-16" />
      
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-soch-blue mb-2">Daily Briefing</div>
          <h2 className="text-3xl font-black leading-tight">The Morning<br />Brief</h2>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-center">
          <div className="text-[10px] font-black uppercase opacity-60">March 11</div>
          <div className="text-xl font-black">07:00</div>
        </div>
      </div>

      <div className="space-y-4">
        {stories.slice(0, 5).map((story, idx) => (
          <div 
            key={`brief-item-${story.id}`} 
            onClick={() => onOpen(story)}
            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-soch-blue flex items-center justify-center font-black text-sm">{idx + 1}</div>
            <div className="flex-1">
              <div className="text-[8px] font-black uppercase tracking-widest text-soch-blue mb-1">{story.topic}</div>
              <div className="text-sm font-bold line-clamp-1">{story.headline}</div>
            </div>
            <ChevronRight size={16} className="opacity-40" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
        <Check size={12} /> Personalised for your IAS prep
      </div>
    </div>
  );
};

// --- Information Circles ---

const SavedArticles = ({ 
  stories, 
  onOpen, 
  onAskSochX, 
  onToggleSave 
}: { 
  stories: Story[]; 
  onOpen: (story: Story) => void; 
  onAskSochX: (story: Story) => void;
  onToggleSave: (id: string) => void;
}) => {
  return (
    <div className="flex-1 flex flex-col p-6">
      <h1 className="text-3xl font-black mb-8">Saved Articles</h1>
      {stories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
          <Bookmark size={64} className="text-slate-100 mb-6" />
          <p className="text-slate-400 font-bold">No saved articles yet. Tap the bookmark icon on any story to save it for later.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stories.map(story => (
            <div key={`saved-story-${story.id}`}>
              {story.type === 'clip' ? (
                <ClipCard 
                  story={story} 
                  onOpen={() => onOpen(story)} 
                  onAskSochX={() => onAskSochX(story)} 
                  isSaved={true}
                  onToggleSave={() => onToggleSave(story.id)}
                />
              ) : (
                <BriefCard 
                  story={story} 
                  onOpen={() => onOpen(story)} 
                  onAskSochX={() => onAskSochX(story)} 
                  isSaved={true}
                  onToggleSave={() => onToggleSave(story.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'verify' | 'simulator' | 'profile' | 'saved'>('home');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isAskSochXOpen, setIsAskSochXOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [savedStoryIds, setSavedStoryIds] = useState<string[]>([]);
  const [showMorningBrief, setShowMorningBrief] = useState(true);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const toggleSave = (id: string) => {
    setSavedStoryIds(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const savedStories = SEED_STORIES.filter(s => savedStoryIds.includes(s.id));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 bg-white z-50 px-6 py-4 flex justify-between items-center border-b border-slate-50">
        <Logo />
        <div className="flex gap-4">
          <button onClick={() => setIsMessengerOpen(true)} className="p-2 text-navy-deep"><MessageSquare size={24} /></button>
          <button onClick={() => setIsMenuOpen(true)} className="p-2 text-navy-deep"><MenuIcon size={24} /></button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">Your Feed</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Settings size={14} /> Customise
              </button>
            </div>

            {showMorningBrief && (
              <MorningBrief 
                stories={SEED_STORIES} 
                onOpen={(s) => setSelectedStory(s)} 
              />
            )}

            <BriefMe />

            <DigitalRupeeTracker />
            <HimalayanMeltRate />

            {SEED_STORIES.map(story => (
              <div key={`story-${story.id}`}>
                {story.type === 'clip' ? (
                  <ClipCard 
                    story={story} 
                    onOpen={() => setSelectedStory(story)} 
                    onAskSochX={() => { setSelectedStory(story); setIsAskSochXOpen(true); }} 
                    isSaved={savedStoryIds.includes(story.id)}
                    onToggleSave={() => toggleSave(story.id)}
                  />
                ) : (
                  <BriefCard 
                    story={story} 
                    onOpen={() => setSelectedStory(story)} 
                    onAskSochX={() => { setSelectedStory(story); setIsAskSochXOpen(true); }} 
                    isSaved={savedStoryIds.includes(story.id)}
                    onToggleSave={() => toggleSave(story.id)}
                  />
                )}
              </div>
            ))}

            <Button variant="secondary" className="w-full py-5 mb-24">Load More</Button>
          </div>
        )}

        {activeTab === 'discover' && (
          <DiscoverTab 
            onOpenStory={(s) => setSelectedStory(s)} 
            onAskSochX={(s) => { setSelectedStory(s); setIsAskSochXOpen(true); }} 
          />
        )}
        {activeTab === 'verify' && <VerifyTab />}
        {activeTab === 'simulator' && <SimulatorTab />}
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'saved' && (
          <SavedArticles 
            stories={savedStories} 
            onOpen={(s) => setSelectedStory(s)} 
            onAskSochX={(s) => { setSelectedStory(s); setIsAskSochXOpen(true); }} 
            onToggleSave={toggleSave}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-100 px-8 py-4 flex justify-between items-center z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-soch-blue' : 'text-slate-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Feed</span>
        </button>
        <button 
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'discover' ? 'text-soch-blue' : 'text-slate-400'}`}
        >
          <Search size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Discover</span>
        </button>
        <button 
          onClick={() => setActiveTab('verify')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'verify' ? 'text-soch-blue' : 'text-slate-400'}`}
        >
          <ShieldCheck size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Verify</span>
        </button>
        <button 
          onClick={() => setActiveTab('simulator')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'simulator' ? 'text-soch-blue' : 'text-slate-400'}`}
        >
          <Zap size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Simulator</span>
        </button>
      </nav>

      {/* Ask Soch X Floating Button */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsAskSochXOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 bg-soch-blue rounded-full shadow-2xl flex flex-col items-center justify-center text-white"
      >
        <MessageCircle size={24} />
        <span className="text-[8px] font-black uppercase mt-1">Ask Soch X</span>
      </motion.button>

      {/* Overlays */}
      <AnimatePresence>
        {selectedStory && (
          <StoryView 
            story={selectedStory} 
            onClose={() => setSelectedStory(null)} 
            onAskSochX={() => setIsAskSochXOpen(true)} 
            isSaved={savedStoryIds.includes(selectedStory.id)}
            onToggleSave={() => toggleSave(selectedStory.id)}
          />
        )}
        {isAskSochXOpen && (
          <AskSochXChat 
            story={selectedStory || undefined} 
            onClose={() => setIsAskSochXOpen(false)} 
          />
        )}
        {isMessengerOpen && (
          <Messenger onClose={() => setIsMessengerOpen(false)} />
        )}
      </AnimatePresence>

      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={(screen) => {
          if (screen === 'profile') setActiveTab('profile');
          if (screen === 'messenger') setIsMessengerOpen(true);
          if (screen === 'saved') setActiveTab('saved');
        }}
      />
    </div>
  );
}
