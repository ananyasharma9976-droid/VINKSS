import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Flame,
  RotateCcw,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildExpertMandapScene,
  MandapSceneHandles,
  MandapViewMode,
  stepAkshataParticles,
  stepEmberParticles,
  triggerAkshataBurst,
} from '../three/mandapArchitecture';
import { ritualAudio } from '../three/ritualAudio';
import { ScrollReveal3D } from './ScrollReveal3D';

type LightingMood = 'morning' | 'sunset' | 'night';

interface CameraPreset {
  pos: THREE.Vector3;
  target: THREE.Vector3;
  label: string;
}

const CAMERA_PRESETS: Record<MandapViewMode, CameraPreset> = {
  overview: {
    pos: new THREE.Vector3(0.3, 2.75, 5.75),
    target: new THREE.Vector3(0, 1.05, 0),
    label: 'Mandap & Antarpat',
  },
  saptapadi: {
    pos: new THREE.Vector3(0.15, 2.55, 2.75),
    target: new THREE.Vector3(0, 0.25, -0.1),
    label: 'Saptapadi (7 Vows)',
  },
  thali: {
    pos: new THREE.Vector3(-2.15, 1.45, 3.05),
    target: new THREE.Vector3(-1.35, 0.35, 1.55),
    label: 'Haldi Pooja Thali',
  },
  samai: {
    pos: new THREE.Vector3(1.65, 1.85, 3.25),
    target: new THREE.Vector3(0.88, 0.95, 1.58),
    label: 'Samai & Varmala',
  },
};

const SAPTAPADI_VOWS = [
  {
    step: 1,
    marathi: 'पहिले पाऊल · अन्न व समृद्धी',
    meaning: 'Nourishment & shared abundance — walking side by side in care.',
  },
  {
    step: 2,
    marathi: 'दुसरे पाऊल · शक्ती व आरोग्य',
    meaning: 'Physical, mental, and spiritual strength in every season.',
  },
  {
    step: 3,
    marathi: 'तिसरे पाऊल · सन्मार्ग व समृद्धी',
    meaning: 'Righteous prosperity and devotion to noble values.',
  },
  {
    step: 4,
    marathi: 'चौथे पाऊल · कुटुंब व प्रेम',
    meaning: 'Deepening warmth, respect, and harmony between both families.',
  },
  {
    step: 5,
    marathi: 'पाचवे पाऊल · वंश व सुख',
    meaning: 'Blessings for future generations, kindness, and joy.',
  },
  {
    step: 6,
    marathi: 'सहावे पाऊल · शांतता व स्वास्थ्य',
    meaning: 'Lifelong peace, patience, and steadfast companionship.',
  },
  {
    step: 7,
    marathi: 'सातवे पाऊल · सख्य व मैत्री',
    meaning: 'Eternal friendship — united as equals for seven lifetimes.',
  },
];

const MOOD_SETTINGS: Record<
  LightingMood,
  {
    label: string;
    bgHex: number;
    skyColor: number;
    groundColor: number;
    hemiIntensity: number;
    sunColor: number;
    sunIntensity: number;
    sunPos: [number, number, number];
    envIntensity: number;
  }
> = {
  morning: {
    label: 'Morning Muhurat',
    bgHex: 0xfaefdb,
    skyColor: 0xfff5e4,
    groundColor: 0xb0834c,
    hemiIntensity: 1.0,
    sunColor: 0xfff1d6,
    sunIntensity: 2.35,
    sunPos: [4.8, 7.5, 5.2],
    envIntensity: 0.9,
  },
  sunset: {
    label: 'Golden Sunset',
    bgHex: 0xf4dcba,
    skyColor: 0xffd19c,
    groundColor: 0x7d3b22,
    hemiIntensity: 0.78,
    sunColor: 0xffa652,
    sunIntensity: 2.6,
    sunPos: [6.4, 3.6, 3.4],
    envIntensity: 0.85,
  },
  night: {
    label: 'Diya Night Glow',
    bgHex: 0x2a100c,
    skyColor: 0x5c271c,
    groundColor: 0x240b08,
    hemiIntensity: 0.36,
    sunColor: 0xffbc70,
    sunIntensity: 0.95,
    sunPos: [-3.5, 5.2, 4.5],
    envIntensity: 0.55,
  },
};

export function ExpertMarathiMandap3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [viewMode, setViewMode] = useState<MandapViewMode>('overview');
  const [mood, setMood] = useState<LightingMood>('morning');
  const [saptapadiStep, setSaptapadiStep] = useState(0);
  const [antarpatDropped, setAntarpatDropped] = useState(false);
  const [varmalaExchanged, setVarmalaExchanged] = useState(false);
  const [thaliDiyaLit, setThaliDiyaLit] = useState(true);
  const [samaiLitCount, setSamaiLitCount] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dockExpanded, setDockExpanded] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    'Drag to orbit · Tap rice mounds, brass bell, Samai wicks, or Antarpat'
  );

  // Imperative bridge refs synced into the Three.js loop without re-creating renderer
  const stateRef = useRef({
    viewMode: 'overview' as MandapViewMode,
    mood: 'morning' as LightingMood,
    saptapadiStep: 0,
    antarpatDropped: false,
    varmalaExchanged: false,
    thaliDiyaLit: true,
    cameraTransitionActive: false,
    bellVelocity: 0,
    bellAngle: 0,
    varmalaBlend: 0,
    antarpatDropBlend: 0,
  });

  const handlesRef = useRef<MandapSceneHandles | null>(null);
  const sceneRefs = useRef<{
    scene: THREE.Scene;
    hemi: THREE.HemisphereLight;
    sun: THREE.DirectionalLight;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
  } | null>(null);

  useEffect(() => {
    ritualAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  const selectViewMode = useCallback((mode: MandapViewMode) => {
    setViewMode(mode);
    stateRef.current.viewMode = mode;
    stateRef.current.cameraTransitionActive = true;
    setStatusMessage(`Focused on ${CAMERA_PRESETS[mode].label}`);
  }, []);

  const selectMood = useCallback((nextMood: LightingMood) => {
    setMood(nextMood);
    stateRef.current.mood = nextMood;
    const refs = sceneRefs.current;
    if (refs) {
      const cfg = MOOD_SETTINGS[nextMood];
      refs.scene.background = new THREE.Color(cfg.bgHex);
      refs.scene.environmentIntensity = cfg.envIntensity;
      refs.hemi.color.setHex(cfg.skyColor);
      refs.hemi.groundColor.setHex(cfg.groundColor);
      refs.hemi.intensity = cfg.hemiIntensity;
      refs.sun.color.setHex(cfg.sunColor);
      refs.sun.intensity = cfg.sunIntensity;
      refs.sun.position.set(...cfg.sunPos);
    }
    setStatusMessage(`Lighting set to ${MOOD_SETTINGS[nextMood].label}`);
  }, []);

  const stepSaptapadi = useCallback((nextIdx: number) => {
    const clamped = ((nextIdx % 7) + 7) % 7;
    setSaptapadiStep(clamped);
    stateRef.current.saptapadiStep = clamped;
    ritualAudio.playMangalChord();
    setStatusMessage(
      `Step ${clamped + 1}/7: ${SAPTAPADI_VOWS[clamped].marathi}`
    );
  }, []);

  const toggleAntarpat = useCallback(() => {
    setAntarpatDropped((prev) => {
      const next = !prev;
      stateRef.current.antarpatDropped = next;
      if (next && handlesRef.current) {
        triggerAkshataBurst(handlesRef.current.akshataParticles);
        ritualAudio.playAkshataSparkle();
        setStatusMessage('Mangalashtak complete — Antarpat lowered & Akshata showered');
      } else {
        ritualAudio.playFlameIgnite();
        setStatusMessage('Sacred silk Antarpat raised before Shubhamangal');
      }
      return next;
    });
  }, []);

  const handleShowerAkshata = useCallback(() => {
    if (!handlesRef.current) return;
    triggerAkshataBurst(handlesRef.current.akshataParticles);
    ritualAudio.playAkshataSparkle();
    setStatusMessage('Auspicious golden turmeric Akshata showered over the Mandap');
  }, []);

  const handleRingBell = useCallback(() => {
    stateRef.current.bellVelocity = 7.5;
    ritualAudio.playBrassBell();
    setStatusMessage('Sacred brass Pooja Ghanti rung');
  }, []);

  const handleToggleAllSamai = useCallback(() => {
    const handles = handlesRef.current;
    if (!handles) return;
    const allLit = handles.samaiWicksLit.every(Boolean);
    const nextState = !allLit;
    for (let i = 0; i < handles.samaiWicksLit.length; i++) {
      handles.samaiWicksLit[i] = nextState;
      handles.samaiFlames[i].visible = nextState;
      handles.samaiHalos[i].visible = nextState;
    }
    const count = nextState ? 5 : 0;
    setSamaiLitCount(count);
    handles.samaiLight.intensity = nextState ? 2.4 : 0;
    ritualAudio.playFlameIgnite();
    setStatusMessage(
      nextState ? 'All 5 Mayur Samai brass wicks lit' : 'Mayur Samai wicks resting'
    );
  }, []);

  const handleToggleVarmala = useCallback(() => {
    setVarmalaExchanged((prev) => {
      const next = !prev;
      stateRef.current.varmalaExchanged = next;
      ritualAudio.playMangalChord();
      setStatusMessage(
        next ? 'Varmala floral garlands exchanged' : 'Varmala garlands resting on crimson cushion'
      );
      return next;
    });
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 320);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    // Software WebGL detection (per threejs/SKILL.md)
    const gl = renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererStr = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '')
      : '';
    const isSoftwareGl =
      /swiftshader|llvmpipe|softpipe|mesa|microsoft basic render/i.test(rendererStr);

    renderer.setPixelRatio(
      isSoftwareGl ? Math.min(window.devicePixelRatio, 1.25) : Math.min(window.devicePixelRatio, 1.75)
    );
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initMood = MOOD_SETTINGS[stateRef.current.mood];
    scene.background = new THREE.Color(initMood.bgHex);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = initMood.envIntensity;

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 60);
    camera.position.copy(CAMERA_PRESETS.overview.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CAMERA_PRESETS.overview.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.1;
    controls.maxDistance = 10.5;
    controls.minPolarAngle = 0.16;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.update();

    const stopAutoCamera = () => {
      stateRef.current.cameraTransitionActive = false;
    };
    controls.addEventListener('start', stopAutoCamera);

    // Three-point + Hemisphere lighting
    const hemi = new THREE.HemisphereLight(
      initMood.skyColor,
      initMood.groundColor,
      initMood.hemiIntensity
    );
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(initMood.sunColor, initMood.sunIntensity);
    sun.position.set(...initMood.sunPos);
    if (!isSoftwareGl) {
      sun.castShadow = true;
      sun.shadow.mapSize.set(512, 512);
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far = 22;
      sun.shadow.camera.left = -5;
      sun.shadow.camera.right = 5;
      sun.shadow.camera.top = 5;
      sun.shadow.camera.bottom = -5;
      sun.shadow.bias = -0.0006;
    }
    scene.add(sun);

    const fillLight = new THREE.DirectionalLight(0xffdfb8, 0.72);
    fillLight.position.set(-5.2, 3.2, -3.6);
    scene.add(fillLight);

    sceneRefs.current = { scene, hemi, sun, camera, controls };

    const maxAniso = isSoftwareGl ? 1 : Math.min(6, renderer.capabilities.getMaxAnisotropy());
    const handles = buildExpertMandapScene(maxAniso, isSoftwareGl);
    handlesRef.current = handles;
    scene.add(handles.root);

    // Layer-1 Raycaster picking (only ritual interactive targets)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointerNdc = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: globalThis.PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: globalThis.PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 8) return; // Was an orbit drag, not a tap/click

      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(handles.clickableTargets, true);
      if (hits.length === 0) return;

      const action = hits[0].object.userData.ritualAction as string | undefined;
      if (!action) return;

      if (action.startsWith('saptapadi-')) {
        const idx = Number(action.replace('saptapadi-', ''));
        if (!Number.isNaN(idx)) {
          stepSaptapadi(idx);
        }
      } else if (action === 'antarpat-toggle') {
        toggleAntarpat();
      } else if (action === 'haldi-kumkum') {
        handleShowerAkshata();
      } else if (action === 'thali-diya') {
        setThaliDiyaLit((prev) => {
          const next = !prev;
          stateRef.current.thaliDiyaLit = next;
          handles.thaliDiyaFlame.visible = next;
          handles.thaliDiyaLight.intensity = next ? 1.8 : 0;
          ritualAudio.playFlameIgnite();
          setStatusMessage(next ? 'Thali brass Diya lit' : 'Thali brass Diya resting');
          return next;
        });
      } else if (action === 'ring-bell') {
        handleRingBell();
      } else if (action.startsWith('samai-wick-')) {
        const idx = Number(action.replace('samai-wick-', ''));
        if (!Number.isNaN(idx) && idx >= 0 && idx < 5) {
          handles.samaiWicksLit[idx] = !handles.samaiWicksLit[idx];
          handles.samaiFlames[idx].visible = handles.samaiWicksLit[idx];
          handles.samaiHalos[idx].visible = handles.samaiWicksLit[idx];
          const litCount = handles.samaiWicksLit.filter(Boolean).length;
          setSamaiLitCount(litCount);
          handles.samaiLight.intensity = (litCount / 5) * 2.4;
          ritualAudio.playFlameIgnite();
          setStatusMessage(`Samai wicks glowing: ${litCount} of 5`);
        }
      } else if (action === 'varmala-toggle') {
        handleToggleVarmala();
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    // ResizeObserver for crisp mobile & desktop responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(entry.contentRect.width, 280);
      const h = Math.max(entry.contentRect.height, 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Visibility-gated Render Loop: pauses WebGL completely when scrolled off-screen to keep page scroll at 60fps
    let disposed = false;
    let isInViewport = true;
    let loopRunning = false;
    let rafId = 0;
    let timerId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const afterDraw = (cb: () => void) => {
      if (!isSoftwareGl) {
        rafId = window.requestAnimationFrame(cb);
        return;
      }
      const sync = (gl as WebGL2RenderingContext).fenceSync?.(
        (gl as WebGL2RenderingContext).SYNC_GPU_COMMANDS_COMPLETE,
        0
      );
      if (sync && (gl as WebGL2RenderingContext).clientWaitSync) {
        const gl2 = gl as WebGL2RenderingContext;
        gl2.flush();
        const poll = () => {
          if (disposed || !isInViewport || document.hidden) {
            loopRunning = false;
            return;
          }
          const status = gl2.clientWaitSync(sync, 0, 0);
          if (status === gl2.TIMEOUT_EXPIRED) {
            timerId = window.setTimeout(poll, 4);
          } else {
            gl2.deleteSync(sync);
            timerId = window.setTimeout(cb, 80);
          }
        };
        timerId = window.setTimeout(poll, 4);
      } else {
        gl.finish();
        timerId = window.setTimeout(cb, 80);
      }
    };

    const tick = () => {
      if (disposed || !isInViewport || document.hidden) {
        loopRunning = false;
        return;
      }
      loopRunning = true;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      elapsed += dt;

      const s = stateRef.current;

      // Smooth camera transition to chosen preset
      if (s.cameraTransitionActive) {
        const preset = CAMERA_PRESETS[s.viewMode];
        const alpha = Math.min(1, dt * 5.0);
        camera.position.lerp(preset.pos, alpha);
        controls.target.lerp(preset.target, alpha);
        if (
          camera.position.distanceToSquared(preset.pos) < 0.0008 &&
          controls.target.distanceToSquared(preset.target) < 0.0008
        ) {
          s.cameraTransitionActive = false;
        }
      }

      // Sacred Fire Havan flicker & rising sparks
      handles.havanFlames.forEach((flame, idx) => {
        const wobble = 1 + Math.sin(elapsed * 9.5 + idx * 2.1) * 0.14;
        flame.scale.set(0.95 + Math.cos(elapsed * 7 + idx) * 0.07, wobble, 0.95);
        flame.rotation.z = Math.sin(elapsed * 6.2 + idx) * 0.07;
      });
      handles.havanLight.intensity = 3.2 + Math.sin(elapsed * 11.2) * 0.45;
      stepEmberParticles(handles.emberMesh, handles.embers, elapsed, dt);

      // Hanging Diya & Samai flame organic shimmer
      handles.mandapDiyaFlames.forEach((fl, i) => {
        fl.scale.y = 1 + Math.sin(elapsed * 8.4 + i) * 0.12;
      });
      handles.samaiFlames.forEach((fl, i) => {
        if (handles.samaiWicksLit[i]) {
          fl.scale.y = 1 + Math.sin(elapsed * 9.1 + i * 1.4) * 0.12;
          fl.rotation.z = Math.sin(elapsed * 5.2 + i) * 0.05;
        }
      });
      if (s.thaliDiyaLit) {
        handles.thaliDiyaFlame.scale.y = 1 + Math.sin(elapsed * 9.8) * 0.11;
      }

      // Saptapadi active Lotus Ring glide
      const targetPos = handles.saptapadiPositions[s.saptapadiStep];
      handles.saptapadiLotusRing.position.lerp(targetPos, Math.min(1, dt * 6.5));
      handles.saptapadiLotusRing.rotation.y += dt * 1.1;

      // Antarpat drop/raise smooth cloth slide + gentle silk breeze
      const dropTarget = s.antarpatDropped ? 1 : 0;
      s.antarpatDropBlend += (dropTarget - s.antarpatDropBlend) * Math.min(1, dt * 4.5);
      handles.antarpatClothMesh.position.y =
        handles.antarpatBaseY - s.antarpatDropBlend * 0.98;
      handles.antarpatClothMesh.scale.y = Math.max(0.08, 1 - s.antarpatDropBlend * 0.85);
      handles.antarpatClothMesh.rotation.x = Math.sin(elapsed * 1.9) * 0.035;

      // Varmala exchange smooth glide
      const varmalaTarget = s.varmalaExchanged ? 1 : 0;
      s.varmalaBlend += (varmalaTarget - s.varmalaBlend) * Math.min(1, dt * 4.2);
      handles.leftGarland.position.x = -0.56 + s.varmalaBlend * 1.12;
      handles.leftGarland.position.y = 0.48 + Math.sin(s.varmalaBlend * Math.PI) * 0.42;
      handles.rightGarland.position.x = 0.56 - s.varmalaBlend * 1.12;
      handles.rightGarland.position.y = 0.48 + Math.sin(s.varmalaBlend * Math.PI) * 0.25;

      // Pooja Ghanti spring-damped bell swing
      if (Math.abs(s.bellVelocity) > 0.005 || Math.abs(s.bellAngle) > 0.002) {
        const accel = -46 * s.bellAngle - 4.2 * s.bellVelocity;
        s.bellVelocity += accel * dt;
        s.bellAngle += s.bellVelocity * dt;
        handles.thaliBellPivot.rotation.z = s.bellAngle;
      }

      // Akshata petal shower step (no-op when idle)
      stepAkshataParticles(handles.akshataMesh, handles.akshataParticles, dt);

      controls.update();
      renderer.render(scene, camera);
      afterDraw(tick);
    };

    const resumeLoop = () => {
      if (!disposed && isInViewport && !document.hidden && !loopRunning) {
        lastTime = performance.now();
        tick();
      }
    };

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        isInViewport = entries[0]?.isIntersecting ?? true;
        if (isInViewport) {
          resumeLoop();
        }
      },
      { rootMargin: '120px 0px' }
    );
    visibilityObserver.observe(container);

    const handleDocVisibility = () => {
      if (!document.hidden) resumeLoop();
    };
    document.addEventListener('visibilitychange', handleDocVisibility);

    // Render initial frame immediately and run while visible
    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', handleDocVisibility);
      resizeObserver.disconnect();
      controls.removeEventListener('start', stopAutoCamera);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();

      handles.disposables.geometries.forEach((g) => g.dispose());
      handles.disposables.materials.forEach((m) => m.dispose());
      handles.disposables.textures.forEach((t) => t.dispose());
      roomEnv.dispose();
      envTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      handlesRef.current = null;
      sceneRefs.current = null;
    };
  }, [handleRingBell, handleShowerAkshata, handleToggleVarmala, stepSaptapadi, toggleAntarpat]);

  const currentVow = SAPTAPADI_VOWS[saptapadiStep];

  return (
    <ScrollReveal3D direction="depth">
      <section aria-label="Interactive 3D Marathi Wedding Mandap">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#dfc89e]">
          <div>
            <p className="font-royal text-xs tracking-[0.14em] text-[#b45309] font-semibold">
              Interactive 3D Ritual Sanctuary
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1f1b18] mt-1">
              Explore the Sacred Mandap in 3D
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(Object.keys(CAMERA_PRESETS) as MandapViewMode[]).map((modeKey) => {
              const active = viewMode === modeKey;
              return (
                <button
                  key={modeKey}
                  type="button"
                  onClick={() => selectViewMode(modeKey)}
                  className={`min-h-[38px] px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#8b261d] text-[#fff8e8] border-[#8b261d]'
                      : 'bg-[#fffaf0] text-[#3b332b] border-[#d2b57f] hover:border-[#8b261d] hover:text-[#8b261d]'
                  }`}
                >
                  {CAMERA_PRESETS[modeKey].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3D Canvas Stage (NO backdrop-filter over canvas, unobstructed center) */}
        <div className="mt-5 relative h-[430px] sm:h-[520px] md:h-[560px] w-full border-2 border-[#c89b44] bg-[#faefdb] shadow-[0_20px_48px_rgba(78,24,18,0.16)] overflow-hidden">
          <div ref={mountRef} className="w-full h-full touch-none select-none" />

          {/* Top-Left Compact Vow & Interaction Readout (non-blurred solid ivory) */}
          <div className="pointer-events-none absolute top-3 left-3 right-14 sm:right-auto sm:max-w-[330px] bg-[#fffaf0]/95 border border-[#d4a64a] px-3.5 py-2.5 shadow-md">
            <p className="font-marathi text-xs font-semibold text-[#8b261d]">
              {currentVow.marathi}
            </p>
            <p className="text-xs text-[#3b332b] leading-snug mt-0.5">{currentVow.meaning}</p>
            <p className="text-[11px] text-[#7a5a26] mt-1.5 pt-1 border-t border-[#ebd8b3] truncate">
              {statusMessage}
            </p>
          </div>

          {/* Top-Right Compact Audio + Reset View Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setSoundEnabled((v) => !v)}
              aria-label={soundEnabled ? 'Mute ritual chimes' : 'Enable ritual chimes'}
              className="w-10 h-10 inline-flex items-center justify-center bg-[#fffaf0]/95 border border-[#d4a64a] text-[#5c1612] hover:bg-[#faecc8] cursor-pointer shadow-sm"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => selectViewMode('overview')}
              aria-label="Reset 3D camera view"
              className="w-10 h-10 inline-flex items-center justify-center bg-[#fffaf0]/95 border border-[#d4a64a] text-[#5c1612] hover:bg-[#faecc8] cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Collapsible Bottom Dock (unobstructed center, mobile-friendly) */}
          <div className="absolute inset-x-2.5 bottom-2.5 flex flex-col items-center pointer-events-none">
            <button
              type="button"
              onClick={() => setDockExpanded((e) => !e)}
              className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 min-h-[32px] px-3 py-1 bg-[#751a14]/95 border border-[#d4a64a] text-[11px] font-medium text-[#f7e5b8] cursor-pointer shadow-sm"
            >
              {dockExpanded ? (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Hide Ritual Controls
                </>
              ) : (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Show Ritual Controls
                </>
              )}
            </button>

            {dockExpanded && (
              <div className="pointer-events-auto w-full bg-[#fffaf0]/95 border border-[#c89b44] p-2.5 shadow-lg flex flex-col gap-2">
                {/* Row 1: Ritual Actions */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={toggleAntarpat}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-medium border cursor-pointer whitespace-nowrap ${
                      antarpatDropped
                        ? 'bg-[#8b261d] text-[#fff8e8] border-[#8b261d]'
                        : 'bg-[#fff5dc] text-[#4f1410] border-[#d4a64a] hover:bg-[#faecc8]'
                    }`}
                  >
                    {antarpatDropped ? 'Raise Antarpat' : 'Lower Antarpat'}
                  </button>

                  <button
                    type="button"
                    onClick={handleShowerAkshata}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 bg-gradient-to-r from-[#d4a64a] to-[#f1d17c] border border-[#b68329] text-[#3a120d] text-xs font-semibold hover:brightness-105 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Shower Akshata
                  </button>

                  <button
                    type="button"
                    onClick={handleRingBell}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 bg-[#fffaf0] border border-[#c8b288] text-[#1f1b18] text-xs font-medium hover:border-[#8b261d] hover:text-[#8b261d] cursor-pointer whitespace-nowrap"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#b45309]" />
                    Ring Ghanti
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleAllSamai}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 bg-[#fffaf0] border border-[#c8b288] text-[#1f1b18] text-xs font-medium hover:border-[#8b261d] hover:text-[#8b261d] cursor-pointer whitespace-nowrap tabular-nums"
                  >
                    <Flame className="w-3.5 h-3.5 text-[#d97706]" />
                    Samai ({samaiLitCount}/5)
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleVarmala}
                    className={`min-h-[38px] px-3 py-1.5 text-xs font-medium border cursor-pointer whitespace-nowrap ${
                      varmalaExchanged
                        ? 'bg-[#8b261d] text-[#fff8e8] border-[#8b261d]'
                        : 'bg-[#fffaf0] text-[#1f1b18] border-[#c8b288] hover:border-[#8b261d]'
                    }`}
                  >
                    {varmalaExchanged ? 'Reset Varmala' : 'Exchange Varmala'}
                  </button>
                </div>

                {/* Row 2: Saptapadi 7-Vow Stepper + Ambience Moods */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#ead8b4]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#6d3d20] mr-1">
                      Saptapadi:
                    </span>
                    <button
                      type="button"
                      onClick={() => stepSaptapadi(saptapadiStep - 1)}
                      aria-label="Previous Saptapadi vow"
                      className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center border border-[#c8b288] bg-[#fffaf0] text-[#3b332b] hover:border-[#8b261d] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold text-[#8b261d] px-1.5 tabular-nums">
                      Vow {saptapadiStep + 1} / 7
                    </span>
                    <button
                      type="button"
                      onClick={() => stepSaptapadi(saptapadiStep + 1)}
                      aria-label="Next Saptapadi vow"
                      className="min-w-[34px] min-h-[34px] inline-flex items-center justify-center border border-[#c8b288] bg-[#fffaf0] text-[#3b332b] hover:border-[#8b261d] cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(
                      [
                        { id: 'morning', label: 'Morning', Icon: Sun },
                        { id: 'sunset', label: 'Sunset', Icon: Sunset },
                        { id: 'night', label: 'Diya Glow', Icon: Moon },
                      ] as const
                    ).map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => selectMood(id)}
                        className={`inline-flex items-center gap-1 min-h-[34px] px-2.5 py-1 text-[11px] font-medium border cursor-pointer ${
                          mood === id
                            ? 'bg-[#681511] text-[#f7e5b8] border-[#681511]'
                            : 'bg-[#fffaf0] text-[#5c5346] border-[#d6c299] hover:border-[#8b261d]'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </ScrollReveal3D>
  );
}
