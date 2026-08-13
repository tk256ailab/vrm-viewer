import { test, expect } from '@playwright/test';

// Helper to wait for the VRM model to finish loading across tests
async function waitForModelLoaded(page, timeout = 60000) {
  const status = page.locator('#status');
  await expect(status).toContainText(/VRM model loaded successfully|VRMモデルの読み込みが完了しました/, { timeout });
}

test.describe('VRM Viewer E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the page and initialize VRM model successfully', async ({ page }) => {
    await expect(page).toHaveTitle('VRM Viewer');

    // Check canvas exists
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check status becomes loaded
    await waitForModelLoaded(page);

    // Check model name
    const vrmName = page.locator('#vrmName');
    await expect(vrmName).toHaveText('sample.vrm');

    // Check model info values populated
    const infoPolygons = page.locator('#infoPolygons');
    await expect(infoPolygons).not.toHaveText('-');
    const infoBones = page.locator('#infoBones');
    await expect(infoBones).not.toHaveText('-');
  });

  test('should support tab navigation smoothly', async ({ page }) => {
    await waitForModelLoaded(page);

    // Switch to Features tab
    await page.locator('#tabFeaturesBtn').click();
    await expect(page.locator('#featuresPanel')).toBeVisible();
    await expect(page.locator('#animationPanel')).toBeHidden();

    // Switch to Pose tab
    await page.locator('#tabPoseBtn').click();
    await expect(page.locator('#posePanel')).toBeVisible();
    await expect(page.locator('#featuresPanel')).toBeHidden();

    // Switch to Face tab
    await page.locator('#tabFaceBtn').click();
    await expect(page.locator('#facePanel')).toBeVisible();
    await expect(page.locator('#posePanel')).toBeHidden();

    // Switch back to Animation tab
    await page.locator('#tabAnimationBtn').click();
    await expect(page.locator('#animationPanel')).toBeVisible();
  });

  test('should populate Pose bone sliders when entering Pose tab', async ({ page }) => {
    await waitForModelLoaded(page);

    await page.locator('#tabPoseBtn').click();
    await expect(page.locator('#posePanel')).toBeVisible();

    // Verify bone rows are generated in the DOM
    const boneRows = page.locator('#poseSliders .bone-row');
    await expect(boneRows.first()).toBeVisible();
    const count = await boneRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should populate Expression sliders when entering Face tab', async ({ page }) => {
    await waitForModelLoaded(page);

    await page.locator('#tabFaceBtn').click();
    await expect(page.locator('#facePanel')).toBeVisible();

    // Verify expression rows are generated in the DOM
    const faceRows = page.locator('#expressionSliders .face-row');
    await expect(faceRows.first()).toBeVisible();
    const count = await faceRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should allow adjusting Lighting controls in Features tab', async ({ page }) => {
    await waitForModelLoaded(page);

    await page.locator('#tabFeaturesBtn').click();
    await expect(page.locator('#featuresPanel')).toBeVisible();

    const dirLightSlider = page.locator('#dirLightSlider');
    await expect(dirLightSlider).toBeVisible();
    const ambLightSlider = page.locator('#ambLightSlider');
    await expect(ambLightSlider).toBeVisible();

    // Verify values display
    await expect(page.locator('#dirLightVal')).toHaveText('3.0');
    await expect(page.locator('#ambLightVal')).toHaveText('1.0');
  });

  test('should toggle UI language when language switch button is clicked', async ({ page }) => {
    const langSwitch = page.locator('.lang-switch');
    await expect(langSwitch).toBeVisible();

    const initialLang = await page.getAttribute('html', 'lang');

    // Click toggle
    await langSwitch.click();
    const newLang = await page.getAttribute('html', 'lang');
    expect(newLang).not.toBe(initialLang);

    // Toggle back
    await langSwitch.click();
    const finalLang = await page.getAttribute('html', 'lang');
    expect(finalLang).toBe(initialLang);
  });

  test('should collapse and expand controls panel using toggle button with ARIA attributes', async ({ page }) => {
    const toggleBtn = page.locator('#panelToggleBtn');
    const controlsPanel = page.locator('#controlsPanel');

    await expect(controlsPanel).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    // Click collapse
    await toggleBtn.click();
    await expect(controlsPanel).toBeHidden();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    // Click expand
    await toggleBtn.click();
    await expect(controlsPanel).toBeVisible();
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
  });

  test('should allow selecting sample VRMA animation and enable playback buttons', async ({ page }) => {
    await waitForModelLoaded(page);

    // Select the first available VRMA animation button dynamically
    const vrmaBtn = page.locator('#vrmaButtons button.vrma-btn').first();
    await expect(vrmaBtn).toBeVisible();
    await vrmaBtn.click();

    // Wait for animation load status
    await expect(page.locator('#status')).toContainText(/Animation loaded successfully|アニメーションの読み込みが完了しました/, { timeout: 30000 });

    // Verify Play, Pause, Stop buttons are now enabled
    await expect(page.locator('#playBtn')).toBeEnabled();
    await expect(page.locator('#pauseBtn')).toBeEnabled();
    await expect(page.locator('#stopBtn')).toBeEnabled();
  });
});
