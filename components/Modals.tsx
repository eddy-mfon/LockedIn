
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { X, Crown, CheckCircle, Activity } from 'lucide-react';

export const UpgradeModal = ({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
    <div className="bg-zinc-950 border border-white/20 w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(255,255,255,0.05)]">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>

      <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
        <X size={20} />
      </button>

      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center text-black mx-auto mb-4 shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            <Crown size={24} fill="currentColor" />
        </div>
        <h2 className="font-mono text-xl text-white uppercase tracking-widest mb-2">Upgrade Clearance</h2>
        <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-white/10 border border-white/20 text-white text-[10px] uppercase font-mono tracking-widest">
            Obsidian Protocol
        </div>
      </div>

      <div className="space-y-4 mb-8">
          {[
              "Multi-Device Cloud Sync",
              "Neural Audio Engine (Focus Sounds)",
              "Hyperspace (Zen) Mode",
              "Encrypted Data Backup",
              "Advanced Career Analytics"
          ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-sm font-mono text-zinc-300">
                  <div className="text-green-500"><CheckCircle size={14} /></div>
                  {feat}
              </div>
          ))}
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 p-4 mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-pulse-slow pointer-events-none"></div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Monthly Subscription</div>
          <div className="text-3xl font-mono font-bold text-white">$12<span className="text-sm text-zinc-600 font-normal">/mo</span></div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-4 bg-white text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all mb-3 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
      >
        Initiate Transfer
      </button>
      <button
        onClick={onClose}
        className="w-full py-3 text-zinc-500 font-mono text-xs uppercase tracking-widest hover:text-white transition-all border border-transparent hover:border-zinc-800"
      >
        Abort
      </button>
    </div>
  </div>
);

export const PreFlightModal = ({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) => {
    const [checks, setChecks] = useState({
        network: false,
        bio: false,
        target: false
    });

    const allChecked = checks.network && checks.bio && checks.target;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(0,255,0,0.05)]">
                 <div className="text-center mb-8">
                    <div className="text-green-500 mb-2 flex justify-center"><Activity size={32} /></div>
                    <h2 className="font-mono text-xl text-white uppercase tracking-widest mb-2">System Diagnostics</h2>
                    <p className="text-xs font-mono text-zinc-500">Verify readiness before engaging flow state.</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div 
                        onClick={() => setChecks(prev => ({...prev, network: !prev.network}))}
                        className={`p-4 border cursor-pointer transition-all flex items-center gap-4 ${checks.network ? 'bg-green-900/20 border-green-500/50 text-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                        <div className={`w-5 h-5 border flex items-center justify-center ${checks.network ? 'border-green-500 bg-green-500 text-black' : 'border-zinc-600'}`}>
                            {checks.network && <CheckCircle size={14} />}
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold font-mono uppercase tracking-wider">Network Isolation</div>
                            <div className="text-[10px] font-mono opacity-70">External communications silenced/disabled.</div>
                        </div>
                    </div>

                    <div 
                        onClick={() => setChecks(prev => ({...prev, bio: !prev.bio}))}
                        className={`p-4 border cursor-pointer transition-all flex items-center gap-4 ${checks.bio ? 'bg-green-900/20 border-green-500/50 text-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                        <div className={`w-5 h-5 border flex items-center justify-center ${checks.bio ? 'border-green-500 bg-green-500 text-black' : 'border-zinc-600'}`}>
                             {checks.bio && <CheckCircle size={14} />}
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold font-mono uppercase tracking-wider">Bio-Support</div>
                            <div className="text-[10px] font-mono opacity-70">Hydration and environment optimized.</div>
                        </div>
                    </div>

                     <div 
                        onClick={() => setChecks(prev => ({...prev, target: !prev.target}))}
                        className={`p-4 border cursor-pointer transition-all flex items-center gap-4 ${checks.target ? 'bg-green-900/20 border-green-500/50 text-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                    >
                        <div className={`w-5 h-5 border flex items-center justify-center ${checks.target ? 'border-green-500 bg-green-500 text-black' : 'border-zinc-600'}`}>
                             {checks.target && <CheckCircle size={14} />}
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-bold font-mono uppercase tracking-wider">Target Lock</div>
                            <div className="text-[10px] font-mono opacity-70">Primary objective clearly defined.</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 py-3 text-zinc-500 font-mono text-xs uppercase hover:text-white border border-transparent hover:border-zinc-800">
                        Abort
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={!allChecked}
                        className={`flex-1 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all ${allChecked ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'}`}
                    >
                        {allChecked ? 'Engage Protocol' : 'Systems Check Pending'}
                    </button>
                </div>
            </div>
        </div>
    )
}
