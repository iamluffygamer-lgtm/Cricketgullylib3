/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WicketType = 'bowled' | 'caught' | 'run_out' | 'lbw' | 'stumped' | 'retired' | 'handled_ball' | 'hit_ball_twice' | 'hit_wicket' | 'obstructing_the_field' | 'timed_out';

export interface Ball {
  id: string;
  run: number;
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  wicket?: {
    type: WicketType;
    batterId: string;
    fielderId?: string;
  };
  batterId: string;
  bowlerId: string;
  overNumber: number;
  ballInOver: number;
  timestamp: number;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
}

export interface MatchSettings {
  totalOvers: number;
  playersPerTeam: number;
  isTestMode: boolean;
  wideValue: number;
  noBallValue: number;
}

export type MatchStatus = 'upcoming' | 'live' | 'finished' | 'abandoned';

export interface Innings {
  battingTeamId: string;
  bowlingTeamId: string;
  balls: Ball[];
  fow: Array<{ score: number; wickets: number; over: number; ball: number; batterId: string }>;
  isCurrent: boolean;
}

export interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  settings: MatchSettings;
  status: MatchStatus;
  innings: Innings[];
  tossWinnerId?: string;
  tossDecision?: 'bat' | 'bowl';
  createdAt: number;
  updatedAt: number;
}

export const STORAGE_KEY = 'gully_cricket_data';
