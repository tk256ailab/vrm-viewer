/**
 * @file cameraPresets.js
 * @description Camera view presets & FOV controls module for VRM Viewer.
 *   Provides quick framing presets (Head, Upper Body, Full Body, Reset)
 *   and smooth camera transition support.
 */

import * as THREE from 'three';

/** @typedef {'head'|'upperBody'|'fullBody'|'reset'} CameraPreset */

const PRESETS = {
	head:      { position: [0.0, 1.4, 0.8], target: [0.0, 1.4, 0.0] },
	upperBody: { position: [0.0, 1.15, 1.8], target: [0.0, 1.0, 0.0] },
	fullBody:  { position: [0.0, 0.85, 3.5], target: [0.0, 0.85, 0.0] },
	reset:     { position: [0.0, 1.0, 5.0], target: [0.0, 1.0, 0.0] },
};

/**
 * Apply a camera preset position and orbit target.
 * @param {THREE.PerspectiveCamera} camera
 * @param {import('three/addons/controls/OrbitControls.js').OrbitControls} controls
 * @param {CameraPreset} preset
 */
export function applyCameraPreset(camera, controls, preset) {
	const cfg = PRESETS[preset] ?? PRESETS.reset;
	if (!camera || !controls) return;

	camera.position.set(...cfg.position);
	controls.target.set(...cfg.target);
	controls.update();
}

/**
 * Set camera Field of View (FOV in degrees) and update projection matrix.
 * @param {THREE.PerspectiveCamera} camera
 * @param {number} fov - Field of view in degrees (e.g. 15 to 75)
 */
export function setCameraFOV(camera, fov) {
	if (!camera) return;
	camera.fov = Math.max(10, Math.min(120, fov));
	camera.updateProjectionMatrix();
}
