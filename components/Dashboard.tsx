
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, CheckCircle, Play, Pause, RotateCcw, LayoutGrid, 
  List, LogOut, Battery, Headphones, Maximize2, Minimize2, 
  FileText, Volume2, VolumeX, Crown, Hexagon, Trophy, Award,
  Keyboard, Save, Cloud, CloudOff, Bold, Italic, Code, Heading, Eye, EyeOff
} from 'lucide-react';

import { FocusMonolithScene } from './QuantumScene';
import { ProductivityChart } from './Diagrams';
import { ToastContainer, ActivityHeatmap } from './Shared';
import { UpgradeModal, PreFlightModal } from './Modals';
import { useNeuralAudio } from '../hooks/useNeuralAudio';
import { Tier, Toast, ToastType } from '../types';
import { RANK_TITLES, XP_PER_LEVEL, ACHIEVEMENTS } from '../constants';

export const Dashboard = ({ onLogout, tier, onUpgrade }: { onLogout: () => void, tier: Tier, onUpgrade: () => void }) => {
    const [activeTab, setActiveTab] = useState<'focus' | 'tasks' | 'stats' | 'notes'>('focus');
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [totalTime, setTotalTime] = useState(25 * 60); 
    const [zenMode, setZenMode] = useState(false);
    const [taskInput, setTaskInput] = useState('');
    const [scratchpad, setScratchpad] = useState('// COMMAND LOG\n// Use this space for quick data entry...');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false); 
    const [showPreFlight, setShowPreFlight] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { isPlaying, toggleAudio, volume, setVolume } = useNeuralAudio();
    const [toasts, setToasts] = useState<Toast[]>([]);

    // GAMIFICATION STATE
    const [xp, setXp] = useState(0);
    const [sessionCount, setSessionCount] = useState(0);
    const [tasksCompletedCount, setTasksCompletedCount] = useState(0);
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

    const level = Math.floor(xp / XP_PER_LEVEL);
    const xpProgress = (xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100;
    const currentRank = RANK_TITLES[Math.min(level, RANK_TITLES.length - 1)];

    const [tasks, setTasks] = useState<{id: number, text: string, completed: boolean}[]>([
        {id: 1, text: "Review System Architecture", completed: false},
        {id: 2, text: "Update Documentation", completed: true},
    ]);

    // Toast Helper
    const addToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    };

    // XP & Level Logic
    const gainXp = (amount: number, reason: string) => {
        setXp(prev => prev + amount);
        addToast(`+${amount} XP: ${reason}`, 'xp');
    };

    // Track Level Up
    const prevLevelRef = useRef(level);
    useEffect(() => {
        if (level > prevLevelRef.current) {
            addToast(`RANK PROMOTION: ${currentRank}`, 'unlock');
        }
        prevLevelRef.current = level;
    }, [level, currentRank]);

    // Track Achievements
    useEffect(() => {
        const newUnlocked = ACHIEVEMENTS.filter(ach => {
            if (unlockedAchievements.includes(ach.id)) return false;
            if (ach.id === 'first_blood') return sessionCount >= 1;
            if (ach.id === 'task_force') return tasksCompletedCount >= 5;
            if (ach.id === 'deep_work') return xp >= 1000;
            if (ach.id === 'obsidian') return tier === 'premium';
            return false;
        }).map(a => a.id);

        if (newUnlocked.length > 0) {
            setUnlockedAchievements(prev => [...prev, ...newUnlocked]);
            newUnlocked.forEach(id => {
                const ach = ACHIEVEMENTS.find(a => a.id === id);
                if (ach) addToast(`ACHIEVEMENT UNLOCKED: ${ach.name}`, 'unlock');
            });
        }
    }, [sessionCount, tasksCompletedCount, xp, tier, unlockedAchievements]);

    // Auto-save Scratchpad
    useEffect(() => {
        const saved = localStorage.getItem('lockedin_scratchpad');
        if (saved) setScratchpad(saved);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem('lockedin_scratchpad', scratchpad);
            setLastSaved(new Date());
        }, 30000);
        return () => clearInterval(interval);
    }, [scratchpad]);

    // KEYBOARD SHORTCUTS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
             if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

             switch(e.code) {
                 case 'Space':
                    e.preventDefault();
                    if (isActive) toggleTimer(); 
                    else if (!showPreFlight) setShowPreFlight(true);
                    break;
                 case 'KeyM':
                    if (tier === 'premium') toggleAudio();
                    else handleFeatureLock();
                    break;
                 case 'KeyZ':
                    if (tier === 'premium') setZenMode(prev => !prev);
                    else handleFeatureLock();
                    break;
                 case 'Escape':
                    setZenMode(false);
                    setShowUpgradeModal(false);
                    setShowPreFlight(false);
                    break;
             }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isActive, tier, showPreFlight]);

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            gainXp(100, "SESSION COMPLETE");
            setSessionCount(prev => prev + 1);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => {
        if (!isActive) {
            setShowPreFlight(true);
        } else {
            setIsActive(false);
        }
    }
    
    const confirmStart = () => {
        setShowPreFlight(false);
        setIsActive(true);
    }

    const resetTimer = () => { setIsActive(false); setTimeLeft(totalTime); };
    const setTimerDuration = (mins: number) => {
        setIsActive(false);
        setTimeLeft(mins * 60);
        setTotalTime(mins * 60);
    };
    
    const handleFeatureLock = () => {
        setShowUpgradeModal(true);
    }

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if(!taskInput.trim()) return;
        setTasks([...tasks, { id: Date.now(), text: taskInput, completed: false }]);
        setTaskInput('');
    }

    const toggleTask = (id: number) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                if (!t.completed) {
                    gainXp(50, "TASK EXECUTED");
                    setTasksCompletedCount(prev => prev + 1);
                } else {
                     setXp(prev => Math.max(0, prev - 50));
                     setTasksCompletedCount(prev => Math.max(0, prev - 1));
                }
                return { ...t, completed: !t.completed };
            }
            return t;
        }));
    }

    const isAchievementUnlocked = (id: string) => {
        return unlockedAchievements.includes(id);
    }

    const insertFormat = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = scratchpad;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = before + prefix + selection + suffix + after;
        setScratchpad(newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const renderPreview = (text: string) => {
        const blocks = text.split(/(```[\s\S]*?```)/g);
        return blocks.map((block, i) => {
            if (block.startsWith('```') && block.endsWith('```')) {
                const content = block.slice(3, -3);
                return <pre key={i} className="bg-zinc-900 p-4 rounded border border-zinc-800 my-2 overflow-x-auto text-xs text-green-400"><code>{content}</code></pre>
            }
            return (
                <div key={i}>
                    {block.split('\n').map((line, j) => {
                        if (line.trim() === '') return <div key={j} className="h-4"></div>;
                        let content = line;
                        let className = "text-zinc-300 min-h-[1.5em]";
                        if (line.startsWith('# ')) {
                            content = line.slice(2);
                            className = "text-xl font-bold text-white mt-4 mb-2 border-b border-zinc-800 pb-1";
                        } else if (line.startsWith('## ')) {
                            content = line.slice(3);
                            className = "text-lg font-bold text-white mt-3 mb-1";
                        } else if (line.startsWith('- ')) {
                            content = line.slice(2);
                            return <div key={j} className="flex gap-2 ml-4"><span className="text-zinc-500">•</span> <span className="text-zinc-300">{parseInline(content)}</span></div>;
                        }
                        return <div key={j} className={className}>{parseInline(content)}</div>;
                    })}
                </div>
            )
        })
    }

    const parseInline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="text-white">{part.slice(2, -2)}</strong>;
            if (part.startsWith('*') && part.endsWith('*')) return <em key={index} className="text-zinc-400">{part.slice(1, -1)}</em>;
            if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="bg-zinc-800 px-1 rounded text-green-400 font-mono text-xs">{part.slice(1, -1)}</code>;
            return part;
        });
    }

    return (
        <div className={`min-h-screen bg-black text-white font-mono flex relative ${zenMode ? 'overflow-hidden' : ''}`}>
            
            <ToastContainer toasts={toasts} />

            {/* UPGRADE MODAL */}
            {showUpgradeModal && (
                <UpgradeModal 
                    onClose={() => setShowUpgradeModal(false)} 
                    onConfirm={() => {
                        onUpgrade();
                        setShowUpgradeModal(false);
                    }} 
                />
            )}

            {/* PRE-FLIGHT DIAGNOSTICS */}
            {showPreFlight && (
                <PreFlightModal 
                    onClose={() => setShowPreFlight(false)}
                    onConfirm={confirmStart}
                />
            )}

            {/* HYPERSPACE (ZEN MODE) OVERLAY */}
            {zenMode && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                         <FocusMonolithScene />
                    </div>
                    
                    <button onClick={() => setZenMode(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors z-50">
                        <Minimize2 size={24} />
                    </button>

                    <div className="relative z-10 text-center">
                        <div className="text-[12rem] font-bold font-mono tracking-tighter leading-none text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-zinc-500 uppercase tracking-[0.5em] mt-8 text-sm animate-pulse">
                            {isActive ? 'System Locked // Deep Work Active' : 'System Idle'}
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center gap-8">
                             <button onClick={() => setIsActive(!isActive)} className="p-4 rounded-full border border-zinc-800 bg-black/50 hover:bg-white hover:text-black transition-all">
                                {isActive ? <Pause size={32}/> : <Play size={32}/>}
                             </button>
                             <button onClick={toggleAudio} className={`p-4 rounded-full border transition-all ${isPlaying ? 'bg-white text-black border-white' : 'border-zinc-800 bg-black/50 text-zinc-500'}`}>
                                <Headphones size={32}/>
                             </button>
                        </div>
                        <div className="mt-12 text-[10px] text-zinc-600 font-mono">
                            PRESS ESC TO EXIT // PRESS SPACE TO TOGGLE
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-16 md:w-64 border-r border-zinc-800 flex flex-col justify-between bg-zinc-950 z-20">
                <div>
                    <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-zinc-800">
                        <Lock size={20} className="md:mr-3" />
                        <span className="hidden md:block font-bold tracking-widest">LOCKED<span className="text-zinc-600">IN</span></span>
                        {tier === 'premium' && (
                            <div className="hidden md:flex ml-2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                        )}
                    </div>

                    {/* XP WIDGET */}
                    <div className="hidden md:block p-6 border-b border-zinc-800">
                         <div className="flex justify-between items-end mb-2">
                             <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Operator Rank</span>
                             <span className="text-[10px] text-white font-bold uppercase tracking-widest">{currentRank}</span>
                         </div>
                         <div className="h-1 w-full bg-zinc-800 relative overflow-hidden">
                             <div 
                                className="absolute top-0 left-0 h-full bg-white transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                style={{ width: `${xpProgress}%` }}
                             ></div>
                         </div>
                         <div className="mt-2 text-[10px] text-zinc-600 flex justify-between font-mono">
                             <span>LVL {level}</span>
                             <span>{xp} XP</span>
                         </div>
                    </div>

                    <nav className="flex flex-col">
                        <button 
                            onClick={() => setActiveTab('focus')}
                            className={`h-12 flex items-center justify-center md:justify-start md:px-6 hover:bg-zinc-900 transition-colors ${activeTab === 'focus' ? 'bg-zinc-900 border-l-2 border-white' : 'text-zinc-500'}`}
                        >
                            <LayoutGrid size={18} className="md:mr-3" />
                            <span className="hidden md:block text-xs uppercase tracking-wider">Focus</span>
                        </button>
                        <button 
                             onClick={() => setActiveTab('tasks')}
                            className={`h-12 flex items-center justify-center md:justify-start md:px-6 hover:bg-zinc-900 transition-colors ${activeTab === 'tasks' ? 'bg-zinc-900 border-l-2 border-white' : 'text-zinc-500'}`}
                        >
                            <List size={18} className="md:mr-3" />
                            <span className="hidden md:block text-xs uppercase tracking-wider">Objectives</span>
                        </button>
                        <button 
                             onClick={() => setActiveTab('notes')}
                            className={`h-12 flex items-center justify-center md:justify-start md:px-6 hover:bg-zinc-900 transition-colors ${activeTab === 'notes' ? 'bg-zinc-900 border-l-2 border-white' : 'text-zinc-500'}`}
                        >
                            <FileText size={18} className="md:mr-3" />
                            <span className="hidden md:block text-xs uppercase tracking-wider">Command Log</span>
                        </button>
                         <button 
                             onClick={() => setActiveTab('stats')}
                            className={`h-12 flex items-center justify-center md:justify-start md:px-6 hover:bg-zinc-900 transition-colors ${activeTab === 'stats' ? 'bg-zinc-900 border-l-2 border-white' : 'text-zinc-500'}`}
                        >
                            <div className="relative">
                                <Trophy size={18} className="md:mr-3" />
                                {unlockedAchievements.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full md:hidden"></span>}
                            </div>
                            <span className="hidden md:flex items-center text-xs uppercase tracking-wider">
                                Career Record
                            </span>
                        </button>
                    </nav>
                </div>
                
                <div className="border-t border-zinc-800">
                     {tier === 'free' && (
                         <div className="p-4 hidden md:block">
                             <button onClick={() => setShowUpgradeModal(true)} className="w-full py-3 bg-zinc-900 border border-zinc-700 hover:border-white transition-colors flex items-center justify-center gap-2 group">
                                 <Crown size={14} className="text-white group-hover:scale-110 transition-transform" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white">Upgrade</span>
                             </button>
                         </div>
                     )}
                     <button onClick={onLogout} className="flex items-center justify-center md:justify-start w-full text-zinc-500 hover:text-white transition-colors h-12 md:px-6">
                        <LogOut size={18} className="md:mr-3" />
                        <span className="hidden md:block text-xs uppercase tracking-wider">Disconnect</span>
                     </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col bg-tech-black relative z-10">
                {/* Header */}
                <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                         {tier === 'premium' ? (
                            <span className="flex items-center gap-2 text-green-500"><Cloud size={12} /> SYNCED</span>
                         ) : (
                             <button onClick={handleFeatureLock} className="flex items-center gap-2 text-zinc-600 hover:text-white transition-colors">
                                 <CloudOff size={12} /> <span className="hidden sm:inline">LOCAL ONLY</span>
                             </button>
                         )}
                        <span className="h-3 w-[1px] bg-zinc-800"></span>
                        <span className="flex items-center gap-2"><Battery size={12}/> 100%</span>
                        {tier === 'free' && (
                             <span className="hidden md:flex items-center gap-2 px-2 py-0.5 border border-zinc-800 bg-zinc-900 text-zinc-400 text-[10px] uppercase ml-4">Standard Clearance</span>
                        )}
                         {tier === 'premium' && (
                             <span className="hidden md:flex items-center gap-2 px-2 py-0.5 border border-white/20 bg-white/10 text-white text-[10px] uppercase ml-4 shadow-[0_0_10px_rgba(255,255,255,0.2)]">Obsidian Clearance</span>
                        )}
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Audio Controls Module */}
                        <div className={`flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded-sm border ${tier === 'free' ? 'border-zinc-800/50 opacity-50 cursor-not-allowed' : 'border-zinc-800/50'}`}>
                             <button 
                                onClick={tier === 'premium' ? toggleAudio : handleFeatureLock}
                                className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${isPlaying ? 'text-green-400' : 'text-zinc-600 hover:text-white'}`}
                            >
                                {tier === 'free' ? <Lock size={14} className="text-zinc-500"/> : (isPlaying ? <Volume2 size={14}/> : <VolumeX size={14}/>)}
                                <span className="hidden lg:inline">{tier === 'free' ? 'LOCKED' : (isPlaying ? 'ON' : 'OFF')}</span>
                            </button>
                            
                            <div className="w-[1px] h-3 bg-zinc-800"></div>

                            <div className="flex items-center gap-2 group">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => {
                                        if (tier === 'premium') setVolume(parseFloat(e.target.value));
                                        else handleFeatureLock();
                                    }}
                                    disabled={tier === 'free'}
                                    className={`w-16 md:w-20 h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-zinc-500 group-hover:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:transition-colors ${tier === 'free' ? 'pointer-events-none' : ''}`}
                                />
                                <span className="text-[10px] font-mono text-zinc-500 w-6 text-right">{tier === 'free' ? '--' : `${Math.round(volume * 100)}%`}</span>
                            </div>
                        </div>

                         <button 
                            onClick={tier === 'premium' ? () => setZenMode(true) : handleFeatureLock}
                            className={`flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors ${tier === 'free' ? 'text-zinc-600' : 'text-zinc-600 hover:text-white'}`}
                        >
                             {tier === 'free' ? <Lock size={16}/> : <Maximize2 size={16}/>}
                            <span className="hidden md:inline">Hyperspace</span>
                        </button>

                        <div className="w-[1px] h-4 bg-zinc-800"></div>

                        <div className="flex items-center gap-2 text-zinc-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono uppercase tracking-widest">System Active</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto relative">
                     {/* Background Grid */}
                     <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />

                     {activeTab === 'focus' && (
                         <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-full relative z-10">
                            <div className="mb-8 text-center">
                                <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-2">Current Session</h2>
                                <div className="text-8xl md:text-9xl font-bold font-mono tracking-tighter tabular-nums leading-none mb-6">
                                    {formatTime(timeLeft)}
                                </div>
                                {/* Timer Presets */}
                                <div className="flex justify-center gap-2 mb-8">
                                    {[25, 45, 90].map(m => (
                                        <button 
                                            key={m}
                                            onClick={() => setTimerDuration(m)}
                                            className={`px-3 py-1 text-[10px] font-mono border transition-all ${totalTime === m*60 ? 'bg-white text-black border-white font-bold' : 'text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
                                        >
                                            {m}M
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 mb-12">
                                <button onClick={toggleTimer} className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all overflow-hidden">
                                     <span className="relative z-10 flex items-center gap-2">
                                         {isActive ? <Pause size={16}/> : <Play size={16}/>} {isActive ? 'Pause Protocol' : 'Initiate Protocol'}
                                     </span>
                                </button>
                                <button onClick={resetTimer} className="px-6 py-4 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
                                    <RotateCcw size={16} />
                                </button>
                            </div>

                            <div className="w-full bg-zinc-900/50 border border-zinc-800 p-6 backdrop-blur-sm mb-6">
                                <div className="flex items-center justify-between mb-4">
                                     <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Active Objective</span>
                                     <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-[10px] uppercase border border-green-900/50">High Priority</span>
                                </div>
                                <div className="text-xl text-white font-light">
                                    {tasks.find(t => !t.completed)?.text || "No active tasks. Add one in Objectives."}
                                </div>
                            </div>
                            
                            {/* Key Bindings Legend */}
                            <div className="flex gap-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest opacity-50">
                                <span className="flex items-center gap-1"><Keyboard size={10}/> HOTKEYS:</span>
                                <span>[SPACE] Toggle</span>
                                <span>[M] Mute</span>
                                <span>[Z] Zen</span>
                            </div>
                         </div>
                     )}

                     {activeTab === 'tasks' && (
                         <div className="max-w-3xl mx-auto relative z-10">
                             <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                                <h2 className="text-2xl font-mono text-white uppercase tracking-tighter">Mission Log</h2>
                                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                                    Completed: {tasksCompletedCount} | XP Yield: {tasksCompletedCount * 50}
                                </div>
                             </div>
                             
                             <form onSubmit={addTask} className="flex gap-4 mb-8">
                                 <input 
                                    type="text" 
                                    value={taskInput}
                                    onChange={(e) => setTaskInput(e.target.value)}
                                    placeholder="Enter new directive..."
                                    className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
                                 />
                                 <button type="submit" className="bg-white text-black px-6 font-bold uppercase text-sm tracking-widest hover:bg-zinc-200">
                                     Add
                                 </button>
                             </form>

                             <div className="space-y-2">
                                 {tasks.map(task => (
                                     <div key={task.id} className={`group flex items-center justify-between p-4 border transition-all ${task.completed ? 'bg-zinc-900/30 border-zinc-900 text-zinc-600' : 'bg-zinc-900/80 border-zinc-800 text-white'}`}>
                                         <div className="flex items-center gap-4">
                                             <button onClick={() => toggleTask(task.id)} className={`w-5 h-5 border flex items-center justify-center transition-colors ${task.completed ? 'bg-zinc-800 border-zinc-800' : 'border-zinc-600 hover:border-white'}`}>
                                                 {task.completed && <CheckCircle size={12} />}
                                             </button>
                                             <span className={`font-mono text-sm ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                                         </div>
                                         <div className="text-[10px] uppercase font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500">
                                             {task.completed ? '+50 XP UPLOADED' : 'Pending'}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}

                     {activeTab === 'notes' && (
                        <div className="max-w-4xl mx-auto relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-4">
                                <h2 className="text-2xl font-mono text-white uppercase tracking-tighter">Command Log</h2>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase">
                                        {lastSaved ? 
                                            <span className="flex items-center gap-1 text-green-500"><Save size={10} /> Auto-Saved {lastSaved.toLocaleTimeString()}</span> : 
                                            <span>Ready</span>
                                        }
                                    </div>
                                    <button 
                                        onClick={() => setShowPreview(!showPreview)}
                                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all ${showPreview ? 'bg-zinc-900 text-white border-white' : 'text-zinc-500 border-zinc-800 hover:text-white'}`}
                                    >
                                        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                                        <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* FORMATTING TOOLBAR */}
                            {!showPreview && (
                                <div className="flex items-center gap-1 mb-2 bg-zinc-900/30 p-1 border border-zinc-800/50 self-start rounded-sm">
                                    <button onClick={() => insertFormat('**', '**')} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm" title="Bold"><Bold size={14}/></button>
                                    <button onClick={() => insertFormat('*', '*')} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm" title="Italic"><Italic size={14}/></button>
                                    <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
                                    <button onClick={() => insertFormat('# ', '')} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm" title="Heading"><Heading size={14}/></button>
                                    <button onClick={() => insertFormat('- ', '')} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm" title="List"><List size={14}/></button>
                                    <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
                                    <button onClick={() => insertFormat('`', '`')} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm" title="Inline Code"><Code size={14}/></button>
                                    <button onClick={() => insertFormat('```\n', '\n```')} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-sm" title="Code Block"><div className="text-[10px] font-bold font-mono">{'{}'}</div></button>
                                </div>
                            )}

                            <div className="flex-1 relative border border-zinc-800 bg-black/50 overflow-hidden">
                                {showPreview ? (
                                    <div className="w-full h-full p-6 text-zinc-300 font-mono text-sm leading-relaxed overflow-y-auto prose-invert">
                                        {renderPreview(scratchpad)}
                                    </div>
                                ) : (
                                    <textarea 
                                        ref={textareaRef}
                                        value={scratchpad}
                                        onChange={(e) => setScratchpad(e.target.value)}
                                        className="w-full h-full bg-transparent p-6 text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:bg-zinc-900/20"
                                        spellCheck={false}
                                    />
                                )}
                                {!showPreview && (
                                    <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600 pointer-events-none">
                                        {scratchpad.length} CHARS
                                    </div>
                                )}
                            </div>
                        </div>
                     )}

                     {activeTab === 'stats' && (
                         <div className="max-w-4xl mx-auto relative z-10">
                             <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
                                <h2 className="text-2xl font-mono text-white uppercase tracking-tighter">Career Record</h2>
                                {tier === 'free' && (
                                    <div className="flex items-center gap-2 text-white font-mono text-xs uppercase tracking-wider">
                                        <Lock size={14} /> Global Leaderboard Locked
                                    </div>
                                )}
                             </div>
                             
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 col-span-2">
                                     <div className="flex justify-between items-start mb-4">
                                         <div>
                                            <div className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Current Rank</div>
                                            <div className="text-2xl font-mono font-bold text-white">{currentRank}</div>
                                         </div>
                                         <Award className="text-zinc-700" size={32} />
                                     </div>
                                     <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                                         <div className="h-full bg-white transition-all duration-700" style={{ width: `${xpProgress}%` }}></div>
                                     </div>
                                     <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500">
                                         <span>EXP: {xp}</span>
                                         <span>NEXT: {(level + 1) * XP_PER_LEVEL}</span>
                                     </div>
                                </div>

                                <div className="p-6 bg-zinc-900/50 border border-zinc-800">
                                    <div className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Sessions</div>
                                    <div className="text-3xl font-mono font-bold">{sessionCount}</div>
                                </div>

                                <div className="p-6 bg-zinc-900/50 border border-zinc-800">
                                    <div className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Focus XP</div>
                                    <div className="text-3xl font-mono font-bold text-green-400">+{xp}</div>
                                </div>
                             </div>

                             {/* HEATMAP */}
                             <div className="mb-12 p-6 bg-zinc-900/20 border border-zinc-800">
                                <ActivityHeatmap />
                             </div>
                             
                             <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest mb-6">Protocol Achievements</h3>
                             
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                                 {ACHIEVEMENTS.map((ach) => {
                                     const unlocked = isAchievementUnlocked(ach.id);
                                     return (
                                        <div key={ach.id} className={`p-6 border flex flex-col items-center text-center transition-all ${unlocked ? 'bg-zinc-900/80 border-white/50' : 'bg-black border-zinc-800 opacity-50'}`}>
                                            <div className={`w-16 h-16 mb-4 flex items-center justify-center relative`}>
                                                <Hexagon size={64} className={`absolute ${unlocked ? 'text-white fill-white/10' : 'text-zinc-800 fill-zinc-900'}`} strokeWidth={1} />
                                                <ach.icon size={24} className={`relative z-10 ${unlocked ? 'text-white' : 'text-zinc-700'}`} />
                                            </div>
                                            <h4 className={`font-mono text-xs uppercase font-bold mb-2 ${unlocked ? 'text-white' : 'text-zinc-600'}`}>{ach.name}</h4>
                                            <p className="text-[10px] text-zinc-500 font-mono leading-tight">{ach.desc}</p>
                                            {unlocked && <div className="mt-3 px-2 py-0.5 bg-white text-black text-[9px] font-bold uppercase tracking-wider">Unlocked</div>}
                                        </div>
                                     )
                                 })}
                             </div>

                             <div className="border-t border-zinc-800 pt-8">
                                <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest mb-6">Efficiency Delta</h3>
                                <ProductivityChart />
                             </div>
                         </div>
                     )}
                </div>
            </main>
        </div>
    )
}
