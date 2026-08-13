import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadPrefs, savePrefs, resetPrefs } from '../../src/settings.js';

describe('settings — loadPrefs', () => {
	beforeEach(() => resetPrefs());
	afterEach(() => resetPrefs());

	it('returns defaults when localStorage is empty', () => {
		const prefs = loadPrefs();
		expect(prefs.lang).toBe('en');
		expect(prefs.dirLight).toBe(3.0);
		expect(prefs.ambLight).toBe(1.0);
		expect(prefs.poseMode).toBe('apose');
		expect(prefs.standbyMotion).toBe(true);
		expect(prefs.autoBlink).toBe(true);
	});

	it('returns the same object shape every time', () => {
		const prefs = loadPrefs();
		expect(prefs).toHaveProperty('lang');
		expect(prefs).toHaveProperty('dirLight');
		expect(prefs).toHaveProperty('ambLight');
		expect(prefs).toHaveProperty('poseMode');
		expect(prefs).toHaveProperty('standbyMotion');
		expect(prefs).toHaveProperty('autoBlink');
	});
});

describe('settings — savePrefs + loadPrefs round-trip', () => {
	beforeEach(() => resetPrefs());
	afterEach(() => resetPrefs());

	it('persists lang change', () => {
		savePrefs({ lang: 'ja' });
		expect(loadPrefs().lang).toBe('ja');
	});

	it('persists dirLight change', () => {
		savePrefs({ dirLight: 7.5 });
		expect(loadPrefs().dirLight).toBe(7.5);
	});

	it('persists ambLight change', () => {
		savePrefs({ ambLight: 2.2 });
		expect(loadPrefs().ambLight).toBe(2.2);
	});

	it('persists poseMode change', () => {
		savePrefs({ poseMode: 'tpose' });
		expect(loadPrefs().poseMode).toBe('tpose');
	});

	it('persists standbyMotion: false', () => {
		savePrefs({ standbyMotion: false });
		expect(loadPrefs().standbyMotion).toBe(false);
	});

	it('persists autoBlink: false', () => {
		savePrefs({ autoBlink: false });
		expect(loadPrefs().autoBlink).toBe(false);
	});

	it('partial patch does not overwrite other keys', () => {
		savePrefs({ lang: 'ja', dirLight: 5 });
		savePrefs({ ambLight: 0.5 });
		const prefs = loadPrefs();
		// Previously saved keys should remain
		expect(prefs.lang).toBe('ja');
		expect(prefs.dirLight).toBe(5);
		// Newly patched key
		expect(prefs.ambLight).toBe(0.5);
	});
});

describe('settings — resetPrefs', () => {
	it('clearing prefs causes loadPrefs to return defaults', () => {
		savePrefs({ lang: 'ja', dirLight: 9 });
		resetPrefs();
		const prefs = loadPrefs();
		expect(prefs.lang).toBe('en');
		expect(prefs.dirLight).toBe(3.0);
	});
});
