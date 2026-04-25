/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Trophy, History, Plus, ChevronRight, Share2, Download } from 'lucide-react';
import { Match } from '../types';

interface DashboardProps {
  recentMatches: Match[];
  onNewMatch: () => void;
  onSelectMatch: (match: Match) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ recentMatches, onNewMatch, onSelectMatch }) => {
  const exportData = () => {
    const blob = new Blob([JSON.stringify(recentMatches, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cricket_matches_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">CricScorer<span className="text-brand-primary">.</span></h1>
          <p className="text-slate-400 text-sm">Gully Cricket Management Pro</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100" id="share-btn">
             <Share2 className="w-5 h-5" />
           </button>
           <button 
             onClick={exportData}
             className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100" 
             id="download-btn"
           >
             <Download className="w-5 h-5" />
           </button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNewMatch}
        className="w-full bg-brand-primary p-6 rounded-2xl flex items-center justify-between group mb-10 shadow-xl shadow-brand-primary/10"
        id="new-match-card-btn"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus className="text-white w-6 h-6" />
          </div>
          <div className="text-left text-slate-900">
            <h2 className="font-bold text-lg">Start New Match</h2>
            <p className="text-slate-900/70 text-sm">Ball-by-ball scoring engine</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="text-white" />
        </div>
      </motion.button>

      <div className="space-y-6">
        <div className="flex items-center gap-2 text-slate-400 uppercase text-xs font-bold tracking-widest px-2">
          <History className="w-4 h-4" />
          Recent Matches
        </div>

        {recentMatches.length === 0 ? (
          <div className="text-center py-12 terminal-card bg-transparent border-dashed">
            <p className="text-slate-500 italic">No match history found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentMatches.map((match) => (
              <motion.div
                key={match.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectMatch(match)}
                className="terminal-card p-4 hover:border-brand-primary/30 transition-colors cursor-pointer group"
                id={`match-history-${match.id}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                    match.status === 'live' ? 'bg-orange-500/20 text-orange-400' : 'bg-brand-primary/20 text-brand-primary'
                  }`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold">{match.teamA.name}</div>
                      <div className="text-slate-500 text-xs italic">vs</div>
                      <div className="text-xl font-bold">{match.teamB.name}</div>
                    </div>
                    <div className="text-slate-400 text-xs mt-1">
                      {match.settings.totalOvers} Overs • {match.status === 'finished' ? 'Match Completed' : 'Resumable'}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-brand-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
