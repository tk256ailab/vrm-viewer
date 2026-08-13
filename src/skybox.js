/**
 * @file skybox.js
 * @description Background & Skybox environment module for VRM Viewer.
 *   Supports background color picker, equirectangular skybox textures,
 *   blurriness, rotation angle, and lighting environment maps.
 */

import * as THREE from 'three';

let activeTexture = null;
let activeEnvMap = null;

/**
 * Set a solid background color on the scene.
 * @param {THREE.Scene} scene
 * @param {string|number} color - Hex string or number (e.g. '#222222' or 0x222222)
 */
export function setBackgroundColor(scene, color) {
	if (!scene) return;
	if (activeTexture) {
		activeTexture.dispose();
		activeTexture = null;
	}
	scene.background = new THREE.Color(color);
}

/**
 * Load an equirectangular skybox image from a File object or URL.
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 * @param {File|string} source - File object from input or URL string
 * @returns {Promise<void>}
 */
export function setSkyboxSource(scene, renderer, source) {
	return new Promise((resolve, reject) => {
		const url = typeof source === 'string' ? source : URL.createObjectURL(source);
		const loader = new THREE.TextureLoader();

		loader.load(
			url,
			(texture) => {
				texture.colorSpace = THREE.SRGBColorSpace;
				texture.mapping = THREE.EquirectangularReflectionMapping;

				if (activeTexture) activeTexture.dispose();
				activeTexture = texture;
				scene.background = texture;

				// Generate environment map for PBR reflection on avatar materials
				if (renderer) {
					if (activeEnvMap) activeEnvMap.dispose();
					const pmremGenerator = new THREE.PMREMGenerator(renderer);
					pmremGenerator.compileEquirectangularShader();
					activeEnvMap = pmremGenerator.fromEquirectangular(texture).texture;
					scene.environment = activeEnvMap;
					pmremGenerator.dispose();
				}

				if (typeof source !== 'string') URL.revokeObjectURL(url);
				resolve();
			},
			undefined,
			(err) => {
				if (typeof source !== 'string') URL.revokeObjectURL(url);
				reject(err);
			}
		);
	});
}

/**
 * Adjust background blurriness (0.0 = sharp, 1.0 = fully blurred).
 * @param {THREE.Scene} scene
 * @param {number} amount - Value between 0.0 and 1.0
 */
export function setBackgroundBlur(scene, amount) {
	if (scene) {
		scene.backgroundBlurriness = Math.max(0, Math.min(1, amount));
	}
}

/**
 * Rotate the skybox background on Y axis (in degrees).
 * @param {THREE.Scene} scene
 * @param {number} degrees - Angle in degrees (0..360)
 */
export function setBackgroundRotation(scene, degrees) {
	if (scene && scene.backgroundRotation) {
		scene.backgroundRotation.y = THREE.MathUtils.degToRad(degrees);
	}
}
