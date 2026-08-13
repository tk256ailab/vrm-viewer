import { describe, it, expect, beforeEach } from 'vitest';
import { setBackgroundColor, setBackgroundBlur, setBackgroundRotation } from '../../src/skybox.js';
import * as THREE from 'three';

describe('skybox module', () => {
	let scene;

	beforeEach(() => {
		scene = new THREE.Scene();
	});

	it('setBackgroundColor sets solid color on scene', () => {
		setBackgroundColor(scene, '#ff0000');
		expect(scene.background).toBeInstanceOf(THREE.Color);
		expect(scene.background.getHexString()).toBe('ff0000');
	});

	it('setBackgroundBlur clamps amount between 0 and 1', () => {
		setBackgroundBlur(scene, 0.5);
		expect(scene.backgroundBlurriness).toBe(0.5);

		setBackgroundBlur(scene, -0.2);
		expect(scene.backgroundBlurriness).toBe(0);

		setBackgroundBlur(scene, 1.5);
		expect(scene.backgroundBlurriness).toBe(1);
	});

	it('setBackgroundRotation sets Euler angle in radians', () => {
		setBackgroundRotation(scene, 180);
		expect(scene.backgroundRotation.y).toBeCloseTo(Math.PI);
	});
});
