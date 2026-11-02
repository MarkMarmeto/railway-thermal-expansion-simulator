(function (global) {
  const physics = typeof module !== 'undefined' && module.exports
    ? require('./physics')
    : global.RailwayPhysics;

  const CONTROL_IDS = Object.freeze({
    temperature: 'temperatureC',
    initialGap: 'initialGapMm',
    material: 'material',
  });

  function readControlState(elements) {
    return {
      material: elements.material.value,
      temperatureC: Number(elements.temperature.value),
      initialGapMm: Number(elements.initialGap.value),
    };
  }

  function createSimulatorController(elements, onStateChange) {
    if (!physics || typeof physics.calculateRailState !== 'function') {
      throw new Error('Railway physics module is unavailable');
    }

    const controller = {
      elements,
      state: null,
      recompute() {
        const input = readControlState(elements);
        controller.state = physics.calculateRailState(input);
        onStateChange(controller.state);
        return controller.state;
      },
    };

    controller.recompute();
    return controller;
  }

  function formatRailResults(state) {
    return {
      summary: [
        `Temperature: ${state.temperatureC} °C`,
        `Material: ${state.materialName}`,
        `α: ${state.coefficientPerC} /°C`,
        `L₀: ${state.railLengthM} m`,
        `T₀: ${state.referenceTemperatureC} °C`,
        `Expansion: ${state.expansionMm} mm`,
        `Signed gap: ${state.signedGapMm} mm`,
        `Physical gap: ${state.remainingGapMm} mm`,
        `Status: ${state.status === 'Closed/Insufficient clearance' ? 'Closed / Insufficient clearance' : state.status}`,
      ].join('\n'),
      explanation: 'The model uses ΔL = α × L₀ × (T − T₀). α is the material coefficient of expansion per °C; L₀ is the original rail length; T is the selected temperature; T₀ is the reference temperature; ΔL is the signed expansion; and g₀ is the initial gap. Here L₀ = 10 m and T₀ = 25 °C. The signed gap is g₀ − ΔL; the physical gap cannot be less than 0 mm.',
      limitations: 'This model reports clearance only. Buckling, compression force, and real-world failure are not calculated.',
    };
  }

  function renderResultsPanel(nodes, state) {
    const formatted = formatRailResults(state);
    nodes.summary.textContent = formatted.summary;
    nodes.explanation.textContent = formatted.explanation;
    nodes.limitations.textContent = formatted.limitations;
    if (nodes.temperatureOutput) nodes.temperatureOutput.textContent = `${state.temperatureC} °C`;
    if (nodes.gapOutput) nodes.gapOutput.textContent = `${state.initialGapMm} mm`;
    if (nodes.statusBadge) {
      nodes.statusBadge.textContent = state.status === 'Open' ? 'OPEN' : 'CLOSED';
      nodes.statusBadge.className = state.status === 'Open' ? 'open' : 'closed';
    }
    return formatted;
  }

  function renderMaterialCue(node, state) {
    if (!node || !state) return;
    node.textContent = `Material identity: ${state.materialName}`;
    node.dataset.material = state.material;
  }

  function renderSceneFailure(node, error) {
    if (!node) return;
    const detail = error && error.message ? ` (${error.message})` : '';
    node.textContent = `3D scene unavailable. The simulator results remain available.${detail}`;
    node.className = 'scene-status error';
    node.dataset.state = 'error';
  }

  function renderSceneReady(node) {
    if (!node) return;
    node.textContent = '3D scene is ready.';
    node.className = 'scene-status ready';
    node.dataset.state = 'ready';
  }

  function initSimulator(document) {
    const elements = {
      temperature: document.getElementById(CONTROL_IDS.temperature),
      initialGap: document.getElementById(CONTROL_IDS.initialGap),
      material: document.getElementById(CONTROL_IDS.material),
    };

    const resultNodes = {
      summary: document.getElementById('resultsSummary'),
      explanation: document.getElementById('resultsExplanation'),
      limitations: document.getElementById('resultsLimitations'),
      materialCue: document.getElementById('materialCue'),
      temperatureOutput: document.querySelector('output[for="temperatureC"]'),
      gapOutput: document.querySelector('output[for="initialGapMm"]'),
      statusBadge: document.getElementById('statusBadge'),
    };

    const sceneMount = document.getElementById('sceneMount');
    const sceneStatus = document.getElementById('sceneStatus');
    let sceneController = null;
    try {
      const sceneFactory = global.RailwaySceneFactory
        || (global.RailwayScene && global.THREE && sceneMount
          ? (three, mount) => global.RailwayScene.createRailwayScene(three, mount)
          : null);
      if (!sceneFactory || !global.THREE || !sceneMount) {
        throw new Error('Three.js renderer unavailable');
      }
      sceneController = sceneFactory(global.THREE, sceneMount);
      renderSceneReady(sceneStatus);
    } catch (error) {
      renderSceneFailure(sceneStatus, error);
    }
    global.simulatorScene = sceneController;

    const controller = createSimulatorController(elements, state => {
      global.simulatorState = state;
      if (sceneController && global.RailwayScene) {
        global.RailwayScene.applyRailState(sceneController, state);
      }
      if (resultNodes.summary && resultNodes.explanation && resultNodes.limitations) {
        renderResultsPanel(resultNodes, state);
      }
      renderMaterialCue(resultNodes.materialCue, state);
      if (typeof global.dispatchEvent === 'function' && typeof global.CustomEvent === 'function') {
        global.dispatchEvent(new CustomEvent('simulatorstatechange', { detail: state }));
      }
    });

    for (const element of Object.values(elements)) {
      element.addEventListener('input', controller.recompute);
      element.addEventListener('change', controller.recompute);
    }

    return { controller, sceneController };
  }

  const api = {
    CONTROL_IDS,
    readControlState,
    createSimulatorController,
    formatRailResults,
    renderResultsPanel,
    renderMaterialCue,
    renderSceneFailure,
    renderSceneReady,
    initSimulator,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.RailwayControls = api;
    global.addEventListener('DOMContentLoaded', () => initSimulator(global.document));
  }
}(typeof globalThis !== 'undefined' ? globalThis : this));
