/**
 * @file hotkeys.js
 * @description Global keyboard shortcut system for VRM Viewer.
 *   Attaches one keydown listener to window and dispatches to registered handlers.
 *   Ignores events when focus is inside an input/textarea/select.
 *
 * Default shortcuts:
 *   Space         → play / pause animation
 *   S             → stop animation
 *   R             → reset pose
 *   L             → toggle UI language (EN ↔ JA)
 *   H             → toggle panel visibility (show / hide controls)
 *   1             → switch to Animation tab
 *   2             → switch to Features tab
 *   3             → switch to Pose tab
 *   4             → switch to Face tab
 *   ?             → show keyboard shortcut help overlay
 */

/** @type {Map<string, () => void>} */
const handlers = new Map();

let overlayEl = null;
let active = false;

/**
 * Register a keyboard shortcut.
 * @param {string} key   - Key string matching KeyboardEvent.key (e.g. ' ', 'r', '1')
 * @param {() => void} fn - Handler to call when key is pressed
 */
export function registerHotkey(key, fn) {
	handlers.set(key.toLowerCase(), fn);
}

/**
 * Remove a registered shortcut.
 * @param {string} key
 */
export function unregisterHotkey(key) {
	handlers.delete(key.toLowerCase());
}

/** @returns {boolean} true if the hotkey system is active */
export function isActive() { return active; }

/**
 * Initialise the hotkey listener. Safe to call multiple times.
 */
export function initHotkeys() {
	if (active) return;
	active = true;

	window.addEventListener('keydown', _onKeydown);

	// Register built-in help shortcut
	registerHotkey('?', showHelp);
	registerHotkey('Escape', hideHelp);
}

/**
 * Tear down event listener (useful for tests).
 */
export function destroyHotkeys() {
	window.removeEventListener('keydown', _onKeydown);
	handlers.clear();
	active = false;
	hideHelp();
}

// ---------------------------------------------------------------------------
// Internal
// ---------------------------------------------------------------------------

function _onKeydown(e) {
	// Ignore when the user is typing in a form element
	const tag = document.activeElement?.tagName?.toLowerCase();
	if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

	// Ignore modifier combos (Ctrl+C, Alt+Tab, etc.)
	if (e.ctrlKey || e.altKey || e.metaKey) return;

	const key = e.key === ' ' ? ' ' : e.key.toLowerCase();
	const handler = handlers.get(key);
	if (handler) {
		e.preventDefault();
		handler();
	}
}

// ---------------------------------------------------------------------------
// Help overlay
// ---------------------------------------------------------------------------

const SHORTCUT_DESCRIPTIONS = [
	['Space',  'Play / Pause animation'],
	['S',      'Stop animation'],
	['R',      'Reset pose'],
	['L',      'Toggle language (EN ↔ JA)'],
	['H',      'Show / hide controls panel'],
	['1',      'Animation tab'],
	['2',      'Features tab'],
	['3',      'Pose tab'],
	['4',      'Face tab'],
	['?',      'Show / hide this help'],
	['Escape', 'Close this help'],
];

/**
 * Show the keyboard shortcut help overlay.
 */
export function showHelp() {
	if (overlayEl) { overlayEl.style.display = 'flex'; return; }

	overlayEl = document.createElement('div');
	overlayEl.id = 'hotkeyOverlay';
	overlayEl.setAttribute('role', 'dialog');
	overlayEl.setAttribute('aria-label', 'Keyboard shortcuts');
	overlayEl.style.cssText = [
		'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.7)',
		'display:flex', 'align-items:center', 'justify-content:center',
		'z-index:9999', 'font-family:Inter,sans-serif',
	].join(';');

	const box = document.createElement('div');
	box.style.cssText = [
		'background:rgba(20,20,30,0.97)', 'border:1px solid rgba(255,255,255,0.15)',
		'border-radius:16px', 'padding:28px 36px', 'color:#fff',
		'max-width:420px', 'width:90vw',
		'box-shadow:0 8px 40px rgba(0,0,0,0.6)',
	].join(';');

	const title = document.createElement('h2');
	title.style.cssText = 'margin:0 0 18px;font-size:16px;font-weight:700;letter-spacing:0.05em;color:#a78bfa;';
	title.textContent = '⌨️ Keyboard Shortcuts';
	box.appendChild(title);

	const table = document.createElement('table');
	table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;';

	SHORTCUT_DESCRIPTIONS.forEach(([key, desc]) => {
		const tr = document.createElement('tr');
		tr.style.cssText = 'border-bottom:1px solid rgba(255,255,255,0.07);';

		const tdKey = document.createElement('td');
		tdKey.style.cssText = 'padding:8px 14px 8px 0;white-space:nowrap;';
		const kbd = document.createElement('kbd');
		kbd.style.cssText = [
			'background:#1e1b4b', 'border:1px solid #4c1d95',
			'border-radius:5px', 'padding:2px 8px',
			'font-family:monospace', 'font-size:12px', 'color:#c4b5fd',
		].join(';');
		kbd.textContent = key;
		tdKey.appendChild(kbd);

		const tdDesc = document.createElement('td');
		tdDesc.style.cssText = 'padding:8px 0;color:#d1d5db;';
		tdDesc.textContent = desc;

		tr.appendChild(tdKey);
		tr.appendChild(tdDesc);
		table.appendChild(tr);
	});

	box.appendChild(table);

	const closeBtn = document.createElement('button');
	closeBtn.style.cssText = [
		'margin-top:20px', 'width:100%', 'padding:8px',
		'background:linear-gradient(135deg,#667eea,#764ba2)',
		'border:none', 'border-radius:8px', 'color:#fff',
		'cursor:pointer', 'font-weight:600', 'font-size:13px',
	].join(';');
	closeBtn.textContent = 'Close  [Esc]';
	closeBtn.addEventListener('click', hideHelp);
	box.appendChild(closeBtn);

	overlayEl.appendChild(box);
	overlayEl.addEventListener('click', (e) => { if (e.target === overlayEl) hideHelp(); });
	document.body.appendChild(overlayEl);
}

/**
 * Hide the help overlay.
 */
export function hideHelp() {
	if (overlayEl) overlayEl.style.display = 'none';
}
