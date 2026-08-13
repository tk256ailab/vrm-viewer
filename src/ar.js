/**
 * @file ar.js
 * @description WebXR Augmented Reality (AR) module for VRM Viewer.
 *   Provides WebXR session initialization, hit-testing reticle, tap-to-place
 *   placement for VRM models, and graceful fallback toasts when WebXR is unsupported.
 */

import * as THREE from 'three';

let arReticle = null;
let hitTestSource = null;
let xrRefSpace = null;
let isARActive = false;

/**
 * Check if WebXR AR (`immersive-ar`) is supported on the current browser/device.
 * @returns {Promise<boolean>}
 */
export async function isARSupported() {
	if (!navigator.xr) return false;
	try {
		return await navigator.xr.isSessionSupported('immersive-ar');
	} catch {
		return false;
	}
}

/**
 * Create a visual ring reticle on the floor/surface for AR placement.
 * @param {THREE.Scene} scene
 * @returns {THREE.Mesh}
 */
export function createARReticle(scene) {
	const geometry = new THREE.RingGeometry(0.1, 0.14, 32).rotateX(-Math.PI / 2);
	const material = new THREE.MeshBasicMaterial({
		color: 0x667eea,
		transparent: true,
		opacity: 0.85,
		side: THREE.DoubleSide,
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.visible = false;
	mesh.matrixAutoUpdate = false;
	scene.add(mesh);
	return mesh;
}

/**
 * Start an immersive AR session if supported.
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {Object} callbacks - Object with onSessionEnd callback
 * @returns {Promise<boolean>} Success status
 */
export async function startARSession(renderer, scene, camera, callbacks = {}) {
	const supported = await isARSupported();
	if (!supported) {
		return false;
	}

	renderer.xr.enabled = true;
	renderer.xr.setReferenceSpaceType('local-floor');

	let session;
	try {
		session = await navigator.xr.requestSession('immersive-ar', {
			requiredFeatures: ['local-floor'],
			optionalFeatures: ['hit-test'],
		});
	} catch (err) {
		console.error('Failed to start WebXR AR session:', err);
		return false;
	}

	renderer.xr.setSession(session);
	isARActive = true;

	arReticle = createARReticle(scene);

	const refSpace = await session.requestReferenceSpace('local-floor');
	const viewerSpace = await session.requestReferenceSpace('viewer');
	hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
	xrRefSpace = refSpace;

	session.addEventListener('end', () => {
		isARActive = false;
		if (arReticle) {
			scene.remove(arReticle);
			arReticle.geometry.dispose();
			arReticle.material.dispose();
			arReticle = null;
		}
		hitTestSource = null;
		xrRefSpace = null;
		if (callbacks.onSessionEnd) callbacks.onSessionEnd();
	});

	return true;
}

/**
 * Per-frame AR reticle update inside renderer loop.
 * @param {Object} frame - WebXR frame
 */
export function updateARFrame(frame) {
	if (!isARActive || !frame || !hitTestSource || !arReticle || !xrRefSpace) return;

	const hitResults = frame.getHitTestResults(hitTestSource);
	if (hitResults.length > 0) {
		const hit = hitResults[0];
		const pose = hit.getPose(xrRefSpace);
		arReticle.visible = true;
		arReticle.matrix.fromArray(pose.transform.matrix);
	} else {
		arReticle.visible = false;
	}
}

/**
 * Place the loaded VRM model at the current AR reticle position.
 * @param {import('@pixiv/three-vrm').VRM} vrm
 */
export function placeVRMAtReticle(vrm) {
	if (!vrm || !arReticle || !arReticle.visible) return;
	vrm.scene.position.setFromMatrixPosition(arReticle.matrix);
}

/** @returns {boolean} */
export function isARRunning() {
	return isARActive;
}
