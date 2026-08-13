import { describe, it, expect } from 'vitest';
import {
	POSE_BONE_GROUPS,
	HANDLE_BONES,
	BONE_AXIS_LIMITS,
	getBoneCategory,
	getBoneLimits,
} from '../../src/boneConfig.js';

describe('boneConfig — POSE_BONE_GROUPS', () => {
	it('should have 8 groups', () => {
		expect(POSE_BONE_GROUPS).toHaveLength(8);
	});

	it('should have hips in the Body group', () => {
		const body = POSE_BONE_GROUPS.find(g => g.label === 'Body');
		expect(body).toBeDefined();
		expect(body.bones).toContain('hips');
	});

	it('should mark finger groups as detail:true', () => {
		const fingers = POSE_BONE_GROUPS.filter(g => g.label.includes('Fingers'));
		expect(fingers).toHaveLength(2);
		fingers.forEach(g => expect(g.detail).toBe(true));
	});

	it('HANDLE_BONES should only contain bones from non-detail groups', () => {
		const detailBones = POSE_BONE_GROUPS.filter(g => g.detail).flatMap(g => g.bones);
		HANDLE_BONES.forEach(bone => {
			expect(detailBones).not.toContain(bone);
		});
	});
});

describe('boneConfig — getBoneCategory', () => {
	it('hips → hips', () => expect(getBoneCategory('hips')).toBe('hips'));
	it('spine → spine', () => expect(getBoneCategory('spine')).toBe('spine'));
	it('chest → spine', () => expect(getBoneCategory('chest')).toBe('spine'));
	it('upperChest → spine', () => expect(getBoneCategory('upperChest')).toBe('spine'));
	it('neck → neck', () => expect(getBoneCategory('neck')).toBe('neck'));
	it('head → head', () => expect(getBoneCategory('head')).toBe('head'));
	it('jaw → jaw', () => expect(getBoneCategory('jaw')).toBe('jaw'));
	it('leftEye → eye', () => expect(getBoneCategory('leftEye')).toBe('eye'));
	it('rightEye → eye', () => expect(getBoneCategory('rightEye')).toBe('eye'));
	it('leftShoulder → shoulder', () => expect(getBoneCategory('leftShoulder')).toBe('shoulder'));
	it('leftUpperArm → upperArm', () => expect(getBoneCategory('leftUpperArm')).toBe('upperArm'));
	it('rightUpperArm → upperArm', () => expect(getBoneCategory('rightUpperArm')).toBe('upperArm'));
	it('leftLowerArm → lowerArm', () => expect(getBoneCategory('leftLowerArm')).toBe('lowerArm'));
	it('leftHand → hand', () => expect(getBoneCategory('leftHand')).toBe('hand'));
	it('leftUpperLeg → upperLeg', () => expect(getBoneCategory('leftUpperLeg')).toBe('upperLeg'));
	it('leftLowerLeg → lowerLeg', () => expect(getBoneCategory('leftLowerLeg')).toBe('lowerLeg'));
	it('leftFoot → foot', () => expect(getBoneCategory('leftFoot')).toBe('foot'));
	it('leftToes → toes', () => expect(getBoneCategory('leftToes')).toBe('toes'));
	it('leftIndexProximal → finger', () => expect(getBoneCategory('leftIndexProximal')).toBe('finger'));
	it('leftThumbDistal → finger', () => expect(getBoneCategory('leftThumbDistal')).toBe('finger'));
	it('leftMiddleIntermediate → finger', () => expect(getBoneCategory('leftMiddleIntermediate')).toBe('finger'));
	it('leftThumbMetacarpal → finger', () => expect(getBoneCategory('leftThumbMetacarpal')).toBe('finger'));
	it('unknownBone → default', () => expect(getBoneCategory('unknownBone')).toBe('default'));
	it('emptyString → default', () => expect(getBoneCategory('')).toBe('default'));
});

describe('boneConfig — getBoneLimits', () => {
	it('returns a {x,y,z} object with [min,max] arrays', () => {
		const limits = getBoneLimits('head');
		expect(limits).toHaveProperty('x');
		expect(limits).toHaveProperty('y');
		expect(limits).toHaveProperty('z');
		expect(Array.isArray(limits.x)).toBe(true);
		expect(limits.x).toHaveLength(2);
		expect(limits.x[0]).toBeLessThan(limits.x[1]);
	});

	it('hips allows ±180 on all axes', () => {
		const lim = getBoneLimits('hips');
		expect(lim.x).toEqual([-180, 180]);
		expect(lim.y).toEqual([-180, 180]);
		expect(lim.z).toEqual([-180, 180]);
	});

	it('finger has large Z range for curling (≥110°)', () => {
		const lim = getBoneLimits('leftIndexProximal');
		expect(Math.abs(lim.z[1])).toBeGreaterThanOrEqual(110);
	});

	it('unknown bone falls back to BONE_AXIS_LIMITS.default', () => {
		const lim = getBoneLimits('veryUnknownBone');
		expect(lim).toEqual(BONE_AXIS_LIMITS.default);
	});

	it('all HANDLE_BONES return valid limits', () => {
		HANDLE_BONES.forEach(bone => {
			const lim = getBoneLimits(bone);
			expect(lim.x).toHaveLength(2);
			expect(lim.y).toHaveLength(2);
			expect(lim.z).toHaveLength(2);
		});
	});
});
