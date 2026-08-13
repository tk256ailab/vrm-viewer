/**
 * @file photo.js
 * @description Screenshot / Photo Mode module for VRM Viewer.
 *   Captures the WebGL canvas as a PNG image with full background or transparent background.
 */

/**
 * Capture a PNG screenshot from the WebGL renderer.
 * @param {import('three').WebGLRenderer} renderer
 * @param {import('three').Scene} scene
 * @param {import('three').Camera} camera
 * @param {Object} [options]
 * @param {boolean} [options.transparent=false] - If true, background is removed for transparency
 * @param {string} [options.filename='vrm-snapshot.png']
 * @returns {string} Data URL of PNG image
 */
export function captureScreenshot(renderer, scene, camera, options = {}) {
	const { transparent = false, filename = 'vrm-snapshot.png' } = options;

	if (!renderer || !scene || !camera) return null;

	const prevBackground = scene.background;
	const prevClearAlpha = renderer.getClearAlpha();

	if (transparent) {
		scene.background = null;
		renderer.setClearAlpha(0);
	}

	// Render frame synchronously
	renderer.render(scene, camera);
	const dataUrl = renderer.domElement.toDataURL('image/png');

	// Restore previous scene state
	scene.background = prevBackground;
	renderer.setClearAlpha(prevClearAlpha);

	// Auto download if requested
	if (filename) {
		downloadDataUrl(dataUrl, filename);
	}

	return dataUrl;
}

/**
 * Trigger browser download for a data URL.
 * @param {string} dataUrl
 * @param {string} filename
 */
export function downloadDataUrl(dataUrl, filename = 'vrm-snapshot.png') {
	const a = document.createElement('a');
	a.href = dataUrl;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
