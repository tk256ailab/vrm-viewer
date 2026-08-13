import { describe, it, expect } from 'vitest';
import { isARSupported, isARRunning, createARReticle } from '../../src/ar.js';
import * as THREE from 'three';

describe('ar module', () => {
	it('isARSupported returns false when navigator.xr is missing', async () => {
		const supported = await isARSupported();
		expect(supported).toBe(false);
	});

	it('isARRunning defaults to false', () => {
		expect(isARRunning()).toBe(false);
	});

	it('createARReticle adds a hidden mesh to the scene', () => {
		const scene = new THREE.Scene();
		const reticle = createARReticle(scene);
		expect(reticle).toBeInstanceOf(THREE.Mesh);
		expect(reticle.visible).toBe(false);
		expect(scene.children).toContain(reticle);
	});
});
