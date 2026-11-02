(function (global) {
  const TEMPERATURE_MIN_C = 10;
  const TEMPERATURE_MAX_C = 100;
  const RAIL_HALF_LENGTH = 2;
  const JOINT_HALF_WIDTH = 0.075;
  const MILLIMETRES_TO_SCENE_UNITS = 0.1;
  const VISUAL_EXAGGERATION_FACTOR = 0.1;
  const CAMERA_BOUNDS = Object.freeze({
    minRadius: 4,
    maxRadius: 14,
    minPolarAngle: 0.35,
    maxPolarAngle: 1.45,
  });

  const MATERIAL_CUES = Object.freeze({
    steel: Object.freeze({ label: 'Steel', swatch: '#6b7280', railColor: 0x718096 }),
    aluminum: Object.freeze({ label: 'Aluminum', swatch: '#d1d5db', railColor: 0xd9e2ec }),
    copper: Object.freeze({ label: 'Copper', swatch: '#c47b55', railColor: 0xb86b45 }),
  });

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function coordinate(position, axis, fallback) {
    if (typeof position[axis] === 'number') return position[axis];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    return position.values ? position.values[index] : fallback;
  }

  function updateCameraPosition(interaction) {
    const { camera, target, state } = interaction;
    const horizontalRadius = state.radius * Math.sin(state.polarAngle);
    const position = {
      x: target.x + (horizontalRadius * Math.sin(state.azimuth)),
      y: target.y + (state.radius * Math.cos(state.polarAngle)),
      z: target.z + (horizontalRadius * Math.cos(state.azimuth)),
    };
    camera.position.set(position.x, position.y, position.z);
    if (typeof camera.lookAt === 'function') camera.lookAt(target.x, target.y, target.z);
    return position;
  }

  function orbitCamera(interaction, azimuthDelta, polarDelta) {
    if (!interaction || !interaction.state) return false;
    interaction.state.azimuth += Number(azimuthDelta) || 0;
    interaction.state.polarAngle = clamp(
      interaction.state.polarAngle + (Number(polarDelta) || 0),
      CAMERA_BOUNDS.minPolarAngle,
      CAMERA_BOUNDS.maxPolarAngle,
    );
    updateCameraPosition(interaction);
    return true;
  }

  function zoomCamera(interaction, radiusDelta) {
    if (!interaction || !interaction.state) return false;
    interaction.state.radius = clamp(
      interaction.state.radius + (Number(radiusDelta) || 0),
      CAMERA_BOUNDS.minRadius,
      CAMERA_BOUNDS.maxRadius,
    );
    updateCameraPosition(interaction);
    return true;
  }

  function createCameraInteraction(camera, mount, target = { x: 0, y: 0.55, z: 0 }) {
    if (!camera || !camera.position) return null;
    const x = coordinate(camera.position, 'x', 0) - target.x;
    const y = coordinate(camera.position, 'y', 4) - target.y;
    const z = coordinate(camera.position, 'z', 8) - target.z;
    const radius = clamp(Math.sqrt((x * x) + (y * y) + (z * z)), CAMERA_BOUNDS.minRadius, CAMERA_BOUNDS.maxRadius);
    const interaction = {
      camera,
      mount,
      target: { ...target },
      state: {
        azimuth: Math.atan2(x, z),
        polarAngle: clamp(Math.acos(y / Math.max(radius, 0.0001)), CAMERA_BOUNDS.minPolarAngle, CAMERA_BOUNDS.maxPolarAngle),
        radius,
      },
    };
    updateCameraPosition(interaction);

    if (!mount || typeof mount.addEventListener !== 'function') return interaction;
    let dragging = false;
    let pointerId = null;
    let lastX = 0;
    let lastY = 0;
    const onPointerDown = event => {
      if (event.button !== undefined && event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      if (typeof mount.setPointerCapture === 'function' && pointerId !== undefined) mount.setPointerCapture(pointerId);
    };
    const onPointerMove = event => {
      if (!dragging || (pointerId !== null && event.pointerId !== pointerId)) return;
      orbitCamera(interaction, (event.clientX - lastX) * 0.01, (event.clientY - lastY) * 0.01);
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onPointerUp = event => {
      if (pointerId !== null && event.pointerId !== pointerId) return;
      dragging = false;
      if (typeof mount.releasePointerCapture === 'function' && pointerId !== null) mount.releasePointerCapture(pointerId);
      pointerId = null;
    };
    const onWheel = event => {
      zoomCamera(interaction, (Number(event.deltaY) || 0) * 0.01);
      if (typeof event.preventDefault === 'function') event.preventDefault();
    };
    mount.addEventListener('pointerdown', onPointerDown);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('pointerup', onPointerUp);
    mount.addEventListener('pointercancel', onPointerUp);
    mount.addEventListener('wheel', onWheel, { passive: false });
    return interaction;
  }

  function temperatureToColor(temperatureC) {
    const ratio = (clamp(Number(temperatureC), TEMPERATURE_MIN_C, TEMPERATURE_MAX_C) - TEMPERATURE_MIN_C)
      / (TEMPERATURE_MAX_C - TEMPERATURE_MIN_C);
    return {
      r: Number((0.1 + (0.9 * ratio)).toFixed(4)),
      g: Number((0.35 - (0.2 * ratio)).toFixed(4)),
      b: Number((1 - (0.95 * ratio)).toFixed(4)),
    };
  }

  function calculateVisualRailTargets(state) {
    const remainingGapMm = Number(state && state.remainingGapMm);
    const expansionMm = Number(state && state.expansionMm);
    const physicalGapMm = Number.isFinite(remainingGapMm) ? Math.max(0, remainingGapMm) : 0;
    const visualExpansionMm = Number.isFinite(expansionMm) ? Math.max(0, expansionMm) * VISUAL_EXAGGERATION_FACTOR : 0;
    const visualGap = Math.max(0, physicalGapMm - visualExpansionMm);
    const gapUnits = visualGap * MILLIMETRES_TO_SCENE_UNITS;
    const centerOffset = RAIL_HALF_LENGTH + JOINT_HALF_WIDTH + (gapUnits / 2);
    return { left: -centerOffset, right: centerOffset, visualGap };
  }

  function readPositionX(object) {
    return typeof object.position.x === 'number' ? object.position.x : object.position.values[0];
  }

  function writePositionX(object, x) {
    object.position.x = x;
    if (typeof object.position.set === 'function') object.position.set(x, object.position.y || 0, object.position.z || 0);
  }

  function applyMaterialColor(material, color) {
    if (!material || !material.color) return;
    if (typeof material.color.setRGB === 'function') material.color.setRGB(color.r, color.g, color.b);
    else material.color = color;
  }

  function hexToColor(hexColor) {
    return {
      r: ((hexColor >> 16) & 0xff) / 255,
      g: ((hexColor >> 8) & 0xff) / 255,
      b: (hexColor & 0xff) / 255,
    };
  }

  function blendColors(baseColor, tintColor, amount) {
    const strength = clamp(amount, 0, 1);
    return {
      r: baseColor.r + ((tintColor.r - baseColor.r) * strength),
      g: baseColor.g + ((tintColor.g - baseColor.g) * strength),
      b: baseColor.b + ((tintColor.b - baseColor.b) * strength),
    };
  }

  function applyRailAppearance(railwayScene, state, cue) {
    const baseColor = hexToColor(cue.railColor || MATERIAL_CUES.steel.railColor);
    const closed = Number(state.remainingGapMm) <= 0;
    const heatTint = closed
      ? { r: 1, g: 0.06, b: 0.03 }
      : railwayScene.animation.heatColor;
    const tintStrength = closed ? 0.82 : 0.22;
    const appearanceColor = blendColors(baseColor, heatTint, tintStrength);
    applyMaterialColor(railwayScene.materials.rail, appearanceColor);
    railwayScene.animation.appearanceColor = appearanceColor;
  }

  function makeMesh(THREE, Geometry, geometryArgs, material) {
    return new THREE.Mesh(new Geometry(...geometryArgs), material);
  }

  function createRailwayScene(THREE, mount) {
    if (!THREE || !mount) {
      throw new Error('Three.js and a scene mount are required');
    }

    const scene = new THREE.Scene();
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x5e6870, metalness: 0.6, roughness: 0.5 });
    const sleeperMaterial = new THREE.MeshStandardMaterial({ color: 0x704b2a, roughness: 0.9 });
    const jointMaterial = new THREE.MeshStandardMaterial({ color: 0xd98c10, roughness: 0.6 });
    const indicatorMaterial = new THREE.MeshBasicMaterial({ color: 0xd98c10 });

    const rails = new THREE.Group();
    rails.name = 'rails';
    const railLeft = makeMesh(THREE, THREE.BoxGeometry, [4, 0.25, 0.25], railMaterial);
    railLeft.name = 'rail-left';
    railLeft.position.set(-2.2, 0.55, 0);
    const railRight = makeMesh(THREE, THREE.BoxGeometry, [4, 0.25, 0.25], railMaterial);
    railRight.name = 'rail-right';
    railRight.position.set(2.2, 0.55, 0);
    rails.add(railLeft, railRight);

    const joint = makeMesh(THREE, THREE.BoxGeometry, [0.15, 0.4, 0.5], jointMaterial);
    joint.name = 'joint';
    joint.position.set(0, 0.55, 0);

    const sleepers = new THREE.Group();
    sleepers.name = 'sleepers';
    for (let index = -4; index <= 4; index += 1) {
      const sleeper = makeMesh(THREE, THREE.BoxGeometry, [0.35, 0.18, 2.2], sleeperMaterial);
      sleeper.name = `sleeper-${index + 4}`;
      sleeper.position.set(index * 0.95, 0.15, 0);
      sleepers.add(sleeper);
    }

    const gapIndicator = makeMesh(THREE, THREE.BoxGeometry, [1, 0.06, 0.06], indicatorMaterial);
    gapIndicator.name = 'gap-indicator';
    gapIndicator.position.set(0, 1.05, 0);
    gapIndicator.scale.set(0, 1, 1);

    scene.add(rails, joint, sleepers, gapIndicator);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.name = 'ambient-light';
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.name = 'directional-light';
    directionalLight.position.set(4, 8, 6);
    scene.add(ambientLight, directionalLight);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.name = 'scene-camera';
    camera.position.set(0, 4, 8);
    if (typeof camera.lookAt === 'function') camera.lookAt(0, 0, 0);
    const cameraController = createCameraInteraction(camera, mount);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    if (typeof renderer.setPixelRatio === 'function' && global.devicePixelRatio) renderer.setPixelRatio(Math.min(global.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    function resize() {
      const width = Math.max(1, mount.clientWidth || 800);
      const height = Math.max(1, mount.clientHeight || 420);
      camera.aspect = width / height;
      if (typeof camera.updateProjectionMatrix === 'function') camera.updateProjectionMatrix();
      if (typeof renderer.setSize === 'function') renderer.setSize(width, height, false);
    }

    function render() {
      if (typeof renderer.render === 'function') renderer.render(scene, camera);
    }

    resize();
    render();
    if (typeof global.ResizeObserver === 'function') {
      const resizeObserver = new global.ResizeObserver(resize);
      resizeObserver.observe(mount);
    } else if (typeof global.addEventListener === 'function') {
      global.addEventListener('resize', resize);
    }
    if (typeof global.requestAnimationFrame === 'function') {
      const renderFrame = () => {
        render();
        global.requestAnimationFrame(renderFrame);
      };
      global.requestAnimationFrame(renderFrame);
    }

    return {
      scene,
      camera,
      cameraController,
      renderer,
      resize,
      render,
      lights: [ambientLight, directionalLight],
      objects: { rails, railLeft, railRight, joint, sleepers, gapIndicator },
      animation: {
        targetPositions: { left: railLeft.position.x, right: railRight.position.x },
        heatColor: temperatureToColor(25),
      },
      materialCue: { label: MATERIAL_CUES.steel.label, swatch: MATERIAL_CUES.steel.swatch },
      materials: { rail: railMaterial },
    };
  }

  function animateRailwayScene(railwayScene, alpha = 0.25) {
    if (!railwayScene || !railwayScene.objects || !railwayScene.animation) return false;
    const step = clamp(Number(alpha), 0, 1);
    const { railLeft, railRight } = railwayScene.objects;
    const targets = railwayScene.animation.targetPositions;
    writePositionX(railLeft, readPositionX(railLeft) + ((targets.left - readPositionX(railLeft)) * step));
    writePositionX(railRight, readPositionX(railRight) + ((targets.right - readPositionX(railRight)) * step));
    return true;
  }

  function continueRailAnimation(railwayScene) {
    if (!railwayScene || typeof global.requestAnimationFrame !== 'function' || railwayScene.animation.framePending) return;
    railwayScene.animation.framePending = true;
    const tick = () => {
      animateRailwayScene(railwayScene);
      const targets = railwayScene.animation.targetPositions;
      const leftDistance = Math.abs(readPositionX(railwayScene.objects.railLeft) - targets.left);
      const rightDistance = Math.abs(readPositionX(railwayScene.objects.railRight) - targets.right);
      if (Math.max(leftDistance, rightDistance) > 0.001) {
        global.requestAnimationFrame(tick);
      } else {
        railwayScene.animation.framePending = false;
      }
    };
    global.requestAnimationFrame(tick);
  }

  function applyRailState(railwayScene, state) {
    if (!railwayScene || !state || !railwayScene.objects) return false;
    const gap = Number(state.remainingGapMm);
    if (!Number.isFinite(gap)) return false;
    railwayScene.objects.gapIndicator.scale.set(Math.max(0, gap), 1, 1);
    railwayScene.animation.targetPositions = calculateVisualRailTargets(state);
    if (Number.isFinite(Number(state.temperatureC))) {
      railwayScene.animation.heatColor = temperatureToColor(state.temperatureC);
      applyMaterialColor(railwayScene.materials.rail, railwayScene.animation.heatColor);
    }
    const cue = MATERIAL_CUES[state.material] || { label: state.materialName || 'Unknown material', swatch: '#6b7280', railColor: MATERIAL_CUES.steel.railColor };
    applyRailAppearance(railwayScene, state, cue);
    railwayScene.materialCue = { label: cue.label, swatch: cue.swatch };
    animateRailwayScene(railwayScene);
    continueRailAnimation(railwayScene);
    return true;
  }

  const api = {
    createRailwayScene,
    applyRailState,
    animateRailwayScene,
    createCameraInteraction,
    orbitCamera,
    zoomCamera,
    CAMERA_BOUNDS,
    calculateVisualRailTargets,
    temperatureToColor,
    MATERIAL_CUES,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.RailwayScene = api;
}(typeof globalThis !== 'undefined' ? globalThis : this));
