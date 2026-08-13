/**
 * @file vrmInfo.js
 * @description Extracts and formats rich metadata from a loaded VRM object.
 *   Returns a plain data object (no DOM manipulation) so the UI can render
 *   it however it likes — and so it can be unit-tested without a browser.
 *
 * Extracted metadata:
 *   - VRM spec version
 *   - Author / license / contact URL
 *   - Model title / version
 *   - Polygon (triangle) count
 *   - Bone count
 *   - Springbone chain count
 *   - Expression names + default values
 *   - Material count + name list
 */

/**
 * @typedef {Object} VRMMetadata
 * @property {string} specVersion      - '1.0' or '0.x'
 * @property {string} title            - Model title
 * @property {string} version          - Model version string
 * @property {string} author           - Author name(s)
 * @property {string} contactUrl       - Author contact URL
 * @property {string} license          - License identifier
 * @property {number} triangleCount    - Total rendered triangles
 * @property {number} boneCount        - Total humanoid bones
 * @property {number} springBoneCount  - SpringBone chain count (0 if none)
 * @property {string[]} expressionNames - VRM expression names
 * @property {number} materialCount    - Total materials
 * @property {string[]} materialNames  - Material names
 */

/**
 * Extract metadata from a loaded three-vrm VRM instance.
 * @param {import('@pixiv/three-vrm').VRM} vrm
 * @returns {VRMMetadata}
 */
export function extractVRMInfo(vrm) {
	// --- Spec version ---
	const meta = vrm.meta ?? {};
	const specVersion = meta.specVersion ?? (vrm.userData?.vrm?.meta ? '0.x' : 'unknown');

	// --- Meta fields (VRM 1.0 uses camelCase; 0.x differs slightly) ---
	const title       = meta.name        ?? meta.title       ?? '—';
	const version     = meta.version     ?? '—';
	const author      = _joinAuthors(meta.authors ?? (meta.author ? [meta.author] : []));
	const contactUrl  = meta.contactInformation ?? meta.contactUrl ?? '—';
	const license     = _describeLicense(meta);

	// --- Geometry ---
	let triangleCount = 0;
	let materialNames = [];
	vrm.scene.traverse((obj) => {
		if (obj.isMesh) {
			const geo = obj.geometry;
			if (geo?.index) {
				triangleCount += geo.index.count / 3;
			} else if (geo?.attributes?.position) {
				triangleCount += geo.attributes.position.count / 3;
			}
			const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
			mats.forEach(m => { if (m?.name && !materialNames.includes(m.name)) materialNames.push(m.name); });
		}
	});

	// --- Bones ---
	const humanoid = vrm.humanoid;
	const boneNames = humanoid ? Object.keys(humanoid.humanBones ?? {}) : [];
	const boneCount = boneNames.length;

	// --- SpringBone chains (VRM 1.0) ---
	let springBoneCount = 0;
	const springBoneManager = vrm.springBoneManager;
	if (springBoneManager) {
		springBoneCount = springBoneManager.joints?.length ?? springBoneManager.springBoneGroupList?.length ?? 0;
	}

	// --- Expressions ---
	const expressionManager = vrm.expressionManager;
	let expressionNames = [];
	if (expressionManager) {
		expressionNames = Object.keys(expressionManager.expressionMap ?? {});
	}

	return {
		specVersion,
		title,
		version,
		author,
		contactUrl,
		license,
		triangleCount:  Math.round(triangleCount),
		boneCount,
		springBoneCount,
		expressionNames,
		materialCount:  materialNames.length,
		materialNames,
	};
}

/**
 * Render a VRMMetadata object into a container element.
 * Appends a structured info card with collapsible sections.
 * @param {VRMMetadata} info
 * @param {HTMLElement} container - Element to render into (will be cleared)
 */
export function renderVRMInfoCard(info, container) {
	container.innerHTML = '';

	const rows = [
		['Spec Version',   info.specVersion],
		['Title',          info.title],
		['Version',        info.version],
		['Author',         info.author],
		['License',        info.license],
		['Contact',        info.contactUrl !== '—' ? `<a href="${info.contactUrl}" target="_blank" rel="noopener" style="color:#a78bfa">${info.contactUrl}</a>` : '—'],
		['Triangles',      info.triangleCount.toLocaleString()],
		['Bones',          info.boneCount],
		['Spring Chains',  info.springBoneCount],
		['Materials',      info.materialCount],
		['Expressions',    info.expressionNames.length > 0 ? info.expressionNames.join(', ') : '—'],
	];

	rows.forEach(([label, value]) => {
		const row = document.createElement('div');
		row.style.cssText = 'display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;';

		const lEl = document.createElement('span');
		lEl.style.cssText = 'color:rgba(255,255,255,0.5);white-space:nowrap;';
		lEl.textContent = label;

		const vEl = document.createElement('span');
		vEl.style.cssText = 'color:#fff;text-align:right;word-break:break-word;max-width:220px;';
		vEl.innerHTML = String(value);

		row.appendChild(lEl);
		row.appendChild(vEl);
		container.appendChild(row);
	});
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _joinAuthors(authors) {
	if (!authors || authors.length === 0) return '—';
	return authors.map(a => (typeof a === 'string' ? a : a.name ?? '?')).join(', ');
}

function _describeLicense(meta) {
	// VRM 1.0: meta.licenseUrl or meta.licenseName
	// VRM 0.x: meta.licenseName
	const name = meta.licenseName ?? meta.license ?? '';
	const url  = meta.licenseUrl  ?? '';
	if (!name && !url) return '—';
	if (name && !url)  return name;
	if (url  && !name) return url;
	return `${name} (${url})`;
}
