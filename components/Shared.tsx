
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Zap, Trophy, Activity, Lock } from 'lucide-react';
import { Toast } from '../types';

export function BrainIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    )
}

export const ToastContainer = ({ toasts }: { toasts: Toast[] }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`
            min-w-[200px] p-4 border backdrop-blur-md shadow-2xl animate-fade-in-up
            ${toast.type === 'xp' ? 'bg-zinc-900/90 border-green-500/50 text-green-400' : ''}
            ${toast.type === 'unlock' ? 'bg-yellow-900/90 border-yellow-500/50 text-yellow-500' : ''}
            ${toast.type === 'system' ? 'bg-zinc-900/90 border-zinc-700 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-red-200' : ''}
          `}
        >
          <div className="flex items-center gap-3">
             {toast.type === 'xp' && <Zap size={16} fill="currentColor" />}
             {toast.type === 'unlock' && <Trophy size={16} fill="currentColor" />}
             {toast.type === 'system' && <Activity size={16} />}
             {toast.type === 'error' && <Lock size={16} />}
             <div>
               <div className="text-[10px] font-mono uppercase opacity-70 tracking-wider">
                 {toast.type === 'xp' ? 'Experience Gain' : toast.type === 'unlock' ? 'Achievement' : 'System Log'}
               </div>
               <div className="font-mono text-xs font-bold">{toast.message}</div>
             </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export const ActivityHeatmap = () => {
    return (
        <div className="w-full overflow-hidden">
            <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Data Upload Frequency</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Last 365 Days</span>
            </div>
            <div className="flex flex-wrap gap-[2px]">
                {Array.from({ length: 168 }).map((_, i) => {
                    const intensity = Math.random();
                    let bg = 'bg-zinc-900';
                    if (intensity > 0.9) bg = 'bg-white';
                    else if (intensity > 0.7) bg = 'bg-zinc-400';
                    else if (intensity > 0.4) bg = 'bg-zinc-700';
                    
                    return (
                        <div key={i} className={`w-2 h-2 ${bg} rounded-[1px]`} title="Data Point"></div>
                    )
                })}
            </div>
        </div>
    )
}
