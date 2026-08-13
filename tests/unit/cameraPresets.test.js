import { describe, it, expect, beforeEach } from 'vitest';
import { applyCameraPreset, setCameraFOV } from '../../src/cameraPresets.js';
import * as THREE from 'three';

describe('cameraPresets — applyCameraPreset', () => {
	let camera;
	let controls;

	beforeEach(() => {
		camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
		controls = {
			target: new THREE.Vector3(),
			update: () => {},
		};
	});

	it('applies head preset correctly', () => {
		applyCameraPreset(camera, controls, 'head');
		expect(camera.position.x).toBe(0.0);
		expect(camera.position.y).toBe(1.4);
		expect(camera.position.z).toBe(0.8);
		expect(controls.target.y).toBe(1.4);
	});

	it('applies upperBody preset correctly', () => {
		applyCameraPreset(camera, controls, 'upperBody');
		expect(camera.position.y).toBe(1.15);
		expect(controls.target.y).toBe(1.0);
	});

	it('applies fullBody preset correctly', () => {
		applyCameraPreset(camera, controls, 'fullBody');
		expect(camera.position.z).toBe(3.5);
	});

	it('applies reset preset correctly', () => {
		applyCameraPreset(camera, controls, 'reset');
		expect(camera.position.z).toBe(5.0);
	});

	it('unknown preset falls back to reset', () => {
		applyCameraPreset(camera, controls, 'nonExistentPreset');
		expect(camera.position.z).toBe(5.0);
	});
});

describe('cameraPresets — setCameraFOV', () => {
	let camera;

	beforeEach(() => {
		camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
	});

	it('sets valid FOV', () => {
		setCameraFOV(camera, 45);
		expect(camera.fov).toBe(45);
	});

	it('clamps FOV below 10 to 10', () => {
		setCameraFOV(camera, 2);
		expect(camera.fov).toBe(10);
	});

	it('clamps FOV above 120 to 120', () => {
		setCameraFOV(camera, 180);
		expect(camera.fov).toBe(120);
	});
});
