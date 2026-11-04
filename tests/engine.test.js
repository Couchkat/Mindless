// Run with: node --test tests/*.test.js
const test = require('node:test');
const assert = require('node:assert');
const { PLACES, optimize, travel } = require('../src/engine.js');

const settings = { mode: 'transit', modes: ['transit'], buffer: 5, breakLen: 10, breakEvery: 90, peak: 'morning', dayStart: 480, dayEnd: 1260, home: 'home', startAt: 'home', cluster: true };
const tasks = [
  { id: 'a', title: 'Pick up prescription', dur: 15, place: 'pharmacy', energy: 'low', priority: 2 },
  { id: 'b', title: 'Mail a package', dur: 10, place: 'post', energy: 'low', priority: 2 },
  { id: 'c', title: 'Write report', dur: 90, place: null, energy: 'high', priority: 3, deadline: 900 },
  { id: 'd', title: 'Groceries', dur: 40, place: 'market', energy: 'low', priority: 1 },
];
const fixed = [{ id: 'f', title: 'Standup', start: 660, end: 680, place: 'work', source: 'test' }];
const plan = optimize({ tasks, fixed, settings, startTime: 480, startPlace: 'home' });

test('every task is scheduled or explained', () => {
  const placed = plan.steps.filter(s => s.type === 'task').map(s => s.task.id);
  const missed = plan.unscheduled.map(u => u.task.id);
  assert.deepStrictEqual([...placed, ...missed].sort(), tasks.map(t => t.id).sort());
  plan.unscheduled.forEach(u => assert.ok(u.why.length > 0));
});

test('steps never overlap and run forward in time', () => {
  for (let i = 1; i < plan.steps.length; i++) assert.ok(plan.steps[i].start >= plan.steps[i - 1].end - 0.001, `step ${i} overlaps`);
});

test('calendar events stay exactly where they are', () => {
  const s = plan.steps.find(x => x.type === 'fixed' && x.event.id === 'f');
  assert.ok(s); assert.strictEqual(s.start, 660); assert.strictEqual(s.end, 680);
});

test('errands happen while the place is open', () => {
  plan.steps.filter(s => s.type === 'task' && s.task.place).forEach(s => {
    const P = PLACES[s.task.place];
    assert.ok(s.start >= P.open && s.end <= P.close, `${s.task.title} outside opening hours`);
  });
});

test('deadlines are met', () => {
  const s = plan.steps.find(x => x.type === 'task' && x.task.id === 'c');
  if (s) assert.ok(s.end <= 900);
});

test('the optimized plan is no worse than the order the list was written in', () => {
  assert.ok(plan.stats.travelMin + plan.stats.waitMin <= plan.baseline.stats.travelMin + plan.baseline.stats.waitMin);
});

test('travel time is zero for the same place', () => {
  assert.strictEqual(travel('work', 'work', 'walk'), 0);
});

test('pinned places use real distances on Earth', () => {
  const saved = { a: { ...PLACES.home }, b: { ...PLACES.pharmacy } };
  Object.assign(PLACES.home, { lat: 42.4440, lng: -76.5019 });
  Object.assign(PLACES.pharmacy, { lat: 42.4396, lng: -76.4970 });
  const walk = travel('home', 'pharmacy', 'walk'), drive = travel('home', 'pharmacy', 'drive');
  assert.ok(walk >= 8 && walk <= 16, `walk ${walk} min`); // about 0.4 mi straight, 0.5 mi by street
  assert.ok(drive < walk);
  PLACES.home = saved.a; PLACES.pharmacy = saved.b;
});
