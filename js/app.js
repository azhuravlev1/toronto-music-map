(() => {
  "use strict";

  const VENUES = window.VENUES || [];
  const TRANSIT = window.TRANSIT || [];
  const EVENTS = window.EVENTS || { meta: {}, events: [] };

  // ---------- dates (local time; the page drops anything before today) ----------
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseIso = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const c = new Date(d); c.setDate(c.getDate() + n); return c; };
  const daysBetween = (a, b) => Math.round((parseIso(b) - parseIso(a)) / 864e5);

  const TODAY = iso(new Date());
  const WINDOW_END = EVENTS.meta.windowEnd || iso(addDays(new Date(), 20));
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const upcoming = EVENTS.events.filter((e) => e.date >= TODAY);
  const byVenue = {};
  for (const e of upcoming) (byVenue[e.venue] ||= []).push(e);
  for (const list of Object.values(byVenue)) list.sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")));

  // ---------- event types ----------
  const TYPES = {
    concert:  { label: "Concert",      emoji: "",   bg: "#FFFFFF", fg: "#1d1d1f", bar: null },
    party:    { label: "Club night",   emoji: "🪩", bg: "#F1E9FF", fg: "#4B2A86", bar: "#9B5DE5" },
    comedy:   { label: "Comedy",       emoji: "😂", bg: "#FFF5D1", fg: "#6B4E00", bar: "#F4B400" },
    theatre:  { label: "Theatre",      emoji: "🎭", bg: "#FDE6EE", fg: "#7A1238", bar: "#D6336C" },
    dance:    { label: "Dance",        emoji: "🩰", bg: "#FCE8F7", fg: "#7A1660", bar: "#D64DAE" },
    sports:   { label: "Sports",       emoji: "🏟️", bg: "#E2EFFC", fg: "#0D3F75", bar: "#1E78D2" },
    film:     { label: "Film",         emoji: "🎬", bg: "#ECEFF2", fg: "#2F3B45", bar: "#5B6B78" },
    talk:     { label: "Talk",         emoji: "🎙️", bg: "#E6F4EA", fg: "#1F5130", bar: "#34A35A" },
    family:   { label: "Family",       emoji: "🧸", bg: "#FFEEDD", fg: "#7A3A00", bar: "#F08A24" },
    festival: { label: "Fair / market",emoji: "🎪", bg: "#DFF6F7", fg: "#0D5257", bar: "#14A3AD" },
    other:    { label: "Other",        emoji: "✨", bg: "#F3F3F3", fg: "#444",    bar: "#9A9A9A" },
  };
  const typeOf = (e) => TYPES[e.type] || TYPES.other;

  // ---------- venue colour modes ----------
  const VENUE_TYPES = {
    stadium:   { label: "Stadium",            color: "#C81D4E" },
    arena:     { label: "Arena",              color: "#F2542D" },
    outdoor:   { label: "Outdoor / seasonal", color: "#13A89E" },
    hall:      { label: "Concert hall / theatre", color: "#6247AA" },
    club:      { label: "Rock & dance club",  color: "#1F7AE0" },
    listening: { label: "Jazz / folk / listening room", color: "#C99A06" },
  };
  const NEXT_BUCKETS = [
    { key: "tonight", label: "Show tonight",   color: "#E4004B", test: (d) => d === 0 },
    { key: "soon",    label: "Within 3 days",  color: "#FF7A45", test: (d) => d <= 3 },
    { key: "week",    label: "Within a week",  color: "#F2B134", test: (d) => d <= 7 },
    { key: "later",   label: "Later",          color: "#7C93C3", test: (d) => d < Infinity },
    { key: "none",    label: "Nothing listed", color: "#BDBDBD", test: () => true },
  ];
  const BUSY_BUCKETS = [
    { label: "6–7 nights",  color: "#3D0C6E", min: 6 },
    { label: "4–5 nights",  color: "#7B2CBF", min: 4 },
    { label: "2–3 nights",  color: "#B37FE0", min: 2 },
    { label: "1 night",     color: "#DCC6F5", min: 1 },
    { label: "Dark",        color: "#BDBDBD", min: 0 },
  ];

  function nextEventDelta(v) {
    const list = byVenue[v.id];
    return list && list.length ? daysBetween(TODAY, list[0].date) : Infinity;
  }
  function nightsThisWeek(v) {
    const end = iso(addDays(parseIso(TODAY), 6));
    return new Set((byVenue[v.id] || []).filter((e) => e.date <= end).map((e) => e.date)).size;
  }

  let mode = localStorage.getItem("tmm-mode") || "next";
  function venueColor(v) {
    if (mode === "type") return VENUE_TYPES[v.type].color;
    if (mode === "busy") { const n = nightsThisWeek(v); return BUSY_BUCKETS.find((b) => n >= b.min).color; }
    const d = nextEventDelta(v);
    return NEXT_BUCKETS.find((b) => b.test(d)).color;
  }

  // ---------- map ----------
  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
  const canHover = window.matchMedia("(hover: hover)").matches;
  const touchBoost = canHover ? 1 : 1.3;

  const map = L.map("map", { zoomControl: false, minZoom: 9, maxZoom: 18, zoomSnap: 0.5, tap: false })
    .setView(isMobile() ? [43.660, -79.395] : [43.665, -79.40], isMobile() ? 12 : 12.5);
  if (canHover) L.control.zoom({ position: "bottomright" }).addTo(map);

  map.createPane("transit").style.zIndex = 410;
  map.createPane("stations").style.zIndex = 430;
  map.createPane("venues").style.zIndex = 640;

  const attribution = '<a href="https://openfreemap.org">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  if (L.maplibreGL) {
    L.maplibreGL({ style: "https://tiles.openfreemap.org/styles/positron", attribution }).addTo(map);
  } else {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
    }).addTo(map);
  }

  // ---------- transit ----------
  const transitRenderer = L.canvas({ pane: "transit", padding: 0.5 });
  const stationRenderer = L.canvas({ pane: "stations", padding: 0.5 });
  const lineLayers = [];
  const stationLayers = [];

  const lineWeight = (kind, z) => kind === "subway"
    ? Math.max(2, Math.min(7, (z - 9) * 0.9))
    : Math.max(1, Math.min(3.2, (z - 9) * 0.4));
  const stationRadius = (kind, z) => kind === "subway"
    ? Math.max(1.6, Math.min(5, (z - 10) * 0.75))
    : Math.max(1.2, Math.min(3.6, (z - 10) * 0.5));

  const ordered = [...TRANSIT].sort((a, b) => (a.kind === "go" ? -1 : 1) - (b.kind === "go" ? -1 : 1));
  for (const line of ordered) {
    const latlngs = line.segments.map((seg) => seg.map(([lon, lat]) => [lat, lon]));
    const layer = L.polyline(latlngs, {
      renderer: transitRenderer, color: line.color, interactive: false,
      opacity: line.kind === "subway" ? 0.55 : 0.4,
      weight: lineWeight(line.kind, map.getZoom()),
      lineCap: "round", lineJoin: "round",
    }).addTo(map);
    lineLayers.push({ layer, kind: line.kind });

    for (const s of line.stations) {
      const m = L.circleMarker([s.lat, s.lon], {
        renderer: stationRenderer, radius: stationRadius(line.kind, map.getZoom()),
        color: line.color, weight: line.kind === "subway" ? 1.6 : 1.2, opacity: 0.85,
        fillColor: "#fff", fillOpacity: 1, interactive: canHover,
      }).addTo(map);
      if (canHover) m.bindTooltip(`${s.name}<span class="tt-line" style="background:${line.color}"></span>${line.name}`,
        { className: "station-tt", direction: "top", offset: [0, -4] });
      stationLayers.push({ layer: m, kind: line.kind });
    }
  }

  // ---------- venues ----------
  const capNumber = (v) => Number(String(v.capacity).replace(/[^\d–-]/g, "").split(/[–-]/).pop()) || 100;
  const zoomFactor = (z) => touchBoost * Math.max(0.45, Math.min(1.7, 0.5 + (z - 11) * 0.17));
  const baseRadius = (v) => 4.5 + 2.1 * Math.log10(Math.max(capNumber(v), 60) / 50);
  const venueMarkers = {};

  for (const v of VENUES) {
    const m = L.circleMarker([v.lat, v.lon], {
      pane: "venues", radius: baseRadius(v) * zoomFactor(map.getZoom()),
      color: "#fff", weight: 2, fillColor: venueColor(v), fillOpacity: 0.95,
      className: "venue-dot",
    }).addTo(map);
    if (canHover) m.bindTooltip(() => venueTooltip(v), { className: "venue-tt", direction: "top", offset: [0, -6] });
    m.on("click", (e) => { L.DomEvent.stopPropagation(e); openCard(v); });
    venueMarkers[v.id] = m;
  }

  function venueTooltip(v) {
    const next = (byVenue[v.id] || [])[0];
    let line = '<span class="muted">Nothing listed</span>';
    if (next) {
      const d = daysBetween(TODAY, next.date);
      const when = d === 0 ? "Tonight" : d === 1 ? "Tomorrow" : `${DAY_NAMES[parseIso(next.date).getDay()]} ${parseIso(next.date).getDate()}`;
      line = `<span class="muted">${when}:</span> ${typeOf(next).emoji ? typeOf(next).emoji + " " : ""}${esc(next.title)}`;
    }
    return `<b>${esc(v.name)}</b><br>${line}`;
  }

  function restyleVenues() {
    const z = map.getZoom();
    for (const v of VENUES) {
      const m = venueMarkers[v.id];
      m.setRadius(baseRadius(v) * zoomFactor(z));
      m.setStyle({ fillColor: venueColor(v), weight: z < 11.5 ? 1.2 : 2 });
      const el = m.getElement();
      if (el) el.classList.toggle("pulse", mode === "next" && nextEventDelta(v) === 0);
    }
  }

  map.on("zoomend", () => {
    const z = map.getZoom();
    lineLayers.forEach(({ layer, kind }) => layer.setStyle({ weight: lineWeight(kind, z) }));
    stationLayers.forEach(({ layer, kind }) => layer.setRadius(stationRadius(kind, z)));
    restyleVenues();
  });

  // ---------- legend ----------
  function renderLegend() {
    document.querySelectorAll("#mode button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
    let items;
    if (mode === "type") items = Object.values(VENUE_TYPES).map((t) => [t.color, t.label]);
    else if (mode === "busy") items = BUSY_BUCKETS.map((b) => [b.color, b.label]);
    else items = NEXT_BUCKETS.map((b) => [b.color, b.label]);
    document.getElementById("legend-items").innerHTML = items
      .map(([c, l]) => `<li><span class="sw" style="background:${c}"></span>${l}</li>`).join("");
  }
  document.getElementById("mode").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    mode = b.dataset.mode;
    localStorage.setItem("tmm-mode", mode);
    renderLegend();
    restyleVenues();
  });
  const legendEl = document.getElementById("legend");
  const setLegendCollapsed = (c) => {
    legendEl.classList.toggle("collapsed", c);
    document.getElementById("legend-toggle").textContent = c ? "+" : "–";
  };
  setLegendCollapsed(isMobile());
  legendEl.querySelector(".legend-head").addEventListener("click", () =>
    setLegendCollapsed(!legendEl.classList.contains("collapsed")));
  document.getElementById("legend-transit").innerHTML =
    TRANSIT.filter((l) => l.kind === "subway").map((l) =>
      `<span class="tl" title="${l.name}"><i style="background:${l.color}"></i>${l.id.replace("L", "")}</span>`).join("") +
    `<span class="tl go"><i></i>GO / UP</span>`;

  // ---------- card ----------
  const card = document.getElementById("card");
  let activeVenue = null;

  function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  const tint = (h, a) => { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function openCard(v) {
    activeVenue = v.id;
    const [c1, c2] = v.colors;
    const vt = VENUE_TYPES[v.type];
    const list = byVenue[v.id] || [];

    const days = [];
    for (let d = parseIso(TODAY); iso(d) <= WINDOW_END; d = addDays(d, 1)) days.push(iso(d));

    const rows = days.map((day) => {
      const evs = list.filter((e) => e.date === day);
      const dt = parseIso(day);
      const delta = daysBetween(TODAY, day);
      const rel = delta === 0 ? "Today" : delta === 1 ? "Tomorrow" : DAY_NAMES[dt.getDay()];
      const weekend = dt.getDay() === 5 || dt.getDay() === 6;
      const more = evs.length > 2 ? `<button class="more" type="button">+${evs.length - 2} more</button>` : "";
      const date = `<div class="d"><span class="dw${weekend ? " we" : ""}">${rel}</span><span class="dn">${dt.getDate()} ${MONTHS[dt.getMonth()]}</span>${more}</div>`;
      if (!evs.length) return `<li class="row empty">${date}<div class="ev-list"><span class="none">No events</span></div></li>`;
      const items = evs.map((e) => {
        const t = typeOf(e);
        const emoji = e.emoji || t.emoji;
        const style = t.bar ? `style="--bg:${t.bg};--fg:${t.fg};--bar:${t.bar}"` : "";
        const tag = e.url ? `a href="${esc(e.url)}" target="_blank" rel="noopener"` : "div";
        return `<${tag} class="ev ${t.bar ? "nc" : ""}" ${style} title="${esc(e.title)}${e.time ? " · " + e.time : ""}">
            ${emoji ? `<span class="em">${emoji}</span>` : ""}
            <span class="t">${esc(e.title)}</span>
            ${e.time ? `<span class="tm">${e.time}</span>` : ""}
            ${e.url ? '<span class="go">↗</span>' : ""}
          </${tag.split(" ")[0]}>`;
      }).join("");
      const cls = evs.length > 1 ? " multi" : "";
      return `<li class="row${cls}${evs.length > 2 ? " folded" : ""}">${date}<div class="ev-list">${items}</div></li>`;
    }).join("");

    const empty = days.length === 0
      ? `<p class="stale">No upcoming data — the last reload covered up to ${WINDOW_END}. Time for a reload!</p>` : "";

    const typesHere = [...new Set(list.map((e) => e.type).filter((t) => t && t !== "concert"))];
    const typeLegend = typesHere.length
      ? `<div class="types">${typesHere.map((t) => `<span style="--bg:${TYPES[t].bg};--bar:${TYPES[t].bar}">${TYPES[t].emoji} ${TYPES[t].label}</span>`).join("")}</div>` : "";

    card.style.setProperty("--c1", c1);
    card.style.setProperty("--c2", c2);
    card.style.setProperty("--c1-soft", tint(c1, 0.1));
    card.style.setProperty("--c1-mid", tint(c1, 0.22));
    card.innerHTML = `
      <div class="band"></div>
      <button class="close" aria-label="Close">×</button>
      <div class="head">
        <span class="vtype" style="--vt:${vt.color}">${vt.label}</span>
        <h2>${esc(v.name)}</h2>
        <p class="addr">${esc(v.address)}</p>
        <div class="stats">
          <div class="cap"><span class="k">Capacity</span><span class="v">${esc(v.capacity)}</span></div>
          <div class="cap"><span class="k">Next 7 days</span><span class="v">${nightsThisWeek(v)} <small>night${nightsThisWeek(v) === 1 ? "" : "s"}</small></span></div>
          <a class="site" href="${esc(v.website)}" target="_blank" rel="noopener">Venue site ↗</a>
        </div>
      </div>
      <div class="sched-head"><span>Upcoming</span><span class="hint">scroll for 3 weeks</span></div>
      ${empty}
      <ol class="days">${rows}</ol>
      ${typeLegend}
      <p class="foot">Updated ${esc(EVENTS.meta.reloadedAt || "—")} · data through ${esc(WINDOW_END)}</p>`;
    card.hidden = false;
    card.classList.remove("in");
    void card.offsetWidth;
    card.classList.add("in");
    card.querySelector(".close").onclick = closeCard;
    card.querySelectorAll(".more").forEach((b) => b.addEventListener("click", () => {
      const row = b.closest(".row");
      row.classList.toggle("folded");
      b.textContent = row.classList.contains("folded") ? `+${row.querySelectorAll(".ev").length - 2} more` : "less";
    }));

    Object.values(venueMarkers).forEach((m) => m.getElement()?.classList.remove("selected"));
    venueMarkers[v.id].getElement()?.classList.add("selected");
    venueMarkers[v.id].bringToFront();
    document.body.classList.add("card-open");

    if (isMobile()) {
      card.insertAdjacentHTML("afterbegin", '<div class="grip" aria-hidden="true"></div>');
      enableSwipeToClose();
      setTimeout(() => keepVenueVisible(v), 60);
    }
  }

  function keepVenueVisible(v) {
    const size = map.getSize();
    const visibleH = size.y - card.offsetHeight;
    const p = map.latLngToContainerPoint([v.lat, v.lon]);
    const targetY = Math.max(90, visibleH * 0.55);
    if (p.y > visibleH - 30 || p.y < 80) {
      map.panBy([p.x - size.x / 2, p.y - targetY], { animate: true, duration: 0.35 });
    }
  }

  function enableSwipeToClose() {
    let startY = null, dy = 0;
    const handle = card.querySelector(".head");
    const zones = [card.querySelector(".grip"), card.querySelector(".band"), handle];
    const onStart = (e) => { startY = e.touches[0].clientY; dy = 0; card.style.transition = "none"; };
    const onMove = (e) => {
      if (startY === null) return;
      dy = Math.max(0, e.touches[0].clientY - startY);
      card.style.transform = `translateY(${dy}px)`;
    };
    const onEnd = () => {
      if (startY === null) return;
      card.style.transition = "transform .2s ease-out";
      if (dy > 90) { card.style.transform = "translateY(100%)"; setTimeout(closeCard, 180); }
      else card.style.transform = "";
      startY = null;
    };
    zones.forEach((z) => {
      if (!z) return;
      z.addEventListener("touchstart", onStart, { passive: true });
      z.addEventListener("touchmove", onMove, { passive: true });
      z.addEventListener("touchend", onEnd);
    });
  }

  function closeCard() {
    card.hidden = true;
    card.style.transform = "";
    card.style.transition = "";
    activeVenue = null;
    document.body.classList.remove("card-open");
    Object.values(venueMarkers).forEach((m) => m.getElement()?.classList.remove("selected"));
  }
  map.on("click", closeCard);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCard(); });

  // ---------- search ----------
  const search = document.getElementById("search");
  const results = document.getElementById("search-results");
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    results.innerHTML = VENUES.filter((v) => v.name.toLowerCase().includes(q)).slice(0, 8)
      .map((v) => `<li data-id="${v.id}"><span class="sw" style="background:${venueColor(v)}"></span>${esc(v.name)}</li>`).join("");
  });
  results.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    const v = VENUES.find((x) => x.id === li.dataset.id);
    search.blur();
    if (isMobile()) map.setView([v.lat, v.lon], Math.max(map.getZoom(), 15), { animate: false });
    else map.flyTo([v.lat, v.lon], Math.max(map.getZoom(), 15), { duration: 0.8 });
    openCard(v);
    results.innerHTML = "";
    search.value = "";
  });

  // ---------- header ----------
  const tonight = VENUES.filter((v) => nextEventDelta(v) === 0).length;
  const now = new Date();
  document.getElementById("subtitle").innerHTML =
    `<span class="sub-date">${DAY_NAMES[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]} · </span>` +
    `${tonight}<span class="sub-long"> venue${tonight === 1 ? "" : "s"} with shows</span> tonight`;

  renderLegend();
  restyleVenues();

  window.__tmm = {
    focus(id, zoom) {
      const v = VENUES.find((x) => x.id === id);
      map.setView([v.lat, v.lon], zoom || Math.max(map.getZoom(), 14), { animate: false });
      openCard(v);
    },
  };
})();
