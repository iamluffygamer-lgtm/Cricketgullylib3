/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Match } from './types';
import { storage } from './services/storage';
import { Dashboard } from './components/Dashboard';
import { MatchSetup } from './components/MatchSetup';
import { ScoringPage } from './components/ScoringPage';
import { Scorecard } from './components/Scorecard';

type View = 'dashboard' | 'setup' | 'scoring' | 'scorecard';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    setMatches(storage.getMatches().sort((a, b) => b.createdAt - a.createdAt));
  }, [view]);

  const handleStartMatch = (match: Match) => {
    storage.saveMatch(match);
    setCurrentMatch(match);
    setView('scoring');
  };

  const handleSelectMatch = (match: Match) => {
    setCurrentMatch(match);
    setView('scoring');
  };

  const handleExitScoring = () => {
    setView('dashboard');
    setCurrentMatch(null);
  };

  return (
    <div className="min-h-screen bg-surface">
      <AnimatePresence mode="wait">
        {view === 'dashboard' && (
          <Dashboard 
            key="dashboard"
            recentMatches={matches}
            onNewMatch={() => setView('setup')}
            onSelectMatch={handleSelectMatch}
          />
        )}
        
        {view === 'setup' && (
          <MatchSetup 
            key="setup"
            onStart={handleStartMatch}
            onCancel={() => setView('dashboard')}
          />
        )}

        {view === 'scoring' && currentMatch && (
          <ScoringPage
            key="scoring"
            match={currentMatch}
            onExit={handleExitScoring}
            onViewScorecard={() => setView('scorecard')}
          />
        )}

        {view === 'scorecard' && currentMatch && (
          <Scorecard
            key="scorecard"
            match={currentMatch}
            onBack={() => setView('scoring')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
