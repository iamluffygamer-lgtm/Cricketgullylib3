/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Share2, Download } from 'lucide-react';
import { Match, Ball } from '../types';
import { calculateInningsStats, getBatterStats, getBowlerStats } from '../services/scoringLogic';

interface ScorecardProps {
  match: Match;
  onBack: () => void;
}

export const Scorecard: React.FC<ScorecardProps> = ({ match, onBack }) => {
  const innings = match.innings[0]; // For now, just showing first innings
  const stats = innings ? calculateInningsStats(innings) : null;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 bg-slate-800 rounded-lg" id="scorecard-back-btn">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Match Scorecard</h1>
        <div className="flex gap-2">
           <button className="p-2 bg-slate-800 rounded-lg" id="scorecard-share-btn"><Share2 className="w-5 h-5 text-slate-400" /></button>
        </div>
      </div>

      {!stats ? (
        <div className="text-center py-20 text-slate-500">No data available</div>
      ) : (
        <div className="space-y-6">
          <div className="terminal-card bg-brand-primary p-6 text-slate-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-2xl uppercase tracking-tighter">{match.teamA.name}</h2>
              <div className="text-right">
                <div className="text-4xl font-black">{stats.runs}/{stats.wickets}</div>
                <div className="text-sm font-bold opacity-70">Overs {stats.overs}.{stats.ballsInOver}</div>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-60">CRR: {stats.rr}</div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Batting</h3>
            <div className="terminal-card">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="px-4 py-2">Batter</th>
                    <th className="px-4 py-2 text-center">R</th>
                    <th className="px-4 py-2 text-center">B</th>
                    <th className="px-4 py-2 text-center">4s</th>
                    <th className="px-4 py-2 text-center">6s</th>
                    <th className="px-4 py-2 text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {/* In a real app, we'd map through all batters. Showing mock for now. */}
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-bold">Striker <span className="text-[10px] text-brand-primary ml-1">*</span></td>
                    <td className="px-4 py-3 text-center font-mono">12</td>
                    <td className="px-4 py-3 text-center font-mono">8</td>
                    <td className="px-4 py-3 text-center font-mono">1</td>
                    <td className="px-4 py-3 text-center font-mono">1</td>
                    <td className="px-4 py-3 text-right font-mono">150.0</td>
                  </tr>
                  <tr className="hover:bg-slate-800/20">
                    <td className="px-4 py-3 font-medium text-slate-300">Non-Striker</td>
                    <td className="px-4 py-3 text-center font-mono">8</td>
                    <td className="px-4 py-3 text-center font-mono">5</td>
                    <td className="px-4 py-3 text-center font-mono">1</td>
                    <td className="px-4 py-3 text-center font-mono">0</td>
                    <td className="px-4 py-3 text-right font-mono">160.0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Bowling</h3>
            <div className="terminal-card">
              <table className="w-full text-sm text-left">
                 <thead>
                    <tr className="bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="px-4 py-2">Bowler</th>
                      <th className="px-4 py-2 text-center">O</th>
                      <th className="px-4 py-2 text-center">R</th>
                      <th className="px-4 py-2 text-center">W</th>
                      <th className="px-4 py-2 text-right">ECO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-800/20">
                      <td className="px-4 py-3 font-bold">Bowler 1</td>
                      <td className="px-4 py-3 text-center font-mono">0.4</td>
                      <td className="px-4 py-3 text-center font-mono">6</td>
                      <td className="px-4 py-3 text-center font-mono">0</td>
                      <td className="px-4 py-3 text-right font-mono">9.00</td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>

          <div className="terminal-card p-4 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-500 uppercase">Extras</span>
            <div className="space-x-3 font-mono">
              <span>WD: {stats.extras.wide}</span>
              <span>NB: {stats.extras.noBall}</span>
              <span>B/LB: {stats.extras.bye + stats.extras.legBye}</span>
              <span className="text-brand-primary font-bold">Total: {stats.extras.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
