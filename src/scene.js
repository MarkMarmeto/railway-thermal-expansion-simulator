(function (global) {
  const TEMPERATURE_MIN_C = 10;
  const TEMPERATURE_MAX_C = 100;
  const RAIL_HALF_LENGTH = 2;
  const MILLIMETRES_TO_SCENE_UNITS = 0.1;
  // Display-only amplitude: not a material law or a predicted buckling threshold.
  const MAX_ILLUSTRATIVE_BEND = 1.2;
  const CAMERA_BOUNDS = Object.freeze({
    minRadius: 4,
    maxRadius: 14,
    minPolarAngle: 0.35,
    maxPolarAngle: 1.45,
  });

  const MATERIAL_CUES = Object.freeze({
    steel: Object.freeze({ label: 'Steel', swatch: '#6b7280', railColor: 0x718096, roughness: 0.48, metalness: 0.65 }),
    aluminum: Object.freeze({ label: 'Aluminum', swatch: '#d1d5db', railColor: 0xd9e2ec, roughness: 0.32, metalness: 0.75 }),
    copper: Object.freeze({ label: 'Copper', swatch: '#c47b55', railColor: 0xb86b45, roughness: 0.4, metalness: 0.7 }),
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
    const physicalGapMm = Number.isFinite(remainingGapMm) ? Math.max(0, remainingGapMm) : 0;
    const visualGap = physicalGapMm;
    const gapUnits = visualGap * MILLIMETRES_TO_SCENE_UNITS;
    const centerOffset = RAIL_HALF_LENGTH + (gapUnits / 2);
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
    railwayScene.materials.rail.roughness = cue.roughness ?? 0.48;
    railwayScene.materials.rail.metalness = cue.metalness ?? 0.65;
    railwayScene.animation.appearanceColor = appearanceColor;
  }

  // Small, repeatable surface maps generated once; no image downloads are needed.
  // Neutral maps preserve the material selection and the red closure warning.
  function createSurfaceTexture(THREE, kind, repeatX, repeatY) {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    function noise(x, y) {
      const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return value - Math.floor(value);
    }
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        let value;
        if (kind === 'metal') {
          value = 0.72 + 0.2 * noise(0, y) + 0.08 * noise(x, y);
        } else if (kind === 'wood') {
          const grain = Math.sin(y * 0.7 + 2 * Math.sin(x * Math.PI * 2 / size));
          value = 0.48 + 0.3 * Math.abs(grain) + 0.16 * noise(x, y);
        } else if (kind === 'ballast') {
          // Irregular stone cells, with dark seams between neighboring stones.
          let nearest = Infinity;
          let second = Infinity;
          let shade = 0;
          const cellX = Math.floor(x / 12);
          const cellY = Math.floor(y / 12);
          for (let dy = -1; dy <= 1; dy += 1) {
            for (let dx = -1; dx <= 1; dx += 1) {
              const cx = cellX + dx;
              const cy = cellY + dy;
              const distance = Math.hypot(x / 12 - cx - noise(cx, cy), y / 12 - cy - noise(cx + 19, cy));
              if (distance < nearest) {
                second = nearest;
                nearest = distance;
                shade = 0.4 + 0.5 * noise(cx + 41, cy);
              } else if (distance < second) second = distance;
            }
          }
          value = second - nearest < 0.06 ? 0.25 : shade + 0.08 * noise(x, y);
        } else {
          value = 0.45 + 0.35 * noise(x, y) + 0.2 * noise(Math.floor(x / 4), Math.floor(y / 4));
        }
        const offset = (y * size + x) * 4;
        const channel = Math.round(clamp(value, 0, 1) * 255);
        data.set([channel, channel, channel, 255], offset);
      }
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.name = `${kind}-surface`;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    return texture;
  }

  function addEnvironment(THREE, scene) {
    scene.background = new THREE.Color(0xb9d7e5);
    scene.fog = new THREE.Fog(0xb9d7e5, 18, 65);
    const environment = new THREE.Group();
    environment.name = 'environment';
    const grassMap = createSurfaceTexture(THREE, 'grass', 45, 45);
    const gravelMap = createSurfaceTexture(THREE, 'ballast', 8, 2);
    const terrain = makeMesh(THREE, THREE.BoxGeometry, [160, 0.2, 160],
      new THREE.MeshStandardMaterial({ color: 0x6e8050, map: grassMap, roughness: 1 }));
    terrain.name = 'terrain';
    terrain.position.set(0, -0.2, 0);
    terrain.receiveShadow = true;
    const ballast = makeMesh(THREE, THREE.BoxGeometry, [15, 0.16, 3.6],
      new THREE.MeshStandardMaterial({ color: 0xa6a29a, map: gravelMap, bumpMap: gravelMap, bumpScale: 0.07, roughness: 1 }));
    ballast.name = 'ballast';
    ballast.position.set(0, -0.02, 0);
    ballast.receiveShadow = true;
    environment.add(terrain, ballast);

    const hillGeometry = new THREE.SphereGeometry(1, 16, 8);
    const hillMaterial = new THREE.MeshStandardMaterial({ color: 0x738b70, roughness: 1 });
    for (let index = 0; index < 10; index += 1) {
      const angle = index * Math.PI * 2 / 10;
      const hill = new THREE.Mesh(hillGeometry, hillMaterial);
      hill.name = `distant-hill-${index}`;
      hill.position.set(Math.cos(angle) * 48, -1, Math.sin(angle) * 48);
      hill.scale.set(15, 5 + index % 3, 12);
      environment.add(hill);
    }
    scene.add(environment);
  }

  function makeMesh(THREE, Geometry, geometryArgs, material) {
    return new THREE.Mesh(new Geometry(...geometryArgs), material);
  }

  function bendRail(rail, side, amplitude) {
    for (const mesh of [rail, ...rail.children]) {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const rest = geometry.userData.restPositions;
      for (let index = 0; index < positions.count; index += 1) {
        const x = rest[index * 3];
        const distanceFromJoint = Math.abs(x + side * RAIL_HALF_LENGTH);
        // Both end faces have the same offset and tangent at the joint.
        const curve = distanceFromJoint >= 4 ? 0 : (1 + Math.cos(Math.PI * distanceFromJoint / 4)) / 2;
        positions.setZ(index, rest[index * 3 + 2] + amplitude * curve);
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
    }
  }

  function createRailwayScene(THREE, mount) {
    if (!THREE || !mount) {
      throw new Error('Three.js and a scene mount are required');
    }

    const scene = new THREE.Scene();
    addEnvironment(THREE, scene);
    const metalMap = createSurfaceTexture(THREE, 'metal', 3, 1);
    const woodMap = createSurfaceTexture(THREE, 'wood', 1, 2);
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x5e6870, metalness: 0.65, roughness: 0.48, map: metalMap, bumpMap: metalMap, bumpScale: 0.012 });
    const sleeperMaterial = new THREE.MeshStandardMaterial({ color: 0x99714c, map: woodMap, bumpMap: woodMap, bumpScale: 0.045, roughness: 0.95 });
    const jointMaterial = new THREE.MeshStandardMaterial({ color: 0xd98c10, roughness: 0.6 });

    const rails = new THREE.Group();
    rails.name = 'rails';
    const railLeft = makeMesh(THREE, THREE.BoxGeometry, [4, 0.25, 0.25, 24], railMaterial);
    railLeft.name = 'rail-left';
    railLeft.position.set(-2.2, 0.55, 0);
    const railRight = makeMesh(THREE, THREE.BoxGeometry, [4, 0.25, 0.25, 24], railMaterial);
    railRight.name = 'rail-right';
    railRight.position.set(2.2, 0.55, 0);
    for (const rail of [railLeft, railRight]) {
      // A simple web and foot support the running surface on the sleepers.
      const web = makeMesh(THREE, THREE.BoxGeometry, [4, 0.2, 0.1, 24], railMaterial);
      web.position.set(0, -0.13, 0);
      const foot = makeMesh(THREE, THREE.BoxGeometry, [4, 0.1, 0.4, 24], railMaterial);
      foot.position.set(0, -0.26, 0);
      rail.add(web, foot);
      rail.castShadow = web.castShadow = foot.castShadow = true;
      rail.receiveShadow = web.receiveShadow = foot.receiveShadow = true;
      for (const mesh of [rail, web, foot]) {
        mesh.geometry.userData.restPositions = mesh.geometry.attributes.position.array.slice();
      }
    }
    rails.add(railLeft, railRight);

    // A small marker below the rail foot leaves the contact plane unobstructed.
    const joint = makeMesh(THREE, THREE.BoxGeometry, [0.08, 0.008, 0.75], jointMaterial);
    joint.name = 'joint';
    joint.position.set(0, 0.245, 0);

    const compressionArrows = new THREE.Group();
    compressionArrows.name = 'compression-arrows';
    compressionArrows.visible = false;
    for (const side of [-1, 1]) {
      compressionArrows.add(new THREE.ArrowHelper(
        new THREE.Vector3(-side, 0, 0), new THREE.Vector3(side * 1.6, 0.95, 0),
        1.1, 0xffb52e, 0.3, 0.22,
      ));
    }

    const sleepers = new THREE.Group();
    sleepers.name = 'sleepers';
    for (let index = -4; index <= 4; index += 1) {
      const sleeper = makeMesh(THREE, THREE.BoxGeometry, [0.35, 0.18, 2.2], sleeperMaterial);
      sleeper.name = `sleeper-${index + 4}`;
      sleeper.position.set(index * 0.95, 0.15, 0);
      sleeper.castShadow = sleeper.receiveShadow = true;
      sleepers.add(sleeper);
    }

    scene.add(rails, joint, sleepers, compressionArrows);

    const ambientLight = new THREE.HemisphereLight(0xe8f4ff, 0x81755d, 2);
    ambientLight.name = 'ambient-light';
    const directionalLight = new THREE.DirectionalLight(0xffefd7, 3);
    directionalLight.name = 'directional-light';
    directionalLight.position.set(4, 8, 6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    Object.assign(directionalLight.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 0.5, far: 30 });
    directionalLight.shadow.normalBias = 0.03;
    scene.add(ambientLight, directionalLight);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.name = 'scene-camera';
    camera.position.set(6, 4.5, 9);
    if (typeof camera.lookAt === 'function') camera.lookAt(0, 0, 0);
    const cameraController = createCameraInteraction(camera, mount);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    if (renderer.shadowMap) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    if (typeof renderer.setPixelRatio === 'function' && global.devicePixelRatio) renderer.setPixelRatio(Math.min(global.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    function resize() {
      const width = Math.max(1, mount.clientWidth || 800);
      const height = Math.max(1, mount.clientHeight || 420);
      camera.aspect = width / height;
      camera.fov = camera.aspect < 1.5 ? 55 : 40;
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
      objects: { rails, railLeft, railRight, joint, sleepers, compressionArrows },
      animation: {
        targetPositions: { left: railLeft.position.x, right: railRight.position.x },
        heatColor: temperatureToColor(25),
        bend: 0,
        targetBend: 0,
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
    for (const [rail, target] of [[railLeft, targets.left], [railRight, targets.right]]) {
      if (Math.abs(readPositionX(rail) - target) < 0.001) writePositionX(rail, target);
    }
    const contact = targets.visualGap === 0
      && readPositionX(railLeft) === targets.left && readPositionX(railRight) === targets.right;
    const desiredBend = contact ? railwayScene.animation.targetBend : 0;
    const previousBend = railwayScene.animation.bend;
    let bend = desiredBend === 0 ? 0 : previousBend + (desiredBend - previousBend) * step;
    if (Math.abs(bend - desiredBend) < 0.001) bend = desiredBend;
    if (bend !== previousBend) {
      bendRail(railLeft, -1, bend);
      bendRail(railRight, 1, bend);
    }
    railwayScene.animation.bend = bend;
    railwayScene.objects.joint.position.z = bend;
    railwayScene.objects.compressionArrows.position.z = bend;
    railwayScene.objects.compressionArrows.visible = contact && desiredBend > 0;
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
      const bendDistance = Math.abs(railwayScene.animation.bend - railwayScene.animation.targetBend);
      if (Math.max(leftDistance, rightDistance, bendDistance) > 0) {
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
    railwayScene.animation.targetPositions = calculateVisualRailTargets(state);
    const signedGap = Number(state.signedGapMm);
    const excess = gap <= 0 && Number.isFinite(signedGap) ? Math.max(0, -signedGap) : 0;
    railwayScene.animation.targetBend = Math.min(MAX_ILLUSTRATIVE_BEND, excess * 0.12);
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
