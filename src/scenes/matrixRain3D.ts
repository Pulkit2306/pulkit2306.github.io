import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const CHARS =
  "アカサタナハマヤラワ0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿABCDEFGHIJKLMNOPQRSTUVWXYZ";

const COLUMNS = 32;
const LAYERS = 3;
const TRAIL_LENGTH = 8;
const TRAIL_SPACING = 0.9;
const TOP_Y = 11;
const BOTTOM_Y = -11;
const FLICKER_INTERVAL_MS = 150;
const FLICKER_FRACTION = 0.08;

const VERTEX_SHADER = `
  attribute float brightness;
  attribute float charIndex;

  varying vec2 vUv;
  varying float vBrightness;
  varying float vCharIndex;

  void main() {
    vUv = uv;
    vBrightness = brightness;
    vCharIndex = charIndex;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D map;
  uniform float atlasCols;
  uniform float atlasRows;
  uniform vec3 color;

  varying vec2 vUv;
  varying float vBrightness;
  varying float vCharIndex;

  void main() {
    float col = mod(vCharIndex, atlasCols);
    float row = floor(vCharIndex / atlasCols);
    vec2 cell = vec2(1.0 / atlasCols, 1.0 / atlasRows);
    vec2 uv = vec2(
      (col + vUv.x) * cell.x,
      1.0 - (row + 1.0 - vUv.y) * cell.y
    );
    vec4 tex = texture2D(map, uv);
    float alpha = tex.r * vBrightness;
    if (alpha < 0.04) discard;
    gl_FragColor = vec4(color * vBrightness, alpha);
  }
`;

function buildGlyphAtlas(): { texture: THREE.CanvasTexture; cols: number; rows: number } {
  const cellSize = 64;
  const cols = 10;
  const rows = Math.ceil(CHARS.length / cols);
  const canvas = document.createElement("canvas");
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `bold ${Math.floor(cellSize * 0.7)}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < CHARS.length; i++) {
    const cx = (i % cols) * cellSize + cellSize / 2;
    const cy = Math.floor(i / cols) * cellSize + cellSize / 2;
    ctx.fillText(CHARS[i], cx, cy);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return { texture, cols, rows };
}

interface Strand {
  x: number;
  z: number;
  headY: number;
  speed: number;
  baseBrightness: number;
}

export function mountMatrixRain3D(canvas: HTMLCanvasElement): () => void {
  // preserveDrawingBuffer: automated/headless screenshot capture can otherwise
  // read back a blank buffer even though the canvas displays correctly on screen.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 9);
  const lookTarget = new THREE.Vector3(0, 0, -6);
  camera.lookAt(lookTarget);

  const atlas = buildGlyphAtlas();
  const strands: Strand[] = [];

  for (let layer = 0; layer < LAYERS; layer++) {
    const z = -layer * 6;
    const xRange = 14 * (1 + layer * 0.8);
    const layerBrightness = [1, 0.6, 0.35][layer] ?? 0.3;
    for (let c = 0; c < COLUMNS; c++) {
      strands.push({
        x: (c / (COLUMNS - 1) - 0.5) * xRange,
        z,
        // Spread initial positions across the whole fall range (not just above
        // TOP_Y) so the scene is already fully populated on first paint, instead
        // of taking several seconds to "rain in" from an empty screen.
        headY: BOTTOM_Y + Math.random() * (TOP_Y - BOTTOM_Y) * 1.3,
        speed: 4 + Math.random() * 4,
        baseBrightness: layerBrightness,
      });
    }
  }

  const totalInstances = strands.length * TRAIL_LENGTH;
  const geometry = new THREE.InstancedBufferGeometry();
  const plane = new THREE.PlaneGeometry(0.6, 0.6);
  geometry.index = plane.index;
  geometry.attributes.position = plane.attributes.position;
  geometry.attributes.uv = plane.attributes.uv;

  const brightnessArray = new Float32Array(totalInstances);
  const charIndexArray = new Float32Array(totalInstances);
  for (let s = 0; s < strands.length; s++) {
    for (let t = 0; t < TRAIL_LENGTH; t++) {
      const i = s * TRAIL_LENGTH + t;
      const tailFade = Math.max(0.12, 1 - t / TRAIL_LENGTH);
      brightnessArray[i] = strands[s].baseBrightness * tailFade;
      charIndexArray[i] = Math.floor(Math.random() * CHARS.length);
    }
  }
  geometry.setAttribute("brightness", new THREE.InstancedBufferAttribute(brightnessArray, 1));
  const charIndexAttr = new THREE.InstancedBufferAttribute(charIndexArray, 1);
  geometry.setAttribute("charIndex", charIndexAttr);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      map: { value: atlas.texture },
      atlasCols: { value: atlas.cols },
      atlasRows: { value: atlas.rows },
      color: { value: new THREE.Color(0x00ff41) },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.InstancedMesh(geometry, material, totalInstances);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const dummy = new THREE.Object3D();
  function layoutInstances() {
    for (let s = 0; s < strands.length; s++) {
      const strand = strands[s];
      for (let t = 0; t < TRAIL_LENGTH; t++) {
        const i = s * TRAIL_LENGTH + t;
        dummy.position.set(strand.x, strand.headY - t * TRAIL_SPACING, strand.z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
  layoutInstances();

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.75,
    0.4,
    0.15
  );
  composer.addPass(bloomPass);

  const mouse = { x: 0, y: 0 };
  function onMouseMove(e: MouseEvent) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener("mousemove", onMouseMove);

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", onResize);

  let lastFlicker = 0;
  const clock = new THREE.Clock();
  let rafId: number;

  function animate() {
    const delta = clock.getDelta();
    const elapsedMs = clock.elapsedTime * 1000;

    for (const strand of strands) {
      strand.headY -= strand.speed * delta;
      if (strand.headY < BOTTOM_Y - TRAIL_LENGTH * TRAIL_SPACING) {
        strand.headY = TOP_Y + Math.random() * 4;
        strand.speed = 4 + Math.random() * 4;
      }
    }
    layoutInstances();

    if (elapsedMs - lastFlicker > FLICKER_INTERVAL_MS) {
      lastFlicker = elapsedMs;
      const flickerCount = Math.floor(totalInstances * FLICKER_FRACTION);
      for (let n = 0; n < flickerCount; n++) {
        const i = Math.floor(Math.random() * totalInstances);
        charIndexArray[i] = Math.floor(Math.random() * CHARS.length);
      }
      charIndexAttr.needsUpdate = true;
    }

    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(lookTarget);

    composer.render();
    rafId = requestAnimationFrame(animate);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      clock.getDelta();
      rafId = requestAnimationFrame(animate);
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange);

  rafId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    geometry.dispose();
    material.dispose();
    atlas.texture.dispose();
    renderer.dispose();
  };
}
