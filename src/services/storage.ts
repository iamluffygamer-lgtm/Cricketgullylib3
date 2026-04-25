/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, STORAGE_KEY } from '../types';

export const storage = {
  getMatches: (): Match[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveMatch: (match: Match) => {
    const matches = storage.getMatches();
    const index = matches.findIndex((m) => m.id === match.id);
    if (index === -1) {
      matches.push(match);
    } else {
      matches[index] = { ...match, updatedAt: Date.now() };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  },

  deleteMatch: (id: string) => {
    const matches = storage.getMatches().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  },

  getMatch: (id: string): Match | undefined => {
    return storage.getMatches().find((m) => m.id === id);
  },
};
