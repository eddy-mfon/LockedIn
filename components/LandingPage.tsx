
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, Cpu, Activity, Globe, Lock, Terminal, BarChart, Clock, Database, Server, Wifi, Download, User, Monitor, X, ChevronRight, Command, AlertTriangle, Hash, ChevronDown, MousePointer2, MessageSquare } from 'lucide-react';
import { HeroScene } from './QuantumScene';
import { FocusGridDiagram, AIWorkflowDiagram } from './Diagrams';
import { Tier } from '../types';

interface LandingPageProps {
  onStart: (tier: Tier) => void;
}

// --- ANIMATION COMPONENTS ---

const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-green-500/80 opacity-0 group-hover:opacity-100 animate-pulse translate-x-[1px]">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-white/80 opacity-0 group-hover:opacity-100 animate-pulse -translate-x-[1px]">{text}</span>
    </div>
  );
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

const TechTicker = () => (
  <div className="w-full border-y border-zinc-900 bg-black overflow-hidden py-3 select-none relative z-20">
    <div className="animate-[scroll_30s_linear_infinite] whitespace-nowrap flex gap-16 text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
      {Array(4).fill(0).map((_, i) => (
          <React.Fragment key={i}>
            <span className="flex items-center gap-2"><div className="w-1 h-1 bg-green-500 rounded-full"></div> SYSTEM STATUS: OPTIMAL</span>
            <span className="flex items-center gap-2">DISTRACTIONS BLOCKED: 1,402,993</span>
            <span className="flex items-center gap-2">ENCRYPTION: AES-256</span>
            <span className="flex items-center gap-2">NEURAL LINK: STANDBY</span>
          </React.Fragment>
      ))}
    </div>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = "INITIALIZING...";
  
  // Modal State
  const [showInitModal, setShowInitModal] = useState(false);
  const [initStep, setInitStep] = useState<'select' | 'download' | 'login'>('select');
  const [username, setUsername] = useState('');
  const [selectedTier, setSelectedTier] = useState<Tier>('free');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleInitClick = (tier: Tier = 'free') => {
      setSelectedTier(tier);
      setInitStep('select');
      setShowInitModal(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!username.trim()) return;
      localStorage.setItem('lockedin_username', username);
      onStart(selectedTier);
  };

  const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-green-500/30 selection:text-green-200 overflow-x-hidden">
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* INITIALIZATION MODAL */}
      <AnimatePresence>
      {showInitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-4xl bg-black border border-zinc-800 relative shadow-2xl flex flex-col md:flex-row h-auto md:h-[500px] overflow-hidden"
              >
                  {/* Decorative Scanline */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>

                  {/* Left Column: Status & Info */}
                  <div className="w-full md:w-1/3 bg-zinc-950/50 border-b md:border-b-0 md:border-r border-zinc-800 p-8 flex flex-col justify-between relative z-10">
                      <div>
                          <div className="flex items-center gap-2 mb-6">
                              <Command size={16} className="text-green-500" />
                              <span className="font-bold tracking-widest text-xs">GATEWAY_V2.4</span>
                          </div>
                          
                          <h2 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">
                              {initStep === 'select' && 'Select Version'}
                              {initStep === 'download' && 'Deploy App'}
                              {initStep === 'login' && 'Identify User'}
                          </h2>
                          
                          <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-wider">
                              {initStep === 'select' && "Choose how you want to access the system."}
                              {initStep === 'download' && "The desktop application is currently being built."}
                              {initStep === 'login' && "Create a codename to track your progress."}
                          </p>
                      </div>

                      <div className="space-y-4 mt-8 md:mt-0">
                          <div className="flex justify-between text-[10px] text-zinc-600 border-b border-zinc-900 pb-2">
                              <span>SERVER STATUS</span>
                              <span className="text-green-500">ONLINE</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-zinc-600 border-b border-zinc-900 pb-2">
                              <span>ACTIVE USERS</span>
                              <span>8,492</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-zinc-600 border-b border-zinc-900 pb-2">
                              <span>LATENCY</span>
                              <span>~12ms</span>
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Interaction */}
                  <div className="w-full md:w-2/3 p-8 bg-black relative z-10 flex flex-col">
                      <button 
                        onClick={() => setShowInitModal(false)}
                        className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors z-20"
                      >
                         <X size={20} />
                      </button>

                       {/* STEP: SELECTION */}
                       {initStep === 'select' && (
                           <div className="flex-1 flex flex-col justify-center gap-4">
                               {/* Option 1 */}
                               <button 
                                   onClick={() => setInitStep('login')}
                                   className="group relative border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-green-500 transition-all p-6 text-left w-full overflow-hidden"
                               >
                                   <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest animate-pulse">Ready</div>
                                   </div>
                                   <div className="flex items-start gap-4 mb-4">
                                       <div className="p-3 bg-zinc-900 border border-zinc-700 text-white group-hover:text-green-500 transition-colors">
                                            <Globe size={24} />
                                       </div>
                                       <div>
                                           <h3 className="text-lg font-bold uppercase tracking-wide text-white group-hover:text-green-500 transition-colors">Use Online</h3>
                                           <p className="text-xs text-zinc-500 mt-1">Start using immediately in your browser.</p>
                                       </div>
                                   </div>
                                   <div className="flex gap-4 text-[10px] text-zinc-600 font-mono uppercase">
                                       <span className="flex items-center gap-1"><Wifi size={10} /> Fast</span>
                                       <span className="flex items-center gap-1"><Server size={10} /> Cloud Sync</span>
                                   </div>
                               </button>

                               {/* Option 2 */}
                               <button 
                                   onClick={() => setInitStep('download')}
                                   className="group relative border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900 hover:border-white transition-all p-6 text-left w-full"
                               >
                                    <div className="absolute top-0 right-0 p-2">
                                       <div className="text-[9px] text-black bg-white px-2 py-0.5 font-bold uppercase tracking-widest">BETA</div>
                                   </div>
                                   <div className="flex items-start gap-4 mb-4">
                                       <div className="p-3 bg-zinc-900 border border-zinc-700 text-white group-hover:text-zinc-300 transition-colors">
                                            <Monitor size={24} />
                                       </div>
                                       <div>
                                           <h3 className="text-lg font-bold uppercase tracking-wide text-white group-hover:text-white transition-colors">Download App</h3>
                                           <p className="text-xs text-zinc-500 mt-1">Install on your computer for offline use.</p>
                                       </div>
                                   </div>
                                   <div className="flex gap-4 text-[10px] text-zinc-600 font-mono uppercase">
                                       <span className="flex items-center gap-1"><Download size={10} /> 140MB</span>
                                       <span className="flex items-center gap-1"><Cpu size={10} /> Native</span>
                                   </div>
                               </button>
                           </div>
                       )}

                       {/* STEP: DOWNLOAD */}
                       {initStep === 'download' && (
                           <div className="flex-1 flex flex-col justify-center items-center text-center">
                                <div className="w-16 h-16 border border-zinc-800 bg-zinc-900/50 flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 border-t border-green-500 animate-[spin_3s_linear_infinite]"></div>
                                    <Download size={24} className="text-zinc-500" />
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-2">Development Status</h3>
                                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-8 font-mono leading-relaxed">
                                    The Native Client is currently in <strong>Closed Beta</strong> and being optimized for performance.<br/><br/>
                                    You can access the full system capabilities via the Cloud Terminal immediately.
                                </p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setInitStep('select')}
                                        className="px-6 py-3 border border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all"
                                    >
                                        Back
                                    </button>
                                    <button 
                                        onClick={() => setInitStep('login')}
                                        className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                    >
                                        Launch Online
                                    </button>
                                </div>
                           </div>
                       )}

                       {/* STEP: LOGIN */}
                       {initStep === 'login' && (
                           <div className="flex-1 flex flex-col justify-center">
                               <form onSubmit={handleLoginSubmit} className="max-w-sm mx-auto w-full">
                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="text-[10px] font-mono text-green-500 uppercase tracking-widest">
                                                Choose Username
                                            </label>
                                            <span className="text-[10px] text-zinc-600 uppercase">Required</span>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800 group-focus-within:bg-green-500 transition-colors"></div>
                                            <input 
                                                type="text" 
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Enter Name..."
                                                className="w-full bg-zinc-900/30 border border-zinc-800 py-4 pl-6 pr-4 text-lg text-white font-mono focus:outline-none focus:border-zinc-600 transition-colors"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="mt-2 text-[10px] text-zinc-600">
                                            This will be displayed on your career record.
                                        </div>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!username.trim()}
                                        className={`w-full py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all ${username.trim() ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'}`}
                                    >
                                        Launch System <ArrowRight size={14} />
                                    </button>
                               </form>
                           </div>
                       )}
                  </div>
              </motion.div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-4 h-4 bg-white transform rotate-45"></div>
            <span className="font-bold tracking-widest text-sm">LOCKED<span className="text-zinc-500">IN</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            <button onClick={() => scrollToSection('manifesto')} className="hover:text-white transition-colors">Why It Works</button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('logs')} className="hover:text-white transition-colors">Logs</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button>
          </div>
          <button 
            onClick={() => handleInitClick('free')}
            className="bg-white text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            Initialize
          </button>
        </div>
      </nav>

      <TechTicker />

      {/* HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden border-b border-zinc-800">
        <HeroScene />
        
        <div className="relative z-10 text-center max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400">System v2.4 Online</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-8 leading-none">
            Master Your <br/>
            <GlitchText text="Flow State" />
          </h1>
          
          <p className="text-zinc-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10 font-mono">
            The ultimate productivity tool for people who can't afford to be distracted. 
            Block noise, track tasks, and gamify your work.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => handleInitClick('free')}
              className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2 group"
            >
              Start For Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => scrollToSection('capabilities')}
              className="px-8 py-4 bg-transparent border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all"
            >
              System Specs
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 animate-bounce">
            <ChevronDown className="text-zinc-600" />
        </div>
      </section>

      {/* MANIFESTO (THE PROBLEM) */}
      <section id="manifesto" className="py-24 border-b border-zinc-800 bg-zinc-950">
          <div className="max-w-5xl mx-auto px-6">
              <FadeIn>
                <div className="flex flex-col md:flex-row gap-16 items-start">
                    <div className="flex-1">
                        <h2 className="text-4xl font-bold uppercase tracking-tighter mb-6">Stealing Your Focus</h2>
                        <div className="w-12 h-1 bg-green-500 mb-6"></div>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                            Modern apps are designed to interrupt you. Notifications, endless feeds, and clutter are destroying your ability to do deep work.
                        </p>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            <strong className="text-white">LockedIn</strong> is different. It's a closed environment. No feeds. No noise. Just you and your work.
                        </p>
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-4 w-full">
                        <div className="p-6 bg-black border border-zinc-800 flex items-start gap-4">
                            <AlertTriangle className="text-white shrink-0" />
                            <div>
                                <h3 className="font-bold uppercase text-sm mb-1">The Cost</h3>
                                <p className="text-xs text-zinc-500">It takes 23 minutes to refocus after one interruption.</p>
                            </div>
                        </div>
                        <div className="p-6 bg-black border border-zinc-800 flex items-start gap-4">
                            <Activity className="text-white shrink-0" />
                            <div>
                                <h3 className="font-bold uppercase text-sm mb-1">The Goal</h3>
                                <p className="text-xs text-zinc-500">Reach "Flow State" — where work feels effortless.</p>
                            </div>
                        </div>
                    </div>
                </div>
              </FadeIn>
          </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 border-b border-zinc-800 bg-black">
          <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                   <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-4">The Workflow</h2>
                   <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white">Three Steps to Freedom</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                      { icon: Check, title: "1. The Plan", desc: "List your tasks. Clear your mind. Set a specific goal." },
                      { icon: Clock, title: "2. The Focus", desc: "Start the timer. Audio turns on. Distractions are blocked." },
                      { icon: Zap, title: "3. The Reward", desc: "Earn XP. Level up your rank. Feel accomplished." }
                  ].map((step, i) => (
                      <FadeIn key={i} delay={i * 0.2}>
                          <div className="p-8 border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors h-full">
                              <div className="w-12 h-12 bg-white text-black flex items-center justify-center mb-6 font-bold">
                                  {i + 1}
                              </div>
                              <h4 className="text-xl font-bold uppercase mb-4">{step.title}</h4>
                              <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                          </div>
                      </FadeIn>
                  ))}
              </div>
          </div>
      </section>

      {/* CAPABILITIES (FEATURES) */}
      <section id="capabilities" className="py-24 border-b border-zinc-800 bg-zinc-950 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6">System Specs</h2>
                <p className="text-zinc-400 max-w-2xl text-lg">Built for speed. Minimalist by design.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    {[
                        { title: "Neural Audio Engine", desc: "Built-in Brownian noise generator to drown out the world.", icon: Activity },
                        { title: "Distraction Blocker", desc: "The interface removes all clutter when the timer starts.", icon: Shield },
                        { title: "Gamified Progress", desc: "Earn ranks like 'Architect' and 'Omniscient' for working hard.", icon: Zap },
                        { title: "Command Console", desc: "A text-based scratchpad to dump thoughts without stopping.", icon: Terminal },
                    ].map((feat, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="group p-6 border border-zinc-800 bg-black hover:border-white transition-colors flex items-start gap-6">
                                <div className="p-3 bg-zinc-900 text-zinc-400 group-hover:text-white transition-colors">
                                    <feat.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold uppercase tracking-wide mb-2 group-hover:text-green-500 transition-colors">{feat.title}</h3>
                                    <p className="text-zinc-500 text-sm">{feat.desc}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
                
                {/* Visualizer */}
                <div className="flex flex-col gap-6">
                     <FocusGridDiagram />
                     <AIWorkflowDiagram />
                </div>
            </div>
        </div>
      </section>

      {/* OPERATOR LOGS (TESTIMONIALS) */}
      <section id="logs" className="py-24 border-b border-zinc-800 bg-black">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 flex items-center gap-4">
                Operator Logs <span className="text-sm font-mono text-green-500 tracking-widest bg-zinc-900 px-2 py-1">VERIFIED</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { user: "Sarah_Dev", rank: "Architect", msg: "I coded for 6 hours straight. I forgot I had a phone. This is dangerous technology." },
                    { user: "K_Write", rank: "Operator", msg: "The audio engine is better than my noise-canceling headphones. Silence is loud. This is focus." },
                    { user: "Student_01", rank: "Specialist", msg: "Gamifying my thesis paper was the only way I finished it. Level 5 reached." }
                ].map((log, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <div className="p-6 border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-bold">
                                    {log.user[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{log.user}</div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{log.rank}</div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm font-mono leading-relaxed">
                                "{log.msg}"
                            </p>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 border-b border-zinc-800 bg-black">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                  <div>
                    <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4">Access Levels</h2>
                    <p className="text-zinc-400">Choose your clearance level.</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-green-500">
                      <Check size={14} /> 30-Day Money Back Guarantee
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Free Tier */}
                  <FadeIn delay={0.1} className="h-full">
                    <div className="p-8 border border-zinc-800 bg-zinc-900/10 flex flex-col h-full hover:bg-zinc-900/30 transition-colors">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-zinc-400 mb-2">Standard</h3>
                            <div className="text-4xl font-bold font-mono">$0</div>
                            <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wider">Forever Free</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Basic Focus Timer', 'Task Management', 'Local Data Only', 'Standard Stats'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <div className="w-1 h-1 bg-zinc-500"></div> {item}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleInitClick('free')}
                            className="w-full py-4 border border-zinc-700 text-zinc-400 font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all"
                        >
                            Initialize Standard
                        </button>
                    </div>
                  </FadeIn>

                  {/* Premium Tier */}
                  <FadeIn delay={0.2} className="h-full">
                    <div className="relative p-8 border border-white bg-zinc-900/50 flex flex-col h-full shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                        <div className="absolute top-0 right-0 bg-white text-black text-[10px] font-bold uppercase px-3 py-1">
                            Recommended
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Obsidian</h3>
                            <div className="text-4xl font-bold font-mono">$12<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
                            <p className="text-xs text-green-500 mt-2 uppercase tracking-wider">Full Access</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {['Everything in Standard', 'Neural Audio (Focus Sounds)', 'Hyperspace (Zen Mode)', 'Cloud Sync & Backup', 'Advanced Analytics'].map(item => (
                                <li key={item} className="flex items-center gap-3 text-sm text-white">
                                    <div className="w-1.5 h-1.5 bg-green-500"></div> {item}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => handleInitClick('premium')}
                            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        >
                            Initialize Obsidian
                        </button>
                    </div>
                  </FadeIn>
              </div>
          </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 border-b border-zinc-800 bg-zinc-950">
          <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 text-center">Knowledge Base</h2>
              <div className="space-y-4">
                  {[
                      { q: "Is this good for ADHD?", a: "Yes. The interface is specifically designed to reduce visual clutter and provide immediate feedback (XP) which is highly effective for ADHD brains." },
                      { q: "Why not just use a phone timer?", a: "Phones are distraction machines. LockedIn runs on your computer and creates a dedicated 'work environment' that helps trigger your brain into focus mode." },
                      { q: "What is Brownian Noise?", a: "It's like white noise, but deeper. It sounds like a heavy waterfall or distant thunder. It's proven to help calm the mind and block out sudden noises." },
                      { q: "Does the free version expire?", a: "No. You can use the Standard tier forever. It includes the core timer and task list." }
                  ].map((item, i) => (
                      <div key={i} className="border border-zinc-800 bg-black p-6">
                          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                              <span className="text-green-500">?</span> {item.q}
                          </h3>
                          <p className="text-zinc-500 text-sm leading-relaxed pl-5 border-l border-zinc-900">
                              {item.a}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-black text-center border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-[10px] uppercase tracking-widest text-zinc-600">
                  LockedIn Corp © 2024
              </div>
              
              <div className="flex flex-col items-center md:items-end">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                      System Architect
                  </div>
                  <div className="font-bold text-white tracking-wide">
                      Edidiong Mfon
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};
