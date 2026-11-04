# Mindless

**An AI day planner that works out the quickest, calmest way through everything on your list.**

You drop in your tasks however is easiest: a messy brain dump, a form, your voice, or a pasted list. Mindless weighs how long each one takes, where it happens, when places open and close, your deadlines, your calendar and when you focus best. It then builds an ordered plan with travel between stops and shows the route on a map.

![Workflow screen](docs/desktop-plan.png)

| Route map | On a phone |
| --- | --- |
| ![Map](docs/desktop-map.png) | ![Phone map](docs/phone-map.png) |

## What it does

- **Plans your day.** It orders tasks by travel, opening hours, deadlines, priority, breaks, buffers and your energy peak. Each step says why it sits where it does ("Grouped with your other Downtown stops").
- **Shows the route.** An illustrated map has numbered stops and grouped neighborhoods, and lets you switch between walking, transit, biking and driving. You can drag and zoom it, and on phones it opens as a draggable sheet.
- **Re-plans in one tap.** Running late, skipping something, a new task or a surprise meeting: Mindless previews what moves before you accept it, and you can undo.
- **Works with your calendar.** It reads Google Calendar events as busy time and writes the plan back as calendar blocks, which update when you re-plan.
- **Reads messy notes.** A built-in parser picks out durations, deadlines, places and "tonight". An optional AI read uses Claude for harder notes.
- **Remembers you.** Tasks, check-offs, places, preferences and recent days save privately to your account and follow you across devices.
- **Lets you choose the look.** There are six color themes with light and dark modes, and five font pairings.

## How the planner works

`src/engine.js` is a pure, dependency-free scheduler:

1. **Greedy placement.** It walks forward through the day and scores each remaining task by travel cost, deadline urgency, opening-hour pressure, priority, energy fit and neighborhood grouping. Calendar events and locked steps act as fixed walls.
2. **Order search.** It uses local search plus 24 seeded random restarts over task orderings, keeping the plan with the lowest total cost (travel, waiting, missed deadlines, unscheduled work).
3. **Baseline check.** It compares the result against doing the list in the order it was written, which gives the "That's 40 min less travel" line.

Distances are Manhattan distances on the illustrated map grid, converted to minutes per travel mode.

## Run it

Everything builds into a single self-contained page.

```bash
python3 build.py          # writes index.html
open index.html           # or serve the folder; GitHub Pages works too
node --test tests/*.test.js
```

Opened on its own, Mindless saves to your browser's local storage. Published as a [Claude](https://claude.ai) artifact, it also turns on:

| Capability | Used for |
| --- | --- |
| `db` + `user` | Private per-person storage that syncs across devices |
| `mcp` (Google Calendar) | Reading events, creating and deleting plan blocks |
| `sample` | "Read it with AI" for brain dumps |

## Project layout

```
src/
  engine.js      scheduling and optimization (no DOM)
  app.js         UI, state, storage, calendar and AI integrations
  style.css      design tokens, themes and layout
  template.html  page shell
tests/           engine tests (node:test)
build.py         bundles src/ into index.html
docs/            screenshots
```

## Limits, honestly

- The map is illustrated, and travel times are estimates from the grid, not live traffic. The twelve map spots can be renamed to your real places in Setup.
- Apple Calendar and Outlook aren't connected yet.
- Voice input depends on the browser's speech recognition (Chrome, Edge, Safari).

## Built with

Vanilla JavaScript, HTML and CSS, with no framework or build dependencies beyond Python for bundling. The design was explored first as a clickable prototype and a Figma design system with variables for themes, fonts and spacing.
