// ===== Mindless web app UI =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hm = s => { const [a, b] = s.split(':').map(Number); return a * 60 + (b || 0); };
const toHM = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
let uid = 0; const nid = p => `${p}${Date.now().toString(36)}${(uid++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

// ---------- icons (stroke, 24 grid) ----------
const IC = {
  setup: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  tasks: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>',
  plan: '<circle cx="6" cy="5" r="1.6"/><circle cx="6" cy="12" r="1.6"/><circle cx="6" cy="19" r="1.6"/><path d="M6 6.6v3.8M6 13.6v3.8M10 5h10M10 12h7M10 19h9"/>',
  map: '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 7.6-1.7"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m10 21 2-6 3 3v3M8.5 12.5l2-4.5 4 1.5 2 3.5M12 15l-1-6.5"/>',
  bike: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M6 16l4-8h5l3 8M10 8 13 16h-3M14 5h2"/>',
  transit: '<rect x="5" y="3.5" width="14" height="14" rx="3"/><path d="M5 11h14M8.5 14.5h.01M15.5 14.5h.01M8 21l1.5-3.5M16 21l-1.5-3.5"/>',
  drive: '<path d="M4 16v-3.5L6 7.5h12l2 5V16"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="16" r=".5"/><path d="M4 12.5h16"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  text: '<path d="M4 6h16M4 11h16M4 16h10"/>',
  form: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M8 13h8M8 17h4"/>',
  import: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pause: '<path d="M8 12h.01M12 12h.01M16 12h.01"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  focus: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/>',
  bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
  minus: '<path d="M5 12h14"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><circle cx="12" cy="12" r="2.5"/>',
  palette: '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.4-2.1-.7-1.3.2-2.9 1.7-2.9H17a3.5 3.5 0 0 0 3.5-3.5c0-4.7-3.8-8.5-8.5-8.5z"/><circle cx="7.8" cy="11.5" r="1.1"/><circle cx="10.5" cy="7.6" r="1.1"/><circle cx="15" cy="8" r="1.1"/>',
  device: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 20.5h8M12 17v3.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  leaf: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19 13 11"/>',
};
const icon = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;

// ---------- state ----------
const SAMPLE_TASKS = () => [
  { id: 't1', title: 'Finish Q4 budget report draft', dur: 120, place: null, energy: 'high', deadline: hm('17:00'), priority: 3, source: 'Brain dump' },
  { id: 't2', title: 'Pick up prescription', dur: 15, place: 'pharmacy', energy: 'low', priority: 2, source: 'Brain dump' },
  { id: 't3', title: 'Mail return package', dur: 10, place: 'post', energy: 'low', priority: 2, source: 'Voice' },
  { id: 't4', title: 'Grocery run for the week', dur: 40, place: 'market', energy: 'low', priority: 1, source: 'Todoist' },
  { id: 't5', title: 'Drop off dry cleaning', dur: 10, place: 'cleaner', energy: 'low', priority: 1, source: 'Form' },
  { id: 't6', title: 'Strength workout', dur: 60, place: 'gym', energy: 'med', priority: 2, source: 'Form' },
  { id: 't7', title: 'Clear inbox backlog', dur: 45, place: null, energy: 'low', priority: 1, source: 'Brain dump' },
  { id: 't8', title: 'Call landlord about lease renewal', dur: 15, place: null, energy: 'low', priority: 2, window: [600, 960], source: 'Brain dump' },
];
const SAMPLE_FIXED = () => [
  { id: 'f1', title: 'Team standup', start: hm('11:00'), end: hm('11:20'), place: 'work', source: 'Google Calendar' },
  { id: 'f2', title: 'Lunch with Odessa', start: hm('13:00'), end: hm('14:00'), place: 'cafe', source: 'Google Calendar' },
];
const DEFAULT_SETTINGS = () => ({
  mode: 'transit', modes: ['walk', 'transit', 'bike'], buffer: 5, breakLen: 10, breakEvery: 90, peak: 'morning',
  dayStart: hm('08:00'), dayEnd: hm('21:00'), home: 'home', homeAddr: '', workAddr: '', startAt: 'home',
  cluster: true, calendars: { google: false, apple: false, outlook: false }, syncMode: 'two-way', theme: 'paper', appearance: 'system', name: '', font: 'neue', look: 3,
});

// ---------- dates and the real clock ----------
const pad2 = n => String(n).padStart(2, '0');
const dayKey = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const todayKey = () => dayKey(new Date());
const tomorrowKey = () => { const d = new Date(); d.setDate(d.getDate() + 1); return dayKey(d); };
const keyDate = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const longDate = k => keyDate(k).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const isToday = () => S.day === todayKey();
const dayWord = () => isToday() ? 'today' : S.day === tomorrowKey() ? 'tomorrow' : longDate(S.day);

// ---------- state ----------
const KEY = 'mindless-v2';
const SAVED_FIELDS = ['settings', 'places', 'tasks', 'fixed', 'later', 'day', 'setupStep', 'onboarded', 'base', 'synced', 'checked', 'gcal', 'placeFor', 'history', 'updatedAt'];
function fresh() {
  return { settings: DEFAULT_SETTINGS(), places: {}, tasks: [], fixed: [], later: [], day: todayKey(), setupStep: 0, onboarded: false, base: null, synced: false, checked: {}, gcal: { ids: [], day: null }, placeFor: {}, history: [], updatedAt: 0 };
}
function normalize(x) {
  const f = fresh(), s = { ...f, ...(x || {}) };
  s.settings = { ...f.settings, ...(s.settings || {}) };
  s.settings.calendars = { ...f.settings.calendars, ...(s.settings.calendars || {}) };
  if ((s.settings.look || 0) < 3) { s.settings.theme = 'paper'; s.settings.font = 'neue'; s.settings.look = 3; }
  ['tasks', 'fixed', 'later', 'history'].forEach(k => { if (!Array.isArray(s[k])) s[k] = []; });
  ['checked', 'places', 'placeFor'].forEach(k => { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; });
  if (!s.gcal || !Array.isArray(s.gcal.ids)) s.gcal = { ids: [], day: null };
  return s;
}
function snapshotState() { const o = {}; SAVED_FIELDS.forEach(k => { o[k] = S[k]; }); return JSON.parse(JSON.stringify(o)); }
function loadLocal() { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
let S = normalize(loadLocal());
S.clock = nowMin();

// Saving: instantly to this browser, and (when signed in) to the person's private account storage.
const STORE = { db: null, ref: null, mode: 'local', pending: null, writing: false, lastRev: null };
function save() {
  S.updatedAt = Date.now();
  const snap = snapshotState();
  try { localStorage.setItem(KEY, JSON.stringify(snap)); } catch (e) { /* storage unavailable */ }
  if (!STORE.ref) return;
  STORE.pending = snap;
  clearTimeout(save._t); save._t = setTimeout(flushRemote, 600);
}
async function flushRemote() {
  if (STORE.writing || !STORE.pending || !STORE.ref) return;
  const body = STORE.pending; STORE.pending = null; STORE.writing = true;
  body.rev = STORE.lastRev = Math.random().toString(36).slice(2);
  try { await STORE.ref.set(body); setStoreMode('cloud'); }
  catch (e) {
    if (e && e.code === 'unavailable') { STORE.pending = STORE.pending || body; setTimeout(flushRemote, 1500 + Math.random() * 1500); }
    else if (e && e.code === 'quota_exceeded') toast('Your account storage is full. Clear old history to keep saving.');
    else { STORE.ref = null; setStoreMode('local'); }
  } finally { STORE.writing = false; if (STORE.pending) flushRemote(); }
}
function setStoreMode(m) { if (STORE.mode === m) return; STORE.mode = m; if ($('#railFoot')) renderRailFoot(); }
function adoptRemote(data) {
  const keepUI = S.clock;
  S = normalize(data); S.clock = keepUI; applyPlaces();
  try { localStorage.setItem(KEY, JSON.stringify(snapshotState())); } catch (e) { /* ignore */ }
  rollDay(); refreshPlan();
  if (!$('#modalRoot') || !$('#modalRoot').innerHTML) route();
}
async function connectStore() {
  const api = window.claude && window.claude.use;
  if (!api) return;
  const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
  const id = user ? await user.id() : null;
  if (!db || !id) { setStoreMode('local'); return; }
  STORE.db = db;
  const ref = db.collection('data/users/' + id).doc('state');
  let first = true, timer = setTimeout(() => { if (first) setStoreMode('offline'); }, 10000);
  ref.onSnapshot(snap => {
    if (snap.metadata.fromCache && first) return;
    clearTimeout(timer);
    const data = snap.exists ? snap.data() : null;
    if (first) {
      first = false; STORE.ref = ref; setStoreMode('cloud');
      if (data && (data.updatedAt || 0) >= (S.updatedAt || 0)) adoptRemote(data);
      else save(); // first visit on this account, or this browser has newer changes: upload them
      return;
    }
    if (!data || snap.metadata.hasPendingWrites || data.rev === STORE.lastRev) return;
    if ((data.updatedAt || 0) > (S.updatedAt || 0)) adoptRemote(data); // edited on another device
  }, () => { clearTimeout(timer); STORE.ref = null; setStoreMode('local'); });
}

// Places: the twelve map spots can be renamed to the person's real places.
const PLACE_DEFAULTS = JSON.parse(JSON.stringify(PLACES));
function applyPlaces() {
  // only addresses the person typed are kept; the map spots themselves are illustrative
  Object.keys(PLACE_DEFAULTS).forEach(k => { PLACES[k] = { ...PLACE_DEFAULTS[k], addr: '', ...((S.places || {})[k] || {}) }; });
  PLACES.home.addr = S.settings.homeAddr || ''; PLACES.work.addr = S.settings.workAddr || '';
  if (!(S.places.work || {}).name) PLACES.work.name = 'Work';
  realAreas();
}

// A new day: archive yesterday, carry unfinished tasks forward.
function rollDay() {
  const today = todayKey();
  if (S.day >= today) return false;
  const p = (() => { try { return computePlan(); } catch (e) { return null; } })();
  const done = S.tasks.filter(t => S.checked[t.id]);
  S.history = [{ day: S.day, done: done.length, total: S.tasks.length, travelMin: p ? planStats(p).travelMin : 0 }].concat(S.history || []).slice(0, 60);
  S.tasks = S.tasks.filter(t => !S.checked[t.id]).map(t => { const c = { ...t }; delete c.pinned; return c; }).concat((S.later || []).filter(l => !l.for || l.for <= today).map(l => l.task));
  S.later = (S.later || []).filter(l => l.for && l.for > today);
  S.fixed = [];
  S.day = today; S.base = null; S.checked = {}; S.synced = false; S.gcal = { ids: [], day: null };
  save();
  return true;
}

// transient UI state
const U = { firstPlan: true, drawRoute: false, sheet: 34, addTab: 'dump', dumpText: null, parsed: [], voice: 'idle', voiceText: '', voiceParsed: [], sel: null, plan: null, diff: null, undo: null, loading: false, formErr: {} };

// ---------- planning ----------
function buildInputs(extra = {}) {
  const st = { ...S.settings, ...(extra.settings || {}) };
  const tasks = (extra.tasks || S.tasks);
  const fixed = (extra.fixed || S.fixed).slice();
  const free = [];
  tasks.forEach(t => {
    if (t.pinned) fixed.push({ id: t.id, title: t.title, start: t.pinned.start, end: t.pinned.end, place: t.pinned.place, source: 'Locked by you', fromTask: t });
    else free.push(t);
  });
  return { st, free, fixed };
}

function computePlan(extra = {}) {
  const { st, free, fixed } = buildInputs(extra);
  const base = extra.base !== undefined ? extra.base : S.base;
  const startPlace = st.startAt === 'work' ? 'work' : st.home;
  let startTime = st.dayStart, loc = startPlace, kept = [], doneIds = new Set();
  // planning today: start from the next five minutes, never in the past
  if (!base && S.day === todayKey()) startTime = Math.max(st.dayStart, Math.min(Math.ceil((nowMin() + 1) / 5) * 5, st.dayEnd - 15));
  if (base) {
    startTime = base.time; loc = base.loc; kept = base.kept;
    doneIds = new Set(base.doneIds);
  }
  const remaining = free.filter(t => !doneIds.has(t.id));
  const fx = fixed.filter(f => !doneIds.has(f.id) && f.end > startTime);
  const r = optimize({ tasks: remaining, fixed: fx, settings: st, startTime, startPlace: loc });
  // "doing it in the order you wrote it", from the same starting point
  return { ...r, steps: kept.concat(r.steps), keptCount: kept.length, baseTime: base ? base.time : null, settings: st };
}

function planStats(p) {
  const travelMin = p.steps.filter(s => s.type === 'travel').reduce((a, s) => a + s.minutes, 0);
  const waitMin = p.steps.filter(s => s.type === 'free').reduce((a, s) => a + (s.end - s.start), 0);
  const bl = p.baseline.stats;
  const saved = Math.max(0, (bl.travelMin + bl.waitMin) - (p.stats.travelMin + p.stats.waitMin));
  const earlier = Math.max(0, bl.finishAt - p.stats.finishAt);
  return { travelMin, waitMin, saved, earlier, finishAt: p.stats.finishAt };
}

function diffPlans(a, b) {
  const pos = p => { const m = {}; p.steps.forEach(s => { if (s.type === 'task') m[s.task.id] = s.start; if (s.type === 'fixed' && s.event.fromTask) m[s.event.fromTask.id] = s.start; }); return m; };
  const A = pos(a), B = pos(b), out = { moved: [], added: [], dropped: [], map: {} };
  Object.keys(B).forEach(id => {
    if (A[id] == null) { out.added.push(id); out.map[id] = 'New'; }
    else { const d = B[id] - A[id]; if (Math.abs(d) >= 5) { out.moved.push({ id, d }); out.map[id] = d < 0 ? `${dur(-d)} earlier` : `${dur(d)} later`; } }
  });
  Object.keys(A).forEach(id => { if (B[id] == null) out.dropped.push(id); });
  return out;
}

const taskById = id => S.tasks.find(t => t.id === id);

function refreshPlan() { U.plan = computePlan(); }


// ---------- fonts ----------
const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", SERIF = "Georgia, 'Times New Roman', serif", MONO = "ui-monospace, 'SFMono-Regular', Menlo, monospace";
const FONTS = {
  neue: { name: 'Helvetica Neue + Inter', mood: 'Swiss, quiet, precise', display: `'Helvetica Neue', Helvetica, 'Inter Tight', Arial, ${SANS}`, body: `Inter, ${SANS}`, label: `'IBM Plex Mono', ${MONO}`, w: 400, ls: '-.055em', lcase: 'uppercase', lls: '.14em', lsize: 0.74 },
  inter: { name: 'Inter Tight + IBM Plex Mono', mood: 'Crisp, receipt-like', display: `'Inter Tight', ${SANS}`, body: `'Inter Tight', ${SANS}`, label: `'IBM Plex Mono', ${MONO}`, w: 700, ls: '-.035em', lcase: 'uppercase', lls: '.06em', lsize: 0.88 },
  bricolage: { name: 'Bricolage Grotesque + Geist', mood: 'Modern, characterful', display: `'Bricolage Grotesque', ${SANS}`, body: `'Geist', ${SANS}`, label: `'Geist', ${SANS}`, w: 500, ls: '-.035em', lcase: 'none', lls: '0', lsize: 1 },
  fraunces: { name: 'Fraunces + Figtree', mood: 'Warm, bookish', display: `'Fraunces', ${SERIF}`, body: `'Figtree', ${SANS}`, label: `'Figtree', ${SANS}`, w: 500, ls: '-.025em', lcase: 'none', lls: '0', lsize: 1 },
  dm: { name: 'DM Serif Display + DM Sans', mood: 'Classic contrast', display: `'DM Serif Display', ${SERIF}`, body: `'DM Sans', ${SANS}`, label: `'DM Sans', ${SANS}`, w: 400, ls: '-.01em', lcase: 'none', lls: '0', lsize: 1 },
  courier: { name: 'Courier Prime + Public Sans', mood: 'Typewriter', display: `'Courier Prime', ${MONO}`, body: `'Public Sans', ${SANS}`, label: `'Courier Prime', ${MONO}`, w: 700, ls: '-.035em', lcase: 'none', lls: '0', lsize: 1 },
};
function fontCSS(f) {
  return `:root{--display:${f.display};--body:${f.body};--label:${f.label};--display-w:${f.w};--display-ls:${f.ls};--label-case:${f.lcase};--label-ls:${f.lls};--label-size:${f.lsize}}`;
}
function fontPicker() {
  const cur = S.settings.font;
  return `<div class="pick-h">Font</div><div class="font-grid" role="radiogroup" aria-label="Font">${Object.keys(FONTS).map(k => {
    const f = FONTS[k];
    return `<button type="button" role="radio" class="font-card" data-font-pick="${k}" aria-checked="${cur === k}">
      <span class="fc-aa" style="font-family:${f.display.replace(/"/g, '&quot;')};font-weight:${f.w};letter-spacing:${f.ls}">Done by 4:55</span>
      <span class="fc-lbl" style="font-family:${f.label.replace(/"/g, '&quot;')};text-transform:${f.lcase};letter-spacing:${f.lls}">3:00 PM, Corner Pharmacy</span>
      <span class="tc-name">${f.name}</span><span class="tc-sub">${f.mood}${k === 'neue' ? ', default' : ''}</span></button>`;
  }).join('')}</div>`;
}

// ---------- themes ----------
const THEMES = {
  paper: { name: 'Paper', mood: 'White, black ink, a little sky',
    light: { bg: '#FFFFFF', surface: '#FFFFFF', sunk: '#F7F8FA', ink: '#111111', ink2: '#5C6268', ink3: '#8A8F95', line: '#E7E7E7', line2: '#D6D8DB', accent: '#6F96CC', accentInk: '#FFFFFF', accentSoft: '#EEF4FB', accentLine: '#C7D9EF', accentText: '#3E6698' },
    dark: { bg: '#0E0F11', surface: '#131417', sunk: '#191B1F', ink: '#F1F1EF', ink2: '#A3A8AE', ink3: '#71767D', line: '#25272B', line2: '#33363B', accent: '#9DBDE6', accentInk: '#0D1520', accentSoft: '#17202C', accentLine: '#2D4260', accentText: '#B6CEF0' } },
  sage: { name: 'Sage and mist', mood: 'Cool and quiet',
    light: { bg: '#F1F4F1', surface: '#FBFCFA', sunk: '#E6ECE7', ink: '#263330', ink2: '#4F5D58', ink3: '#76837E', line: '#DDE4DF', line2: '#C9D3CC', accent: '#4F7D69', accentInk: '#FFFFFF', accentSoft: '#E0EBE4', accentLine: '#A9C7B9', accentText: '#3B6452' },
    dark: { bg: '#131816', surface: '#1A211F', sunk: '#212926', ink: '#E4EBE7', ink2: '#AAB7B1', ink3: '#7F8C86', line: '#2A3330', line2: '#37423E', accent: '#8DBBA6', accentInk: '#102019', accentSoft: '#1E3029', accentLine: '#38594B', accentText: '#A9D1BF' } },
  dusk: { name: 'Dusk', mood: 'Evening sky',
    light: { bg: '#EEF1F5', surface: '#FAFBFD', sunk: '#E3E8EF', ink: '#232B38', ink2: '#4E5869', ink3: '#737D8F', line: '#DBE1EA', line2: '#C6CEDA', accent: '#D98C5F', accentInk: '#2B1A10', accentSoft: '#F6E3D6', accentLine: '#E8B898', accentText: '#8E4F2C' },
    dark: { bg: '#141922', surface: '#1B212C', sunk: '#222935', ink: '#E6EAF1', ink2: '#A9B2C2', ink3: '#7C8597', line: '#2A3240', line2: '#37404F', accent: '#E7A07A', accentInk: '#25160D', accentSoft: '#3A2A22', accentLine: '#6B4A37', accentText: '#F0B996' } },
  clay: { name: 'Stone and clay', mood: 'Warm and grounded',
    light: { bg: '#F3F0EC', surface: '#FCFBF9', sunk: '#EAE5DF', ink: '#2E2925', ink2: '#5A524C', ink3: '#81776F', line: '#E2DBD4', line2: '#D2C8BF', accent: '#A8636C', accentInk: '#FFFFFF', accentSoft: '#F1E1DF', accentLine: '#D9AEB2', accentText: '#7E4048' },
    dark: { bg: '#191614', surface: '#211D1A', sunk: '#29241F', ink: '#EEE8E3', ink2: '#B9AFA7', ink3: '#8A8079', line: '#332D28', line2: '#413933', accent: '#D9969E', accentInk: '#2A1316', accentSoft: '#3A2427', accentLine: '#6A444A', accentText: '#E8B1B7' } },
  tide: { name: 'Tide', mood: 'Clear and coastal',
    light: { bg: '#EDF3F5', surface: '#FAFCFD', sunk: '#E1EAEE', ink: '#1F2E35', ink2: '#4A5C64', ink3: '#71838B', line: '#D7E2E7', line2: '#C1D0D7', accent: '#3D7D92', accentInk: '#FFFFFF', accentSoft: '#DCEBF0', accentLine: '#9CC3D0', accentText: '#2B5E6F' },
    dark: { bg: '#11181B', surface: '#172024', sunk: '#1E292E', ink: '#E2ECEF', ink2: '#A6B8BF', ink3: '#7A8E96', line: '#26343A', line2: '#33434A', accent: '#7FBACB', accentInk: '#0C1A1F', accentSoft: '#1A3039', accentLine: '#335664', accentText: '#9DCFDD' } },
  lilac: { name: 'Lilac fog', mood: 'Soft and dreamy',
    light: { bg: '#F3F1F6', surface: '#FCFBFD', sunk: '#E9E5EF', ink: '#2B2733', ink2: '#575062', ink3: '#7D768A', line: '#E0DBE7', line2: '#CEC7D8', accent: '#7D6B9A', accentInk: '#FFFFFF', accentSoft: '#EAE4F2', accentLine: '#BDB0D2', accentText: '#5A4A75' },
    dark: { bg: '#16141A', surface: '#1D1A22', sunk: '#25212B', ink: '#ECE8F1', ink2: '#B5AEBF', ink3: '#878092', line: '#2F2A36', line2: '#3D3745', accent: '#B3A3D0', accentInk: '#1C1626', accentSoft: '#2C2538', accentLine: '#544867', accentText: '#C9BCE2' } },
  sunrise: { name: 'Sunrise', mood: 'Bright and hopeful',
    light: { bg: '#F7F3EA', surface: '#FFFDF8', sunk: '#EFE8DA', ink: '#2F2A20', ink2: '#5C5444', ink3: '#81786A', line: '#E7DFCE', line2: '#D8CDB7', accent: '#9C7124', accentInk: '#FFFFFF', accentSoft: '#F3E6C8', accentLine: '#DCC08A', accentText: '#76551A' },
    dark: { bg: '#18150F', surface: '#201C15', sunk: '#28231A', ink: '#F0EBE0', ink2: '#BDB4A3', ink3: '#8D8473', line: '#332D22', line2: '#423A2C', accent: '#E2B868', accentInk: '#271C08', accentSoft: '#3A2F17', accentLine: '#6B5528', accentText: '#EBCB8B' } },
};
const TOK = { bg: 'bg', surface: 'surface', sunk: 'sunk', ink: 'ink', ink2: 'ink-2', ink3: 'ink-3', line: 'line', line2: 'line-2', accent: 'accent', accentInk: 'accent-ink', accentSoft: 'accent-soft', accentLine: 'accent-line', accentText: 'accent-text' };
function themeCSS(t) {
  const decl = (c, dark) => Object.keys(TOK).map(k => `--${TOK[k]}:${c[k]}`).join(';') + `;--map-bg:${dark ? c.surface : c.sunk};--map-street:${dark ? c.line : c.surface};--map-major:${dark ? c.line2 : c.surface};color-scheme:${dark ? 'dark' : 'light'}`;
  return `:root{${decl(t.light, false)}}
:root[data-appearance="light"]{${decl(t.light, false)}}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]):not([data-appearance="light"]){${decl(t.dark, true)}}}
:root[data-theme="dark"]:not([data-appearance="light"]),:root[data-appearance="dark"]{${decl(t.dark, true)}}`;
}
function isDark() {
  const r = document.documentElement, a = S.settings.appearance;
  if (a === 'dark') return true; if (a === 'light') return false;
  if (r.getAttribute('data-theme') === 'dark') return true; if (r.getAttribute('data-theme') === 'light') return false;
  return matchMedia('(prefers-color-scheme: dark)').matches;
}
function applyTheme() {
  const st = S.settings;
  let el = document.getElementById('themeVars');
  if (!el) { el = document.createElement('style'); el.id = 'themeVars'; document.body.appendChild(el); }
  el.textContent = themeCSS(THEMES[st.theme] || THEMES.paper) + '\n' + fontCSS(FONTS[st.font] || FONTS.neue);
  const r = document.documentElement;
  if (st.appearance === 'system') r.removeAttribute('data-appearance'); else r.setAttribute('data-appearance', st.appearance);
}
function themePicker() {
  const st = S.settings, dk = isDark();
  return `<div class="pick-h">Color</div><div class="theme-grid" role="radiogroup" aria-label="Color theme">${Object.keys(THEMES).map(k => {
    const t = THEMES[k], c = dk ? t.dark : t.light;
    return `<button type="button" role="radio" class="theme-card" data-theme-pick="${k}" aria-checked="${st.theme === k}" style="--tb:${c.bg};--ts:${c.surface};--ta:${c.accent};--ti:${c.ink};--tsoft:${c.accentSoft}">
      <span class="tc-prev" aria-hidden="true"><span class="tc-bar"><span class="tc-chip"></span></span><span class="tc-line"></span><span class="tc-line short"></span><span class="tc-dot"></span></span>
      <span class="tc-name">${t.name}</span><span class="tc-sub">${t.mood}</span></button>`;
  }).join('')}</div>
  ${fontPicker()}
  <div class="field" style="margin-top:18px"><span class="lbl" id="apL">Appearance</span><div class="seg" role="radiogroup" aria-labelledby="apL">${['system', 'light', 'dark'].map(a => `<button type="button" role="radio" data-appear="${a}" aria-checked="${st.appearance === a}" aria-pressed="${st.appearance === a}">${icon(a === 'system' ? 'device' : a === 'light' ? 'sun' : 'moon')}${{ system: 'Auto', light: 'Light', dark: 'Dark' }[a]}</button>`).join('')}</div></div>`;
}
function bindThemePicker(rerender) {
  $$('[data-theme-pick]').forEach(b => b.onclick = () => { S.settings.theme = b.dataset.themePick; save(); applyTheme(); rerender(); const n = $(`[data-theme-pick="${S.settings.theme}"]`); n && n.focus(); });
  $$('[data-font-pick]').forEach(b => b.onclick = () => { S.settings.font = b.dataset.fontPick; save(); applyTheme(); rerender(); const n = $(`[data-font-pick="${S.settings.font}"]`); n && n.focus(); });
  $$('[data-appear]').forEach(b => b.onclick = () => { S.settings.appearance = b.dataset.appear; save(); applyTheme(); rerender(); const n = $(`[data-appear="${S.settings.appearance}"]`); n && n.focus(); });
}
function openTheme() {
  const root = $('#modalRoot'), prev = document.activeElement;
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); renderRailFoot(); prev && prev.focus && prev.focus(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  const draw = () => {
    root.innerHTML = `<div class="scrim" id="scrim"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="thTitle">
      <header><div><h2 class="h-page" id="thTitle" style="font-size:24px">Look and feel</h2><p class="small muted" style="margin:4px 0 0">Pick the colors and type that feel calm to you. It changes everywhere at once.</p></div><button class="icon-btn" id="thClose" aria-label="Close">${icon('x')}</button></header>
      <div style="margin-top:16px">${themePicker()}</div>
      <div class="row" style="justify-content:flex-end;margin-top:20px"><button class="btn primary" id="thDone">Done</button></div></div></div>`;
    $('#scrim').onclick = e => { if (e.target.id === 'scrim') close(); };
    $('#thClose').onclick = close; $('#thDone').onclick = close;
    bindThemePicker(draw);
  };
  draw();
  setTimeout(() => { const f = $(`[data-theme-pick="${S.settings.theme}"]`); f && f.focus(); }, 30);
}

// FLIP: animate list items from old to new positions after a re-render
function withFlip(fn) {
  const before = {};
  $$('[data-flip]').forEach(el => { before[el.dataset.flip] = el.getBoundingClientRect(); });
  fn();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('[data-flip]').forEach(el => {
    const a = before[el.dataset.flip];
    if (!a) { el.animate([{ opacity: 0.001, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.16,1,.3,1)' }); return; }
    const b = el.getBoundingClientRect(), dy = a.top - b.top;
    if (Math.abs(dy) < 1) return;
    el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
}

// ---------- routing ----------
const VIEWS = { setup: 'Setup', add: 'Tasks', plan: 'Workflow', map: 'Map' };
const VIEW_ICON = { setup: 'setup', add: 'tasks', plan: 'plan', map: 'map' };
function route() {
  let v = (location.hash || '').slice(1);
  if (!VIEWS[v]) v = 'plan';
  $$('.nav-link').forEach(a => {
    const k = a.dataset.view;
    const count = k === 'add' ? `<span class="count tnum">${S.tasks.length + S.fixed.length}</span>` : '';
    a.innerHTML = `${icon(VIEW_ICON[k])}<span>${VIEWS[k]}</span>${count}`;
    if (k === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  renderRailFoot();
  const main = $('#view');
  if (v === 'map' && U.view !== 'map') { U.drawRoute = true; U.mapView = null; }
  if (v === 'setup') main.innerHTML = renderSetup();
  if (v === 'add') main.innerHTML = renderAdd();
  if (v === 'plan') main.innerHTML = renderPlan();
  if (v === 'map') main.innerHTML = renderMap();
  bind(v);
  U.view = v;
  $$('[data-themebtn]').forEach(b => b.onclick = openTheme);
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); $('#view').focus({ preventScroll: true }); });

function renderRailFoot() {
  const c = S.settings.calendars, on = Object.keys(c).filter(k => c[k]);
  const names = { google: 'Google', apple: 'Apple', outlook: 'Outlook' };
  const th = THEMES[S.settings.theme] || THEMES.paper;
  $('#railFoot').innerHTML = (on.length
    ? `<div><span class="sync-dot"></span>${on.map(k => names[k]).join(', ')} connected</div><div>${S.settings.syncMode === 'two-way' ? 'Two-way sync' : 'Read-only'}${S.synced ? ', plan synced' : ''}</div>`
    : `<div><span class="sync-dot off"></span>No calendar connected</div><a href="#setup">Connect one</a>`)
    + `<div class="store-line ${STORE.mode}" title="${STORE.mode === 'cloud' ? 'Saved privately to your account. Open Mindless on any device to pick up where you left off.' : STORE.mode === 'offline' ? 'Can’t reach your account right now. Changes are kept in this browser and sync when it’s back.' : 'Saved in this browser only. Open Mindless on claude.ai while signed in to save to your account.'}">${icon(STORE.mode === 'cloud' ? 'check' : 'device')}${STORE.mode === 'cloud' ? 'Saved to your account' : STORE.mode === 'offline' ? 'Offline, saved here' : 'Saved on this device'}</div>`
    + `<button class="theme-mini" data-themebtn>${icon('palette')}<span>Look: ${th.name}</span></button>`;
  $$('#railFoot [data-themebtn]').forEach(b => b.onclick = openTheme);
}
const LOGO = `<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="currentColor"/><path d="M19 45 C19 33, 45 37, 45 24" fill="none" stroke="var(--accent-ink)" stroke-width="4.6" stroke-linecap="round"/><circle cx="19" cy="46" r="5.4" fill="currentColor" stroke="var(--accent-ink)" stroke-width="3.6"/><circle cx="45" cy="20" r="6.4" fill="var(--accent-ink)"/></svg>`;
const mobileTop = right => `<div class="mobile-top"><div class="brand">${LOGO}Mindless</div><div class="row" style="gap:6px"><button class="icon-btn" data-themebtn aria-label="Look and feel">${icon('palette')}</button>${right || ''}</div></div>`;

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2800);
}

// ================= SETUP =================
const SETUP_STEPS = [
  { t: 'Welcome', s: 'Your name and colors' },
  { t: 'Calendars', s: 'Plan around what’s booked' },
  { t: 'Places', s: 'Where your day starts' },
  { t: 'Energy', s: 'When you focus best' },
  { t: 'Getting around', s: 'Travel, buffers, grouping' },
];
const LAST_STEP = SETUP_STEPS.length - 1, PLACES_STEP = 2;
function renderSetup() {
  const i = Math.min(S.setupStep, LAST_STEP), st = S.settings;
  const nav = SETUP_STEPS.map((x, k) => `<button type="button" data-step="${k}" ${k === i ? 'aria-current="step"' : ''} class="${k < i ? 'done' : ''}"><span class="n">${k < i ? icon('check') : k + 1}</span><span><b>${x.t}</b><span class="s">${x.s}</span></span></button>`).join('');
  let body = '';
  if (i === 0) {
    body = `<h2 class="h-page">Welcome to Mindless</h2>
      <p class="lede">A few quick choices so your days fit you. Skip anything; sensible defaults fill the gaps, and you can change it all later.</p>
      <div class="panel" style="margin-top:20px"><div class="field"><label for="userName">What should we call you?</label><input class="input" id="userName" value="${esc(st.name || '')}" placeholder="Your first name" autocomplete="given-name"><span class="help">Used for your daily greeting. Leave blank to skip.</span></div></div>
      <h3 class="h-sec" style="margin:26px 0 4px">Pick your look</h3>
      ${themePicker()}`;
  }
  if (i === 1) {
    const cal = (k, name, logo, note, soon) => `<div class="cal-row"><div class="cal-logo" aria-hidden="true">${logo}</div><div class="grow"><b>${name}</b><div class="small muted">${note}</div></div>${soon ? '<span class="chip">Not available yet</span>' : st.calendars[k] ? `<span class="chip acc">${icon('check')}Connected</span><button class="btn sm ghost" data-cal="${k}">Disconnect</button>` : `<button class="btn sm" data-cal="${k}" ${GCAL.busy ? 'disabled' : ''}>${GCAL.busy ? 'Connecting…' : 'Connect'}</button>`}</div>`;
    body = `<h2 class="h-page">Connect your calendars</h2>
      <p class="lede">Mindless reads when you’re busy and plans tasks around it. You can skip this and add events by hand.</p>
      <div class="panel" style="margin-top:20px">
        ${cal('google', 'Google Calendar', 'G', 'Uses the Google Calendar connector in your Claude account. Claude asks you to allow it the first time.')}
        ${gErrHTML()}
        ${cal('apple', 'Apple Calendar', 'A', 'Subscribe it to Google Calendar to use it here', true)}
        ${cal('outlook', 'Outlook', 'O', 'Work, school or personal Microsoft account', true)}
      </div>
      <div class="field" style="margin-top:22px"><span class="lbl">After you approve a plan</span>
        <div class="choice-grid">
          <button class="choice" data-sync="two-way" aria-pressed="${st.syncMode === 'two-way'}"><b>Add it to my calendar</b><span class="muted">Reads busy times and writes plan blocks back. Re-plans update them.</span></button>
          <button class="choice" data-sync="read" aria-pressed="${st.syncMode === 'read'}"><b>Only read my calendar</b><span class="muted">Your calendar is never changed. The plan lives in Mindless.</span></button>
        </div></div>`;
  }
  if (i === 2) {
    body = `<h2 class="h-page">Where does your day happen?</h2>
      <p class="lede">These anchor every route. Travel times are measured from here.</p>
      <div class="panel form-grid" style="margin-top:20px">
        <div class="field span"><label for="homeAddr">Home</label><div class="addr-row"><input class="input" id="homeAddr" value="${esc(st.homeAddr)}" placeholder="Your street address" autocomplete="street-address">${pinBtn('home')}</div><span class="help">Pin it so routes start from your real location. Saved privately to your account.</span></div>
        <div class="field span"><label for="workAddr">Work or school</label><div class="addr-row"><input class="input" id="workAddr" value="${esc(st.workAddr)}" placeholder="Office, campus or cowork">${pinBtn('work')}</div></div>
        <div class="field"><label for="startAt">Start the day at</label><select class="input" id="startAt"><option value="home" ${st.startAt === 'home' ? 'selected' : ''}>Home</option><option value="work" ${st.startAt === 'work' ? 'selected' : ''}>Work or school</option></select></div>
        <div class="field"><span class="lbl">Plan between</span><div class="row" style="flex-wrap:nowrap"><input class="input tnum" type="time" id="dayStart" value="${toHM(st.dayStart)}" aria-label="Day starts"><span class="muted">and</span><input class="input tnum" type="time" id="dayEnd" value="${toHM(st.dayEnd)}" aria-label="Day ends"></div></div>
      </div>
      <h3 class="h-sec" style="margin:26px 0 4px">Your regular spots</h3>
      <p class="small muted" style="margin:0 0 12px">Rename these to the places you actually go and set their hours. Pin them on the real map and Mindless plans with real distances; unpinned spots stay on the illustrated map.</p>
      <div class="panel places-edit">${Object.keys(PLACES).filter(k => k !== 'home' && k !== 'work').map(k => { const P = PLACES[k]; return `<div class="pl-row"><input class="input" data-pname="${k}" value="${esc(P.name)}" aria-label="Name for the ${esc(PLACE_DEFAULTS[k].name)} spot"><span class="addr-row"><input class="input" data-paddr="${k}" value="${esc(P.addr || '')}" placeholder="Address (optional)" aria-label="${esc(P.name)} address">${pinBtn(k)}</span><span class="row" style="flex-wrap:nowrap;gap:6px"><input class="input tnum" type="time" data-popen="${k}" value="${toHM(Math.min(P.open, 1439))}" aria-label="${esc(P.name)} opens"><span class="muted small">to</span><input class="input tnum" type="time" data-pclose="${k}" value="${toHM(Math.min(P.close, 1439))}" aria-label="${esc(P.name)} closes"></span></div>`; }).join('')}</div>`;
  }
  if (i === 3) {
    const curves = { morning: 'M0 34 C 20 6, 40 4, 60 18 S 100 30, 120 34 S 160 38, 180 40', afternoon: 'M0 38 C 30 34, 50 26, 75 10 S 110 8, 130 26 S 165 38, 180 40', evening: 'M0 40 C 40 38, 80 34, 110 26 S 150 6, 180 10' };
    const lbl = { morning: ['Morning', '8 AM to noon'], afternoon: ['Afternoon', '1 to 4:30 PM'], evening: ['Evening', '5 to 8 PM'] };
    body = `<h2 class="h-page">When do you focus best?</h2>
      <p class="lede">Deep work goes into your peak. Errands and calls fill the dips.</p>
      <div class="choice-grid" style="margin-top:20px">${Object.keys(curves).map(k => `<button class="choice" data-peak="${k}" aria-pressed="${st.peak === k}"><b>${lbl[k][0]}</b><span class="muted tnum">${lbl[k][1]}</span><svg class="curve" viewBox="0 0 180 44" preserveAspectRatio="none" aria-hidden="true"><path d="${curves[k]}"/></svg></button>`).join('')}</div>
      <div class="panel form-grid" style="margin-top:16px">
        <div class="field"><label for="breakEvery">Take a break after</label><select class="input" id="breakEvery">${[60, 90, 120].map(v => `<option value="${v}" ${st.breakEvery === v ? 'selected' : ''}>${dur(v)} of work</option>`).join('')}</select></div>
        <div class="field"><label for="breakLen">Break length</label><select class="input" id="breakLen">${[5, 10, 15].map(v => `<option value="${v}" ${st.breakLen === v ? 'selected' : ''}>${v} min</option>`).join('')}</select><span class="help">A walk of 8 minutes or more counts as a break.</span></div>
      </div>`;
  }
  if (i === 4) {
    body = `<h2 class="h-page">How do you get around?</h2>
      <p class="lede">Pick every way you travel. You can switch modes on the map at any time.</p>
      <div class="choice-grid" style="margin-top:20px">${Object.keys(MODES).map(k => `<button class="choice" data-mode-opt="${k}" aria-pressed="${st.modes.includes(k)}">${icon(k)}<b>${MODES[k].label}</b></button>`).join('')}</div>
      <div class="panel form-grid" style="margin-top:16px">
        <div class="field"><label for="defMode">Usually</label><select class="input" id="defMode">${st.modes.map(k => `<option value="${k}" ${st.mode === k ? 'selected' : ''}>${MODES[k].label}</option>`).join('')}</select></div>
        <div class="field"><label for="buffer">Buffer before each stop</label><div class="range-row"><input type="range" id="buffer" min="0" max="15" step="1" value="${st.buffer}"><span class="tnum" id="bufferOut" style="width:52px;text-align:right">${st.buffer} min</span></div><span class="help">Time to find parking, a door, a seat.</span></div>
        <div class="field span"><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><span><b style="font-weight:500">Group nearby errands</b><br><span class="small muted">Finish one neighborhood before moving to the next.</span></span><button class="switch" role="switch" id="cluster" aria-checked="${st.cluster}" aria-label="Group nearby errands"></button></div></div>
      </div>`;
  }
  return `<div class="wrap">${mobileTop()}
    <div class="setup-top"><div><div class="eyebrow">Set up Mindless, step ${i + 1} of ${SETUP_STEPS.length}</div><div class="progress" aria-hidden="true"><span style="width:${(i + 1) / SETUP_STEPS.length * 100}%"></span></div></div><button class="btn sm ghost" id="setupAll">Skip setup</button></div>
    <div class="setup" style="margin-top:18px">
      <nav class="steps-nav" aria-label="Setup steps">${nav}</nav>
      <section class="setup-body">${body}
        <div class="setup-foot">
          <button class="btn ghost" id="setupBack" ${i === 0 ? 'disabled' : ''}>Back</button>
          <div class="row">${i < LAST_STEP ? `<button class="btn ghost" id="setupSkip">Skip this step</button><button class="btn primary" id="setupNext">Continue</button>` : `<button class="btn primary" id="setupDone">Save and add tasks</button>`}</div>
        </div>
      </section>
    </div></div>`;
}
function bindSetup() {
  const st = S.settings;
  $$('[data-step]').forEach(b => b.onclick = () => { readSetupInputs(); S.setupStep = +b.dataset.step; save(); route(); });
  $('#setupBack').onclick = () => { readSetupInputs(); S.setupStep = Math.max(0, S.setupStep - 1); save(); route(); };
  const next = () => { readSetupInputs(); S.setupStep = Math.min(LAST_STEP, S.setupStep + 1); save(); route(); window.scrollTo(0, 0); };
  $('#setupNext') && ($('#setupNext').onclick = next);
  $('#setupSkip') && ($('#setupSkip').onclick = () => { S.setupStep = Math.min(LAST_STEP, S.setupStep + 1); save(); route(); });
  $('#setupDone') && ($('#setupDone').onclick = () => { readSetupInputs(); S.onboarded = true; save(); refreshPlan(); toast('Preferences saved'); location.hash = 'add'; });
  $('#setupAll').onclick = () => { readSetupInputs(); S.onboarded = true; save(); refreshPlan(); toast('Using defaults. Change them any time in Setup.'); location.hash = 'add'; };
  bindThemePicker(() => { const n = $('#userName'); if (n) st.name = n.value.trim(); route(); });
  $$('[data-perms]').forEach(b => b.onclick = openPerms);
  $$('[data-cal]').forEach(b => b.onclick = () => { if (b.dataset.cal !== 'google') return; if (st.calendars.google) gcalDisconnect(); else gcalConnect(); });
  $$('[data-pname]').forEach(inp => inp.onchange = () => { readPlaces(); });
  $$('[data-paddr],[data-popen],[data-pclose]').forEach(inp => inp.onchange = () => { readPlaces(); });
  $$('[data-pin]').forEach(b => b.onclick = () => { readSetupInputs(); save(); openPinPicker(b.dataset.pin, () => route()); });
  $$('[data-sync]').forEach(b => b.onclick = () => { st.syncMode = b.dataset.sync; save(); route(); });
  $$('[data-peak]').forEach(b => b.onclick = () => { st.peak = b.dataset.peak; save(); route(); });
  $$('[data-mode-opt]').forEach(b => b.onclick = () => {
    const k = b.dataset.modeOpt, has = st.modes.includes(k);
    if (has && st.modes.length === 1) { toast('Keep at least one way to get around'); return; }
    st.modes = has ? st.modes.filter(x => x !== k) : st.modes.concat(k);
    if (!st.modes.includes(st.mode)) st.mode = st.modes[0];
    save(); route();
  });
  const buf = $('#buffer'); if (buf) buf.oninput = () => { $('#bufferOut').textContent = `${buf.value} min`; };
  const cl = $('#cluster'); if (cl) cl.onclick = () => { st.cluster = !st.cluster; cl.setAttribute('aria-checked', st.cluster); save(); };
}
function pinBtn(k) {
  const on = hasPin(k);
  return `<button type="button" class="btn sm ${on ? 'pinned' : ''}" data-pin="${k}" aria-label="${on ? 'Move' : 'Pin'} ${esc(PLACES[k].name)} on the map">${icon('pin')}${on ? 'Pinned' : 'Pin'}</button>`;
}
function readPlaces() {
  $$('[data-pname]').forEach(inp => {
    const k = inp.dataset.pname, o = { ...(S.places[k] || {}) };
    const name = inp.value.trim(), addr = ($(`[data-paddr="${k}"]`) || {}).value, op = ($(`[data-popen="${k}"]`) || {}).value, cl = ($(`[data-pclose="${k}"]`) || {}).value;
    if (name) o.name = name.slice(0, 60);
    if (addr != null) o.addr = addr.trim().slice(0, 120);
    if (op) o.open = hm(op);
    if (cl) o.close = hm(cl) >= 1439 ? 1440 : hm(cl);
    if (o.close != null && o.open != null && o.close <= o.open) { o.open = 0; o.close = 1440; }
    S.places[k] = o;
  });
  applyPlaces(); S.base = null; save(); refreshPlan();
}
function readSetupInputs() {
  if ($('[data-pname]')) readPlaces();
  const st = S.settings, v = id => $('#' + id) && $('#' + id).value;
  if (v('userName') != null) st.name = v('userName').trim();
  if (v('homeAddr') != null) st.homeAddr = v('homeAddr').trim();
  if (v('workAddr') != null) st.workAddr = v('workAddr').trim();
  applyPlaces();
  if (v('startAt')) st.startAt = v('startAt');
  if (v('dayStart')) st.dayStart = hm(v('dayStart'));
  if (v('dayEnd')) st.dayEnd = hm(v('dayEnd'));
  if (v('breakEvery')) st.breakEvery = +v('breakEvery');
  if (v('breakLen')) st.breakLen = +v('breakLen');
  if (v('defMode')) st.mode = v('defMode');
  if ($('#buffer')) st.buffer = +v('buffer');
  if ($('#homeAddr') || $('#breakEvery') || $('#defMode')) { S.base = null; U.diff = null; }
}

// ================= PARSER =================
const PLACE_WORDS = [[/pharmac|prescription|\bmeds\b/i, 'pharmacy'], [/post office|\bmail\b|package|\bship\b/i, 'post'], [/grocer|groceries|market/i, 'market'], [/dry clean|cleaners/i, 'cleaner'], [/\bgym\b|workout|\blift/i, 'gym'], [/librar/i, 'library'], [/birthday card|\bcard\b|stationer|paperleaf/i, 'paper'], [/marisol/i, 'friend'], [/dentist|dental/i, 'dentist'], [/caf[eé]|coffee/i, 'cafe'], [/\boffice\b|cowork/i, 'work']];
const NUMW = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, ninety: 90 };
const DEF_DUR = { market: 40, gym: 60, post: 10, pharmacy: 15, library: 10, paper: 15, friend: 10, cleaner: 10, dentist: 45, cafe: 30, work: 30 };
const VERBS = '(?:grab|drop|call|buy|pick|return|book|mail|email|go|get|finish|send|water|order|text|write|schedule|renew|clean)';
function splitDump(text) {
  const out = [];
  text.split(/\n|;/).forEach(line => {
    line.split(new RegExp(`,?\\s+and\\s+(?:then\\s+)?(?=(?:i\\s+(?:need\\s+to|should|have\\s+to|want\\s+to|gotta)\\s+)?${VERBS}\\b)|,\\s*(?=(?:and\\s+)?(?:i\\s+(?:need\\s+to|should|have\\s+to|want\\s+to|gotta)\\s+)?${VERBS}\\b)`, 'i')).forEach(p => { const q = (p || '').trim(); if (q.length > 2 && !/^(okay|ok|um|so|well|alright)[,.!]*$/i.test(q)) out.push(q); });
  });
  return out;
}
function parseLine(raw) {
  let s = ' ' + raw.replace(/^\s*(okay|ok|um|so)[,\s]+/i, '').trim() + ' ';
  s = s.replace(/\b(forty-five)\b/gi, '45').replace(new RegExp(`\\b(${Object.keys(NUMW).join('|')})\\b`, 'gi'), m => NUMW[m.toLowerCase()]);
  const tok = {};
  let m;
  if ((m = s.match(/\b(?:for\s+)?(?:about\s+)?(\d+(?:\.\d+)?)\s*(h|hr|hrs|hour|hours)\b/i))) { tok.dur = Math.round(parseFloat(m[1]) * 60); s = s.replace(m[0], ' '); }
  else if ((m = s.match(/\b(?:for\s+)?(?:about\s+)?(\d+)\s*(m|min|mins|minutes)\b/i))) { tok.dur = +m[1]; s = s.replace(m[0], ' '); }
  else if ((m = s.match(/\b(?:for\s+)?half an hour\b/i))) { tok.dur = 30; s = s.replace(m[0], ' '); }
  else if ((m = s.match(/\b(?:for\s+)?an hour\b/i))) { tok.dur = 60; s = s.replace(m[0], ' '); }
  if ((m = s.match(/\b(before|by)\s+(\d{1,2})(?::(\d\d))?\s*(am|pm)?\b/i))) {
    let h = +m[2]; const mm = +(m[3] || 0), ap = (m[4] || '').toLowerCase();
    if (ap === 'pm' && h < 12) h += 12; if (!ap && h < 8) h += 12;
    tok.deadline = h * 60 + mm; s = s.replace(m[0], ' ');
  }
  if ((m = s.match(/\btonight\b|\bthis evening\b/i))) { tok.window = [1080, 1260]; s = s.replace(m[0], ' '); }
  else if ((m = s.match(/\bthis morning\b/i))) { tok.window = [480, 720]; s = s.replace(m[0], ' '); }
  const remote = /^\s*(?:and\s+)?(?:i\s+(?:need\s+to|should|have\s+to|want\s+to|gotta)\s+)?(?:call|text|email|phone|message)\b/i.test(s);
  if (!remote) for (const [re, key] of PLACE_WORDS) if (re.test(s)) { tok.place = key; break; }
  if (/focus|write|draft|study|essay|report|research|book flights|slides|plan\b|deep/i.test(s)) tok.energy = 'high';
  else if (/\bcall|email|reply|text|pick up|drop|buy|mail|return|grab|water|order/i.test(s)) tok.energy = 'low';
  else tok.energy = 'med';
  s = s.replace(/[—–-]\s*needs focus/i, ' ').replace(/\bneeds focus\b/i, ' ');
  let title = s.replace(/^\s*(?:and\s+)?(?:i\s+(?:need\s+to|should|have\s+to|want\s+to|gotta)\s+)/i, '').replace(/\s+/g, ' ').replace(/^[\s,.\-—]+|[\s,.\-—]+$/g, '');
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (!tok.dur) tok.dur = tok.place ? DEF_DUR[tok.place] : (/\bcall\b/i.test(title) ? 15 : 30);
  return { id: nid('p'), title, dur: tok.dur, place: tok.place || null, deadline: tok.deadline ?? null, window: tok.window || null, energy: tok.energy, priority: tok.deadline != null ? 2 : 1 };
}
const ENERGY_LABEL = { high: 'Deep focus', med: 'Steady', low: 'Light' };
const DURS = [10, 15, 20, 30, 45, 60, 90, 120];
function parsedChips(p, scope) {
  const c = [];
  c.push(`<span class="chip tnum">${icon('clock')}<button type="button" data-cyc="${scope}:${p.id}" aria-label="Change duration, now ${p.dur} minutes" style="width:auto;padding:0 2px;border-radius:4px">${dur(p.dur)}</button></span>`);
  c.push(p.place ? `<span class="chip acc">${icon('pin')}${esc(PLACES[p.place].name)}<button type="button" data-rm="${scope}:${p.id}:place" aria-label="Remove place">${icon('x')}</button></span>` : `<span class="chip">${icon('pin')}Anywhere</span>`);
  if (p.deadline != null) c.push(`<span class="chip warn tnum">By ${fmt(p.deadline)}<button type="button" data-rm="${scope}:${p.id}:deadline" aria-label="Remove deadline">${icon('x')}</button></span>`);
  if (p.window) c.push(`<span class="chip tnum">${fmt(p.window[0])} to ${fmt(p.window[1])}<button type="button" data-rm="${scope}:${p.id}:window" aria-label="Remove time window">${icon('x')}</button></span>`);
  c.push(`<span class="chip">${icon(p.energy === 'high' ? 'focus' : p.energy === 'low' ? 'leaf' : 'bolt')}${ENERGY_LABEL[p.energy]}</span>`);
  return c.join('');
}


// ================= INTEGRATIONS =================
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
const nextDayKey = k => { const d = keyDate(k); d.setDate(d.getDate() + 1); return dayKey(d); };

function guessPlace(text) {
  const t = ' ' + String(text || '').toLowerCase() + ' ';
  for (const k of Object.keys(PLACES)) {
    const P = PLACES[k];
    if ((P.name && P.name.length > 3 && t.includes(P.name.toLowerCase())) || (P.addr && P.addr.length > 5 && t.includes(P.addr.toLowerCase()))) return k;
  }
  for (const [re, key] of PLACE_WORDS) if (re.test(t)) return key;
  return null;
}

// ---- AI reading (Claude, through the page's sample capability) ----
const AI = { ok: null };
async function aiApi() {
  const sm = window.claude && window.claude.use ? await window.claude.use('sample') : null;
  AI.ok = !!sm;
  if (!sm) throw new Error('AI reading isn’t available here. The quick reader still works.');
  return sm;
}
async function aiParse(text) {
  const sm = await aiApi();
  const places = Object.keys(PLACES).filter(k => k !== 'home').map(k => `${k}: ${PLACES[k].name}`).join('\n');
  const prompt = `You turn a person's messy to-do notes into tasks for a day planner. The day being planned is ${longDate(S.day)}.
Known places (key: name):
${places}

<notes>
${text.slice(0, 6000)}
</notes>

Reply with only a JSON array. One object per distinct task, in this shape:
{"title": "Pick up prescription", "dur": 15, "place": "pharmacy", "deadline": "17:00", "window": null, "energy": "low", "priority": 2}
Rules: title is short and starts with a verb, with no times or durations in it. dur is minutes (estimate if not given). place is one of the keys above, or null when the task can be done anywhere (calls, emails, online). deadline is "HH:MM" 24-hour or null. window is ["HH:MM","HH:MM"] when the note limits when it can happen (tonight = ["18:00","21:00"]) or null. energy is "high" for focused work, "low" for errands and quick admin, otherwise "med". priority is 3 urgent, 2 normal, 1 can wait. Skip filler that is not a task.`;
  const arr = await sm.json(prompt, { modelTier: 'quick' }).catch(e => {
    if (e && e.code === 'not_granted') { AI.ok = false; throw new Error('AI reading wasn’t allowed. The quick reader still works.'); }
    if (e && e.code === 'rate_limited') throw new Error('AI is busy. Try again in a moment.');
    throw new Error('AI couldn’t read that. The quick reader’s result is kept.');
  });
  if (!Array.isArray(arr)) return null;
  const toMin = v => (typeof v === 'string' && /^\d{1,2}:\d{2}$/.test(v)) ? hm(v) : null;
  return arr.filter(x => x && typeof x.title === 'string' && x.title.trim()).slice(0, 40).map(x => {
    const d = Math.min(480, Math.max(5, Math.round(+x.dur || 30)));
    const w = Array.isArray(x.window) && toMin(x.window[0]) != null && toMin(x.window[1]) > toMin(x.window[0]) ? [toMin(x.window[0]), toMin(x.window[1])] : null;
    return { id: nid('p'), title: x.title.trim().slice(0, 120), dur: d, place: PLACES[x.place] && x.place !== 'home' ? x.place : null, deadline: toMin(x.deadline), window: w, energy: ['high', 'med', 'low'].includes(x.energy) ? x.energy : 'med', priority: [1, 2, 3].includes(+x.priority) ? +x.priority : 2 };
  });
}

// ---- Google Calendar (the viewer's own connector, through the page's mcp capability) ----
const GSERVER = 'Google Calendar';
const GCAL = { busy: false, last: null, pulledFor: null, err: null };
const MARK = '#mindless';
async function mcpApi() {
  const m = window.claude && window.claude.use ? await window.claude.use('mcp') : null;
  if (!m) throw { code: 'unavailable_here', message: 'window.claude.use("mcp") returned nothing' };
  return m;
}
function gErr(e) {
  const c = e && e.code;
  const M = {
    unavailable_here: 'Calendar access only works when Mindless is opened on claude.ai (web or desktop app) while you’re signed in.',
    not_granted: 'Calendar access isn’t turned on for this page. Open the page’s Permissions menu and allow Google Calendar.',
    capability_disabled: 'This view of Claude can’t reach connectors. Open Mindless on claude.ai in a browser or the desktop app.',
    capability_removed: 'This view of Claude can’t reach connectors. Open Mindless on claude.ai in a browser or the desktop app.',
    server_not_connected: 'Google Calendar isn’t connected to your Claude account. Add it in Claude: Settings, then Connectors, then try again.',
    server_not_found: 'Google Calendar isn’t connected to your Claude account. Add it in Claude: Settings, then Connectors, then try again.',
    needs_reauth: 'Your Google Calendar connection expired. Reconnect it in Claude: Settings, then Connectors.',
    selection_required: 'You have more than one Google Calendar connection. Pick one in the prompt Claude shows, then try again.',
    not_in_manifest: 'Google Calendar was turned off for this page. Turn it back on from the page’s Permissions menu.',
    approval_required: 'Claude needs your OK first. Press Connect again and choose Allow.',
    consent_required: 'Claude needs your OK first. Press Connect again and choose Allow.',
    blocked_by_policy: 'Your organization blocks Google Calendar here.',
    server_unavailable: 'Google Calendar is having trouble right now. Try again in a minute.',
    rate_limited: 'Too many calendar requests at once. Try again in a minute.',
    tool_error: 'Google Calendar rejected the request.',
  };
  return M[c] || 'Google Calendar didn’t respond. Try again in a moment.';
}
function setGErr(e) {
  GCAL.err = e ? { code: (e && e.code) || 'unknown', text: gErr(e), detail: String((e && e.message) || '').slice(0, 160) } : null;
}
function gErrHTML() {
  if (!GCAL.err) return '';
  const e = GCAL.err;
  return `<div class="gerr" role="alert">${icon('x')}<div><b>${esc(e.text)}</b><span class="mono small muted">Code: ${esc(e.code)}${e.detail && e.detail !== e.text ? ` · ${esc(e.detail)}` : ''}</span>${['not_granted', 'not_in_manifest'].includes(e.code) ? '<button class="btn sm" data-perms style="margin-top:8px">Open permissions</button>' : ''}</div></div>`;
}
async function openPerms() {
  const pm = window.claude && window.claude.use ? await window.claude.use('permissions') : null;
  if (!pm) { toast('Open the Permissions menu at the top of this page.'); return; }
  try { await pm.manage(); } catch (e) { toast('Open the Permissions menu at the top of this page.'); }
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function gcall(m, tool, input) {
  try { return await m.callTool(GSERVER, tool, input); }
  catch (e) {
    if (e && e.retryable) { await sleep(Math.min(8000, e.retryAfterMs || 1500)); return await m.callTool(GSERVER, tool, input); }
    throw e;
  }
}
const localISO = (day, min) => `${day}T${toHM(Math.max(0, Math.min(1439, Math.round(min))))}:00`;
async function gcalConnect() {
  setGErr(null);
  S.settings.calendars.google = true; save();
  const ok = await gcalPull(true);
  if (!ok) { S.settings.calendars.google = false; save(); }
  route();
}
function gcalDisconnect() {
  S.settings.calendars.google = false; setGErr(null);
  S.fixed = S.fixed.filter(f => !f.gid); S.synced = false; S.base = null;
  save(); refreshPlan(); route(); toast('Google Calendar disconnected. Blocks already added stay on your calendar.');
}
async function gcalPull(manual) {
  if (GCAL.busy) return false;
  GCAL.busy = true; if (manual && U.view) route();
  try {
    const m = await mcpApi();
    if (manual) {
      // check the connection first, so a missing or expired connector gets a clear message
      const lt = await m.listTools(GSERVER).catch(() => null);
      const sv = lt && (lt.servers || []).find(x => x.server === GSERVER);
      if (lt && !sv) throw { code: 'server_not_connected', message: 'Not in your Claude connectors' };
      if (sv && sv.authStatus === 'needs_reauth') throw { code: 'needs_reauth', message: 'Connection expired' };
    }
    const r = await gcall(m, 'list_events', { startTime: localISO(S.day, 0), endTime: `${nextDayKey(S.day)}T00:00:00`, orderBy: 'startTime', pageSize: 100 });
    const pl = r && r.payload, evs = (pl && Array.isArray(pl.events)) ? pl.events : [];
    if (pl && typeof pl === 'string') throw { code: 'tool_error', message: pl.slice(0, 160) };
    const own = new Set(S.gcal.ids || []);
    const mapped = [];
    evs.forEach(ev => {
      if (!ev || ev.status === 'cancelled' || own.has(ev.id) || !ev.start || !ev.start.dateTime || !ev.end) return;
      if ((ev.description || '').includes(MARK)) return;
      if ((ev.attendees || []).some(a => a.self && a.responseStatus === 'declined')) return;
      const a = new Date(ev.start.dateTime), b = new Date(ev.end.dateTime || ev.start.dateTime);
      const start = dayKey(a) === S.day ? a.getHours() * 60 + a.getMinutes() : 0;
      const end = dayKey(b) === S.day ? b.getHours() * 60 + b.getMinutes() : 1440;
      if (end <= start) return;
      const place = S.placeFor[ev.id] || guessPlace((ev.summary || '') + ' ' + (ev.location || '')) || S.settings.home;
      mapped.push({ id: 'g' + String(ev.id).replace(/[^a-zA-Z0-9]/g, '').slice(-24), gid: ev.id, title: ev.summary || 'Busy', start, end, place, source: 'Google Calendar', loc: ev.location || '' });
    });
    const sig = arr => JSON.stringify(arr.map(f => [f.gid, f.start, f.end, f.title]));
    const changed = sig(S.fixed.filter(f => f.gid)) !== sig(mapped);
    S.fixed = S.fixed.filter(f => !f.gid).concat(mapped);
    GCAL.last = nowMin(); GCAL.pulledFor = S.day; setGErr(null);
    if (changed) { save(); refreshPlan(); }
    if (manual) toast(mapped.length ? `Connected. ${mapped.length} ${mapped.length === 1 ? 'event' : 'events'} from Google Calendar for ${dayWord()}` : `Connected. No timed events on Google Calendar for ${dayWord()}`);
    return true;
  } catch (e) {
    setGErr(e);
    if (manual) toast(gErr(e));
    try { console.warn('[Mindless] Google Calendar', e && e.code, e && e.message); } catch (_) {}
    return false;
  } finally { GCAL.busy = false; if (U.view) route(); }
}
async function gcalPush() {
  if (GCAL.busy || !U.plan) return;
  GCAL.busy = true; route();
  let made = 0;
  try {
    const m = await mcpApi();
    for (const id of (S.gcal.ids || [])) {
      try { await gcall(m, 'delete_event', { eventId: id, notificationLevel: 'NONE' }); }
      catch (e) { if (e && e.code !== 'tool_error') throw e; }
    }
    S.gcal.ids = []; save();
    const steps = U.plan.steps.filter(x => (x.type === 'task' || x.type === 'travel') && !(isToday() && x.end <= S.clock) && !S.checked[x.type === 'task' ? x.task.id : '']);
    for (const x of steps) {
      const summary = x.type === 'task' ? x.task.title : `${MODES[x.mode].label} to ${PLACES[x.to].name}`;
      const where = x.type === 'task' ? (x.task.place ? PLACES[x.place] : null) : PLACES[x.to];
      const why = x.type === 'task' && x.reasons && x.reasons.length ? x.reasons.join(' ') + '\n\n' : '';
      const input = { summary, startTime: localISO(S.day, x.start), endTime: localISO(S.day, x.end), description: `${why}Planned by Mindless ${MARK}` };
      if (where && where.addr) input.location = where.addr;
      const r = await gcall(m, 'create_event', input);
      const ev = r && r.payload; if (ev && ev.id) { S.gcal.ids.push(ev.id); made++; }
    }
    S.gcal.day = S.day; S.synced = true; save();
    setGErr(null); toast(`${made} ${made === 1 ? 'block' : 'blocks'} on your Google Calendar`);
  } catch (e) { setGErr(e); toast(gErr(e)); }
  finally { GCAL.busy = false; route(); }
}
function resyncIfSynced() {
  if (S.synced && S.settings.calendars.google && S.settings.syncMode === 'two-way') gcalPush();
}

// ---- which day is being planned ----
function daySwitch() {
  const t = todayKey(), tm = tomorrowKey();
  return `<div class="seg day-seg" role="group" aria-label="Day to plan"><button type="button" data-day="${t}" aria-pressed="${S.day === t}">Today</button><button type="button" data-day="${tm}" aria-pressed="${S.day === tm}">Tomorrow</button></div>`;
}
function bindDaySwitch() {
  $$('[data-day]').forEach(b => b.onclick = () => {
    const k = b.dataset.day; if (k === S.day) return;
    if (S.day === todayKey() && k === tomorrowKey()) {
      const done = S.tasks.filter(t => S.checked[t.id]);
      if (done.length) S.history = [{ day: S.day, done: done.length, total: S.tasks.length, travelMin: U.plan ? planStats(U.plan).travelMin : 0 }].concat(S.history).slice(0, 60);
      S.tasks = S.tasks.filter(t => !S.checked[t.id]);
    }
    S.tasks.forEach(t => delete t.pinned);
    S.day = k; S.fixed = []; S.base = null; S.checked = {}; S.synced = false; S.gcal = { ids: [], day: null }; U.diff = null; U.undo = null;
    save(); refreshPlan(); route();
    if (S.settings.calendars.google) gcalPull(false);
  });
}
function loadSample() {
  S.tasks = SAMPLE_TASKS().map(t => ({ ...t, id: nid('t'), source: 'Sample' }));
  if (!S.settings.calendars.google) S.fixed = SAMPLE_FIXED().map(f => ({ ...f, id: nid('f'), source: 'Sample event' }));
  S.base = null; S.checked = {}; S.synced = false; U.diff = null;
  save(); refreshPlan(); route(); toast('Sample day loaded. Remove any of it from the Tasks screen.');
}

// ================= ADD TASKS =================
const DUMP_SAMPLE = `return library books, 10 min
buy a birthday card for Theo before 6pm
pick up spare keys from Marisol
book flights for December, needs focus, 30 min`;

function renderAdd() {
  if (U.dumpText == null) { U.dumpText = ''; U.parsed = []; }
  const tabs = [['dump', 'text', 'Brain dump'], ['form', 'form', 'Form'], ['voice', 'mic', 'Voice'], ['import', 'import', 'Import']];
  let pane = '';
  if (U.addTab === 'dump') {
    pane = `<div class="field"><label for="dump">Type everything on your mind</label>
      <textarea class="input" id="dump" spellcheck="true" placeholder="${esc(DUMP_SAMPLE)}">${esc(U.dumpText)}</textarea>
      <span class="help">One per line, or run them together. Mindless picks out times, places and deadlines; tap a chip to fix it.</span></div>
      <div class="parsed" id="parsed" aria-live="polite">${renderParsed(U.parsed, 'dump')}</div>
      <div class="row" style="margin-top:14px;justify-content:flex-end">${AI.ok !== false ? `<button class="btn ghost" id="aiParse" ${U.dumpText.trim() && !U.aiBusy ? '' : 'disabled'}>${icon('bolt')}${U.aiBusy ? 'Reading…' : 'Read it with AI'}</button>` : ''}<button class="btn primary" id="addParsed" ${U.parsed.length ? '' : 'disabled'}>${icon('plus')}Add ${U.parsed.length} ${U.parsed.length === 1 ? 'task' : 'tasks'}</button></div>`;
  }
  if (U.addTab === 'form') {
    const e = U.formErr;
    pane = `<form id="taskForm" class="form-grid" novalidate>
      <div class="field span"><label for="fTitle">Task</label><input class="input" id="fTitle" placeholder="Return the library books" ${e.title ? 'aria-invalid="true" aria-describedby="fTitleErr"' : ''}>${e.title ? `<span class="err" id="fTitleErr">${e.title}</span>` : ''}</div>
      <div class="field"><label for="fDur">How long</label><select class="input" id="fDur">${DURS.map(d => `<option value="${d}" ${d === 30 ? 'selected' : ''}>${dur(d)}</option>`).join('')}</select></div>
      <div class="field"><label for="fPlace">Where</label><select class="input" id="fPlace"><option value="">Anywhere</option>${Object.keys(PLACES).filter(k => k !== 'home').map(k => `<option value="${k}">${esc(PLACES[k].name)}</option>`).join('')}</select><span class="help">Opening hours are checked automatically.</span></div>
      <div class="field span"><span class="lbl" id="fEnergyL">Focus needed</span><div class="seg" role="radiogroup" aria-labelledby="fEnergyL" id="fEnergy">${['high', 'med', 'low'].map(k => `<button type="button" role="radio" data-en="${k}" aria-pressed="${k === 'med'}" aria-checked="${k === 'med'}">${ENERGY_LABEL[k]}</button>`).join('')}</div></div>
      <div class="field"><label for="fBy">Finish by <span class="muted">(optional)</span></label><input class="input tnum" type="time" id="fBy"></div>
      <div class="field"><label for="fPri">Priority</label><select class="input" id="fPri"><option value="3">High</option><option value="2" selected>Normal</option><option value="1">Low, can wait</option></select></div>
      <div class="field"><label for="fFrom">Only between <span class="muted">(optional)</span></label><input class="input tnum" type="time" id="fFrom"></div>
      <div class="field"><label for="fTo">and</label><input class="input tnum" type="time" id="fTo" ${e.win ? 'aria-invalid="true"' : ''}>${e.win ? `<span class="err">${e.win}</span>` : ''}</div>
      <div class="span row" style="justify-content:flex-end"><button class="btn primary" type="submit">${icon('plus')}Add task</button></div>
    </form>`;
  }
  if (U.addTab === 'voice') {
    const rec = U.voice === 'rec';
    pane = `<div style="text-align:center"><button class="mic ${rec ? 'rec' : ''}" id="mic" ${SR ? '' : 'disabled'} aria-pressed="${rec}" aria-label="${rec ? 'Stop recording' : 'Start recording'}">${icon('mic')}</button>
      <div class="small muted">${rec ? 'Listening… tap to stop' : U.voice === 'done' ? 'Got it. Review what Mindless heard.' : U.voice === 'err' ? esc(U.voiceErr) : SR ? 'Tap and talk through your day.' : 'Voice input needs Chrome, Edge or Safari. Brain dump works everywhere.'}</div></div>
      <div class="transcript" style="margin-top:16px" aria-live="polite">${U.voiceText ? esc(U.voiceText) : '<span class="muted">Your words appear here.</span>'}${rec ? '<span class="caret"></span>' : ''}</div>
      ${U.voice === 'done' ? `<div class="parsed">${renderParsed(U.voiceParsed, 'voice')}</div><div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn ghost" id="voiceAgain">Record again</button><button class="btn primary" id="addVoice">${icon('plus')}Add ${U.voiceParsed.length} tasks</button></div>` : ''}`;
  }
  if (U.addTab === 'import') {
    const g = S.settings.calendars.google;
    pane = `<div class="import-src"><div class="row" style="justify-content:space-between"><b>Google Calendar</b>${g ? `<span class="chip acc">${icon('check')}Connected</span>` : `<button class="btn sm" data-gconnect>Connect</button>`}</div>
        <p class="small muted" style="margin:8px 0 0">${g ? `Events for ${esc(dayWord())} come in as busy time. ${GCAL.last ? `Last checked ${fmt(GCAL.last)}.` : ''}` : 'Read your events so tasks fit around them. Uses your Google Calendar connection in Claude.'}</p>
        ${g ? `<div class="row" style="margin-top:10px"><button class="btn sm" data-gsync ${GCAL.busy ? 'disabled' : ''}>${icon('refresh')}${GCAL.busy ? 'Checking…' : 'Check for new events'}</button></div>` : ''}${gErrHTML()}</div>
      <div class="import-src"><b>From another app</b>
        <p class="small muted" style="margin:8px 0 10px">Copy a list from Todoist, Notes or an email and paste it here. Each line becomes a task.</p>
        <textarea class="input" id="pasteList" style="min-height:96px" placeholder="Paste a list"></textarea>
        <div class="row" style="justify-content:flex-end;margin-top:10px"><button class="btn primary" id="doImport">${icon('import')}Read this list</button></div></div>
      <div class="import-src small muted">Apple Calendar and Outlook aren’t available yet. You can add events by hand on the Workflow screen with Re-plan.</div>`;
  }
  const items = S.fixed.map(f => ({ kind: 'fixed', start: f.start, f })).concat(S.tasks.map(t => ({ kind: 'task', t }))).sort((a, b) => (a.kind === 'fixed' ? 0 : 1) - (b.kind === 'fixed' ? 0 : 1) || (a.start || 0) - (b.start || 0));
  const list = items.map((x, ix) => { const head = (ix === 0 || items[ix - 1].kind !== x.kind) ? `<li class="inbox-h">${x.kind === 'fixed' ? 'On your calendar' : 'To do'}</li>` : '';
    if (x.kind === 'fixed') { const f = x.f; return head + `<li><span class="kind fixed" aria-hidden="true"></span><div class="grow"><div class="t">${esc(f.title)}</div><div class="meta"><span class="chip tnum">${fmt(f.start)} to ${fmt(f.end)}</span><span class="chip">${icon('pin')}<select class="chip-sel" data-fplace="${f.id}" aria-label="Where is ${esc(f.title)}?">${Object.keys(PLACES).map(k => `<option value="${k}" ${k === f.place ? 'selected' : ''}>${esc(PLACES[k].name)}</option>`).join('')}</select></span><span class="chip">${icon('calendar')}${esc(f.source)}</span></div></div><button class="icon-btn" data-delf="${f.id}" aria-label="Remove ${esc(f.title)}">${icon('x')}</button></li>`; }
    const t = x.t;
    return head + `<li><span class="kind" aria-hidden="true"></span><div class="grow"><div class="t">${esc(t.title)}</div><div class="meta"><span class="chip tnum">${dur(t.dur)}</span><span class="chip">${icon('pin')}${t.place ? esc(PLACES[t.place].name) : 'Anywhere'}</span>${t.deadline != null ? `<span class="chip warn tnum">By ${fmt(t.deadline)}</span>` : ''}${t.window ? `<span class="chip tnum">${fmt(t.window[0])} to ${fmt(t.window[1])}</span>` : ''}<span class="chip">${ENERGY_LABEL[t.energy]}</span></div></div><button class="icon-btn" data-delt="${t.id}" aria-label="Remove ${esc(t.title)}">${icon('x')}</button></li>`;
  }).join('');
  return `<div class="wrap">${mobileTop()}
    <div class="row" style="justify-content:space-between;align-items:center"><div class="eyebrow">${esc(longDate(S.day))}</div>${daySwitch()}</div>
    <h1 class="h-page" style="margin-top:6px">What needs doing ${esc(dayWord())}?</h1>
    <p class="lede">Add tasks however is easiest. Mindless works out the order, the route and the timing.</p>
    <div class="add-grid">
      <section class="panel" aria-label="Add tasks">
        <div class="tabs" role="tablist">${tabs.map(([k, ic, l]) => `<button role="tab" id="tab-${k}" aria-selected="${U.addTab === k}" aria-controls="addPane" data-tab="${k}">${icon(ic)}${l}</button>`).join('')}</div>
        <div id="addPane" role="tabpanel" aria-labelledby="tab-${U.addTab}">${pane}</div>
      </section>
      <section aria-label="Your list">
        <div class="list-head"><h2 class="h-sec">${isToday() ? 'Today’s' : 'Your'} list</h2><span class="small muted tnum">${S.tasks.length} tasks, ${S.fixed.length} events</span></div>
        <div class="panel" style="padding:4px 18px">${items.length ? `<ul class="inbox">${list}</ul>` : `<div style="padding:28px 0;text-align:center" class="muted">Nothing here yet. Add a task on the left, or import from a calendar.<div style="margin-top:12px"><button class="btn sm" id="loadSample">Load a sample day</button></div></div>`}</div>
        <div class="build-bar"><a class="btn accent" href="#plan" id="buildBtn" ${S.tasks.length ? '' : 'aria-disabled="true"'}>${icon('plan')}Build my workflow</a></div>
      </section>
    </div></div>`;
}
function renderParsed(arr, scope) {
  if (!arr.length) return `<div class="small muted" style="padding:12px 0">Nothing recognized yet.</div>`;
  return arr.map(p => `<div class="parsed-row"><div class="t">${esc(p.title)}</div><div class="chips">${parsedChips(p, scope)}</div></div>`).join('');
}
function addTasks(arr, source) {
  arr.forEach(p => S.tasks.push({ ...p, id: nid('t'), source }));
  S.base = null; U.diff = null; S.synced = false; save(); refreshPlan();
}
function bindAdd() {
  $$('[data-tab]').forEach(b => b.onclick = () => { U.addTab = b.dataset.tab; route(); $(`#tab-${U.addTab}`).focus(); });
  const tabList = $('[role="tablist"]');
  tabList.onkeydown = e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const keys = ['dump', 'form', 'voice', 'import']; let i = keys.indexOf(U.addTab);
    i = (i + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length; U.addTab = keys[i]; route(); $(`#tab-${U.addTab}`).focus();
  };
  // chips (shared by dump and voice)
  $('#addPane').onclick = e => {
    const rm = e.target.closest('[data-rm]'), cy = e.target.closest('[data-cyc]');
    if (!rm && !cy) return;
    const [scope, id, field] = (rm || cy).dataset[rm ? 'rm' : 'cyc'].split(':');
    const arr = scope === 'dump' ? U.parsed : U.voiceParsed, p = arr.find(x => x.id === id);
    if (rm) p[field] = field === 'deadline' ? null : null;
    if (cy) p.dur = DURS[(DURS.indexOf(p.dur) + 1) % DURS.length] || 30;
    const host = scope === 'dump' ? $('#parsed') : $('.parsed');
    host.innerHTML = renderParsed(arr, scope);
  };
  const dump = $('#dump');
  if (dump) {
    let t;
    dump.oninput = () => { clearTimeout(t); t = setTimeout(() => {
      U.dumpText = dump.value; U.parsed = splitDump(dump.value).map(parseLine);
      $('#parsed').innerHTML = renderParsed(U.parsed, 'dump');
      const b = $('#addParsed'); b.disabled = !U.parsed.length; b.innerHTML = `${icon('plus')}Add ${U.parsed.length} ${U.parsed.length === 1 ? 'task' : 'tasks'}`;
      const ai = $('#aiParse'); if (ai) ai.disabled = !dump.value.trim() || U.aiBusy;
    }, 220); };
    const ai = $('#aiParse');
    if (ai) ai.onclick = async () => {
      U.dumpText = dump.value; U.aiBusy = true; route();
      try { const r = await aiParse(U.dumpText); if (r && r.length) { U.parsed = r; toast(`AI found ${r.length} ${r.length === 1 ? 'task' : 'tasks'}. Check the chips, then add.`); } else toast('AI couldn’t read that. The quick reader’s result is kept.'); }
      catch (e) { toast(e.message || 'AI is unavailable right now'); }
      U.aiBusy = false; if (U.view === 'add') route();
    };
    $('#addParsed').onclick = () => { const n = U.parsed.length; addTasks(U.parsed, 'Brain dump'); U.dumpText = ''; U.parsed = []; toast(`Added ${n} ${n === 1 ? 'task' : 'tasks'}`); route(); };
  }
  const form = $('#taskForm');
  if (form) {
    $$('#fEnergy button').forEach(b => b.onclick = () => $$('#fEnergy button').forEach(x => { const on = x === b; x.setAttribute('aria-pressed', on); x.setAttribute('aria-checked', on); }));
    form.onsubmit = e => {
      e.preventDefault();
      const title = $('#fTitle').value.trim(), from = $('#fFrom').value, to = $('#fTo').value, by = $('#fBy').value;
      U.formErr = {};
      if (!title) U.formErr.title = 'Give the task a name so you can find it in your plan.';
      if ((from && !to) || (!from && to)) U.formErr.win = 'Add both times, or leave both empty.';
      else if (from && to && hm(to) <= hm(from)) U.formErr.win = 'The end time needs to be after the start time.';
      if (Object.keys(U.formErr).length) { route(); $('#fTitle').value = title; ($('[aria-invalid="true"]') || $('#fTitle')).focus(); return; }
      const en = $('#fEnergy [aria-pressed="true"]').dataset.en;
      addTasks([{ title, dur: +$('#fDur').value, place: $('#fPlace').value || null, energy: en, priority: +$('#fPri').value, deadline: by ? hm(by) : null, window: from ? [hm(from), hm(to)] : null }], 'Form');
      toast(`Added “${title}”`); route();
    };
  }
  const mic = $('#mic');
  if (mic) mic.onclick = () => {
    if (U.voice === 'rec') { U._rec && U._rec.stop(); return; }
    if (!SR) return;
    const rec = new SR(); U._rec = rec;
    rec.lang = navigator.language || 'en-US'; rec.continuous = true; rec.interimResults = true;
    let finalText = '';
    rec.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) finalText += r[0].transcript + ' '; else interim += r[0].transcript; }
      U.voiceText = (finalText + interim).trim();
      const tr = $('.transcript'); if (tr) tr.innerHTML = esc(U.voiceText) + '<span class="caret"></span>';
    };
    rec.onerror = e => { U.voice = 'err'; U.voiceErr = e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'Microphone access was blocked here. Use Brain dump instead, or try again after allowing the microphone.' : e.error === 'no-speech' ? 'Didn’t catch anything. Tap to try again.' : 'Voice stopped unexpectedly. Tap to try again.'; if (U.view === 'add') route(); };
    rec.onend = () => { if (U.voice !== 'rec') return; finishVoice((finalText || U.voiceText).trim()); };
    U.voice = 'rec'; U.voiceText = ''; route();
    try { rec.start(); } catch (e) { U.voice = 'err'; U.voiceErr = 'Voice input couldn’t start here. Use Brain dump instead.'; route(); }
  };
  function finishVoice(text) {
    U.voiceText = text; U.voiceParsed = text ? splitDump(text).map(parseLine) : [];
    U.voice = text ? 'done' : 'idle'; route();
  }
  $('#voiceAgain') && ($('#voiceAgain').onclick = () => { U.voice = 'idle'; U.voiceText = ''; route(); });
  $('#addVoice') && ($('#addVoice').onclick = () => { const n = U.voiceParsed.length; addTasks(U.voiceParsed, 'Voice'); U.voice = 'idle'; U.voiceText = ''; toast(`Added ${n} tasks from voice`); route(); });
  $$('[data-gconnect]').forEach(b => b.onclick = () => gcalConnect());
  $$('[data-perms]').forEach(b => b.onclick = openPerms);
  $$('[data-gsync]').forEach(b => b.onclick = () => gcalPull(true));
  $('#doImport') && ($('#doImport').onclick = () => {
    const txt = $('#pasteList').value.trim();
    if (!txt) { toast('Paste a list first'); return; }
    const lines = txt.split(/\n+/).map(l => l.replace(/^\s*([-*•–]|\d+[.)]|\[[ x]?\])\s*/i, '').trim()).filter(l => l.length > 1);
    U.addTab = 'dump'; U.dumpText = lines.join('\n'); U.parsed = lines.map(parseLine); route();
    toast(`Read ${lines.length} ${lines.length === 1 ? 'line' : 'lines'}. Check them, then add.`);
  });
  $$('[data-fplace]').forEach(sel => sel.onchange = () => {
    const f = S.fixed.find(x => x.id === sel.dataset.fplace); if (!f) return;
    f.place = sel.value; if (f.gid) S.placeFor[f.gid] = sel.value;
    S.base = null; save(); refreshPlan(); toast(`${f.title}: ${PLACES[f.place].name}`);
  });
  bindDaySwitch();
  $('#loadSample') && ($('#loadSample').onclick = loadSample);
  $$('[data-delt]').forEach(b => b.onclick = () => { S.tasks = S.tasks.filter(t => t.id !== b.dataset.delt); S.synced = false; S.base = null; U.diff = null; save(); refreshPlan(); route(); });
  $$('[data-delf]').forEach(b => b.onclick = () => { S.fixed = S.fixed.filter(f => f.id !== b.dataset.delf); S.synced = false; S.base = null; U.diff = null; save(); refreshPlan(); route(); });
  const bb = $('#buildBtn'); bb.onclick = e => {
    if (!S.tasks.length) { e.preventDefault(); toast('Add at least one task first'); return; }
    U.loading = true; U.firstPlan = true;
  };
}

// ================= PLAN =================
function placeLabel(k) { return k ? PLACES[k].name : 'Anywhere'; }
function greeting() {
  const c = S.clock, n = (S.settings.name || '').trim();
  const g = c < 720 ? 'Good morning' : c < 1020 ? 'Good afternoon' : 'Good evening';
  return n ? `${g}, ${esc(n)}` : g;
}
function headline(p, ps) {
  return `Everything’s done by <span class="tnum">${fmt(ps.finishAt)}</span><span class="soft">${p.unscheduled.length ? `, with ${p.unscheduled.length} left for tomorrow.` : '.'}</span>`;
}
function rationale(p) {
  const st = p.settings, bits = [];
  const tasks = p.steps.filter(s => s.type === 'task');
  const deep = tasks.filter(s => s.task.energy === 'high');
  if (deep.length) {
    const inPk = deep.every(s => s.start >= PEAKS[st.peak][0] && s.start < PEAKS[st.peak][1]);
    bits.push(inPk ? `deep work lands in your ${st.peak} peak` : `deep work takes the longest open block before its deadline`);
  }
  const areas = []; tasks.forEach(s => { if (s.task.place) { const a = PLACES[s.task.place].area; if (areas[areas.length - 1] !== a) areas.push(a); } });
  const uniq = [...new Set(areas)];
  if (uniq.length > 1) bits.push(`errands are grouped by neighborhood`);
  const closing = tasks.filter(s => s.task.place && PLACES[s.task.place].close < 1440 && PLACES[s.task.place].close - s.end < 120);
  if (closing.length) bits.push(`${PLACES[closing[0].task.place].name} is reached before it closes`);
  if (!bits.length) return 'Tasks are ordered to keep travel short and fit around your calendar.';
  const s = bits.length > 1 ? bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1] : bits[0];
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}
const stepId = s => s.type === 'task' ? s.task.id : s.event.fromTask ? s.event.fromTask.id : s.event.id;
const stepTitle = s => s.type === 'task' ? s.task.title : s.event.title;
function isStepDone(p, s, i) { return (p.baseTime != null && i < p.keptCount) || !!S.checked[stepId(s)]; }

function nowNext(p) {
  const c = S.clock, steps = p.steps;
  if (!isToday()) {
    const first = steps.find(s => s.type === 'task' || s.type === 'fixed');
    return `<section class="nownext" aria-label="Day ahead"><div class="nn-now"><div class="nn-k">Planned for ${esc(dayWord())}</div><div class="nn-t">${first ? esc(stepTitle(first)) : 'Nothing yet'}</div><div class="nn-s">${first ? `First up at ${fmt(first.start)}, at ${esc(PLACES[first.place].name)}.` : ''}</div></div><div class="nn-next"><div class="nn-k">Check-offs</div><div class="nn-t2 muted">Open on ${esc(longDate(S.day))} to tick things off as you go.</div></div></section>`;
  }
  const cur = steps.find(s => s.start <= c && c < s.end && s.type !== 'free');
  const real = steps.map((s, i) => ({ s, i })).filter(x => (x.s.type === 'task' || x.s.type === 'fixed') && x.s.start >= c && x.s !== cur && !S.checked[stepId(x.s)]);
  const nx = real[0];
  let nowT, nowS, nowAct = '';
  if (!cur) {
    if (c < steps[0].start) { nowT = 'Your day hasn’t started'; nowS = `First up at ${fmt(steps[0].start)}.`; }
    else if (!nx) { nowT = 'All done for today'; nowS = 'Nothing else is planned. Enjoy the evening.'; }
    else { nowT = 'Free time'; nowS = `Nothing scheduled until ${fmt(nx.s.start)}.`; }
  } else if (cur.type === 'travel') { nowT = `Heading to ${PLACES[cur.to].name}`; nowS = `${MODES[cur.mode].label}, arrive about ${fmt(cur.end)}.`; }
  else if (cur.type === 'break') { nowT = 'Taking a break'; nowS = `Back to it at ${fmt(cur.end)}.`; }
  else {
    nowT = stepTitle(cur); nowS = `Until ${fmt(cur.end)}, at ${esc(PLACES[cur.place].name)}.`;
    const id = stepId(cur);
    if (cur.type === 'task') nowAct = S.checked[id] ? `<span class="chip acc">${icon('check')}Done</span>` : `<button class="btn sm" data-check="${id}">${icon('check')}Mark done</button>`;
  }
  let next = `<div class="nn-t2 muted">Nothing after this</div>`;
  if (nx) {
    const prev = steps[nx.i - 1];
    const leave = prev && prev.type === 'travel' && prev.start > c ? `, leave by ${fmt(prev.start)}` : '';
    next = `<div class="nn-t2">${esc(stepTitle(nx.s))}</div><div class="nn-s tnum">${fmt(nx.s.start)} at ${esc(PLACES[nx.s.place].name)}${leave}</div>`;
  }
  return `<section class="nownext" aria-label="Now and next">
    <div class="nn-now"><div class="nn-k"><span class="pulse" aria-hidden="true"></span>Now, <span class="tnum">${fmt(c)}</span></div><div class="nn-t">${esc(nowT)}</div><div class="nn-s">${nowS}</div>${nowAct ? `<div style="margin-top:10px">${nowAct}</div>` : ''}</div>
    <div class="nn-next"><div class="nn-k">Next</div>${next}</div>
  </section>`;
}

function renderSteps(p) {
  const c = isToday() ? S.clock : -1;
  const out = [];
  let nowPlaced = false;
  const nowLi = `<li class="now-li" aria-label="Now, ${fmt(c)}"><div class="time tnum">${fmtShort(c)}</div><div class="now-dot" aria-hidden="true"></div><div class="now-line"><span>Now</span></div></li>`;
  p.steps.forEach((s, i) => {
    if (c >= 0 && !nowPlaced && s.start >= c && i > 0) { out.push(nowLi); nowPlaced = true; }
    if (!nowPlaced && s.start < c && c < s.end && s.type !== 'travel' && s.type !== 'free') { /* now line goes after the current step */ }
    if (s.type === 'travel') { out.push(`<li class="leg"><div class="time tnum">${fmtShort(s.start)}</div><div class="node"></div><div class="body">${icon(s.mode)}<b>${MODES[s.mode].label} ${s.minutes} min</b><span>to ${esc(PLACES[s.to].name)}, ${s.miles.toFixed(1)} mi${s.buffer ? `, plus ${s.buffer} min buffer` : ''}</span><a class="leg-dir" href="${esc(gmDir(s.from, s.to, s.mode))}" target="_blank" rel="noopener" aria-label="Directions to ${esc(PLACES[s.to].name)} in Google Maps">Directions</a></div></li>`); return; }
    if (s.type === 'break') { out.push(`<li class="leg brk"><div class="time tnum">${fmtShort(s.start)}</div><div class="node"></div><div class="body">${icon('leaf')}<b style="color:inherit">Break, ${dur(s.end - s.start)}</b><span class="muted">Stretch, refill your water.</span></div></li>`); return; }
    if (s.type === 'free') { if (s.end - s.start >= 3) out.push(`<li class="leg"><div class="time tnum">${fmtShort(s.start)}</div><div class="node"></div><div class="body">${icon('pause')}<span>Open time, ${dur(s.end - s.start)}</span></div></li>`); return; }
    const id = stepId(s), done = isStepDone(p, s, i), kept = p.baseTime != null && i < p.keptCount;
    const live = s.start <= c && c < s.end;
    const tag = U.diff && U.diff.map[id] ? `<span class="chip acc">${U.diff.map[id]}</span>` : '';
    const sel = U.sel === s.place ? 'is-sel' : '';
    if (s.type === 'fixed') {
      const ft = s.event.fromTask;
      out.push(`<li class="${ft ? 'is-pinned' : 'is-fixed'} ${done ? 'is-done' : ''} ${live ? 'is-live' : ''} ${sel}" data-flip="${id}" data-place="${s.place}"><div class="time tnum">${fmt(s.start)}<small>${fmt(s.end)}</small></div><div class="node"></div><div class="body"><div class="step">
        ${ft ? `<button class="check" role="checkbox" aria-checked="${done}" data-check="${id}" ${kept ? 'disabled' : ''} aria-label="${esc(s.event.title)} done">${icon('check')}</button>` : `<span class="cal-ic" aria-hidden="true">${icon('calendar')}</span>`}
        <div class="grow"><div class="title">${esc(s.event.title)}</div><div class="where">${icon('pin')}${esc(PLACES[s.place].name)}<span>${icon(ft ? 'lock' : 'calendar')}${esc(s.event.source)}</span>${tag}</div></div>
        ${ft ? `<button class="icon-btn" data-pin="${ft.id}" aria-pressed="true" aria-label="Unlock ${esc(ft.title)} so Mindless can move it">${icon('lock')}</button>` : ''}</div></div></li>`);
      return;
    }
    const t = s.task, r = s.reasons || [];
    out.push(`<li class="${done ? 'is-done' : ''} ${live ? 'is-live' : ''} ${sel}" data-flip="${id}" data-place="${s.place}"><div class="time tnum">${fmt(s.start)}<small>${fmt(s.end)}</small></div><div class="node"></div><div class="body"><div class="step">
      <button class="check" role="checkbox" aria-checked="${done}" data-check="${id}" ${kept ? 'disabled' : ''} aria-label="${esc(t.title)} done">${icon('check')}</button>
      <div class="grow">
        <div class="title">${esc(t.title)}</div>
        <div class="where">${icon('pin')}${t.place ? esc(PLACES[t.place].name) : `Anywhere, at ${esc(PLACES[s.place].name)}`}<span class="tnum">${dur(t.dur)}</span>${tag}</div>
        ${done || !r.length ? '' : `<p class="hint">${esc(r[0])}${r.length > 1 ? ` <button type="button" class="why-btn" data-why aria-expanded="false" aria-controls="why-${id}">Why here?</button>` : ''}</p>${r.length > 1 ? `<p class="hint more" id="why-${id}" hidden>${r.slice(1).map(esc).join(' ')}</p>` : ''}`}
      </div>
      ${done ? '' : `<button class="icon-btn" data-pin="${t.id}" aria-pressed="false" aria-label="Lock ${esc(t.title)} at ${fmt(s.start)}" title="Lock this time">${icon('unlock')}</button>`}
    </div></div></li>`);
  });
  if (c >= 0 && !nowPlaced && p.steps.length && c >= p.steps[0].start && c < p.stats.finishAt) out.push(nowLi);
  return out.join('');
}

function renderPlan() {
  if (!S.tasks.length && !S.fixed.length) {
    const first = !S.onboarded && !S.history.length;
    return `<div class="wrap">${mobileTop()}<div style="max-width:540px;margin:12vh auto 0;text-align:center"><div class="eyebrow">${greeting()}. <span class="muted">${esc(longDate(S.day))}</span></div><h1 class="h-page" style="margin-top:10px">${first ? 'Let’s plan your first day' : `Your ${isToday() ? 'day' : esc(dayWord())} is clear`}</h1><p class="lede" style="margin-inline:auto">${first ? 'Tell Mindless what’s on your plate. It works out the order, the route and the timing, and remembers everything for next time.' : 'Add a few tasks and Mindless will plan the calmest, quickest way through them.'}</p>${first ? `<div class="row" style="justify-content:center;margin-top:6px"><a class="btn sm ghost" href="#setup">Set your preferences first</a></div>` : ''}<div class="row" style="justify-content:center;margin-top:18px"><a class="btn primary" href="#add">${icon('plus')}Add tasks</a><button class="btn" id="loadSample">Load a sample day</button></div></div></div>`;
  }
  if (U.loading) {
    setTimeout(() => { U.loading = false; refreshPlan(); if (U.view === 'plan') { route(); } }, 950);
    return `<div class="wrap">${mobileTop()}<div class="eyebrow">${greeting()}</div>
      <h1 class="h-page" style="margin-top:10px">Planning your day…</h1>
      <p class="lede">Checking ${S.tasks.length} tasks against opening hours, travel times and ${S.fixed.length} calendar events.</p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:30px;max-width:720px" aria-hidden="true">${[120, 30, 88, 30, 64, 64].map(h => `<div class="skel" style="height:${h}px"></div>`).join('')}</div></div>`;
  }
  if (!U.plan) refreshPlan();
  if (!U.plan.steps.length) {
    const late = isToday() && S.clock >= S.settings.dayEnd - 30;
    return `<div class="wrap">${mobileTop()}<div style="max-width:560px;margin:12vh auto 0;text-align:center"><div class="eyebrow">${greeting()}. <span class="muted">${esc(longDate(S.day))}</span></div><h1 class="h-page" style="margin-top:10px">${late ? 'Today’s planning window has closed' : 'Nothing fits in the time left'}</h1><p class="lede" style="margin-inline:auto">${late ? `You plan between ${fmt(S.settings.dayStart)} and ${fmt(S.settings.dayEnd)}. Your ${S.tasks.length} ${S.tasks.length === 1 ? 'task is' : 'tasks are'} saved.` : 'Try shorter tasks, or widen your planning hours.'}</p><div class="row" style="justify-content:center;margin-top:18px">${isToday() ? `<button class="btn primary" data-day="${tomorrowKey()}">Plan tomorrow instead</button>` : ''}<a class="btn" href="#setup">Change planning hours</a></div></div></div>`;
  }
  const p = U.plan, ps = planStats(p), st = p.settings;
  const calOn = Object.keys(st.calendars).filter(k => st.calendars[k]);
  const calNames = { google: 'Google Calendar', apple: 'Apple Calendar', outlook: 'Outlook' };
  const blocks = p.steps.filter(s => s.type === 'task' || s.type === 'travel').length;
  const doneCount = p.steps.filter((s, i) => s.type === 'task' && isStepDone(p, s, i)).length, taskCount = p.steps.filter(s => s.type === 'task').length;
  const banner = U.diff ? `<div class="banner" role="status">${icon('refresh')}<div class="grow"><b>${U.diffWhy ? esc(U.diffWhy) : `Re-planned at ${fmt(S.clock)}.`}</b> ${U.diff.moved.length} moved, ${U.diff.added.length} added${U.diff.dropped.length ? `, ${U.diff.dropped.length} moved to tomorrow` : ''}.${S.synced && st.syncMode === 'two-way' ? ' Your calendar was updated.' : ''}</div>${U.undo ? `<button class="btn sm" id="undo">${icon('undo')}Undo</button>` : ''}<button class="icon-btn" id="dismissBanner" aria-label="Dismiss">${icon('x')}</button></div>` : '';
  const savedLine = ps.saved >= 5
    ? `That’s ${dur(ps.saved)} less travel and waiting than doing your list in the order you wrote it.`
    : 'Your list was already in a good order. Mindless kept it close and fitted it around your calendar.';
  const anim = U.firstPlan ? 'enter' : '';
  U.firstPlan = false;
  return `<div class="wrap ${anim}">${mobileTop(`<button class="btn sm" data-replan>${icon('refresh')}Re-plan</button>`)}
    <header class="plan-head">
      <div class="eyebrow">${greeting()}. <span class="muted">${esc(longDate(S.day))}${isToday() ? '' : ' (tomorrow)'}</span></div>
      <h1 class="h-display">${headline(p, ps)}</h1>
      <p class="lede" style="margin-top:0">${savedLine} ${rationale(p)}</p>
      <div class="row"><button class="btn primary" data-replan>${icon('refresh')}Re-plan</button><a class="btn" href="#map">${icon('map')}See it on a map</a></div>
    </header>
    ${banner}
    <div class="plan-grid">
      <section aria-label="Workflow">
        ${nowNext(p)}
        <div class="tl-head"><h2 class="h-sec">${isToday() ? 'Today’s' : 'Tomorrow’s'} workflow</h2><span class="small muted tnum">${doneCount} of ${taskCount} done</span></div>
        <div class="meter" aria-hidden="true"><span style="width:${taskCount ? doneCount / taskCount * 100 : 0}%"></span></div>
        <ol class="tl">${renderSteps(p)}</ol>
      </section>
      <aside class="aside">
        <div class="panel facts-panel tnum">
          <div class="fact"><span class="k">Travel</span><span class="v">${dur(ps.travelMin)}</span></div>
          <div class="fact"><span class="k">Waiting</span><span class="v">${dur(ps.waitMin)}</span></div>
          <div class="fact"><span class="k">Errand stops</span><span class="v">${p.stats.stops}</span></div>
          <div class="fact"><span class="k">Getting around</span><span class="v" style="display:flex;align-items:center;gap:6px">${icon(st.mode)}${MODES[st.mode].label}</span></div>
        </div>
        <div class="panel"><h3>Calendar</h3>
          ${calOn.length ? `<div class="cal-mini">
              ${calOn.map(k => `<div class="r"><span><span class="sync-dot"></span>${calNames[k]}</span><span class="muted">${st.syncMode === 'two-way' ? 'Two-way' : 'Read-only'}</span></div>`).join('')}
              <div class="muted">Planned around ${S.fixed.length} busy ${S.fixed.length === 1 ? 'block' : 'blocks'}.</div>
            </div>
            <button class="btn sm ghost" data-gsync style="margin-top:10px" ${GCAL.busy ? 'disabled' : ''}>${icon('refresh')}${GCAL.busy ? 'Working…' : 'Check for new events'}</button>
            ${st.syncMode === 'two-way' ? (S.synced ? `<div class="chip acc" style="margin-top:12px">${icon('check')}Plan is on your calendar</div><p class="small muted" style="margin:8px 0 0">Re-plans update these blocks automatically.</p>` : `<button class="btn primary" id="syncBtn" style="width:100%;margin-top:14px" ${GCAL.busy ? 'disabled' : ''}>${icon('calendar')}${S.gcal.ids.length ? 'Update your calendar' : 'Add plan to calendar'}</button><p class="small muted" style="margin:8px 0 0">${blocks} blocks go to ${calNames[calOn[0]]}.</p>`) : '<p class="small muted" style="margin:10px 0 0">Read-only: your calendar won’t change.</p>'}`
            : `<p class="small muted" style="margin:0 0 12px">Connect a calendar to plan around meetings and add this plan to it.</p><a class="btn sm" href="#setup">Connect a calendar</a>`}
        </div>
        <div class="panel"><h3>Didn’t fit today</h3>
          ${p.unscheduled.length ? `<ul class="miss">${p.unscheduled.map(u => `<li><b style="font-weight:500">${esc(u.task.title)}</b><div class="muted">${esc(u.why)}</div><div class="row" style="margin-top:8px"><button class="btn sm" data-tomorrow="${u.task.id}">Move to ${isToday() ? 'tomorrow' : 'the next day'}</button><button class="btn sm ghost" data-trim="${u.task.id}">Make it shorter</button></div></li>`).join('')}</ul>` : `<p class="small muted" style="margin:0">Everything fits, with room to breathe.</p>`}
        </div>
        <div class="panel"><h3>Adjust</h3>
          <p class="small muted" style="margin:0 0 10px">Lock a step to keep its time. Re-plan moves everything else.</p>
          <div class="row"><a class="btn sm" href="#add">${icon('plus')}Add a task</a><a class="btn sm ghost" href="#setup">Preferences</a></div>
        </div>
        ${S.history.length ? `<div class="panel"><h3>Recent days</h3><ul class="hist tnum">${S.history.slice(0, 5).map(h => `<li><span>${esc(keyDate(h.day).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }))}</span><span class="muted">${h.done} of ${h.total} done${h.travelMin ? `, ${dur(h.travelMin)} travel` : ''}</span></li>`).join('')}</ul></div>` : ''}
      </aside>
    </div></div>`;
}

function bindPlan() {
  $('#loadSample') && ($('#loadSample').onclick = loadSample);
  bindDaySwitch();
  $$('[data-gsync]').forEach(b => b.onclick = () => gcalPull(true));
  $$('[data-replan]').forEach(b => b.onclick = openReplan);
  $('#undo') && ($('#undo').onclick = doUndo);
  $('#dismissBanner') && ($('#dismissBanner').onclick = () => { U.diff = null; U.diffWhy = null; route(); });
  $('#syncBtn') && ($('#syncBtn').onclick = gcalPush);
  $$('[data-pin]').forEach(b => b.onclick = () => togglePin(b.dataset.pin));
  $$('[data-check]').forEach(b => b.onclick = () => {
    const id = b.dataset.check, on = !S.checked[id];
    if (on) S.checked[id] = true; else delete S.checked[id];
    save();
    const t = taskById(id) || S.fixed.find(f => f.id === id);
    withFlip(route);
    const again = $(`.tl [data-check="${id}"]`); again && again.focus();
    if (on) toast(`Done: ${t ? t.title : 'step'}`);
  });
  $$('[data-why]').forEach(b => b.onclick = () => {
    const open = b.getAttribute('aria-expanded') === 'true', more = document.getElementById(b.getAttribute('aria-controls'));
    b.setAttribute('aria-expanded', !open); b.textContent = open ? 'Why here?' : 'Less'; more.hidden = open;
  });
  $$('.tl > li').forEach((li, i) => li.style.setProperty('--i', Math.min(i, 14)));
  $$('[data-tomorrow]').forEach(b => b.onclick = () => { const t = taskById(b.dataset.tomorrow); S.tasks = S.tasks.filter(x => x !== t); const c = { ...t }; delete c.pinned; S.later.push({ for: nextDayKey(S.day), task: c }); save(); refreshPlan(); toast(`“${t.title}” moved to ${longDate(nextDayKey(S.day))}`); route(); });
  $$('[data-trim]').forEach(b => b.onclick = () => { const t = taskById(b.dataset.trim); t.dur = Math.max(10, Math.round(t.dur * 0.6 / 5) * 5); save(); refreshPlan(); toast(`Shortened to ${dur(t.dur)}`); route(); });
}

function togglePin(id) {
  const t = taskById(id); if (!t) return;
  if (t.pinned) { delete t.pinned; toast(`Unlocked. Mindless can move “${t.title}” now.`); }
  else {
    const s = U.plan.steps.find(x => x.type === 'task' && x.task.id === id);
    t.pinned = { start: s.start, end: s.end, place: s.place };
    toast(`Locked at ${fmt(s.start)}`);
  }
  save(); refreshPlan(); withFlip(route); resyncIfSynced();
}

// ---------- re-plan ----------
function makeBase(plan, clock, delay) {
  // keep everything that has finished by `clock`; the step in progress finishes, plus any delay
  const kept = []; let loc = plan.settings.startAt === 'work' ? 'work' : plan.settings.home, time = clock;
  const doneIds = [];
  for (const s of plan.steps) {
    if (s.start >= clock) break;
    kept.push(s);
    if (s.type === 'task') { doneIds.push(s.task.id); loc = s.place; }
    if (s.type === 'fixed') { doneIds.push(s.event.fromTask ? s.event.fromTask.id : s.event.id); loc = s.place; }
    if (s.type === 'travel') loc = s.to;
    time = Math.max(clock, s.end);
  }
  return { time: time + delay, loc, kept, doneIds };
}
function openReplan() {
  const startC = isToday() ? Math.max(S.settings.dayStart, S.clock) : S.settings.dayStart;
  const R = { clock: startC, late: false, delay: 30, skip: false, skipId: '', add: false, addText: '', ev: false, evTitle: '', evStart: toHM(Math.min(1380, Math.ceil((startC + 30) / 15) * 15)), evEnd: toHM(Math.min(1439, Math.ceil((startC + 60) / 15) * 15)), preview: null };
  U.R = R;
  const root = $('#modalRoot');
  const prevFocus = document.activeElement;
  const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', onKey); prevFocus && prevFocus.focus && prevFocus.focus(); };
  const onKey = e => { if (e.key === 'Escape') close(); if (e.key === 'Tab') { const f = $$('.dialog button, .dialog select, .dialog input', root).filter(x => !x.disabled); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } } };
  document.addEventListener('keydown', onKey);
  const remainingTasks = () => U.plan.steps.filter(s => s.type === 'task' && s.start >= R.clock).map(s => s.task);
  const draw = () => {
    const rt = remainingTasks(); if (!R.skipId && rt[0]) R.skipId = rt[0].id;
    let inner;
    if (!R.preview) {
      inner = `<header><div><h2 class="h-page" id="rpTitle" style="font-size:24px">What changed?</h2><p class="small muted" style="margin:4px 0 0">Mindless keeps what’s done and locked, and re-orders the rest.</p></div><button class="icon-btn" id="rpClose" aria-label="Close">${icon('x')}</button></header>
        <div class="field" style="margin-top:14px"><label for="rpClock">Re-plan from <span class="muted">(${isToday() ? 'now' : 'start of the day'} by default)</span></label><input class="input tnum" type="time" id="rpClock" value="${toHM(R.clock)}"></div>
        <div class="opt-list">
          <div class="opt" data-on="${R.late}"><label><input type="checkbox" id="rpLate" ${R.late ? 'checked' : ''}>I’m running behind</label>${R.late ? `<div class="more"><select class="input" id="rpDelay" aria-label="How far behind">${[15, 30, 45, 60].map(d => `<option value="${d}" ${d === R.delay ? 'selected' : ''}>${d} min</option>`).join('')}</select></div>` : ''}</div>
          <div class="opt" data-on="${R.skip}"><label><input type="checkbox" id="rpSkip" ${R.skip ? 'checked' : ''} ${rt.length ? '' : 'disabled'}>Skip a task today</label>${R.skip ? `<div class="more"><select class="input" id="rpSkipId" aria-label="Task to skip">${rt.map(t => `<option value="${t.id}" ${t.id === R.skipId ? 'selected' : ''}>${esc(t.title)}</option>`).join('')}</select></div>` : ''}</div>
          <div class="opt" data-on="${R.add}"><label><input type="checkbox" id="rpAdd" ${R.add ? 'checked' : ''}>Something new to fit in</label>${R.add ? `<div class="more"><input class="input" id="rpAddT" value="${esc(R.addText)}" placeholder="Buy a birthday card before 6pm, 15 min" aria-label="New task" style="flex:1;min-width:200px"></div>` : ''}</div>
          <div class="opt" data-on="${R.ev}"><label><input type="checkbox" id="rpEv" ${R.ev ? 'checked' : ''}>A meeting came up</label>${R.ev ? `<div class="more"><input class="input" id="rpEvT" value="${esc(R.evTitle)}" placeholder="Meeting name" aria-label="Meeting name" style="flex:1;min-width:160px"><input class="input tnum" type="time" id="rpEvS" value="${R.evStart}" aria-label="Starts"><span class="muted">to</span><input class="input tnum" type="time" id="rpEvE" value="${R.evEnd}" aria-label="Ends"></div>` : ''}</div>
        </div>
        <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn ghost" id="rpCancel">Cancel</button><button class="btn primary" id="rpPreview">Preview changes</button></div>`;
    } else {
      const { plan, diff } = R.preview, ps = planStats(plan), old = planStats(U.plan);
      const rows = [];
      diff.added.forEach(id => { const t = R.preview.tasks.find(x => x.id === id); rows.push(`<li><span>${esc(t ? t.title : id)}</span><span class="chip acc">Added</span></li>`); });
      diff.moved.forEach(m => { const t = R.preview.tasks.find(x => x.id === m.id); rows.push(`<li><span>${esc(t.title)}</span><span class="chip tnum">${m.d < 0 ? `${dur(-m.d)} earlier` : `${dur(m.d)} later`}</span></li>`); });
      diff.dropped.forEach(id => { const t = S.tasks.find(x => x.id === id); rows.push(`<li><span>${esc(t ? t.title : id)}</span><span class="chip warn">${R.skip && id === R.skipId ? 'Skipped' : 'Moves to tomorrow'}</span></li>`); });
      inner = `<header><div><h2 class="h-page" style="font-size:24px">Here’s the new plan</h2><p class="small muted tnum" style="margin:4px 0 0">Finishes at ${fmt(ps.finishAt)}${ps.finishAt !== old.finishAt ? `, was ${fmt(old.finishAt)}` : ', same as before'}.</p></div><button class="icon-btn" id="rpClose" aria-label="Close">${icon('x')}</button></header>
        ${rows.length ? `<ul class="diff">${rows.join('')}</ul>` : `<p class="muted" style="margin-top:14px">Nothing needs to move. Your plan still works.</p>`}
        <p class="small muted" style="margin-top:12px">Locked steps and calendar events stay where they are.</p>
        <div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn ghost" id="rpBack">Back</button><button class="btn primary" id="rpApply">${icon('check')}Use this plan</button></div>`;
    }
    root.innerHTML = `<div class="scrim" id="scrim"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="rpTitle">${inner}</div></div>`;
    $('#scrim').onclick = e => { if (e.target.id === 'scrim') close(); };
    $('#rpClose').onclick = close;
    if (!R.preview) {
      $('#rpCancel').onclick = close;
      $('#rpClock').onchange = e => { if (e.target.value) { R.clock = hm(e.target.value); R.skipId = ''; draw(); $('#rpClock').focus(); } };
      $('#rpAddT') && ($('#rpAddT').oninput = e => { R.addText = e.target.value; });
      $('#rpLate').onchange = e => { R.late = e.target.checked; draw(); $('#rpLate').focus(); };
      $('#rpSkip').onchange = e => { R.skip = e.target.checked; draw(); $('#rpSkip').focus(); };
      $('#rpAdd').onchange = e => { R.add = e.target.checked; draw(); $('#rpAdd').focus(); };
      $('#rpEv').onchange = e => { R.ev = e.target.checked; draw(); $('#rpEv').focus(); };
      $('#rpDelay') && ($('#rpDelay').onchange = e => R.delay = +e.target.value);
      $('#rpSkipId') && ($('#rpSkipId').onchange = e => R.skipId = e.target.value);
      ['rpEvT', 'rpEvS', 'rpEvE'].forEach(id => { const el = $('#' + id); if (el) el.oninput = () => { R.evTitle = $('#rpEvT').value; R.evStart = $('#rpEvS').value; R.evEnd = $('#rpEvE').value; }; });
      $('#rpPreview').onclick = () => {
        if (R.ev && (!R.evStart || !R.evEnd || hm(R.evEnd) <= hm(R.evStart))) { toast('Check the meeting times: the end needs to be after the start'); return; }
        let tasks = S.tasks.map(t => ({ ...t })), fixed = S.fixed.slice();
        if (R.skip && R.skipId) tasks = tasks.filter(t => t.id !== R.skipId);
        let addedTask = null;
        if (R.add) { if (!R.addText.trim()) { toast('Type the new task, or untick “Something new”'); return; } addedTask = { ...parseLine(R.addText), id: nid('t'), source: 'Re-plan' }; tasks.push(addedTask); }
        let addedEv = null;
        if (R.ev) { addedEv = { id: nid('f'), title: R.evTitle.trim() || 'New meeting', start: hm(R.evStart), end: hm(R.evEnd), place: guessPlace(R.evTitle) || 'work', source: 'Added by you' }; fixed.push(addedEv); }
        const base = makeBase(U.plan, R.clock, R.late ? R.delay : 0);
        const plan = computePlan({ tasks, fixed, base });
        R.preview = { plan, diff: diffPlans(U.plan, plan), tasks, fixed, base };
        draw(); $('#rpApply').focus();
      };
    } else {
      $('#rpBack').onclick = () => { R.preview = null; draw(); };
      $('#rpApply').onclick = () => {
        U.undo = { tasks: S.tasks, fixed: S.fixed, base: S.base, clock: S.clock, plan: U.plan, diff: U.diff, why: U.diffWhy };
        U.diffWhy = null;
        S.tasks = R.preview.tasks; S.fixed = R.preview.fixed; S.base = R.preview.base;
        S.clock = nowMin(); U.diff = R.preview.diff; U.plan = R.preview.plan; save();
        close(); withFlip(route); toast('Plan updated'); resyncIfSynced();
      };
    }
  };
  draw();
  setTimeout(() => { const f = $('#rpClock'); f && f.focus(); }, 30);
}
function doUndo() {
  if (!U.undo) return;
  const u = U.undo; S.tasks = u.tasks; S.fixed = u.fixed; S.base = u.base; U.plan = u.plan; U.diff = u.diff; U.diffWhy = u.why; if (u.mode) S.settings.mode = u.mode; U.undo = null;
  save(); U.drawRoute = U.view === 'map'; withFlip(route); toast('Change undone'); resyncIfSynced();
}

// ================= MAP =================
const SNAPS = [30, 56, 88];
function renderMap() {
  if (!S.tasks.length && !S.fixed.length) return `<div class="wrap">${mobileTop()}<div style="max-width:520px;margin:12vh auto 0;text-align:center"><h1 class="h-page">No route yet</h1><p class="lede" style="margin-inline:auto">Add tasks with a place and your route shows up here, stop by stop.</p><div class="row" style="justify-content:center;margin-top:18px"><a class="btn primary" href="#add">${icon('plus')}Add tasks</a></div></div></div>`;
  if (!U.plan) refreshPlan();
  const p = U.plan, st = p.settings, draw = U.drawRoute;
  U.drawRoute = false;
  const order = []; p.steps.forEach(s => { if ((s.type === 'task' && s.task.place) || s.type === 'fixed') { if (!order.includes(s.place)) order.push(s.place); } });
  const num = k => order.indexOf(k) + 1;
  const legs = p.steps.map((s, i) => ({ s, i })).filter(x => x.s.type === 'travel');
  const legPath = s => { const A = PLACES[s.from], B = PLACES[s.to]; return `M${A.x} ${A.y} H${B.x} V${B.y}`; };
  const LEG_T = 0.3, arrive = {};
  legs.forEach(({ s }, n) => { if (arrive[s.to] == null) arrive[s.to] = n * LEG_T + 0.3; });
  const areas = {}; order.forEach(k => { const a = PLACES[k].area; (areas[a] = areas[a] || []).push(k); });
  const clusters = st.cluster ? Object.keys(areas).filter(a => areas[a].length > 1).map(a => {
    const pts = areas[a].map(k => PLACES[k]); const cx = pts.reduce((s, q) => s + q.x, 0) / pts.length, cy = pts.reduce((s, q) => s + q.y, 0) / pts.length;
    const r = Math.max(...pts.map(q => Math.hypot(q.x - cx, q.y - cy))) + 6;
    return `<g aria-hidden="true"><circle class="cluster" cx="${cx}" cy="${cy}" r="${r}"/><text class="cluster-lbl" x="${cx}" y="${cy - r - 1.2}" text-anchor="middle">${a}, ${pts.length} stops</text></g>`;
  }).join('') : '';
  const streets = [];
  for (let v = -60; v < 170; v += 8) { streets.push(`<line class="street" x1="${v}" y1="-70" x2="${v}" y2="180"/>`, `<line class="street" x1="-70" y1="${v}" x2="180" y2="${v}"/>`); }
  const sel = U.sel;
  const stops = order.map(k => {
    const P = PLACES[k], n = num(k), isFixed = p.steps.some(s => s.type === 'fixed' && s.place === k && !s.event.fromTask);
    const right = P.x < 80;
    const pop = draw ? `style="animation:popin .5s cubic-bezier(.16,1,.3,1) ${(arrive[k] || 0).toFixed(2)}s both"` : '';
    return `<g class="stop ${sel === k ? 'hot' : ''}" tabindex="0" role="button" data-place="${k}" data-x="${P.x}" data-y="${P.y}" aria-label="Stop ${n}: ${esc(P.name)}" ${pop}>
      ${isFixed ? `<rect class="shape" x="${P.x - 2.4}" y="${P.y - 2.4}" width="4.8" height="4.8" rx="1.4"/>` : `<circle class="shape" cx="${P.x}" cy="${P.y}" r="2.6"/>`}
      <text x="${P.x}" y="${P.y + .1}">${n}</text>
      <text class="nm" x="${right ? P.x + 3.6 : P.x - 3.6}" y="${P.y + .1}" ${right ? '' : 'style="text-anchor:end"'} dominant-baseline="central">${esc(P.name)}</text></g>`;
  }).join('');
  const H = PLACES[st.home];
  const homeMark = `<g class="stop home ${sel === 'home' ? 'hot' : ''}" tabindex="0" role="button" data-place="home" data-x="${H.x}" data-y="${H.y}" aria-label="Home"><rect class="shape" x="${H.x - 2.6}" y="${H.y - 2.6}" width="5.2" height="5.2" rx="1.6"/><text x="${H.x}" y="${H.y + .1}" style="font-size:2px">H</text><text class="nm" x="${H.x + 3.8}" y="${H.y + .1}" dominant-baseline="central">Home</text></g>`;
  const hotLeg = s => sel && (s.from === sel || s.to === sel);
  const masks = draw ? `<defs>${legs.map(({ s, i }, n) => `<mask id="mk${i}" maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120"><path d="${legPath(s)}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" style="animation:drawleg ${LEG_T + .05}s cubic-bezier(.45,0,.25,1) ${(n * LEG_T).toFixed(2)}s forwards"/></mask>`).join('')}</defs>` : '';
  const svg = `<svg class="map ${sel ? 'has-sel' : ''}" viewBox="-4 -4 108 108" preserveAspectRatio="xMidYMid meet" tabindex="0" role="group" aria-roledescription="map" aria-label="Route map with ${order.length} places. Drag or use arrow keys to move, scroll or press plus and minus to zoom. The stop list describes the same route in order.">
    ${masks}
    <rect x="-80" y="-80" width="270" height="270" style="fill:var(--map-bg)"/>
    <path class="water" d="M86 -70 L 86 -10 C 90 8, 96 20, 120 26 L 180 40 L 180 -70 Z"/>
    <path class="water" d="M-80 50 L -10 49 C 14 44, 30 52, 52 50 S 84 44, 120 52 L 180 51 L 180 54.5 L 120 55.5 C 84 48, 70 55, 52 54 S 14 48, -10 53 L -80 54 Z"/>
    <rect class="park" x="34" y="74" width="16" height="16" rx="3"/>
    ${streets.join('')}
    <line class="major" x1="-70" y1="28" x2="180" y2="28"/><line class="major" x1="-70" y1="60" x2="180" y2="60"/><line class="major" x1="56" y1="-70" x2="56" y2="180"/><line class="major" x1="84" y1="-70" x2="84" y2="180"/>
    <text class="lbl" x="2" y="27">Linden Ave</text><text class="lbl" x="2" y="59">Elm St</text><text class="lbl" x="57" y="100">State St</text><text class="lbl" x="85" y="100">Lake Rd</text>
    <text class="lbl" x="36" y="83">Hazel Park</text><text class="lbl" x="2" y="47">Six Mile Creek</text><text class="lbl" x="92" y="6">Cayuga Lake</text>
    <text class="lbl area" x="22" y="22">DOWNTOWN</text><text class="lbl area" x="4" y="94">ELM STREET</text><text class="lbl area" x="66" y="70">RIVERSIDE</text><text class="lbl area" x="66" y="6">NORTHSIDE</text>
    ${clusters}
    ${legs.map(({ s, i }) => `<path class="leg-path ${s.mode} ${hotLeg(s) ? 'hot' : ''}" d="${legPath(s)}" data-leg="${i}" ${draw ? `mask="url(#mk${i})"` : ''}/>`).join('')}
    ${homeMark}${stops}
  </svg>`;

  const canLive = liveMapAvailable(p), live = canLive && U.mapKind !== 'drawn';
  const unpinned = order.filter(k => !hasPin(k));
  const gm = gmRouteLink(p);
  let lastArea = null;
  const listItems = p.steps.map((s, i) => {
    if (s.type === 'travel') return `<div class="ml-leg">${icon(s.mode)}<span>${MODES[s.mode].label} ${s.minutes} min, ${s.miles.toFixed(1)} mi</span><a class="ml-dir" href="${esc(gmDir(s.from, s.to, s.mode))}" target="_blank" rel="noopener" aria-label="Directions to ${esc(PLACES[s.to].name)} in Google Maps">Directions</a></div>`;
    if (s.type !== 'task' && s.type !== 'fixed') return '';
    const title = stepTitle(s);
    const real = s.type === 'fixed' || s.task.place;
    const area = PLACES[s.place].area;
    let head = '';
    if (st.cluster && real && area !== lastArea) { head = `<div class="ml-area"><span>${area}</span></div>`; lastArea = area; }
    const done = isStepDone(p, s, i);
    const badge = real ? `<span class="badge ${s.type === 'fixed' && !s.event.fromTask ? 'fixed' : ''} ${done ? 'done' : ''}">${done ? icon('check') : num(s.place)}</span>` : `<span class="badge none" aria-hidden="true">${icon('pin')}</span>`;
    return `${head}<button class="ml-item ${done ? 'is-done' : ''}" data-place="${s.place}" aria-pressed="${sel === s.place}">${badge}<span class="grow"><span class="t">${esc(title)}</span><br><span class="s tnum">${fmt(s.start)}, ${real ? esc(PLACES[s.place].name) : `anywhere (at ${esc(PLACES[s.place].name)})`}</span></span></button>`;
  }).join('');

  const ps = planStats(p);
  const sheet = U.sheet || 34;
  const modeWord = { walk: 'walking', bike: 'biking', transit: 'transit', drive: 'driving' }[st.mode];
  return `<div class="wrap">${mobileTop(`<button class="btn sm" data-replan>${icon('refresh')}Re-plan</button>`)}
    <div class="map-head row" style="justify-content:space-between;align-items:flex-end">
      <div><div class="eyebrow">${esc(longDate(S.day))}</div><h1 class="h-page" style="margin-top:6px">${isToday() ? 'Today’s' : 'Tomorrow’s'} route</h1>
      <p class="lede tnum" style="margin-top:6px">${order.length} places, ${dur(ps.travelMin)} of ${modeWord}, home by ${fmt(ps.finishAt)}.</p></div>
      <div class="row desk-only">${gm ? `<a class="btn" href="${esc(gm.url)}" target="_blank" rel="noopener">${icon('map')}${gm.label}</a>` : ''}<button class="btn" data-replan>${icon('refresh')}Re-plan</button></div>
    </div>
    ${gm ? `<a class="btn sm mob-only gm-mob" href="${esc(gm.url)}" target="_blank" rel="noopener">${icon('map')}${gm.label}</a>` : ''}
    <div class="map-grid">
      <div class="map-pane ${live ? 'is-live' : ''}">${live ? `<div id="liveMap" class="live-map" role="application" aria-label="Live map of today’s route"></div>${unpinned.length ? `<div class="live-note">${unpinned.length} ${unpinned.length === 1 ? 'stop isn’t' : 'stops aren’t'} pinned yet, so ${unpinned.length === 1 ? 'it’s' : 'they’re'} only in the list. <a href="#setup" data-goplaces>Pin ${unpinned.length === 1 ? 'it' : 'them'}</a></div>` : ''}` : svg}
        ${!canLive && !LIVE.blocked ? `<a class="live-cta" href="#setup" data-goplaces>${icon('pin')}Pin your real places for a live map</a>` : ''}
        <div class="map-tools">
          <div class="seg" role="group" aria-label="Travel mode">${st.modes.map(k => `<button data-mode="${k}" aria-pressed="${st.mode === k}">${icon(k)}<span>${MODES[k].label}</span></button>`).join('')}</div>
          ${canLive ? `<div class="seg" role="group" aria-label="Map style"><button data-mapkind="live" aria-pressed="${live}">Live</button><button data-mapkind="drawn" aria-pressed="${!live}">Drawn</button></div>` : ''}
          ${live ? '' : `<div class="seg" role="group" aria-label="Map options"><button id="clusterBtn" aria-pressed="${st.cluster}" aria-label="Group areas">${icon('layers')}<span class="lbl-opt">Group areas</span></button></div>`}
        </div>
        <div class="map-zoom" role="group" aria-label="Zoom" ${live ? 'hidden' : ''}><button data-zoom="in" aria-label="Zoom in" title="Zoom in">${icon('plus')}</button><button data-zoom="out" aria-label="Zoom out" title="Zoom out">${icon('minus')}</button><button data-zoom="fit" aria-label="Show whole route" title="Show whole route">${icon('fit')}</button></div>
        <div class="legend" aria-hidden="true">
          ${live ? '<div class="r small muted">Straight lines between stops. Google Maps has turn-by-turn.</div>' : ''}<div class="r"><svg viewBox="0 0 34 8"><circle cx="4" cy="4" r="3.5" style="fill:var(--ink)"/></svg>Task stop</div>
          <div class="r"><svg viewBox="0 0 34 8"><rect x=".5" y=".5" width="7" height="7" rx="2" style="fill:var(--ink)"/></svg>Calendar event</div>
          <div class="r"><svg viewBox="0 0 34 8"><line x1="0" y1="4" x2="34" y2="4" style="stroke:var(--accent)" stroke-width="1.8" ${{ walk: 'stroke-dasharray=".2 3" stroke-linecap="round" stroke-width="2.4"', transit: 'stroke-dasharray="6 3"', bike: 'stroke-dasharray="8 2 1.5 2"', drive: 'stroke-width="2.6"' }[st.mode]}/></svg>${MODES[st.mode].label} route</div>
        </div>
      </div>
      <div class="map-list" id="sheet" style="--sheet:${sheet}%">
        <button class="sheet-handle" id="sheetHandle" aria-label="Stop list size. Drag, or press to resize."><span></span></button>
        <div class="sheet-title"><b>${order.length} places</b><span class="muted small tnum">Home by ${fmt(ps.finishAt)}</span></div>
        <div class="sheet-body" aria-label="Stops in order">${listItems}</div>
      </div>
    </div></div>`;
}

function bindMap() {
  const pick = k => {
    U.sel = U.sel === k ? null : k;
    $$('.ml-item').forEach(b => b.setAttribute('aria-pressed', b.dataset.place === U.sel));
    $$('svg.map .stop').forEach(g => g.classList.toggle('hot', g.dataset.place === U.sel));
    $('svg.map') && $('svg.map').classList.toggle('has-sel', !!U.sel);
    $$('svg.map .leg-path').forEach(pth => { const s = U.plan.steps[+pth.dataset.leg]; pth.classList.toggle('hot', !!U.sel && (s.from === U.sel || s.to === U.sel)); });
  };
  $$('.ml-item').forEach(b => b.onclick = () => { pick(b.dataset.place); if (U.sel && U.panTo) U.panTo(b.dataset.place); });
  $$('svg.map .stop').forEach(g => {
    const go = () => {
      pick(g.dataset.place);
      const li = $(`.ml-item[data-place="${g.dataset.place}"]`);
      if (li && U.sel) { const body = $('.sheet-body'); body.scrollTo({ top: li.offsetTop - body.offsetTop - 40, behavior: 'smooth' }); }
    };
    g.onclick = () => { if (U.mapDragged) return; go(); }; g.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
  });
  $$('[data-mode]').forEach(b => b.onclick = () => {
    if (b.dataset.mode === S.settings.mode) return;
    const before = planStats(U.plan).finishAt, prevMode = S.settings.mode, old = U.plan;
    U.undo = { tasks: S.tasks, fixed: S.fixed, base: S.base, clock: S.clock, plan: old, diff: U.diff, why: U.diffWhy, mode: prevMode };
    S.settings.mode = b.dataset.mode; if (S.synced) S.synced = false; save();
    refreshPlan(); U.diff = diffPlans(old, U.plan); U.diffWhy = `Switched to ${MODES[S.settings.mode].label.toLowerCase()}.`;
    const after = planStats(U.plan).finishAt, d = after - before;
    U.drawRoute = true; route();
    const nb = $(`[data-mode="${S.settings.mode}"]`); nb && nb.focus();
    toast(d === 0 ? `${MODES[S.settings.mode].label}: same finish time` : `${MODES[S.settings.mode].label}: home ${dur(Math.abs(d))} ${d < 0 ? 'sooner' : 'later'}, at ${fmt(after)}`);
  });
  $('#clusterBtn') && ($('#clusterBtn').onclick = () => { S.settings.cluster = !S.settings.cluster; save(); route(); $('#clusterBtn').focus(); });
  $$('[data-replan]').forEach(b => b.onclick = openReplan);
  $$('[data-mapkind]').forEach(b => b.onclick = () => { U.mapKind = b.dataset.mapkind; U.drawRoute = true; route(); });
  $$('[data-goplaces]').forEach(a => a.onclick = () => { S.setupStep = PLACES_STEP; save(); });

  // draggable bottom sheet (phones)
  const sheet = $('#sheet'), handle = $('#sheetHandle'), grid = $('.map-grid');
  const mobile = () => matchMedia('(max-width: 820px)').matches;
  const setSnap = v => { U.sheet = v; sheet.style.setProperty('--sheet', v + '%'); if (U.mapApply) setTimeout(U.mapApply, 460); handle.setAttribute('aria-label', `Stop list ${v < 40 ? 'collapsed' : v < 70 ? 'half open' : 'expanded'}. Drag, or press to resize.`); };
  let startY = null, startH = 0, moved = false;
  handle.onpointerdown = e => { if (!mobile()) return; startY = e.clientY; startH = sheet.getBoundingClientRect().height; moved = false; handle.setPointerCapture(e.pointerId); sheet.classList.add('dragging'); };
  handle.onpointermove = e => {
    if (startY == null) return;
    const dy = startY - e.clientY; if (Math.abs(dy) > 4) moved = true;
    const H = grid.clientHeight, h = Math.min(H * 0.92, Math.max(H * 0.18, startH + dy));
    sheet.style.setProperty('--sheet', (h / H * 100) + '%');
  };
  const end = () => {
    if (startY == null) return;
    sheet.classList.remove('dragging');
    const H = grid.clientHeight, pct = sheet.getBoundingClientRect().height / H * 100; startY = null;
    if (!moved) { const i = SNAPS.findIndex(s => s > (U.sheet || 34) + 1); setSnap(SNAPS[i === -1 ? 0 : i]); }
    else setSnap(SNAPS.reduce((a, b) => Math.abs(b - pct) < Math.abs(a - pct) ? b : a));
  };
  handle.onpointerup = end; handle.onpointercancel = end;
  handle.onclick = e => { if (e.detail === 0) { const i = SNAPS.findIndex(s => s > (U.sheet || 34) + 1); setSnap(SNAPS[i === -1 ? 0 : i]); } };

  if (LIVE.map && !$('#liveMap')) { LIVE.map.remove(); LIVE.map = null; }
  if ($('#liveMap')) {
    const order = []; U.plan.steps.forEach(s => { if ((s.type === 'task' && s.task.place) || s.type === 'fixed') { if (!order.includes(s.place)) order.push(s.place); } });
    mountLiveMap(U.plan, order);
    U.mapApply = () => LIVE.map && LIVE.map.invalidateSize();
    return;
  }
  // ---- pan and zoom (Google Maps style) ----
  const svg = $('svg.map'), pane = $('.map-pane');
  const mobileNow = () => matchMedia('(max-width: 820px)').matches;
  const stopsEl = $$('svg.map .stop');
  const pts = [U.plan.settings.home, ...new Set(U.plan.steps.filter(s => (s.type === 'task' && s.task.place) || s.type === 'fixed').map(s => s.place))].map(k => PLACES[k]);
  const size = () => ({ W: Math.max(1, pane.clientWidth), H: Math.max(1, pane.clientHeight) });
  const pad = () => mobileNow() ? { t: 70, b: Math.round(grid.clientHeight * (U.sheet || 34) / 100) + 16, l: 18, r: 64 } : { t: 76, b: 104, l: 44, r: 140 };
  const MIN_W = 26, MAX_W = 190;
  const fit = () => {
    const { W, H } = size(), p = pad();
    const xs = pts.map(q => q.x), ys = pts.map(q => q.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const aw = Math.max(80, W - p.l - p.r), ah = Math.max(80, H - p.t - p.b);
    const u = Math.max((maxX - minX) / aw, (maxY - minY) / ah, MIN_W / W);
    return { x: (minX + maxX) / 2 - (p.l + aw / 2) * u, y: (minY + maxY) / 2 - (p.t + ah / 2) * u, w: W * u };
  };
  const clamp = v => {
    const { W, H } = size(); const w = Math.min(MAX_W, Math.max(MIN_W, v.w)), h = w * H / W;
    const cl = (val, len) => (170 - len < -60) ? 50 - len / 2 : Math.min(170 - len, Math.max(-60, val));
    return { x: cl(v.x, w), y: cl(v.y, h), w };
  };
  const apply = () => {
    const { W, H } = size(); const v = U.mapView = clamp(U.mapView); const u = v.w / W;
    svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.w} ${v.w * H / W}`);
    svg.style.setProperty('--u', u);
    stopsEl.forEach(g => { const X = +g.dataset.x, Y = +g.dataset.y, k = u * 5; g.setAttribute('transform', `translate(${X} ${Y}) scale(${k}) translate(${-X} ${-Y})`); });
    const zc = $('.map-zoom');
    if (zc) { if (mobileNow()) { const sh = grid.clientHeight * (U.sheet || 34) / 100; zc.style.top = 'auto'; zc.style.bottom = (sh + 12) + 'px'; zc.hidden = (U.sheet || 34) > 60; } else { zc.style.top = ''; zc.style.bottom = ''; zc.hidden = false; } }
    const zin = $('[data-zoom="in"]'), zout = $('[data-zoom="out"]');
    if (zin) zin.disabled = v.w <= MIN_W + 0.01; if (zout) zout.disabled = v.w >= MAX_W - 0.01;
  };
  const local = e => { const r = pane.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const zoomAt = (f, px, py, v = U.mapView) => { const { W } = size(); const u = v.w / W, wx = v.x + px * u, wy = v.y + py * u; const w = Math.min(MAX_W, Math.max(MIN_W, v.w / f)), nu = w / W; return { x: wx - px * nu, y: wy - py * nu, w }; };
  let anim = null;
  const animateTo = target => {
    cancelAnimationFrame(anim); const from = { ...U.mapView }, to = clamp(target);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { U.mapView = to; apply(); return; }
    const t0 = performance.now(), D = 320, ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => { const t = Math.min(1, (now - t0) / D), k = ease(t); U.mapView = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, w: from.w + (to.w - from.w) * k }; apply(); if (t < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  };
  if (!U.mapView) U.mapView = fit();
  apply(); U.mapApply = apply;
  U.panTo = k => {
    const P = PLACES[k]; if (!P) return; const { W, H } = size(), p = pad(), v = U.mapView, u = v.w / W;
    const sx = (P.x - v.x) / u, sy = (P.y - v.y) / u;
    if (sx > p.l && sx < W - p.r && sy > p.t && sy < H - p.b) return;
    animateTo({ x: P.x - (p.l + (W - p.l - p.r) / 2) * u, y: P.y - (p.t + (H - p.t - p.b) / 2) * u, w: v.w });
  };
  // pointers: drag to pan, two fingers to pinch
  const ptrs = new Map(); let dragged = false, total = 0, pinchD = 0;
  svg.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 1) { dragged = false; total = 0; }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinchD = Math.hypot(a.x - b.x, a.y - b.y); }
    cancelAnimationFrame(anim);
  });
  svg.addEventListener('pointermove', e => {
    const prev = ptrs.get(e.pointerId); if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY }; ptrs.set(e.pointerId, cur);
    const { W } = size(), u = U.mapView.w / W;
    if (ptrs.size === 1) {
      const dx = cur.x - prev.x, dy = cur.y - prev.y; total += Math.abs(dx) + Math.abs(dy);
      if (!dragged && total > 5) { dragged = true; svg.classList.add('grabbing'); try { svg.setPointerCapture(e.pointerId); } catch (_) {} }
      if (dragged) { U.mapView = { ...U.mapView, x: U.mapView.x - dx * u, y: U.mapView.y - dy * u }; apply(); }
    } else if (ptrs.size === 2) {
      dragged = true; const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchD > 0) { const r = pane.getBoundingClientRect(); U.mapView = zoomAt(d / pinchD, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top); apply(); }
      pinchD = d;
    }
  });
  const up = e => {
    ptrs.delete(e.pointerId); if (ptrs.size < 2) pinchD = 0;
    if (!ptrs.size) { svg.classList.remove('grabbing'); if (dragged) { U.mapDragged = true; setTimeout(() => { U.mapDragged = false; }, 0); } }
  };
  svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  svg.addEventListener('wheel', e => { e.preventDefault(); const [px, py] = local(e); const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)); U.mapView = zoomAt(f, px, py); apply(); }, { passive: false });
  svg.addEventListener('dblclick', e => { if (e.target.closest('.stop')) return; const [px, py] = local(e); animateTo(zoomAt(2, px, py)); });
  svg.addEventListener('keydown', e => {
    if (e.target !== svg) return; const { W, H } = size(), u = U.mapView.w / W, s = 80 * u; let t = null;
    if (e.key === 'ArrowLeft') t = { ...U.mapView, x: U.mapView.x - s }; if (e.key === 'ArrowRight') t = { ...U.mapView, x: U.mapView.x + s };
    if (e.key === 'ArrowUp') t = { ...U.mapView, y: U.mapView.y - s }; if (e.key === 'ArrowDown') t = { ...U.mapView, y: U.mapView.y + s };
    if (e.key === '+' || e.key === '=') t = zoomAt(1.6, W / 2, H / 2); if (e.key === '-' || e.key === '_') t = zoomAt(1 / 1.6, W / 2, H / 2); if (e.key === '0') t = fit();
    if (t) { e.preventDefault(); animateTo(t); }
  });
  $$('[data-zoom]').forEach(b => b.onclick = () => { const { W, H } = size(); const z = b.dataset.zoom; animateTo(z === 'fit' ? fit() : zoomAt(z === 'in' ? 1.6 : 1 / 1.6, W / 2, H / 2)); });
  if (U._mapRO) U._mapRO.disconnect();
  U._mapRO = new ResizeObserver(() => { if (document.body.contains(pane)) apply(); }); U._mapRO.observe(pane);
}

function bind(v) {
  if (v === 'setup') bindSetup();
  if (v === 'add') bindAdd();
  if (v === 'plan') bindPlan();
  if (v === 'map') bindMap();
}

// boot
(function boot() {
  applyPlaces();
  rollDay();
  if (!location.hash && !S.onboarded && !S.tasks.length) location.hash = 'setup';
  applyTheme();
  refreshPlan();
  route();
  connectStore().catch(() => setStoreMode('local'));
  if (S.settings.calendars.google) gcalPull(false);
  // the real clock: move the "now" line every minute; roll over at midnight
  setInterval(() => {
    const c = nowMin(); if (c === S.clock) return;
    S.clock = c;
    if (rollDay()) { refreshPlan(); route(); if (S.settings.calendars.google) gcalPull(false); return; }
    const busy = ($('#modalRoot') && $('#modalRoot').innerHTML) || (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName));
    if (U.view === 'plan' && !busy && !U.loading) route();
  }, 15000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.settings.calendars.google && !GCAL.busy && GCAL.last != null && nowMin() - GCAL.last > 10) gcalPull(false); });
})();
