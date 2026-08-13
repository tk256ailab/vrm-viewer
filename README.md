# VRM Viewer with VRMA Animation

English | [日本語](README-jp.md)

A web-based VRM (Virtual Reality Model) viewer with VRMA (VRM Animation) support built using Three.js and the three-vrm library.

**[Try the Demo →](https://tk256ailab.github.io/vrm-viewer/)**

## Features

- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎭 **VRM Model Support**: Load and display VRM 1.0 models
- 🎬 **VRMA Animation**: Play custom VRMA animation files
- 🎮 **Interactive Controls**: Play, pause, and stop animations
- 🦴 **Pose Editing**: Rotate every humanoid bone (including fingers) with sliders, or click a bone handle in the 3D view and drag the rotation gizmo directly
- 😊 **Facial Expressions**: Control every expression the model defines (emotions, visemes, blinking, custom clips) with weight sliders
- 👀 **Gaze Control**: Aim the eyes with yaw/pitch sliders, or let them follow your mouse cursor
- 💡 **Lighting & Behaviors**: Adjust directional and ambient light, and toggle auto-blinking or standby motion
- 🎛️ **Collapsible UI**: Tabbed control panel (Features / Animation / Pose / Face) that can be hidden entirely with the ☰ toggle
- 🌐 **Automated Localization**: Automatically switches between English and Japanese UI based on browser preference (with manual override)
- 🧪 **Automated Testing Suite**: Built-in Vitest sanity checks, Playwright E2E browser tests, and GitHub Actions CI pipeline
- ⚡ **Fast Performance**: Optimized rendering and animations
- 📂 **Drag & Drop**: Easily load .vrm and .vrma files by dragging them into the window

## Demo

Open `index.html` in a web browser to see the demo. The viewer includes:

- A sample VRM model (sample.vrm)
- Eleven VRMA animation examples:
  - **Angry**: Angry emotion animation
  - **Blush**: Blushing emotion animation
  - **Clapping**: Clapping hands animation
  - **Goodbye**: Waving goodbye animation
  - **Jump**: Jumping action animation
  - **LookAround**: Looking around animation
  - **Relax**: Relaxed pose animation
  - **Sad**: Sad emotion animation
  - **Sleepy**: Sleepy emotion animation
  - **Surprised**: Surprised emotion animation
  - **Thinking**: Thinking pose animation

## Project Structure

```text
vrm_viewer/
├── index.html              # Main viewer application (Dual Language)
├── package.json            # NPM dependencies & test scripts
├── playwright.config.js    # Playwright E2E configuration
├── tests/
│   ├── sanity.test.js      # Vitest DOM & HTML sanity tests
│   └── e2e.spec.js         # Playwright E2E browser tests
├── .github/workflows/
│   └── test.yml            # GitHub Actions CI workflow
├── VRM/
│   └── sample.vrm          # Sample VRM model
├── VRMA/
│   └── ...                 # Bundled VRMA animation files
├── README.md               # English documentation
└── README-jp.md            # Japanese documentation
```

## Quick Start

### Method 1: GitHub Pages (Recommended)

1. **Fork or upload** this repository to GitHub
2. **Enable GitHub Pages**:
   - Go to your repository's Settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
3. **Access your demo** at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/`

### Method 2: Local Development

1. **Clone or download** this repository
2. **Start a local web server** (required for loading files):

   ```bash
   # Using Node.js
   npx serve .
   ```

3. **Open your browser** and navigate to `http://localhost:3000`
4. **Load the VRM model** (automatically loads on page load)
5. **Select animations** using the VRMA buttons or upload your own files
6. **Control playback** with Play, Pause, and Stop buttons

## Automated Testing

This project includes a comprehensive test suite covering unit DOM sanity checks, Playwright E2E browser tests, and GitHub Actions integration.

### Installing Test Dependencies

```bash
npm install
npx playwright install --with-deps chromium
```

### Running Tests

```bash
# Run all tests (Sanity + E2E)
npm test

# Run Vitest DOM sanity tests only
npm run test:sanity

# Run Playwright E2E tests only
npm run test:e2e
```

### CI/CD Pipeline

The included GitHub Actions workflow (`.github/workflows/test.yml`) automatically runs the full test suite on every `push` and `pull_request` to the `main` branch.

## Technical Details

### Dependencies

- [Three.js](https://threejs.org/) - 3D graphics library
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) - VRM model support
- [@pixiv/three-vrm-animation](https://github.com/pixiv/three-vrm-animation) - VRMA animation support

### Animation Specifications

- **Format**: VRMA (VRM Animation) files in glTF binary format
- **Humanoid Bones**: Compatible with VRM 1.0 humanoid specification
- **Frame Rate**: 60 FPS with linear interpolation
- **Duration**: Variable (4-12 seconds for included animations)

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 14+
- ✅ Edge 80+

## License

AGPLv3 (with original MIT License retained for upstream components). See `LICENSE` for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm test` to verify all tests pass
5. Submit a pull request

## Acknowledgments

- [three-vrm](https://github.com/pixiv/three-vrm) - VRM support for Three.js
- [Three.js](https://threejs.org/) - 3D graphics foundation
- VRM Consortium - VRM format specification
