
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Shield, Check, Mail, MessageSquare, Calendar, Brain, List, Bell, Zap, BarChart2, Activity } from 'lucide-react';

// --- FOCUS GRID DIAGRAM ---
export const FocusGridDiagram: React.FC = () => {
  // 3x3 grid of time blocks
  const [tasks, setTasks] = useState<number[]>([]);
  const [distractions, setDistractions] = useState<number[]>([]);
  const [shieldActive, setShieldActive] = useState(false);

  // Simulate random distractions appearing
  useEffect(() => {
    const interval = setInterval(() => {
        if (Math.random() > 0.6) {
             const id = Math.floor(Math.random() * 9);
             if (!tasks.includes(id)) {
                 setDistractions(prev => {
                     if (prev.includes(id)) return prev;
                     // If shield is active, block it immediately (don't add)
                     if (shieldActive) return prev; 
                     return [...prev, id];
                 });
                 // Auto remove after a bit
                 setTimeout(() => {
                    setDistractions(prev => prev.filter(d => d !== id));
                 }, 2000);
             }
        }
    }, 1500);
    return () => clearInterval(interval);
  }, [tasks, shieldActive]);

  const toggleTask = (id: number) => {
    setDistractions(prev => prev.filter(d => d !== id)); // Clear distraction if taking task
    setTasks(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-zinc-950/50 backdrop-blur-sm rounded-none border border-zinc-800 my-8 shadow-2xl">
      <div className="flex justify-between w-full mb-6 items-center border-b border-zinc-800 pb-4">
        <h3 className="font-mono text-sm text-white uppercase tracking-widest">:: Grid_Monitor</h3>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${shieldActive ? 'bg-green-500 animate-pulse' : 'bg-white'}`}></div>
            <span className="text-[10px] font-mono text-zinc-500">{shieldActive ? 'SECURE' : 'VULNERABLE'}</span>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6 w-full justify-center">
        <button 
            onClick={() => setShieldActive(!shieldActive)}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${shieldActive ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
        >
            <Shield size={12} /> {shieldActive ? "Deactivate Shield" : "Activate Shield"}
        </button>
      </div>

      <div className="relative w-64 h-64 bg-black border border-zinc-800 p-1 grid grid-cols-3 grid-rows-3 gap-1">
         {/* Grid Items */}
         {[...Array(9)].map((_, i) => (
             <button
                key={i}
                onClick={() => toggleTask(i)}
                className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden
                    ${tasks.includes(i) ? 'bg-zinc-900 border border-zinc-700' : 'bg-black border border-zinc-900 hover:border-zinc-700'}
                `}
             >
                {/* Task Active Indicator */}
                {tasks.includes(i) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full bg-[linear-gradient(45deg,#18181b_25%,transparent_25%,transparent_75%,#18181b_75%,#18181b),linear-gradient(45deg,#18181b_25%,transparent_25%,transparent_75%,#18181b_75%,#18181b)] bg-[length:10px_10px] opacity-50"></div>
                        <Check size={16} className="text-white relative z-10" />
                    </div>
                )}
                
                {/* Distraction Popup */}
                <AnimatePresence>
                    {distractions.includes(i) && !shieldActive && (
                        <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="absolute inset-0 bg-white flex items-center justify-center z-20"
                        >
                            <Bell size={16} className="text-black animate-shake" />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Shield Effect */}
                <AnimatePresence>
                    {shieldActive && distractions.includes(i) && (
                         <motion.div 
                         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                         className="absolute inset-0 bg-zinc-800/80 flex items-center justify-center z-30 border border-white/20"
                        >
                            <Shield size={14} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
             </button>
         ))}
      </div>

      <div className="mt-6 flex items-center gap-6 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          <div className="flex items-center gap-2"><div className="w-3 h-3 border border-zinc-700 bg-zinc-900"></div> Deep Work</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white"></div> Intrusion</div>
      </div>
      
    </div>
  );
};

// --- AI WORKFLOW DIAGRAM ---
export const AIWorkflowDiagram: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-zinc-900/30 rounded-none border border-zinc-800 my-8 relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

      <h3 className="font-mono text-sm mb-8 text-white uppercase tracking-widest border-b border-zinc-800 pb-2 w-full text-center">:: Processing_Unit</h3>

      <div className="relative w-full max-w-lg h-48 bg-black rounded-sm border border-zinc-800 flex items-center justify-center gap-8 p-4">
        
        {/* Input Stage */}
        <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${step === 0 ? 'border-white bg-zinc-900 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'border-zinc-800 text-zinc-700'}`}>
                <Activity size={20} />
            </div>
            <span className={`text-[9px] uppercase font-mono tracking-widest ${step === 0 ? 'text-white' : 'text-zinc-700'}`}>Input</span>
        </div>

        {/* Path 1 */}
        <div className="h-[1px] w-12 bg-zinc-800 relative">
            <motion.div 
                className="absolute top-[-1px] left-0 w-4 h-[3px] bg-white" 
                animate={{ x: step >= 1 ? 48 : 0, opacity: step >= 1 ? 0 : 1 }}
                transition={{ duration: 0.5 }}
            />
        </div>

        {/* Processing Stage (AI) */}
        <div className="flex flex-col items-center gap-3 relative">
             <div className={`w-16 h-16 border-2 flex items-center justify-center transition-all duration-300 ${step === 1 || step === 2 ? 'border-white bg-white text-black' : 'border-zinc-800 bg-black text-zinc-700'}`}>
                <Brain size={24} className={step === 1 || step === 2 ? 'animate-pulse' : ''} />
             </div>
             {step === 1 && <div className="absolute -top-4 text-[9px] font-mono text-white animate-pulse">ANALYZING...</div>}
             <span className={`text-[9px] uppercase font-mono tracking-widest ${step === 1 || step === 2 ? 'text-white' : 'text-zinc-700'}`}>Logic</span>
        </div>

        {/* Path 2 */}
        <div className="h-[1px] w-12 bg-zinc-800 relative">
            <motion.div 
                className="absolute top-[-1px] left-0 w-4 h-[3px] bg-white" 
                animate={{ x: step >= 3 ? 48 : 0, opacity: step >= 3 ? 0 : 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            />
        </div>

        {/* Output Stage */}
        <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 border flex items-center justify-center transition-all duration-300 ${step === 3 ? 'border-white bg-zinc-900 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'border-zinc-800 text-zinc-700'}`}>
                <List size={20} />
            </div>
            <span className={`text-[9px] uppercase font-mono tracking-widest ${step === 3 ? 'text-white' : 'text-zinc-700'}`}>Queue</span>
        </div>

      </div>

      <div className="flex gap-1 mt-8">
          {[0, 1, 2, 3].map(s => (
              <div key={s} className={`h-1 transition-all duration-300 ${step === s ? 'w-8 bg-white' : 'w-2 bg-zinc-800'}`}></div>
          ))}
      </div>
    </div>
  );
};

// --- PRODUCTIVITY CHART ---
export const ProductivityChart: React.FC = () => {
    const [view, setView] = useState<'hours' | 'tasks'>('hours');
    
    // Data comparison
    const data = {
        hours: { standard: 2.5, lockedin: 6.2, label: 'Deep Work (Hrs)' },
        tasks: { standard: 12, lockedin: 28, label: 'Task Velocity' }
    };

    const currentData = data[view];
    const maxVal = Math.max(currentData.standard, currentData.lockedin) * 1.25;
    
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-zinc-900/20 rounded-none border border-zinc-800 my-8">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-mono text-xl mb-2 text-white uppercase tracking-tight">Efficiency Delta</h3>
                <div className="h-[1px] w-12 bg-white mb-4"></div>
                <p className="text-zinc-500 text-sm mb-6 leading-relaxed font-mono">
                      &gt; Batching interruptions.<br/>
                      &gt; Maximizing flow state.<br/>
                      &gt; Result: <span className="text-white">Exponential output.</span>
                </p>
                <div className="flex gap-2 mt-6">
                    <button 
                        onClick={() => setView('hours')} 
                        className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all duration-200 border ${view === 'hours' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-600 border-zinc-800 hover:border-zinc-500 hover:text-white'}`}
                    >
                        Time
                    </button>
                    <button 
                        onClick={() => setView('tasks')} 
                        className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest transition-all duration-200 border ${view === 'tasks' ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-600 border-zinc-800 hover:border-zinc-500 hover:text-white'}`}
                    >
                        Velocity
                    </button>
                </div>
            </div>
            
            <div className="relative w-64 h-72 bg-black border border-zinc-800 p-6 flex justify-around items-end">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                   <div className="w-full h-[1px] bg-zinc-900 border-t border-zinc-900 border-dashed"></div>
                   <div className="w-full h-[1px] bg-zinc-900 border-t border-zinc-900 border-dashed"></div>
                   <div className="w-full h-[1px] bg-zinc-900 border-t border-zinc-900 border-dashed"></div>
                   <div className="w-full h-[1px] bg-zinc-900 border-t border-zinc-900 border-dashed"></div>
                </div>

                {/* Standard Bar */}
                <div className="w-16 flex flex-col justify-end items-center h-full z-10 group">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-8 w-full text-center text-[10px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-1 border border-zinc-800">{currentData.standard}</div>
                        <motion.div 
                            className="w-full bg-zinc-800 border-t border-x border-zinc-700 pattern-diagonal-lines-sm text-zinc-900"
                            initial={{ height: 0 }}
                            animate={{ height: `${(currentData.standard / maxVal) * 100}%` }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                        />
                    </div>
                    <div className="h-4 flex items-center text-[9px] font-bold text-zinc-600 uppercase tracking-widest">AVG</div>
                </div>

                {/* LockedIn Bar */}
                <div className="w-16 flex flex-col justify-end items-center h-full z-10 group">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <div className="absolute -top-8 w-full text-center text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-1 border border-white">{currentData.lockedin}</div>
                        <motion.div 
                            className="w-full bg-white relative overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                            initial={{ height: 0 }}
                            animate={{ height: Math.max(1, (currentData.lockedin / maxVal) * 100) + '%' }}
                            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                        >
                        </motion.div>
                    </div>
                     <div className="h-4 flex items-center text-[9px] font-bold text-white uppercase tracking-widest">PRO</div>
                </div>
            </div>
        </div>
    )
}
