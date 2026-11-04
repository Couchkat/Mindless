// ===== Mindless planning engine (pure functions, no DOM) =====
const PLACES = {
  home:    { name: 'Home', addr: '41 Hazel Ct', x: 16, y: 76, area: 'Elm Street', open: 0, close: 1440 },
  work:    { name: 'Linden Cowork', addr: '214 Linden Ave', x: 56, y: 28, area: 'Downtown', open: 420, close: 1320 },
  pharmacy:{ name: 'Corner Pharmacy', addr: '9 State St', x: 64, y: 38, area: 'Downtown', open: 540, close: 1080 },
  post:    { name: 'Post Office', addr: '213 N Tioga St', x: 61, y: 20, area: 'Downtown', open: 540, close: 1020 },
  cafe:    { name: 'Café Alder', addr: '118 Green St', x: 48, y: 42, area: 'Downtown', open: 420, close: 1140 },
  library: { name: 'Fall Creek Library', addr: '101 E Green St', x: 42, y: 30, area: 'Downtown', open: 600, close: 1200 },
  market:  { name: 'Greenway Market', addr: '702 Elm St', x: 30, y: 64, area: 'Elm Street', open: 480, close: 1260 },
  cleaner: { name: 'Bright Press Cleaners', addr: '640 Elm St', x: 25, y: 57, area: 'Elm Street', open: 420, close: 1140 },
  paper:   { name: 'Paperleaf Stationers', addr: '27 Aurora St', x: 53, y: 35, area: 'Downtown', open: 600, close: 1080 },
  friend:  { name: "Marisol's place", addr: '12 Hazel Ct', x: 20, y: 70, area: 'Elm Street', open: 0, close: 1440 },
  gym:     { name: 'Northside Gym', addr: '1290 Lake Rd', x: 84, y: 14, area: 'Northside', open: 330, close: 1320 },
  dentist: { name: 'Riverside Dental', addr: '55 Inlet Way', x: 76, y: 60, area: 'Riverside', open: 480, close: 1020 },
};

const MODES = {
  walk:    { label: 'Walk',    perUnit: 0.42, fixed: 0 },
  bike:    { label: 'Bike',    perUnit: 0.15, fixed: 2 },
  transit: { label: 'Transit', perUnit: 0.12, fixed: 7 },
  drive:   { label: 'Drive',   perUnit: 0.08, fixed: 5 },
};

const PEAKS = { morning: [480, 720], afternoon: [780, 990], evening: [1020, 1200] };

function dist(a, b) { const A = PLACES[a], B = PLACES[b]; return Math.abs(A.x - B.x) + Math.abs(A.y - B.y); }
// Real places: when both ends are pinned on the live map, use the straight-line
// distance on Earth with a 1.3x street-detour factor, and per-mode city speeds.
const REAL = { walk: { perMile: 20, fixed: 0 }, bike: { perMile: 6, fixed: 2 }, transit: { perMile: 3.6, fixed: 8 }, drive: { perMile: 2.6, fixed: 4 } };
const pinned = k => PLACES[k] && typeof PLACES[k].lat === 'number' && typeof PLACES[k].lng === 'number';
function realMiles(a, b) {
  const A = PLACES[a], B = PLACES[b], R = 3958.8, rad = Math.PI / 180;
  const dLat = (B.lat - A.lat) * rad, dLng = (B.lng - A.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(A.lat * rad) * Math.cos(B.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h))) * 1.3;
}
function miles(a, b) { return pinned(a) && pinned(b) ? realMiles(a, b) : dist(a, b) * 0.025; }
function travel(a, b, mode) {
  if (!a || !b || a === b) return 0;
  if (pinned(a) && pinned(b)) { const r = REAL[mode]; const mi = realMiles(a, b); return mi < 0.05 ? 0 : Math.max(2, Math.round(r.fixed + mi * r.perMile)); }
  const m = MODES[mode];
  return Math.max(2, Math.round(m.fixed + dist(a, b) * m.perUnit));
}

function fmt(min) {
  min = Math.round(min);
  let h = Math.floor(min / 60), m = min % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
}
function fmtShort(min) { return fmt(min).replace(':00', ''); }
function dur(min) {
  min = Math.round(min);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

function inPeak(t, peak) { const p = PEAKS[peak]; return t >= p[0] && t < p[1]; }

/**
 * Schedule one day.
 * opts: { tasks, fixed, settings, startTime, startPlace, order: 'smart'|'input' }
 * Returns { steps, unscheduled, stats }
 */
function schedule(opts) {
  const { tasks, fixed, settings } = opts;
  const mode = settings.mode, buffer = settings.buffer;
  const order = opts.order || 'smart';
  let t = opts.startTime, loc = opts.startPlace;
  const steps = [];
  const remaining = tasks.filter(x => !x.done);
  const fixedQ = fixed.filter(f => f.end > t).sort((a, b) => a.start - b.start);
  let focusRun = 0, needBreak = false, lastTaskPlace = null, lastArea = null;

  const pushTravel = (to, why) => {
    const tr = travel(loc, to, mode);
    if (tr > 0) {
      steps.push({ type: 'travel', from: loc, to, start: t, end: t + tr + buffer, minutes: tr, buffer, mode, miles: miles(loc, to), why });
      t += tr + buffer;
      if (tr >= 8) { focusRun = 0; needBreak = false; }
    }
    loc = to;
  };

  for (let guard = 0; guard < 80; guard++) {
    const F = fixedQ[0];
    const cands = [];
    remaining.forEach((task, idx) => {
      const p = task.place || loc;
      const P = PLACES[p];
      let bt = t;
      const breakFirst = needBreak && travel(loc, p, mode) < 8;
      if (breakFirst) bt += settings.breakLen;
      const tr = travel(loc, p, mode);
      const arrive = bt + tr + (tr ? buffer : 0);
      const winStart = task.window ? task.window[0] : 0;
      const begin = Math.max(arrive, P.open, winStart);
      const wait = begin - arrive;
      const finish = begin + task.dur;
      if (finish > P.close) return;
      if (task.window && finish > task.window[1]) return;
      if (finish > settings.dayEnd) return;
      if (F) {
        const trF = travel(p, F.place, mode);
        if (finish + trF + (trF ? buffer : 0) > F.start) return;
      }
      if (wait > 45) return; // don't idle long when something else could happen
      let score;
      if (order === 'input') score = tasks.indexOf(task);
      else if (Array.isArray(order)) score = order.indexOf(task.id);
      else {
        score = tr * 1.0 + wait * 1.3;
        if (task.deadline != null) {
          const slack = task.deadline - finish;
          score -= slack < 0 ? -200 : Math.max(0, 150 - slack) * 0.35;
        }
        if (P.close < 1440) score -= Math.max(0, 210 - (P.close - finish)) * 0.22;
        if (task.window) score -= Math.max(0, 180 - (task.window[1] - finish)) * 0.15;
        const peak = inPeak(begin, settings.peak);
        if (task.energy === 'high') score += peak ? -28 : 22;
        if (task.energy === 'low') score += peak ? 10 : -4;
        score -= (task.priority - 1) * 5;
        // prefer finishing an area before leaving it
        if (task.place && lastArea && PLACES[task.place].area === lastArea) score -= 6;
      }
      cands.push({ task, idx, p, tr, begin, wait, finish, breakFirst, score });
    });

    if (!cands.length) {
      if (F) {
        if (needBreak && travel(loc, F.place, mode) < 8 && t + settings.breakLen + travel(loc, F.place, mode) + buffer <= F.start) {
          steps.push({ type: 'break', start: t, end: t + settings.breakLen });
          t += settings.breakLen; needBreak = false; focusRun = 0;
        }
        const trF = travel(loc, F.place, mode);
        const leave = Math.max(t, F.start - trF - (trF ? buffer : 0));
        if (leave > t) { steps.push({ type: 'free', start: t, end: leave }); t = leave; }
        pushTravel(F.place, `Gets you to ${F.title.toLowerCase()} on time`);
        steps.push({ type: 'fixed', event: F, place: F.place, start: F.start, end: F.end });
        t = Math.max(t, F.end);
        lastArea = PLACES[F.place].area;
        lastTaskPlace = F.place;
        fixedQ.shift();
        focusRun = 0;
        continue;
      }
      break;
    }

    cands.sort((a, b) => a.score - b.score);
    const c = cands[0];
    if (c.breakFirst) {
      steps.push({ type: 'break', start: t, end: t + settings.breakLen });
      t += settings.breakLen; needBreak = false; focusRun = 0;
    }
    const prevLoc = loc, prevArea = lastArea;
    if (c.task.place && c.task.place !== loc) pushTravel(c.task.place);
    if (c.begin > t) { steps.push({ type: 'free', start: t, end: c.begin }); t = c.begin; }

    // reasons
    const P = PLACES[c.p];
    const reasons = [];
    const peak = inPeak(c.begin, settings.peak);
    if (c.task.energy === 'high' && peak) reasons.push(`Deep work in your ${settings.peak} focus peak.`);
    if (c.task.deadline != null) {
      const slack = c.task.deadline - c.finish;
      reasons.push(slack >= 0 ? `Due ${fmtShort(c.task.deadline)}; done with ${dur(slack)} to spare.` : `Due ${fmtShort(c.task.deadline)}; this is the earliest open slot.`);
    }
    if (c.task.place && P.close < 1440 && P.close - c.finish < 240) reasons.push(`${P.name} closes at ${fmtShort(P.close)}.`);
    if (c.task.window && !reasons.length) reasons.push(`Fits your ${fmtShort(c.task.window[0])} to ${fmtShort(c.task.window[1])} window.`);
    if (c.task.place && c.task.place === prevLoc) reasons.push('Same place as your last stop, no travel.');
    else if (c.task.place && c.tr && c.tr <= 8 && lastTaskPlace) reasons.push(`${c.tr} min from ${PLACES[prevLoc].name}.`);
    if (c.task.place && prevArea && P.area === prevArea && c.task.place !== prevLoc) reasons.push(`Grouped with your other ${P.area} stops.`);
    if (!c.task.place) {
      if (F && F.start - c.finish < 40) reasons.push(`No location needed; fills the gap before ${F.title.toLowerCase()}.`);
      else reasons.push(`No location needed; done at ${PLACES[c.p].name}.`);
    }
    if (c.task.energy === 'low' && !peak && reasons.length < 2) reasons.push('Light task, kept out of your focus peak.');
    if (c.task.energy === 'med' && reasons.length < 2) reasons.push(peak ? 'Moderate effort while your energy is up.' : 'Moderate effort, after your deep work is done.');
    if (c.task.place && prevArea && P.area !== prevArea && reasons.length < 2) reasons.push(`Starts your ${P.area} stops.`);
    if (c.task.place && !prevArea && reasons.length < 2) reasons.push('First errand, on your way out.');
    if (!reasons.length) reasons.push('Shortest detour from where you are.');

    steps.push({ type: 'task', task: c.task, place: c.p, start: c.begin, end: c.finish, reasons: reasons.slice(0, 2) });
    t = c.finish;
    if (c.task.place) { lastTaskPlace = c.task.place; lastArea = P.area; }
    remaining.splice(remaining.indexOf(c.task), 1);
    focusRun += c.task.dur;
    if (focusRun >= settings.breakEvery) needBreak = true;
  }

  // remaining fixed events
  while (fixedQ.length) {
    const F = fixedQ.shift();
    const trF = travel(loc, F.place, mode);
    const leave = Math.max(t, F.start - trF - (trF ? buffer : 0));
    if (leave > t) { steps.push({ type: 'free', start: t, end: leave }); t = leave; }
    pushTravel(F.place, `Gets you to ${F.title.toLowerCase()} on time`);
    steps.push({ type: 'fixed', event: F, place: F.place, start: F.start, end: F.end });
    t = Math.max(t, F.end);
  }
  if (loc !== settings.home) pushTravel(settings.home, 'Back home');
  const finishAt = t;

  const travelMin = steps.filter(s => s.type === 'travel').reduce((a, s) => a + s.minutes, 0);
  const waitMin = steps.filter(s => s.type === 'free').reduce((a, s) => a + (s.end - s.start), 0);
  const unscheduled = remaining.map(task => {
    const P = PLACES[task.place || settings.home];
    let why = 'No open slot long enough today.';
    if (task.place && P.close < 1440) why = `${P.name} closes at ${fmtShort(P.close)} and the day is full before then.`;
    if (task.deadline != null) why = `Couldn't fit before its ${fmtShort(task.deadline)} deadline.`;
    return { task, why };
  });
  return { steps, unscheduled, stats: { finishAt, travelMin, waitMin, stops: new Set(steps.filter(s => s.type === 'task' && s.task.place).map(s => s.place)).size } };
}

// Objective: lower is better.
function cost(r, settings) {
  let c = r.stats.finishAt + r.stats.travelMin * 0.9 + r.stats.waitMin * 0.35 + r.unscheduled.length * 600;
  r.steps.forEach(s => {
    if (s.type !== 'task') return;
    const pk = inPeak(s.start, settings.peak);
    if (s.task.energy === 'high' && !pk) c += 45;
    if (s.task.energy === 'low' && pk) c += 8;
    if (s.task.deadline != null && s.end > s.task.deadline) c += (s.end - s.task.deadline) * 4 + 120;
    c -= (s.task.priority - 1) * 0; // priority only matters when something must drop
  });
  r.unscheduled.forEach(u => { c += (u.task.priority) * 150; });
  return c;
}

// Seeded RNG so the same inputs always give the same plan.
function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }

/** Search task orderings; returns the best schedule plus the input-order baseline. */
function optimize(opts) {
  const active = opts.tasks.filter(t => !t.done);
  const ids = active.map(t => t.id);
  const run = order => schedule({ ...opts, order });
  const evalOrder = order => { const r = run(order); return { r, c: cost(r, opts.settings), order }; };

  const baseline = run('input');
  const greedy = run('smart');
  const greedyOrder = greedy.steps.filter(s => s.type === 'task').map(s => s.task.id);
  ids.forEach(id => { if (!greedyOrder.includes(id)) greedyOrder.push(id); });

  let best = evalOrder(greedyOrder);
  const inp = evalOrder(ids.slice());
  if (inp.c < best.c) best = inp;

  const rand = rng(ids.length * 7919 + Math.round(opts.startTime) + opts.settings.mode.length * 31);
  const localSearch = start => {
    let cur = start, improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < ids.length && !improved; i++) {
        for (let j = 0; j < ids.length && !improved; j++) {
          if (i === j) continue;
          const o = cur.order.slice();
          const [x] = o.splice(i, 1); o.splice(j, 0, x);
          const e = evalOrder(o);
          if (e.c < cur.c - 0.01) { cur = e; improved = true; }
        }
      }
    }
    return cur;
  };
  best = localSearch(best);
  for (let k = 0; k < 24; k++) {
    const o = ids.slice();
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    const e = localSearch(evalOrder(o));
    if (e.c < best.c) best = e;
  }
  return { ...best.r, baseline, cost: best.c };
}

if (typeof module !== 'undefined') module.exports = { PLACES, MODES, schedule, optimize, fmt, dur, travel };
