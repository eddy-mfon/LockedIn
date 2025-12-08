
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';

export const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);

    const bootLogs = [
        "BIOS CHECK... OK",
        "LOADING KERNEL... LOCKED_IN_V2.4",
        "MOUNTING FILE SYSTEM... READ/WRITE",
        "INITIALIZING NEURAL INTERFACE...",
        "CHECKING PERIPHERALS...",
        "OPTIMIZING MEMORY STACK...",
        "ESTABLISHING SECURE CONNECTION...",
        "LOADING USER PREFERENCES...",
        "STARTING DAEMON PROCESSES...",
        "SYSTEM READY."
    ];

    useEffect(() => {
        let currentLog = 0;
        
        const logInterval = setInterval(() => {
            if (currentLog < bootLogs.length) {
                setLogs(prev => [...prev, bootLogs[currentLog]]);
                currentLog++;
            } else {
                clearInterval(logInterval);
            }
        }, 300);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return prev + Math.random() * 5;
            });
        }, 150);

        return () => {
            clearInterval(logInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 font-mono text-xs">
            <div className="w-full max-w-lg">
                <div className="mb-8 border border-zinc-800 p-6 bg-zinc-950/50 min-h-[300px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/20"></div>
                    {logs.map((log, i) => (
                        <div key={i} className="text-green-500 mb-1">
                            <span className="text-zinc-600 mr-2">[{new Date().toISOString().split('T')[1].split('.')[0]}]</span>
                            {log}
                        </div>
                    ))}
                    <div className="animate-pulse text-green-500 mt-1">_</div>
                    
                    {/* Scanline */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50"></div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-zinc-500 uppercase tracking-widest text-[10px]">
                        <span>System Boot</span>
                        <span>{Math.min(100, Math.floor(progress))}%</span>
                    </div>
                    <div className="h-1 bg-zinc-900 w-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-100 ease-out" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-8 text-zinc-700 text-[10px] uppercase tracking-[0.5em]">
                LockedIn Corp © 2024
            </div>
        </div>
    )
}
