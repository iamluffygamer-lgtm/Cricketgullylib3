/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Ball, Innings } from '../types';

export const calculateInningsStats = (innings: Innings) => {
  let runs = 0;
  let wickets = 0;
  let extras = { wide: 0, noBall: 0, bye: 0, legBye: 0, total: 0 };
  let legalBalls = 0;

  innings.balls.forEach((ball) => {
    runs += ball.run;
    if (ball.isWide) {
      extras.wide += ball.run || 1;
      extras.total += ball.run || 1;
      runs += ball.run || 1;
    } else if (ball.isNoBall) {
      extras.noBall += 1;
      extras.total += 1;
      runs += (ball.run + 1);
    } else {
      legalBalls++;
      if (ball.isBye) {
        extras.bye += ball.run;
        extras.total += ball.run;
      } else if (ball.isLegBye) {
        extras.legBye += ball.run;
        extras.total += ball.run;
      }
    }

    if (ball.wicket) {
      wickets++;
    }
  });

  const overs = Math.floor(legalBalls / 6);
  const ballsInOver = legalBalls % 6;
  const rr = legalBalls > 0 ? (runs / (legalBalls / 6)) : 0;

  return {
    runs,
    wickets,
    extras,
    legalBalls,
    overs,
    ballsInOver,
    rr: rr.toFixed(2),
  };
};

export const getBatterStats = (balls: Ball[], batterId: string) => {
  const batterBalls = balls.filter(b => b.batterId === batterId && !b.isWide);
  const runs = batterBalls.reduce((acc, b) => acc + (b.isBye || b.isLegBye ? 0 : b.run), 0);
  const faced = batterBalls.length;
  const fours = batterBalls.filter(b => b.run === 4 && !b.isBye && !b.isLegBye).length;
  const sixes = batterBalls.filter(b => b.run === 6 && !b.isBye && !b.isLegBye).length;
  const sr = faced > 0 ? (runs / faced) * 100 : 0;

  return { runs, faced, fours, sixes, sr: sr.toFixed(1) };
};

export const getBowlerStats = (balls: Ball[], bowlerId: string) => {
  const bowlerBalls = balls.filter(b => b.bowlerId === bowlerId);
  const runsConceded = bowlerBalls.reduce((acc, b) => {
    let r = b.run;
    if (b.isWide) r += 1;
    if (b.isNoBall) r += 1;
    return acc + r;
  }, 0);
  const legalBalls = bowlerBalls.filter(b => !b.isWide && !b.isNoBall).length;
  const wickets = bowlerBalls.filter(b => b.wicket && b.wicket.type !== 'run_out').length;
  const econ = legalBalls > 0 ? (runsConceded / (legalBalls / 6)) : 0;

  return {
    overs: `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`,
    runs: runsConceded,
    wickets,
    econ: econ.toFixed(2)
  };
};
