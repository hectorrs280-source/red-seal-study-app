/* Perfiles locales de estudio. No usa correo ni servidor: cada navegador conserva sus propios usuarios. */
(function () {
  'use strict';
  const KEY = 'redSealStudyProfilesV2';
  function fmtLocal(d) { const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
  function today() { return fmtLocal(new Date()); }
  function addDays(iso, days) { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + days); return fmtLocal(d); }
  function loadState() { try { const state = JSON.parse(localStorage.getItem(KEY)); if (state && Array.isArray(state.profiles)) return state; } catch (_) {} return { profiles: [], activeId: null }; }
  function saveState(state) { localStorage.setItem(KEY, JSON.stringify(state)); }
  function list() { return loadState().profiles; }
  function active() { const state = loadState(); return state.profiles.find((p) => p.id === state.activeId) || null; }
  function create(name, startDate = today()) { const clean = String(name || '').trim().slice(0, 32); if (!clean) throw new Error('El nombre de usuario es obligatorio.'); const state = loadState(); const id = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`; const profile = { id, name: clean, startDate, targetDate: addDays(startDate, 179), createdAt: new Date().toISOString() }; state.profiles.push(profile); state.activeId = id; saveState(state); return profile; }
  function setActive(id) { const state = loadState(); if (!state.profiles.some((p) => p.id === id)) return null; state.activeId = id; saveState(state); return active(); }
  function update(patch) { const state = loadState(); const idx = state.profiles.findIndex((p) => p.id === state.activeId); if (idx < 0) return null; state.profiles[idx] = { ...state.profiles[idx], ...patch }; if (patch.startDate) state.profiles[idx].targetDate = addDays(patch.startDate, 179); saveState(state); return state.profiles[idx]; }
  function progressKey(id = active()?.id) { return id ? `redSealStudyProgressV2:${id}` : null; }
  window.ProfileStore = { list, active, create, setActive, update, progressKey, today, addDays };
})();
