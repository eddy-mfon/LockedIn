
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { BootSequence } from './components/BootSequence';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { Tier } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'booting' | 'app'>('landing');
  const [tier, setTier] = useState<Tier>('free');

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lockedin_username');
    const savedTier = localStorage.getItem('lockedin_tier') as Tier;
    
    if (savedUser) {
        if (savedTier) setTier(savedTier);
        setView('app'); // Skip boot sequence on re-entry for faster app feel
    }
  }, []);

  const handleStart = (selectedTier: Tier) => {
      setTier(selectedTier);
      localStorage.setItem('lockedin_tier', selectedTier);
      setView('booting');
  };

  const handleBootComplete = () => {
      setView('app');
  };

  const handleUpgrade = () => {
      setTier('premium');
      localStorage.setItem('lockedin_tier', 'premium');
  };

  const handleLogout = () => {
      localStorage.removeItem('lockedin_username');
      localStorage.removeItem('lockedin_tier');
      setTier('free');
      setView('landing');
  };

  return (
    <>
      {view === 'landing' && <LandingPage onStart={handleStart} />}
      {view === 'booting' && <BootSequence onComplete={handleBootComplete} />}
      {view === 'app' && <Dashboard onLogout={handleLogout} tier={tier} onUpgrade={handleUpgrade} />}
    </>
  );
};

export default App;
