import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * VRM Viewer Static HTML & Structural Tests
 * Note: JSDOM validates static HTML markup, meta tags, importmaps, and DOM element IDs.
 * Full dynamic JavaScript execution (WebGL, canvas, ES module imports) is tested in tests/e2e/viewer.spec.js via Playwright.
 */
describe('VRM Viewer Static HTML & Structural Tests', () => {
  let dom;
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');
    dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('should have correct title and meta tags', () => {
    expect(document.title).toBe('VRM Viewer');
    const description = document.querySelector('meta[name="description"]');
    expect(description).not.toBeNull();
    expect(description.getAttribute('content')).toContain('VRM model viewer');

    const favicon = document.querySelector('link[rel="icon"]');
    expect(favicon).not.toBeNull();
    expect(favicon.getAttribute('href')).toContain('data:image/svg+xml');
  });

  it('should have valid importmap with expected dependency versions', () => {
    const importmapScript = document.querySelector('script[type="importmap"]');
    expect(importmapScript).not.toBeNull();
    const importmap = JSON.parse(importmapScript.textContent);
    expect(importmap.imports.three).toContain('0.185.1');
    expect(importmap.imports['@pixiv/three-vrm']).toContain('3.5.5');
    expect(importmap.imports['@pixiv/three-vrm-animation']).toContain('3.5.5');
  });

  it('should contain all required DOM element IDs', () => {
    const requiredIds = [
      'controlsPanel',
      'panelToggleBtn',
      'infoPanel',
      'dragOverlay',
      'tabFeaturesBtn',
      'tabAnimationBtn',
      'tabPoseBtn',
      'tabFaceBtn',
      'animationPanel',
      'posePanel',
      'facePanel',
      'featuresPanel',
      'vrmaButtons',
      'playBtn',
      'pauseBtn',
      'stopBtn',
      'openFileBtn',
      'filePicker',
      'status',
      'vrmName',
    ];

    requiredIds.forEach((id) => {
      const element = document.getElementById(id);
      expect(element, `Element #${id} should exist`).not.toBeNull();
    });
  });

  it('should have bilingual lang-en and lang-ja spans for key UI buttons', () => {
    const bilingualButtons = ['tabFeaturesBtn', 'tabAnimationBtn', 'tabPoseBtn', 'tabFaceBtn', 'playBtn', 'pauseBtn', 'stopBtn'];

    bilingualButtons.forEach((id) => {
      const btn = document.getElementById(id);
      expect(btn.querySelector('.lang-en'), `#${id} missing .lang-en`).not.toBeNull();
      expect(btn.querySelector('.lang-ja'), `#${id} missing .lang-ja`).not.toBeNull();
    });
  });

  it('should have a working language switch function setup', () => {
    const langSwitchBtn = document.querySelector('.lang-switch');
    expect(langSwitchBtn).not.toBeNull();
    expect(langSwitchBtn.getAttribute('onclick')).toBe('toggleLang()');
  });
});
