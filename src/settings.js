/**
 * @file settings.js
 * @description Persistent user preferences via localStorage.
 *   Stores and restores: UI language, lighting levels, pose reset mode,
 *   standby motion state, and auto-blink state.
 *   Pure JS — no DOM or Three.js dependencies; DOM sync is done by callers.
 */

const STORAGE_KEY = 'vrmviewer_prefs_v1';

/** @typedef {{ lang: 'en'|'ja', dirLight: number, ambLight: number, poseMode: 'apose'|'tpose', standbyMotion: boolean, autoBlink: boolean }} Prefs */

/** @type {Prefs} */
const DEFAULTS = {
	lang:          'en',
	dirLight:      3.0,
	ambLight:      1.0,
	poseMode:      'apose',
	standbyMotion: true,
	autoBlink:     true,
};

/**
 * Load preferences from localStorage. Missing keys fall back to defaults.
 * @returns {Prefs}
 */
export function loadPrefs() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { ...DEFAULTS };
		return { ...DEFAULTS, ...JSON.parse(raw) };
	} catch {
		return { ...DEFAULTS };
	}
}

/**
 * Persist a partial preference update.
 * @param {Partial<Prefs>} patch
 */
export function savePrefs(patch) {
	try {
		const current = loadPrefs();
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...patch }));
	} catch {
		// localStorage blocked (private mode, quota full) — silently ignore
	}
}

/**
 * Reset all preferences to defaults.
 */
export function resetPrefs() {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// ignore
	}
}
