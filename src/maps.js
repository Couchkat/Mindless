// ===== Real places: live map, your location, Google Maps hand-off =====
// Loaded before app.js. Uses Leaflet (inlined) with CARTO basemap tiles; every
// network-dependent piece degrades to the illustrated map when the host blocks it.

const LIVE = { blocked: false, map: null, pick: null, tilesOk: false };
const TILE = dark => `https://{s}.basemaps.cartocdn.com/${dark ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`;
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';
const mapIsDark = () => document.documentElement.dataset.resolved === 'dark' || (document.documentElement.dataset.appearance === 'dark') || (document.documentElement.dataset.appearance !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
const hasPin = k => !!(PLACES[k] && typeof PLACES[k].lat === 'number' && typeof PLACES[k].lng === 'number');
const pinnedCount = () => Object.keys(PLACES).filter(hasPin).length;

// ---------- location ----------
function myLocation() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error('Location isn’t available in this browser.'));
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6), acc: p.coords.accuracy }),
      e => rej(new Error(e.code === 1 ? 'Location access was blocked. Tap the map to drop your pin instead.' : e.code === 3 ? 'Finding your location took too long. Tap the map to drop your pin instead.' : 'Couldn’t find your location. Tap the map to drop your pin instead.')),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });
}

// ---------- address search (OpenStreetMap Nominatim) ----------
async function searchPlaces(q, near) {
  const u = new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('format', 'jsonv2'); u.searchParams.set('q', q); u.searchParams.set('limit', '5'); u.searchParams.set('addressdetails', '1');
  if (near) { const d = 0.35; u.searchParams.set('viewbox', `${near.lng - d},${near.lat + d},${near.lng + d},${near.lat - d}`); }
  let r;
  try { r = await fetch(u.toString(), { headers: { 'Accept': 'application/json' } }); }
  catch (e) { throw new Error('Address search isn’t reachable from here. Drag the map and tap to drop the pin.'); }
  if (!r.ok) throw new Error('Address search is busy. Try again, or tap the map to drop the pin.');
  const arr = await r.json();
  return arr.map(x => ({ lat: +(+x.lat).toFixed(6), lng: +(+x.lon).toFixed(6), label: x.display_name, short: [x.address && (x.address.house_number ? x.address.house_number + ' ' : '') + (x.address.road || ''), x.address && (x.address.city || x.address.town || x.address.village || x.address.suburb)].filter(Boolean).join(', ') || x.display_name.split(',').slice(0, 2).join(','), hood: x.address && (x.address.neighbourhood || x.address.suburb || x.address.quarter || x.address.city_district) }));
}

// ---------- Google Maps hand-off ----------
const GM_MODE = { walk: 'walking', bike: 'bicycling', transit: 'transit', drive: 'driving' };
function gmPlace(k) {
  const P = PLACES[k]; if (!P) return '';
  if (P.addr) return P.addr;
  if (hasPin(k)) return `${P.lat},${P.lng}`;
  return P.name;
}
function gmDir(from, to, mode, via) {
  const u = new URL('https://www.google.com/maps/dir/');
  u.searchParams.set('api', '1');
  if (from) u.searchParams.set('origin', gmPlace(from));
  u.searchParams.set('destination', gmPlace(to));
  u.searchParams.set('travelmode', GM_MODE[mode] || 'transit');
  if (via && via.length && mode !== 'transit') u.searchParams.set('waypoints', via.slice(0, 9).map(gmPlace).join('|'));
  return u.toString();
}
function gmSearch(k) { const u = new URL('https://www.google.com/maps/search/'); u.searchParams.set('api', '1'); u.searchParams.set('query', gmPlace(k)); return u.toString(); }
function routeStops(p) {
  const order = [];
  p.steps.forEach(s => { if (s.type === 'travel') { if (!order.length) order.push(s.from); order.push(s.to); } });
  return order;
}
// Whole day in Google Maps (driving, walking, biking support waypoints; transit opens the next leg)
function gmRouteLink(p) {
  const st = p.settings, legs = p.steps.filter(s => s.type === 'travel');
  if (!legs.length) return null;
  if (st.mode === 'transit') {
    const next = legs.find(s => !(isToday() && s.end <= S.clock)) || legs[0];
    return { url: gmDir(next.from, next.to, 'transit'), label: `Next leg in Google Maps` };
  }
  const stops = routeStops(p);
  return { url: gmDir(stops[0], stops[stops.length - 1], st.mode, stops.slice(1, -1)), label: 'Open route in Google Maps' };
}

// ---------- areas from real pins ----------
function realAreas() {
  const keys = Object.keys(PLACES).filter(hasPin);
  const parent = {}; keys.forEach(k => parent[k] = k);
  const find = k => parent[k] === k ? k : (parent[k] = find(parent[k]));
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    if (realMiles(keys[i], keys[j]) / 1.3 <= 0.45) parent[find(keys[i])] = find(keys[j]);
  }
  const groups = {}; keys.forEach(k => (groups[find(k)] = groups[find(k)] || []).push(k));
  Object.values(groups).forEach(g => {
    const hood = g.map(k => PLACES[k].hood).find(Boolean);
    const name = hood || (g.length > 1 ? `Around ${PLACES[g.find(k => k !== 'home') || g[0]].name}` : PLACES[g[0]].name);
    g.forEach(k => { PLACES[k].area = name; });
  });
}

// ---------- Leaflet helpers ----------
function leafletOk() { return typeof L !== 'undefined' && !LIVE.blocked; }
function baseTiles(map) {
  const layer = L.tileLayer(TILE(mapIsDark()), { subdomains: 'abcd', maxZoom: 19, attribution: TILE_ATTR, crossOrigin: true });
  let loaded = 0, failed = 0;
  layer.on('tileload', () => { loaded++; LIVE.tilesOk = true; map.getContainer().classList.remove('tiles-wait'); });
  layer.on('tileerror', () => { failed++; if (!loaded && failed >= 4) onTilesBlocked(); });
  map.getContainer().classList.add('tiles-wait');
  setTimeout(() => { if (!loaded) onTilesBlocked(); }, 9000);
  return layer.addTo(map);
}
function onTilesBlocked() {
  if (LIVE.tilesOk || LIVE.blocked) return;
  LIVE.blocked = true;
  if (typeof toast === 'function') toast('Live map tiles can’t load here, so Mindless is showing the illustrated map. Google Maps links still work.');
  if (typeof route === 'function' && U.view === 'map') route();
  const pm = document.getElementById('pinMap'); if (pm) pm.classList.add('tiles-blocked');
}
const pinIcon = (html, cls) => L.divIcon({ className: 'lm-pin ' + (cls || ''), html, iconSize: [30, 30], iconAnchor: [15, 15] });

// ---------- pin picker ----------
function openPinPicker(k, after) {
  const root = $('#modalRoot'), prev = document.activeElement;
  const P = PLACES[k];
  let pick = hasPin(k) ? { lat: P.lat, lng: P.lng } : null, hood = P.hood || null, addr = P.addr || '';
  const close = () => { if (LIVE.pick) { LIVE.pick.remove(); LIVE.pick = null; } root.innerHTML = ''; document.removeEventListener('keydown', onKey); prev && prev.focus && prev.focus(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  root.innerHTML = `<div class="scrim" id="scrim"><div class="dialog pin-dialog" role="dialog" aria-modal="true" aria-labelledby="pinTitle">
    <header><div><h2 class="h-page" id="pinTitle" style="font-size:24px">Where is ${esc(P.name)}?</h2><p class="small muted" style="margin:4px 0 0">Search an address, use your location, or tap the map. Real distances and travel times come from these pins.</p></div><button class="icon-btn" id="pinClose" aria-label="Close">${icon('x')}</button></header>
    <form class="pin-search" id="pinForm"><input class="input" id="pinQ" placeholder="Search an address or place" value="${esc(addr)}" autocomplete="off" aria-label="Search an address or place"><button class="btn" type="submit">Search</button></form>
    <div class="pin-results" id="pinRes" role="listbox" aria-label="Search results"></div>
    <div class="pin-map-wrap"><div id="pinMap" class="pin-map" aria-label="Map. Tap to place the pin."></div>
      <button class="btn sm pin-locate" id="pinLocate" type="button">${icon('pin')}Use my location</button></div>
    <p class="small muted" id="pinMsg" aria-live="polite" style="min-height:1.4em;margin:10px 0 0"></p>
    <div class="row" style="justify-content:space-between;margin-top:8px">${hasPin(k) ? `<button class="btn ghost" id="pinClear" type="button">Remove pin</button>` : '<span></span>'}<div class="row"><button class="btn" id="pinCancel" type="button">Cancel</button><button class="btn primary" id="pinSave" type="button" ${pick ? '' : 'disabled'}>Save pin</button></div></div>
  </div></div>`;
  const msg = t => { $('#pinMsg').textContent = t || ''; };
  $('#scrim').onclick = e => { if (e.target.id === 'scrim') close(); };
  $('#pinClose').onclick = close; $('#pinCancel').onclick = close;
  let marker = null, map = null;
  const center = pick || (hasPin('home') ? { lat: PLACES.home.lat, lng: PLACES.home.lng } : null) || Object.keys(PLACES).filter(hasPin).map(x => ({ lat: PLACES[x].lat, lng: PLACES[x].lng }))[0] || { lat: 39.5, lng: -98.35 };
  const setPick = (ll, label) => {
    pick = { lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) };
    if (map) { if (marker) marker.setLatLng(pick); else marker = L.marker(pick, { icon: pinIcon(icon('pin'), 'pick'), draggable: true }).addTo(map).on('dragend', e => setPick(e.target.getLatLng())); }
    $('#pinSave').disabled = false;
    msg(label ? `Pinned: ${label}` : `Pinned at ${pick.lat.toFixed(4)}, ${pick.lng.toFixed(4)}`);
  };
  if (typeof L !== 'undefined') {
    try {
      map = LIVE.pick = L.map('pinMap', { zoomControl: true, attributionControl: true }).setView(center, pick ? 16 : (center.lat === 39.5 ? 4 : 13));
      baseTiles(map);
      map.on('click', e => { setPick(e.latlng); hood = null; });
      if (pick) setPick(pick);
      setTimeout(() => map.invalidateSize(), 60);
    } catch (e) { $('#pinMap').classList.add('tiles-blocked'); }
  } else $('#pinMap').classList.add('tiles-blocked');
  $('#pinLocate').onclick = async () => {
    msg('Finding you…');
    try { const g = await myLocation(); if (map) map.setView(g, 16); setPick(g, g.acc > 1 ? `your current location (within ${Math.round(g.acc)} m)` : 'your current location'); }
    catch (e) { msg(e.message); }
  };
  $('#pinForm').onsubmit = async e => {
    e.preventDefault();
    const q = $('#pinQ').value.trim(); if (!q) return;
    msg('Searching…'); $('#pinRes').innerHTML = '';
    try {
      const res = await searchPlaces(q, pick || (hasPin('home') ? PLACES.home : null));
      if (!res.length) { msg('No matches. Try adding the city, or tap the map.'); return; }
      msg('');
      $('#pinRes').innerHTML = res.map((r, i) => `<button type="button" class="pin-hit" role="option" data-hit="${i}"><b>${esc(r.short)}</b><span>${esc(r.label)}</span></button>`).join('');
      $$('[data-hit]').forEach(b => b.onclick = () => { const r = res[+b.dataset.hit]; addr = r.short; hood = r.hood || null; $('#pinRes').innerHTML = ''; if (map) map.setView(r, 17); setPick(r, r.short); });
    } catch (err) { msg(err.message); }
  };
  $('#pinSave').onclick = () => {
    if (!pick) return;
    savePin(k, { lat: pick.lat, lng: pick.lng, hood: hood || undefined, addr: addr && !/^\s*-?\d+\.\d+,\s*-?\d+\.\d+\s*$/.test(addr) ? addr : undefined });
    close(); after && after();
  };
  $('#pinClear') && ($('#pinClear').onclick = () => { savePin(k, null); close(); after && after(); });
  setTimeout(() => $('#pinQ').focus(), 40);
}
function savePin(k, v) {
  const o = { ...(S.places[k] || {}) };
  if (v) { o.lat = v.lat; o.lng = v.lng; if (v.hood) o.hood = v.hood; else delete o.hood; if (v.addr) { o.addr = v.addr; if (k === 'home') S.settings.homeAddr = v.addr; if (k === 'work') S.settings.workAddr = v.addr; } }
  else { delete o.lat; delete o.lng; delete o.hood; }
  S.places[k] = o;
  applyPlaces(); S.base = null; S.synced = false; save(); refreshPlan();
  toast(v ? `${PLACES[k].name} pinned. Travel times now use real distances.` : `Pin removed from ${PLACES[k].name}.`);
}

// ---------- live route map ----------
function liveMapAvailable(p) {
  if (!leafletOk()) return false;
  const stops = [p.settings.home, ...p.steps.filter(s => (s.type === 'task' && s.task.place) || s.type === 'fixed').map(s => s.place)];
  return stops.filter(hasPin).length >= 1;
}
function mountLiveMap(p, order) {
  const el = document.getElementById('liveMap'); if (!el) return;
  if (LIVE.map) { LIVE.map.remove(); LIVE.map = null; }
  const map = LIVE.map = L.map(el, { zoomControl: false, attributionControl: true, zoomSnap: 0.25 });
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  baseTiles(map);
  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent').trim() || '#4a7c68';
  const dash = { walk: '1 8', transit: '10 6', bike: '14 4 2 4', drive: null }[p.settings.mode];
  const pts = [];
  const home = p.settings.home;
  if (hasPin(home)) { pts.push([PLACES[home].lat, PLACES[home].lng]); L.marker([PLACES[home].lat, PLACES[home].lng], { icon: pinIcon('H', 'home'), keyboard: false, title: 'Home' }).addTo(map).bindTooltip('Home', { direction: 'right', offset: [12, 0], className: 'lm-tip' }); }
  order.forEach((k, i) => {
    if (!hasPin(k) || k === home) return;
    const P = PLACES[k], isFixed = p.steps.some(s => s.type === 'fixed' && s.place === k && !s.event.fromTask);
    pts.push([P.lat, P.lng]);
    const m = L.marker([P.lat, P.lng], { icon: pinIcon(String(i + 1), isFixed ? 'fixed' : ''), title: P.name }).addTo(map);
    m.bindTooltip(esc(P.name), { direction: 'right', offset: [12, 0], className: 'lm-tip' });
    m.on('click', () => { const b = document.querySelector(`.ml-item[data-place="${k}"]`); if (b) b.click(); });
  });
  p.steps.filter(s => s.type === 'travel' && hasPin(s.from) && hasPin(s.to)).forEach(s => {
    L.polyline([[PLACES[s.from].lat, PLACES[s.from].lng], [PLACES[s.to].lat, PLACES[s.to].lng]], { color: accent, weight: p.settings.mode === 'drive' ? 5 : 4, opacity: .9, dashArray: dash, lineCap: 'round' }).addTo(map);
  });
  if (pts.length > 1) map.fitBounds(pts, { padding: [70, 70], maxZoom: 16 }); else if (pts.length) map.setView(pts[0], 15);
  U.panTo = k => { if (hasPin(k)) map.flyTo([PLACES[k].lat, PLACES[k].lng], Math.max(map.getZoom(), 15), { duration: .6 }); };
  setTimeout(() => map.invalidateSize(), 80);
}
