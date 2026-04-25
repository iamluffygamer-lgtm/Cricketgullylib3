/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trophy, History, Settings, ChevronRight, Users, Calendar } from 'lucide-react';
import { Match, Team, MatchSettings } from './types';
import { storage } from './services/storage';

interface MatchSetupProps {
  onStart: (match: Match) => void;
  onCancel: () => void;
}

export const MatchSetup: React.FC<MatchSetupProps> = ({ onStart, onCancel }) => {
  const [teamA, setTeamA] = useState('Team A');
  const [teamB, setTeamB] = useState('Team B');
  const [overs, setOvers] = useState(5);
  const [playersPerTeam, setPlayersPerTeam] = useState(11);

  const handleStart = () => {
    const newMatch: Match = {
      id: Math.random().toString(36).substr(2, 9),
      teamA: { id: 'team_a', name: teamA, playerIds: [] },
      teamB: { id: 'team_b', name: teamB, playerIds: [] },
      settings: {
        totalOvers: overs,
        playersPerTeam,
        isTestMode: false,
        wideValue: 1,
        noBallValue: 1,
      },
      status: 'upcoming',
      innings: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onStart(newMatch);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto p-6"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-primary/10 rounded-xl">
          <Trophy className="w-8 h-8 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">New Match</h1>
          <p className="text-slate-400 text-sm">Configure your local series</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="terminal-card p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Team Names</label>
            <div className="space-y-2">
              <input
                type="text"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
                placeholder="Team A Name"
                className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:border-brand-primary outline-none transition-colors"
                id="team-a-input"
              />
              <input
                type="text"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
                placeholder="Team B Name"
                className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:border-brand-primary outline-none transition-colors"
                id="team-b-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Overs</label>
              <input
                type="number"
                value={overs}
                onChange={(e) => setOvers(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:border-brand-primary outline-none"
                id="overs-input"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Players/Team</label>
              <input
                type="number"
                value={playersPerTeam}
                onChange={(e) => setPlayersPerTeam(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700/50 rounded-lg px-4 py-3 text-sm focus:border-brand-primary outline-none"
                id="players-input"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-brand-primary hover:bg-emerald-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
          id="start-match-btn"
        >
          Start Scoring <ChevronRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={onCancel}
          className="w-full bg-transparent border border-slate-700 text-slate-300 font-medium py-3 rounded-xl hover:bg-slate-800 transition-all"
          id="cancel-match-btn"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};
