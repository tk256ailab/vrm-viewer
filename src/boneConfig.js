/**
 * @file boneConfig.js
 * @description VRM humanoid bone configuration — groups, axis rotation limits,
 *   and category/limit lookup helpers. Pure data + logic, no DOM or Three.js dependencies.
 *   Exported as an ES module so it can be unit-tested with Vitest.
 */

// ---------------------------------------------------------------------------
// Bone group definitions used to build the Pose UI sliders.
// `detail: false` → shown in the main Pose panel.
// `detail: true`  → shown only when "Show Detail Bones" is enabled.
// ---------------------------------------------------------------------------
export const POSE_BONE_GROUPS = [
	{ label: 'Body',                detail: false, bones: ['hips', 'spine', 'chest', 'neck', 'head'] },
	{ label: 'Left Arm',            detail: false, bones: ['leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand'] },
	{ label: 'Right Arm',           detail: false, bones: ['rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand'] },
	{ label: 'Left Leg',            detail: false, bones: ['leftUpperLeg', 'leftLowerLeg', 'leftFoot'] },
	{ label: 'Right Leg',           detail: false, bones: ['rightUpperLeg', 'rightLowerLeg', 'rightFoot'] },
	{ label: 'Torso / Head Detail', detail: true,  bones: ['upperChest', 'leftEye', 'rightEye', 'jaw', 'leftToes', 'rightToes'] },
	{
		label: 'Left Fingers', detail: true, bones: [
			'leftThumbMetacarpal', 'leftThumbProximal', 'leftThumbDistal',
			'leftIndexProximal', 'leftIndexIntermediate', 'leftIndexDistal',
			'leftMiddleProximal', 'leftMiddleIntermediate', 'leftMiddleDistal',
			'leftRingProximal', 'leftRingIntermediate', 'leftRingDistal',
			'leftLittleProximal', 'leftLittleIntermediate', 'leftLittleDistal',
		],
	},
	{
		label: 'Right Fingers', detail: true, bones: [
			'rightThumbMetacarpal', 'rightThumbProximal', 'rightThumbDistal',
			'rightIndexProximal', 'rightIndexIntermediate', 'rightIndexDistal',
			'rightMiddleProximal', 'rightMiddleIntermediate', 'rightMiddleDistal',
			'rightRingProximal', 'rightRingIntermediate', 'rightRingDistal',
			'rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal',
		],
	},
];

/**
 * Bones that get 3D sphere gizmos in the viewport (non-detail groups only).
 * @type {string[]}
 */
export const HANDLE_BONES = POSE_BONE_GROUPS.filter(g => !g.detail).flatMap(g => g.bones);

// ---------------------------------------------------------------------------
// Per-category rotation limits (degrees). Used by sliders and gizmo clamping.
// ---------------------------------------------------------------------------
export const BONE_AXIS_LIMITS = {
	hips:     { x: [-180, 180], y: [-180, 180], z: [-180, 180] },
	spine:    { x: [-30,   30], y: [-30,   30], z: [-30,   30] },
	neck:     { x: [-40,   40], y: [-60,   60], z: [-30,   30] },
	head:     { x: [-45,   45], y: [-70,   70], z: [-40,   40] },
	shoulder: { x: [-15,   15], y: [-30,   30], z: [-30,   30] },
	upperArm: { x: [-135, 135], y: [-135, 135], z: [-135, 135] },
	lowerArm: { x: [-45,   45], y: [-150, 150], z: [-45,   45] },
	hand:     { x: [-60,   60], y: [-45,   45], z: [-80,   80] },
	upperLeg: { x: [-120, 120], y: [-60,   60], z: [-60,   60] },
	lowerLeg: { x: [-150, 150], y: [-30,   30], z: [-30,   30] },
	foot:     { x: [-60,   60], y: [-30,   30], z: [-30,   30] },
	toes:     { x: [-45,   45], y: [-15,   15], z: [-15,   15] },
	eye:      { x: [-20,   20], y: [-25,   25], z: [-5,     5] },
	jaw:      { x: [-5,    30], y: [-10,   10], z: [-10,   10] },
	finger:   { x: [-30,   30], y: [-30,   30], z: [-110, 110] },
	default:  { x: [-90,   90], y: [-90,   90], z: [-90,   90] },
};

/**
 * Maps a VRM humanoid bone name to its rotation-limit category.
 * @param {string} boneName - VRM humanoid bone identifier (camelCase)
 * @returns {string} category key in BONE_AXIS_LIMITS
 */
export function getBoneCategory(boneName) {
	if (boneName === 'hips')                                                        return 'hips';
	if (boneName === 'spine' || boneName === 'chest' || boneName === 'upperChest') return 'spine';
	if (boneName === 'neck')                                                        return 'neck';
	if (boneName === 'head')                                                        return 'head';
	if (boneName === 'jaw')                                                         return 'jaw';
	if (boneName.endsWith('Eye'))                                                   return 'eye';
	if (boneName.endsWith('Shoulder'))                                              return 'shoulder';
	if (boneName.endsWith('UpperArm'))                                              return 'upperArm';
	if (boneName.endsWith('LowerArm'))                                              return 'lowerArm';
	if (boneName.endsWith('Hand'))                                                  return 'hand';
	if (boneName.endsWith('UpperLeg'))                                              return 'upperLeg';
	if (boneName.endsWith('LowerLeg'))                                              return 'lowerLeg';
	if (boneName.endsWith('Foot'))                                                  return 'foot';
	if (boneName.endsWith('Toes'))                                                  return 'toes';
	if (/Metacarpal$|Proximal$|Intermediate$|Distal$/.test(boneName))              return 'finger';
	return 'default';
}

/**
 * Returns the `{ x, y, z }` rotation limit object (in degrees) for the given bone.
 * @param {string} boneName - VRM humanoid bone identifier
 * @returns {{ x: [number, number], y: [number, number], z: [number, number] }}
 */
export function getBoneLimits(boneName) {
	return BONE_AXIS_LIMITS[getBoneCategory(boneName)] ?? BONE_AXIS_LIMITS.default;
}
