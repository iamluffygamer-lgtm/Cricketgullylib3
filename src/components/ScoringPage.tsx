/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, RotateCcw, AlertTriangle, Users, Settings2, MoreHorizontal } from 'lucide-react';
import { Match, Ball, Innings } from '../types';
import { calculateInningsStats, getBatterStats, getBowlerStats } from '../services/scoringLogic';
import { storage } from '../services/storage';

interface ScoringPageProps {
  match: Match;
  onExit: () => void;
  onViewScorecard: () => void;
}

export const ScoringPage: React.FC<ScoringPageProps> = ({ match, onExit, onViewScorecard }) => {
  const [currentMatch, setCurrentMatch] = useState<Match>(match);
  
  // Initialize innings if empty
  useEffect(() => {
    if (currentMatch.innings.length === 0) {
      const firstInnings: Innings = {
        battingTeamId: currentMatch.teamA.id,
        bowlingTeamId: currentMatch.teamB.id,
        balls: [],
        fow: [],
        isCurrent: true,
      };
      const updated = { ...currentMatch, innings: [firstInnings], status: 'live' as const };
      setCurrentMatch(updated);
      storage.saveMatch(updated);
    }
  }, []);

  const innings = currentMatch.innings.find(i => i.isCurrent) || currentMatch.innings[0];
  const stats = innings ? calculateInningsStats(innings) : { runs: 0, wickets: 0, overs: 0, ballsInOver: 0, rr: '0.00' };

  // State for active players (using simple local state for now)
  const [strikerId, setStrikerId] = useState('batter_1');
  const [nonStrikerId, setNonStrikerId] = useState('batter_2');
  const [bowlerId, setBowlerId] = useState('bowler_1');

  const handleAddBall = (ballData: Partial<Ball>) => {
    if (!innings) return;

    const runs = ballData.run || 0;
    const isExtra = ballData.isWide || ballData.isNoBall;
    const isWicket = !!ballData.wicket;

    const newBall: Ball = {
      id: Math.random().toString(36).substr(2, 9),
      run: runs,
      isWide: ballData.isWide || false,
      isNoBall: ballData.isNoBall || false,
      isBye: ballData.isBye || false,
      isLegBye: ballData.isLegBye || false,
      wicket: ballData.wicket,
      batterId: strikerId,
      bowlerId: bowlerId,
      overNumber: stats.overs,
      ballInOver: stats.ballsInOver + (isExtra ? 0 : 1),
      timestamp: Date.now(),
    };

    // Strike rotation logic
    if (!isExtra && !isWicket) {
      if (runs % 2 !== 0) {
        setStrikerId(nonStrikerId);
        setNonStrikerId(strikerId);
      }
    } else if (ballData.isWide && (ballData.run || 0) % 2 !== 0) {
        // Switch strike on wide runs too if odd
        setStrikerId(nonStrikerId);
        setNonStrikerId(strikerId);
    }

    // Check for innings completion
    const isOversCompleted = !isExtra && stats.overs >= currentMatch.settings.totalOvers - 1 && stats.ballsInOver === 5;
    const isWicketsCompleted = stats.wickets + (isWicket ? 1 : 0) >= currentMatch.settings.playersPerTeam - 1;

    if (isOversCompleted || isWicketsCompleted) {
      if (currentMatch.innings.length === 1) {
         // Start second innings
         const secondInnings: Innings = {
            battingTeamId: currentMatch.teamB.id,
            bowlingTeamId: currentMatch.teamA.id,
            balls: [],
            fow: [],
            isCurrent: true,
         };
         const updatedMatch = { 
           ...currentMatch, 
           innings: [
             { ...currentMatch.innings[0], isCurrent: false },
             secondInnings
           ],
           status: 'live' as const
         };
         setCurrentMatch(updatedMatch);
         storage.saveMatch(updatedMatch);
         setStrikerId('batter_1');
         setNonStrikerId('batter_2');
         setBowlerId('bowler_1');
         return; // Skip the rest of the current ball logic as we switched
      } else {
        // Match Finished
        const updatedMatch = { ...currentMatch, status: 'finished' as const };
        setCurrentMatch(updatedMatch);
        storage.saveMatch(updatedMatch);
      }
    } else if (!isExtra && stats.ballsInOver === 5) {
      // Normal over rotation
      setStrikerId(nonStrikerId);
      setNonStrikerId(strikerId);
    }

    const updatedInnings = { ...innings, balls: [...innings.balls, newBall] };
    const updatedMatch = { 
      ...currentMatch, 
      innings: currentMatch.innings.map(i => i.isCurrent ? updatedInnings : i) 
    };
    
    setCurrentMatch(updatedMatch);
    storage.saveMatch(updatedMatch);
  };

  const undoLastBall = () => {
    if (!innings || innings.balls.length === 0) return;
    const updatedInnings = { ...innings, balls: innings.balls.slice(0, -1) };
    const updatedMatch = { 
      ...currentMatch, 
      innings: currentMatch.innings.map(i => i.isCurrent ? updatedInnings : i) 
    };
    setCurrentMatch(updatedMatch);
    storage.saveMatch(updatedMatch);
  };

  return (
    <div className="flex flex-col h-screen text-slate-100 bg-surface select-none">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800">
        <button onClick={onExit} className="p-2 -ml-2" id="back-btn"><ChevronLeft className="w-6 h-6" /></button>
        <div className="text-center flex-1">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Match</h2>
            <p className="text-sm font-bold truncate max-w-[150px] mx-auto">{currentMatch.teamA.name} v {currentMatch.teamB.name}</p>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={onViewScorecard}
            className="text-[10px] bg-slate-800 px-3 py-1.5 rounded-lg font-bold text-slate-300 border border-slate-700 active:bg-slate-700"
            id="header-scorecard-btn"
          >
            SCORECARD
          </button>
        </div>
      </header>

      {/* Main Scoreboard */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tighter font-mono">{stats.runs}</span>
              <span className="text-3xl text-slate-500 font-bold">/ {stats.wickets}</span>
            </div>
            <div className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                CRR: <span className="text-brand-primary">{stats.rr}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono">
              Overs <span className="text-brand-primary">{stats.overs}.{stats.ballsInOver}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target: --</div>
          </div>
        </div>

        {/* Recent Balls */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 noscrollbar">
          {innings?.balls.slice(-6).map((ball, idx) => (
            <div key={ball.id} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                ball.wicket ? 'bg-red-500 text-white' : 
                ball.run === 6 ? 'bg-purple-500 text-white' :
                ball.run === 4 ? 'bg-blue-500 text-white' :
                ball.isWide || ball.isNoBall ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                'bg-slate-800 text-slate-400'
            }`}>
              {ball.wicket ? 'W' : ball.isWide ? 'Wd' : ball.isNoBall ? 'NB' : ball.run}
            </div>
          ))}
          {Array.from({ length: Math.max(0, 6 - (innings?.balls.slice(-6).length || 0)) }).map((_, i) => (
            <div key={`empty-${i}`} className="w-8 h-8 rounded-full border border-slate-800 flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Players Summary */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="terminal-card border-none bg-slate-800/40 divide-y divide-slate-700/50">
             <div className="p-3 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                   <span className="font-bold">Striker</span>
                </div>
                <div className="font-mono font-bold">
                  {getBatterStats(innings?.balls || [], strikerId).runs} 
                  <span className="text-slate-500 font-normal ml-1">({getBatterStats(innings?.balls || [], strikerId).faced})</span>
                </div>
             </div>
             <div className="p-3 flex justify-between items-center text-sm opacity-60">
                <span className="font-medium text-slate-400">Non-Striker</span>
                <div className="font-mono">
                  {getBatterStats(innings?.balls || [], nonStrikerId).runs} 
                  <span className="text-slate-600 font-normal ml-1">({getBatterStats(innings?.balls || [], nonStrikerId).faced})</span>
                </div>
             </div>
          </div>

          <div className="terminal-card border-none bg-slate-800/40 p-3 flex justify-between items-center text-sm">
             <span className="text-slate-400">Bowler</span>
             <div className="font-mono font-bold">
               {getBowlerStats(innings?.balls || [], bowlerId).overs} - {getBowlerStats(innings?.balls || [], bowlerId).runs} - {getBowlerStats(innings?.balls || [], bowlerId).wickets}
               <span className="text-xs text-slate-500 font-normal ml-2">({getBowlerStats(innings?.balls || [], bowlerId).econ})</span>
             </div>
          </div>
      </div>

      {/* Controls Grid */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 pb-8 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3, 4, 6].map(num => (
          <button 
            key={num}
            onClick={() => handleAddBall({ run: num })}
            className={`h-16 rounded-xl font-bold text-xl active:scale-95 transition-transform ${
                num === 6 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' :
                num === 4 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' :
                'bg-slate-800 text-slate-100 hover:bg-slate-700'
            }`}
            id={`run-${num}-btn`}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleAddBall({ isWide: true, run: 0 })}
          className="h-16 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-xl font-bold active:scale-95 transition-transform"
          id="wide-btn"
        >
          WD
        </button>
        <button 
           onClick={() => handleAddBall({ isNoBall: true, run: 0 })}
           className="h-16 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded-xl font-bold active:scale-95 transition-transform"
           id="nb-btn"
        >
          NB
        </button>
        <button 
          onClick={() => handleAddBall({ wicket: { type: 'bowled', batterId: 'batter_1' } })}
          className="h-16 bg-red-600 text-white rounded-xl font-bold col-span-2 active:scale-95 transition-transform"
          id="wicket-btn"
        >
          WICKET
        </button>
        <button 
          onClick={undoLastBall}
          className="h-16 bg-slate-800 text-slate-400 rounded-xl font-bold flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
          id="undo-btn"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px]">UNDO</span>
        </button>
        <button className="h-16 bg-slate-800 text-slate-400 rounded-xl font-bold flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform" id="more-btn">
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px]">MORE</span>
        </button>
      </div>
    </div>
  );
};
