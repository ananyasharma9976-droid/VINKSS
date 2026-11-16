import * as THREE from 'three';
import {
  createAntarpatClothTexture,
  createBrassHammerBumpTexture,
  createContactShadowTexture,
  createRangoliFloorTexture,
  createRosewoodGrainTexture,
} from './proceduralTextures';

export type MandapViewMode = 'overview' | 'saptapadi' | 'thali' | 'samai';

export interface AkshataParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  scale: number;
  active: boolean;
}

export interface EmberParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  phase: number;
  radius: number;
}

export interface MandapSceneHandles {
  root: THREE.Group;
  clickableTargets: THREE.Object3D[];
  // Antarpat & Akshata
  antarpatGroup: THREE.Group;
  antarpatClothMesh: THREE.Mesh;
  antarpatBaseY: number;
  akshataMesh: THREE.InstancedMesh;
  akshataParticles: AkshataParticle[];
  // Havan Sacred Fire & Embers
  havanFlames: THREE.Mesh[];
  havanLight: THREE.PointLight;
  emberMesh: THREE.InstancedMesh;
  embers: EmberParticle[];
  // Saptapadi 7 Steps
  saptapadiPositions: THREE.Vector3[];
  saptapadiLotusRing: THREE.Group;
  // Hanging & Corner Diyas
  mandapDiyaFlames: THREE.Mesh[];
  // Foreground Pooja Thali
  thaliGroup: THREE.Group;
  thaliDiyaFlame: THREE.Mesh;
  thaliDiyaLight: THREE.PointLight;
  thaliBellPivot: THREE.Group;
  // 5-Wick Mayur Samai
  samaiFlames: THREE.Mesh[];
  samaiHalos: THREE.Mesh[];
  samaiLight: THREE.PointLight;
  samaiWicksLit: boolean[];
  // Varmala Cushion & Garlands
  leftGarland: THREE.Group;
  rightGarland: THREE.Group;
  // Disposal registry
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
}

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

export function buildExpertMandapScene(
  maxAniso: number,
  isSoftwareGl: boolean
): MandapSceneHandles {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  // Procedural Canvas PBR Maps
  const rangoliTex = trackTex(createRangoliFloorTexture(maxAniso));
  const antarpatTex = trackTex(createAntarpatClothTexture(maxAniso));
  const rosewoodTex = trackTex(createRosewoodGrainTexture(maxAniso));
  const brassBumpTex = trackTex(createBrassHammerBumpTexture(maxAniso));
  const contactTex = trackTex(createContactShadowTexture());

  // Varied PBR Material Library (>= 0.25 roughness contrast across adjacent parts)
  const brassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xd9a944,
      metalness: 0.92,
      roughness: 0.2,
      bumpMap: brassBumpTex,
      bumpScale: 0.012,
      anisotropy: isSoftwareGl ? 0 : 0.78,
      clearcoat: 0.25,
    })
  );

  const copperMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xb85c34,
      metalness: 0.88,
      roughness: 0.26,
      bumpMap: brassBumpTex,
      bumpScale: 0.014,
      anisotropy: isSoftwareGl ? 0 : 0.6,
    })
  );

  const antiqueGoldMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb9862d,
      metalness: 0.85,
      roughness: 0.32,
      bumpMap: brassBumpTex,
      bumpScale: 0.015,
    })
  );

  const rosewoodMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: rosewoodTex,
      color: 0x623121,
      metalness: 0.05,
      roughness: 0.64,
    })
  );

  const crimsonSilkMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x8b261d,
      metalness: 0.04,
      roughness: 0.78,
      sheen: 0.9,
      sheenRoughness: 0.42,
      sheenColor: new THREE.Color(0xf6cf74),
      side: THREE.DoubleSide,
    })
  );

  const saffronSilkMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      metalness: 0.04,
      roughness: 0.76,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xfef08a),
      side: THREE.DoubleSide,
    })
  );

  const sandstoneMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf0e3cb,
      metalness: 0.02,
      roughness: 0.86,
    })
  );

  const rangoliFloorMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: rangoliTex,
      roughness: 0.85,
      metalness: 0.02,
    })
  );

  const pearlMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xfbf8f1,
      metalness: 0.05,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })
  );

  const rubyMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x9e1922,
      metalness: 0.1,
      roughness: 0.18,
      clearcoat: 1.0,
    })
  );

  const haldiMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.94, metalness: 0.0 })
  );
  const kumkumMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.92, metalness: 0.0 })
  );
  const riceMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xf9f3dc, roughness: 0.88, metalness: 0.02 })
  );
  const leafMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x3b6e28,
      roughness: 0.56,
      metalness: 0.04,
      side: THREE.DoubleSide,
    })
  );
  const coconutMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0x6b3e1f, roughness: 0.88, metalness: 0.02 })
  );

  const flameMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffdf7a,
      emissive: 0xff7b14,
      emissiveIntensity: 2.8,
      roughness: 0.25,
      metalness: 0.0,
    })
  );

  const haloMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xffb347,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    })
  );

  const emberMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffb74d,
      emissive: 0xff6d00,
      emissiveIntensity: 3.0,
      roughness: 0.3,
    })
  );

  const root = new THREE.Group();
  const clickableTargets: THREE.Object3D[] = [];
  const mandapDiyaFlames: THREE.Mesh[] = [];

  const registerClickable = (obj: THREE.Object3D, action: string, label: string) => {
    obj.layers.enable(1);
    obj.traverse((child) => {
      child.layers.enable(1);
      child.userData.ritualAction = action;
      child.userData.ritualLabel = label;
    });
    clickableTargets.push(obj);
  };

  // =========================================================================
  // 1. MULTI-TIERED SANDSTONE & BRASS MANDAP DAIS + RANGOLI COURTYARD
  // =========================================================================
  const outerStep = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(4.4, 4.65, 0.16, 48)),
    sandstoneMat
  );
  outerStep.position.y = -0.22;
  outerStep.receiveShadow = true;
  root.add(outerStep);

  const mainDais = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(3.85, 4.02, 0.16, 48)),
    sandstoneMat
  );
  mainDais.position.y = -0.08;
  mainDais.receiveShadow = true;
  root.add(mainDais);

  const daisTrim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(3.86, 0.032, 10, 64)),
    antiqueGoldMat
  );
  daisTrim.rotation.x = Math.PI / 2;
  daisTrim.position.y = 0.005;
  root.add(daisTrim);

  const rangoliFloor = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(3.55, 3.55, 0.02, 56)),
    rangoliFloorMat
  );
  rangoliFloor.position.y = 0.01;
  rangoliFloor.receiveShadow = true;
  root.add(rangoliFloor);

  const contactShadow = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(7.2, 7.2)),
    trackMat(
      new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.42,
      })
    )
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.025;
  root.add(contactShadow);

  // =========================================================================
  // 2. FOUR CARVED PESHWA PILLARS + HELICAL FLORAL VINES + CUSPED ARCHWAYS
  // =========================================================================
  const pillarCoords: [number, number][] = [
    [-2.15, -1.85],
    [2.15, -1.85],
    [-2.15, 1.85],
    [2.15, 1.85],
  ];

  const pPlinthGeo = trackGeo(new THREE.CylinderGeometry(0.24, 0.29, 0.24, 8));
  const pShaftGeo = trackGeo(
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.18, 0),
        new THREE.Vector2(0.13, 0.14),
        new THREE.Vector2(0.11, 0.55),
        new THREE.Vector2(0.14, 0.65),
        new THREE.Vector2(0.105, 1.55),
        new THREE.Vector2(0.14, 2.35),
        new THREE.Vector2(0.11, 2.55),
        new THREE.Vector2(0.2, 2.75),
        new THREE.Vector2(0.22, 2.84),
      ],
      20
    )
  );
  const pCollarGeo = trackGeo(new THREE.TorusGeometry(0.145, 0.025, 10, 24));

  // Helical flower vine blossoms across all 4 pillars (InstancedMesh)
  const floretGeo = trackGeo(new THREE.SphereGeometry(0.068, 10, 8));
  const floretMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72, metalness: 0.02 })
  );
  const pillarBlossomTotal = 4 * 34;
  const pillarBlossoms = new THREE.InstancedMesh(floretGeo, floretMat, pillarBlossomTotal);
  const marigoldPalette = [0xf59e0b, 0xea580c, 0xfbbf24, 0xfaf7f0, 0xdc2626];
  let pbIdx = 0;

  pillarCoords.forEach(([px, pz]) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(px, 0.02, pz);

    const plinth = new THREE.Mesh(pPlinthGeo, sandstoneMat);
    plinth.position.y = 0.12;
    plinth.castShadow = true;
    pGroup.add(plinth);

    const shaft = new THREE.Mesh(pShaftGeo, rosewoodMat);
    shaft.position.y = 0.24;
    shaft.castShadow = true;
    pGroup.add(shaft);

    [0.28, 0.88, 1.78, 2.68].forEach((cy) => {
      const collar = new THREE.Mesh(pCollarGeo, brassMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.y = cy;
      pGroup.add(collar);
    });

    root.add(pGroup);

    // Helical marigold & mogra wrapping on each pillar
    for (let j = 0; j < 34; j++) {
      const t = j / 33;
      const angle = t * Math.PI * 6;
      const r = 0.165;
      _dummy.position.set(
        px + Math.cos(angle) * r,
        0.38 + t * 2.45,
        pz + Math.sin(angle) * r
      );
      _dummy.scale.setScalar(0.82 + ((j * 7) % 5) * 0.08);
      _dummy.updateMatrix();
      pillarBlossoms.setMatrixAt(pbIdx, _dummy.matrix);
      _color.setHex(marigoldPalette[j % marigoldPalette.length]);
      pillarBlossoms.setColorAt(pbIdx, _color);
      pbIdx++;
    }
  });
  pillarBlossoms.instanceMatrix.needsUpdate = true;
  if (pillarBlossoms.instanceColor) pillarBlossoms.instanceColor.needsUpdate = true;
  pillarBlossoms.computeBoundingSphere();
  root.add(pillarBlossoms);

  // Scalloped Cusped Peshwai Archways (ExtrudeGeometry with Bevel)
  const buildCuspedArch = (span: number) => {
    const half = span / 2;
    const h = 0.78;
    const shape = new THREE.Shape();
    shape.moveTo(-half, 0);
    shape.lineTo(-half, h);
    shape.lineTo(half, h);
    shape.lineTo(half, 0);
    shape.quadraticCurveTo(half * 0.72, h * 0.56, half * 0.42, h * 0.45);
    shape.quadraticCurveTo(half * 0.22, h * 0.82, 0, h * 0.72);
    shape.quadraticCurveTo(-half * 0.22, h * 0.82, -half * 0.42, h * 0.45);
    shape.quadraticCurveTo(-half * 0.72, h * 0.56, -half, 0);

    const archGeo = trackGeo(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.12,
        bevelEnabled: true,
        bevelSize: 0.018,
        bevelThickness: 0.018,
      })
    );
    archGeo.center();
    return archGeo;
  };

  const frontBackArchGeo = buildCuspedArch(4.15);
  const sideArchGeo = buildCuspedArch(3.55);

  [1.85, -1.85].forEach((zPos) => {
    const arch = new THREE.Mesh(frontBackArchGeo, antiqueGoldMat);
    arch.position.set(0, 2.75, zPos);
    arch.castShadow = true;
    root.add(arch);
  });
  [-2.15, 2.15].forEach((xPos) => {
    const sArch = new THREE.Mesh(sideArchGeo, antiqueGoldMat);
    sArch.rotation.y = Math.PI / 2;
    sArch.position.set(xPos, 2.75, 0);
    sArch.castShadow = true;
    root.add(sArch);
  });

  // Layered Crimson & Saffron Silk Mandap Dome Roof + Brass Kalash Spire
  const canopyProfile = [
    new THREE.Vector2(3.15, 0),
    new THREE.Vector2(2.6, 0.28),
    new THREE.Vector2(1.45, 0.65),
    new THREE.Vector2(0.45, 0.92),
    new THREE.Vector2(0.18, 1.02),
    new THREE.Vector2(0, 1.05),
  ];
  const domeMesh = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(canopyProfile, 4)),
    crimsonSilkMat
  );
  domeMesh.rotation.y = Math.PI / 4;
  domeMesh.position.set(0, 3.12, 0);
  domeMesh.castShadow = true;
  root.add(domeMesh);

  const spireGeo = trackGeo(
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.16, 0),
        new THREE.Vector2(0.22, 0.12),
        new THREE.Vector2(0.12, 0.24),
        new THREE.Vector2(0.16, 0.34),
        new THREE.Vector2(0.05, 0.52),
        new THREE.Vector2(0, 0.65),
      ],
      20
    )
  );
  const spire = new THREE.Mesh(spireGeo, brassMat);
  spire.position.set(0, 4.14, 0);
  root.add(spire);

  // Hanging Brass Diyas along Front & Back Scalloped Arches
  const chainGeo = trackGeo(new THREE.CylinderGeometry(0.009, 0.009, 0.52, 6));
  const smallDiyaGeo = trackGeo(
    new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(0.12, 0.04),
        new THREE.Vector2(0.13, 0.07),
        new THREE.Vector2(0.04, 0.03),
      ],
      16
    )
  );
  const smallFlameGeo = trackGeo(new THREE.ConeGeometry(0.032, 0.1, 10));

  const hangingHaloGeo = trackGeo(new THREE.SphereGeometry(0.11, 10, 8));
  const hangingPositions: [number, number][] = [
    [-1.25, 1.85],
    [1.25, 1.85],
    [-1.25, -1.85],
    [1.25, -1.85],
  ];
  hangingPositions.forEach(([hx, hz]) => {
    const chain = new THREE.Mesh(chainGeo, brassMat);
    chain.position.set(hx, 2.52, hz);
    root.add(chain);

    const bowl = new THREE.Mesh(smallDiyaGeo, brassMat);
    bowl.position.set(hx, 2.24, hz);
    root.add(bowl);

    const fl = new THREE.Mesh(smallFlameGeo, flameMat);
    fl.position.set(hx, 2.33, hz);
    const halo = new THREE.Mesh(hangingHaloGeo, haloMat);
    halo.position.y = 0.02;
    fl.add(halo);
    root.add(fl);
    mandapDiyaFlames.push(fl);
  });

  // =========================================================================
  // 3. CENTRAL SACRED COPPER HAVAN KUND + ANIMATED AGNI FIRE & SPARKS
  // =========================================================================
  const havanGroup = new THREE.Group();
  havanGroup.position.set(0, 0.02, -0.15);
  root.add(havanGroup);

  const stepSizes = [
    { w: 1.05, h: 0.09, y: 0.045, mat: sandstoneMat },
    { w: 0.86, h: 0.09, y: 0.135, mat: copperMat },
    { w: 0.68, h: 0.08, y: 0.22, mat: brassMat },
  ];
  stepSizes.forEach((s) => {
    const box = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(s.w, s.h, s.w)), s.mat);
    box.position.y = s.y;
    box.castShadow = true;
    box.receiveShadow = true;
    havanGroup.add(box);
  });

  // Samidha Firewood Logs inside Kund
  const logGeo = trackGeo(new THREE.CylinderGeometry(0.035, 0.038, 0.44, 8));
  [0, Math.PI / 3, -Math.PI / 3].forEach((rot, i) => {
    const log = new THREE.Mesh(logGeo, rosewoodMat);
    log.position.set(0, 0.27 + i * 0.015, 0);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = rot;
    havanGroup.add(log);
  });

  const havanFlames: THREE.Mesh[] = [];
  [
    { r: 0.14, h: 0.42, x: 0, z: 0 },
    { r: 0.09, h: 0.3, x: -0.09, z: 0.05 },
    { r: 0.09, h: 0.32, x: 0.08, z: -0.05 },
  ].forEach((cfg) => {
    const f = new THREE.Mesh(
      trackGeo(new THREE.ConeGeometry(cfg.r, cfg.h, 12)),
      flameMat
    );
    f.position.set(cfg.x, 0.28 + cfg.h * 0.45, cfg.z);
    havanGroup.add(f);
    havanFlames.push(f);
  });

  const havanLight = new THREE.PointLight(0xff942e, 3.5, 7.5, 1.6);
  havanLight.position.set(0, 0.85, 0);
  havanGroup.add(havanLight);

  // Rising Sacred Ember Sparks (InstancedMesh)
  const emberCount = 36;
  const emberGeo = trackGeo(new THREE.SphereGeometry(0.016, 6, 6));
  const emberMesh = new THREE.InstancedMesh(emberGeo, emberMat, emberCount);
  emberMesh.frustumCulled = false;
  const embers: EmberParticle[] = [];
  for (let i = 0; i < emberCount; i++) {
    embers.push({
      x: (Math.random() - 0.5) * 0.3,
      y: 0.32 + Math.random() * 1.1,
      z: (Math.random() - 0.5) * 0.3,
      speed: 0.32 + Math.random() * 0.42,
      phase: Math.random() * Math.PI * 2,
      radius: 0.04 + Math.random() * 0.14,
    });
  }
  havanGroup.add(emberMesh);

  // Twin Ceremonial Bajots (Wooden Chaurang Seats with Velvet Cushions)
  [-1.08, 1.08].forEach((bx) => {
    const bajot = new THREE.Group();
    bajot.position.set(bx, 0.02, -0.32);

    const bFrame = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.68, 0.1, 0.58)),
      rosewoodMat
    );
    bFrame.position.y = 0.09;
    bFrame.castShadow = true;
    bajot.add(bFrame);

    const cushion = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.62, 0.07, 0.52)),
      bx < 0 ? saffronSilkMat : crimsonSilkMat
    );
    cushion.position.y = 0.175;
    cushion.castShadow = true;
    bajot.add(cushion);

    root.add(bajot);
  });

  // =========================================================================
  // 4. SEVEN SAPTAPADI SACRED RICE MOUNDS + ACTIVE STEP LOTUS RING
  // =========================================================================
  const saptapadiPositions: THREE.Vector3[] = [];
  const riceMoundGeo = trackGeo(new THREE.ConeGeometry(0.11, 0.08, 16));
  const supariGeo = trackGeo(new THREE.SphereGeometry(0.032, 10, 8));
  const stepRingGeo = trackGeo(new THREE.TorusGeometry(0.135, 0.018, 8, 24));

  for (let i = 0; i < 7; i++) {
    const angle = -Math.PI * 0.65 + (i / 6) * Math.PI * 1.3;
    const rx = Math.cos(angle) * 1.36;
    const rz = -0.15 + Math.sin(angle) * 1.18;
    const pos = new THREE.Vector3(rx, 0.02, rz);
    saptapadiPositions.push(pos);

    const stepGroup = new THREE.Group();
    stepGroup.position.copy(pos);

    const ring = new THREE.Mesh(stepRingGeo, haldiMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.015;
    stepGroup.add(ring);

    const mound = new THREE.Mesh(riceMoundGeo, riceMat);
    mound.position.y = 0.04;
    stepGroup.add(mound);

    const supari = new THREE.Mesh(supariGeo, coconutMat);
    supari.position.y = 0.09;
    stepGroup.add(supari);

    registerClickable(stepGroup, `saptapadi-${i}`, `Saptapadi Vow Step ${i + 1}`);
    root.add(stepGroup);
  }

  // Animated Glowing Golden Lotus Ring Highlighting Active Saptapadi Step
  const saptapadiLotusRing = new THREE.Group();
  saptapadiLotusRing.position.copy(saptapadiPositions[0]);
  const activeRingMesh = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.18, 0.022, 12, 32)),
    flameMat
  );
  activeRingMesh.rotation.x = Math.PI / 2;
  activeRingMesh.position.y = 0.03;
  saptapadiLotusRing.add(activeRingMesh);
  root.add(saptapadiLotusRing);

  // =========================================================================
  // 5. ANIMATED SILK ANTARPAT + AKSHATA PETAL SHOWER
  // =========================================================================
  const antarpatGroup = new THREE.Group();
  antarpatGroup.position.set(0, 0.02, 0.42);
  root.add(antarpatGroup);

  const poleGeo = trackGeo(new THREE.CylinderGeometry(0.028, 0.034, 1.9, 12));
  [-1.08, 1.08].forEach((xPole) => {
    const pole = new THREE.Mesh(poleGeo, brassMat);
    pole.position.set(xPole, 0.95, 0);
    pole.castShadow = true;
    antarpatGroup.add(pole);

    const knob = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.055, 12, 10)), antiqueGoldMat);
    knob.position.set(xPole, 1.94, 0);
    antarpatGroup.add(knob);
  });

  const antarpatGeo = trackGeo(new THREE.PlaneGeometry(2.06, 1.24, 20, 12));
  const antarpatMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      map: antarpatTex,
      roughness: 0.6,
      metalness: 0.14,
      sheen: 0.9,
      sheenColor: new THREE.Color(0xf6cf74),
      side: THREE.DoubleSide,
    })
  );
  const antarpatBaseY = 1.26;
  const antarpatClothMesh = new THREE.Mesh(antarpatGeo, antarpatMat);
  antarpatClothMesh.position.set(0, antarpatBaseY, 0);
  antarpatClothMesh.castShadow = true;
  antarpatGroup.add(antarpatClothMesh);
  registerClickable(antarpatClothMesh, 'antarpat-toggle', 'Toggle Antarpat & Shower Akshata');

  // Akshata (Sacred Turmeric Rice & Rose Petals InstancedMesh)
  const akshataCount = 200;
  const akshataGeo = trackGeo(new THREE.BoxGeometry(0.038, 0.014, 0.056));
  const akshataMat = trackMat(
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.68, metalness: 0.05 })
  );
  const akshataMesh = new THREE.InstancedMesh(akshataGeo, akshataMat, akshataCount);
  akshataMesh.frustumCulled = false;
  const akshataParticles: AkshataParticle[] = [];
  for (let i = 0; i < akshataCount; i++) {
    akshataParticles.push({
      x: 0,
      y: -10,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      scale: 0,
      active: false,
    });
    _dummy.position.set(0, -10, 0);
    _dummy.scale.setScalar(0);
    _dummy.updateMatrix();
    akshataMesh.setMatrixAt(i, _dummy.matrix);
    _color.setHex(i % 3 === 0 ? 0xf59e0b : i % 3 === 1 ? 0xdc2626 : 0xfef08a);
    akshataMesh.setColorAt(i, _color);
  }
  akshataMesh.instanceMatrix.needsUpdate = true;
  if (akshataMesh.instanceColor) akshataMesh.instanceColor.needsUpdate = true;
  root.add(akshataMesh);

  // =========================================================================
  // 6. FOREGROUND HALDI POOJA THALI (Left-Front Courtyard Corner)
  // =========================================================================
  const thaliStation = new THREE.Group();
  thaliStation.position.set(-1.35, 0.02, 1.55);
  thaliStation.scale.setScalar(0.68);
  root.add(thaliStation);

  const chowkiTop = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.48, 1.54, 0.12, 32)),
    rosewoodMat
  );
  chowkiTop.position.y = 0.06;
  chowkiTop.castShadow = true;
  chowkiTop.receiveShadow = true;
  thaliStation.add(chowkiTop);

  const thaliGroup = new THREE.Group();
  thaliGroup.position.set(0, 0.13, 0);
  thaliStation.add(thaliGroup);

  const plateProfile = [
    new THREE.Vector2(0, 0.02),
    new THREE.Vector2(1.12, 0.02),
    new THREE.Vector2(1.24, 0.08),
    new THREE.Vector2(1.32, 0.13),
    new THREE.Vector2(1.36, 0.11),
    new THREE.Vector2(1.25, 0.05),
    new THREE.Vector2(1.12, 0),
    new THREE.Vector2(0, 0),
  ];
  const plateMesh = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(plateProfile, 40)), brassMat);
  plateMesh.castShadow = true;
  thaliGroup.add(plateMesh);

  const katoriProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.18, 0),
    new THREE.Vector2(0.24, 0.12),
    new THREE.Vector2(0.26, 0.16),
    new THREE.Vector2(0.23, 0.16),
    new THREE.Vector2(0.19, 0.04),
    new THREE.Vector2(0, 0.03),
  ];
  const katoriGeo = trackGeo(new THREE.LatheGeometry(katoriProfile, 24));
  const moundGeo = trackGeo(new THREE.ConeGeometry(0.19, 0.14, 20));

  const haldiBowl = new THREE.Group();
  haldiBowl.position.set(-0.56, 0.025, 0.34);
  haldiBowl.add(new THREE.Mesh(katoriGeo, brassMat));
  const hm = new THREE.Mesh(moundGeo, haldiMat);
  hm.position.y = 0.12;
  haldiBowl.add(hm);
  thaliGroup.add(haldiBowl);
  registerClickable(haldiBowl, 'haldi-kumkum', 'Bless with Haldi (Turmeric)');

  const kumkumBowl = new THREE.Group();
  kumkumBowl.position.set(0.56, 0.025, 0.34);
  kumkumBowl.add(new THREE.Mesh(katoriGeo, brassMat));
  const km = new THREE.Mesh(moundGeo, kumkumMat);
  km.position.y = 0.12;
  kumkumBowl.add(km);
  thaliGroup.add(kumkumBowl);
  registerClickable(kumkumBowl, 'haldi-kumkum', 'Bless with Kumkum (Vermilion)');

  // Mangal Kalash on Thali
  const kalashGroup = new THREE.Group();
  kalashGroup.position.set(0, 0.025, -0.44);
  const kalashProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.28, 0.12),
    new THREE.Vector2(0.32, 0.28),
    new THREE.Vector2(0.17, 0.44),
    new THREE.Vector2(0.24, 0.52),
    new THREE.Vector2(0.22, 0.54),
    new THREE.Vector2(0.15, 0.46),
  ];
  kalashGroup.add(new THREE.Mesh(trackGeo(new THREE.LatheGeometry(kalashProfile, 28)), antiqueGoldMat));

  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.09, 0.16, 0, 0.34);
  leafShape.quadraticCurveTo(-0.09, 0.16, 0, 0);
  const leafGeo = trackGeo(
    new THREE.ExtrudeGeometry(leafShape, { depth: 0.01, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004 })
  );
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(Math.cos(a) * 0.12, 0.48, Math.sin(a) * 0.12);
    leaf.rotation.y = -a + Math.PI / 2;
    leaf.rotation.x = 0.45;
    kalashGroup.add(leaf);
  }
  const coconut = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.16, 16, 14)), coconutMat);
  coconut.scale.set(0.95, 1.25, 0.95);
  coconut.position.y = 0.62;
  kalashGroup.add(coconut);
  thaliGroup.add(kalashGroup);

  // Thali Brass Diya
  const thaliDiya = new THREE.Group();
  thaliDiya.position.set(0, 0.025, 0.56);
  thaliDiya.add(
    new THREE.Mesh(
      trackGeo(
        new THREE.LatheGeometry(
          [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(0.14, 0),
            new THREE.Vector2(0.24, 0.09),
            new THREE.Vector2(0.22, 0.11),
            new THREE.Vector2(0.14, 0.04),
            new THREE.Vector2(0, 0.03),
          ],
          20
        )
      ),
      brassMat
    )
  );
  const thaliDiyaFlame = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(0.05, 0.17, 12)), flameMat);
  thaliDiyaFlame.position.set(0, 0.16, 0.08);
  thaliDiya.add(thaliDiyaFlame);
  const thaliDiyaLight = new THREE.PointLight(0xffa438, 1.8, 4.5, 1.8);
  thaliDiyaLight.position.set(0, 0.28, 0.08);
  thaliDiya.add(thaliDiyaLight);
  thaliGroup.add(thaliDiya);
  registerClickable(thaliDiya, 'thali-diya', 'Toggle Brass Diya');

  // Thali Pooja Ghanti (Hand Bell)
  const thaliBellPivot = new THREE.Group();
  thaliBellPivot.position.set(-0.62, 0.03, -0.34);
  const bellMesh = new THREE.Mesh(
    trackGeo(
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.2, 0),
          new THREE.Vector2(0.16, 0.04),
          new THREE.Vector2(0.11, 0.22),
          new THREE.Vector2(0.05, 0.34),
          new THREE.Vector2(0.03, 0.54),
          new THREE.Vector2(0.055, 0.59),
          new THREE.Vector2(0, 0.62),
        ],
        20
      )
    ),
    brassMat
  );
  thaliBellPivot.add(bellMesh);
  thaliGroup.add(thaliBellPivot);
  registerClickable(thaliBellPivot, 'ring-bell', 'Ring Pooja Ghanti');

  // =========================================================================
  // 7. RIGHT-FRONT 5-WICK PEACOCK SAMAI & VARMALA + MUNDAVALYA CUSHION
  // =========================================================================
  const samaiStation = new THREE.Group();
  samaiStation.position.set(1.52, 0.02, 1.48);
  samaiStation.scale.setScalar(0.74);
  root.add(samaiStation);

  const samaiProfile = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.58, 0),
    new THREE.Vector2(0.62, 0.06),
    new THREE.Vector2(0.42, 0.12),
    new THREE.Vector2(0.24, 0.28),
    new THREE.Vector2(0.11, 0.44),
    new THREE.Vector2(0.14, 0.54),
    new THREE.Vector2(0.09, 0.78),
    new THREE.Vector2(0.13, 0.96),
    new THREE.Vector2(0.085, 1.25),
    new THREE.Vector2(0.16, 1.46),
    new THREE.Vector2(0.56, 1.62),
    new THREE.Vector2(0.6, 1.68),
    new THREE.Vector2(0.5, 1.66),
    new THREE.Vector2(0.15, 1.54),
    new THREE.Vector2(0.12, 1.82),
    new THREE.Vector2(0.07, 1.98),
    new THREE.Vector2(0.11, 2.08),
    new THREE.Vector2(0.02, 2.15),
  ];
  const samaiBody = new THREE.Mesh(trackGeo(new THREE.LatheGeometry(samaiProfile, 32)), brassMat);
  samaiBody.castShadow = true;
  samaiStation.add(samaiBody);

  const peacockShape = new THREE.Shape();
  peacockShape.moveTo(-0.08, 0);
  peacockShape.quadraticCurveTo(-0.18, 0.18, -0.1, 0.34);
  peacockShape.quadraticCurveTo(-0.04, 0.44, 0.04, 0.42);
  peacockShape.quadraticCurveTo(0.12, 0.4, 0.08, 0.32);
  peacockShape.quadraticCurveTo(0.02, 0.28, 0.12, 0.2);
  peacockShape.quadraticCurveTo(0.26, 0.28, 0.24, 0.45);
  peacockShape.quadraticCurveTo(0.14, 0.16, 0.06, 0);
  peacockShape.closePath();
  const peacockGeo = trackGeo(
    new THREE.ExtrudeGeometry(peacockShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    })
  );
  peacockGeo.center();
  const peacockMesh = new THREE.Mesh(peacockGeo, antiqueGoldMat);
  peacockMesh.position.set(0, 2.34, 0);
  samaiStation.add(peacockMesh);

  const samaiFlames: THREE.Mesh[] = [];
  const samaiHalos: THREE.Mesh[] = [];
  const samaiWicksLit = [true, true, true, true, true];
  const wickBaseGeo = trackGeo(new THREE.CylinderGeometry(0.02, 0.025, 0.09, 8));
  const flameConeGeo = trackGeo(new THREE.ConeGeometry(0.044, 0.18, 12));
  const haloSphereGeo = trackGeo(new THREE.SphereGeometry(0.11, 12, 10));
  const cottonMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf4eee1, roughness: 0.95 }));

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const wx = Math.cos(angle) * 0.52;
    const wz = Math.sin(angle) * 0.52;

    const wickHolder = new THREE.Group();
    wickHolder.position.set(wx, 1.66, wz);

    const wick = new THREE.Mesh(wickBaseGeo, cottonMat);
    wick.position.y = 0.03;
    wickHolder.add(wick);

    const flame = new THREE.Mesh(flameConeGeo, flameMat);
    flame.position.y = 0.14;
    wickHolder.add(flame);
    samaiFlames.push(flame);

    const halo = new THREE.Mesh(haloSphereGeo, haloMat);
    halo.position.y = 0.14;
    wickHolder.add(halo);
    samaiHalos.push(halo);

    const hitProxy = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.18, 8, 8)),
      trackMat(new THREE.MeshBasicMaterial({ visible: false }))
    );
    hitProxy.position.y = 0.12;
    wickHolder.add(hitProxy);

    registerClickable(wickHolder, `samai-wick-${i}`, `Toggle Samai Wick #${i + 1}`);
    samaiStation.add(wickHolder);
  }

  const samaiLight = new THREE.PointLight(0xffa940, 2.4, 6.5, 1.6);
  samaiLight.position.set(0, 1.95, 0);
  samaiStation.add(samaiLight);

  // Varmala Cushion & Garlands beside Samai
  const varmalaStation = new THREE.Group();
  varmalaStation.position.set(0.25, 0.02, 1.72);
  varmalaStation.scale.setScalar(0.62);
  root.add(varmalaStation);

  const cushion = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(1.05, 1.12, 0.18, 28)),
    crimsonSilkMat
  );
  cushion.position.y = 0.09;
  cushion.castShadow = true;
  varmalaStation.add(cushion);

  const buildGarland = (tintAccent: number): THREE.Group => {
    const gGroup = new THREE.Group();
    const curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0.88, 0),
        new THREE.Vector3(0.38, 0.52, 0.06),
        new THREE.Vector3(0.28, 0.04, 0.12),
        new THREE.Vector3(0, -0.18, 0.14),
        new THREE.Vector3(-0.28, 0.04, 0.12),
        new THREE.Vector3(-0.38, 0.52, 0.06),
      ],
      true
    );
    gGroup.add(new THREE.Mesh(trackGeo(new THREE.TubeGeometry(curve, 48, 0.034, 8, true)), antiqueGoldMat));

    const blossomCount = 44;
    const inst = new THREE.InstancedMesh(floretGeo, floretMat, blossomCount);
    for (let i = 0; i < blossomCount; i++) {
      const pt = curve.getPoint(i / blossomCount);
      _dummy.position.copy(pt);
      _dummy.scale.setScalar(i % 4 === 0 ? 1.12 : 0.9);
      _dummy.updateMatrix();
      inst.setMatrixAt(i, _dummy.matrix);
      _color.setHex(i % 6 === 0 ? tintAccent : i % 2 === 0 ? 0xf59e0b : 0xfaf7f0);
      inst.setColorAt(i, _color);
    }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    inst.computeBoundingSphere();
    gGroup.add(inst);
    return gGroup;
  };

  const leftGarland = buildGarland(0x9e1922);
  leftGarland.position.set(-0.56, 0.48, 0.04);
  varmalaStation.add(leftGarland);
  registerClickable(leftGarland, 'varmala-toggle', 'Exchange Varmala Garlands');

  const rightGarland = buildGarland(0xdc2626);
  rightGarland.position.set(0.56, 0.48, 0.1);
  varmalaStation.add(rightGarland);
  registerClickable(rightGarland, 'varmala-toggle', 'Exchange Varmala Garlands');

  // Pearl Mundavalya Arc hovering gently over Varmala
  const pearlArc = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.62, 0.02, 8, 32, Math.PI)),
    antiqueGoldMat
  );
  pearlArc.position.set(0, 1.38, -0.15);
  pearlArc.rotation.z = Math.PI;
  varmalaStation.add(pearlArc);

  const pPearlGeo = trackGeo(new THREE.SphereGeometry(0.03, 10, 8));
  const rDropGeo = trackGeo(new THREE.ConeGeometry(0.028, 0.075, 8));
  for (let i = -3; i <= 3; i++) {
    const mx = (i / 3) * 0.56;
    const my = 1.38 - Math.sqrt(Math.max(0, 0.62 * 0.62 - mx * mx));
    const p = new THREE.Mesh(pPearlGeo, pearlMat);
    p.position.set(mx, my - 0.05, -0.15);
    varmalaStation.add(p);
    const rDrop = new THREE.Mesh(rDropGeo, rubyMat);
    rDrop.rotation.x = Math.PI;
    rDrop.position.set(mx, my - 0.12, -0.15);
    varmalaStation.add(rDrop);
  }

  return {
    root,
    clickableTargets,
    antarpatGroup,
    antarpatClothMesh,
    antarpatBaseY,
    akshataMesh,
    akshataParticles,
    havanFlames,
    havanLight,
    emberMesh,
    embers,
    saptapadiPositions,
    saptapadiLotusRing,
    mandapDiyaFlames,
    thaliGroup,
    thaliDiyaFlame,
    thaliDiyaLight,
    thaliBellPivot,
    samaiFlames,
    samaiHalos,
    samaiLight,
    samaiWicksLit,
    leftGarland,
    rightGarland,
    disposables: { geometries, materials, textures },
  };
}

export function triggerAkshataBurst(particles: AkshataParticle[]): void {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.active = true;
    p.x = (Math.random() - 0.5) * 3.0;
    p.y = 2.8 + Math.random() * 1.2;
    p.z = (Math.random() - 0.5) * 2.4;
    p.vx = (Math.random() - 0.5) * 0.5;
    p.vy = -(0.55 + Math.random() * 0.78);
    p.vz = (Math.random() - 0.5) * 0.5;
    p.rx = Math.random() * Math.PI;
    p.ry = Math.random() * Math.PI;
    p.rz = Math.random() * Math.PI;
    p.scale = 0.75 + Math.random() * 0.68;
  }
}

export function stepAkshataParticles(
  mesh: THREE.InstancedMesh,
  particles: AkshataParticle[],
  dt: number
): boolean {
  let anyActive = false;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (!p.active) continue;
    anyActive = true;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    p.rx += dt * 3.2;
    p.ry += dt * 2.4;
    if (p.y <= 0.04) {
      p.y = 0.04;
      p.vy = 0;
      p.vx = 0;
      p.vz = 0;
      p.scale *= Math.max(0, 1 - dt * 0.65);
      if (p.scale < 0.05) {
        p.active = false;
        p.scale = 0;
      }
    }
    _dummy.position.set(p.x, p.y, p.z);
    _dummy.rotation.set(p.rx, p.ry, p.rz);
    _dummy.scale.setScalar(p.scale);
    _dummy.updateMatrix();
    mesh.setMatrixAt(i, _dummy.matrix);
  }
  if (anyActive) {
    mesh.instanceMatrix.needsUpdate = true;
  }
  return anyActive;
}

export function stepEmberParticles(
  mesh: THREE.InstancedMesh,
  embers: EmberParticle[],
  elapsed: number,
  dt: number
): void {
  for (let i = 0; i < embers.length; i++) {
    const e = embers[i];
    e.y += e.speed * dt;
    if (e.y > 1.65) {
      e.y = 0.34;
    }
    const swirlX = e.x + Math.cos(elapsed * 2.4 + e.phase) * e.radius;
    const swirlZ = e.z + Math.sin(elapsed * 2.4 + e.phase) * e.radius;
    const fade = Math.max(0.1, 1 - (e.y - 0.34) / 1.35);
    _dummy.position.set(swirlX, e.y, swirlZ);
    _dummy.scale.setScalar(fade * 0.9);
    _dummy.updateMatrix();
    mesh.setMatrixAt(i, _dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}
