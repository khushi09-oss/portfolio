import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export function mountMachine(
  host: HTMLElement,
  night: boolean,
  readStage: () => number,
) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = night ? 1.15 : 1.18;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-5.5, 5.5, 3.8, -3.8, 0.1, 80);
  camera.position.set(9, 6.7, 11);
  camera.lookAt(0, 1.1, 0);

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(environment, 0.04);
  scene.environment = target.texture;
  environment.dispose();
  pmrem.dispose();

  const metal = new THREE.MeshStandardMaterial({
    color: night ? "#9a9fa3" : "#b5b8b9",
    metalness: 0.87,
    roughness: 0.27,
  });
  const edge = new THREE.MeshStandardMaterial({
    color: "#dee0df",
    metalness: 0.82,
    roughness: 0.2,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: "#353b3c",
    metalness: 0.6,
    roughness: 0.4,
  });
  const rose = new THREE.MeshStandardMaterial({
    color: "#b16d7e",
    metalness: 0.5,
    roughness: 0.25,
    emissive: "#8d384e",
    emissiveIntensity: night ? 0.7 : 0.15,
  });
  const paper = new THREE.MeshStandardMaterial({
    color: "#fffaf1",
    roughness: 0.9,
    side: THREE.DoubleSide,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: night ? "#647e86" : "#e3eeeb",
    transparent: true,
    opacity: night ? 0.05 : 0.19,
    metalness: 0.12,
    roughness: 0.12,
    depthWrite: false,
  });
  const model = new THREE.Group();
  scene.add(model);
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    radius = 0.06,
  ) {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 3, Math.min(radius, w / 4, h / 4, d / 4)),
      material,
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = material !== glass;
    mesh.receiveShadow = true;
    model.add(mesh);
    return mesh;
  }
  function cylinder(
    radius: number,
    length: number,
    x: number,
    y: number,
    z: number,
    material: THREE.Material,
    axis: "x" | "y" | "z" = "z",
  ) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, length, 32),
      material,
    );
    if (axis === "z") mesh.rotation.x = Math.PI / 2;
    if (axis === "x") mesh.rotation.z = Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    model.add(mesh);
    return mesh;
  }
  box(9.7, 0.35, 3.1, 0, 0.2, 0, metal, 0.15);
  box(9.5, 0.07, 2.95, 0, 0.41, 0, edge);
  for (const x of [-3.8, 3.8])
    for (const z of [-1.05, 1.05]) cylinder(0.25, 0.2, x, -0.04, z, dark, "y");
  const rollers: THREE.Mesh[] = [];
  const gearWheels: THREE.Group[] = [];
  for (const x of [-2.8, 0, 2.8]) {
    box(1.65, 0.13, 2.4, x, 0.6, 0, dark);
    for (const z of [-1.1, 1.1]) {
      box(0.16, 2.25, 0.16, x - 0.62, 1.62, z, metal);
      box(0.16, 2.25, 0.16, x + 0.62, 1.62, z, metal);
      box(1.52, 0.16, 0.2, x, 2.72, z, edge);
      for (const dx of [-0.62, 0.62])
        for (const y of [0.7, 2.7]) {
          cylinder(0.068, 0.07, x + dx, y, z + (z > 0 ? 0.12 : -0.12), dark);
          box(
            0.07,
            0.012,
            0.01,
            x + dx,
            y,
            z + (z > 0 ? 0.16 : -0.16),
            edge,
            0,
          );
        }
    }
    box(1.3, 1.85, 0.045, x, 1.65, -1.08, glass);
    box(1.3, 0.04, 2.1, x, 2.67, 0, glass);
    rollers.push(
      cylinder(0.29, 2, x, 1.08, 0, metal),
      cylinder(0.29, 2, x, 1.69, 0, edge),
    );
    for (const z of [-1.18, 1.18]) {
      const wheel = new THREE.Group();
      wheel.position.set(x, 1.08, z);
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.43, 0.08, 10, 40),
        metal,
      );
      wheel.add(ring);
      for (let tooth = 0; tooth < 12; tooth++) {
        const angle = (tooth / 12) * Math.PI * 2;
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.16, 0.14),
          edge,
        );
        mesh.position.set(Math.cos(angle) * 0.46, Math.sin(angle) * 0.46, 0);
        mesh.rotation.z = angle;
        wheel.add(mesh);
      }
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.19, 24),
        dark,
      );
      hub.rotation.x = Math.PI / 2;
      wheel.add(hub);
      model.add(wheel);
      gearWheels.push(wheel);
    }
    box(0.85, 0.42, 0.1, x, 2.18, 1.18, dark);
    box(0.56, 0.035, 0.04, x, 2.18, 1.25, rose);
  }
  for (const z of [-0.94, 0.94]) cylinder(0.055, 8.7, 0, 1.3, z, edge, "x");
  box(9.05, 0.045, 0.045, 0, 0.55, 1.42, rose);
  // A moving paper fixture illustrates data flow; it is not a live model response.
  const source = new THREE.Group();
  const sheet = new THREE.Mesh(
    new RoundedBoxGeometry(1.1, 0.025, 1.55, 2, 0.01),
    paper,
  );
  sheet.castShadow = true;
  source.add(sheet);
  for (let i = 0; i < 5; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(i === 0 ? 0.55 : 0.76, 0.005, 0.035),
      i === 0 ? rose : dark,
    );
    line.position.set(-0.06, 0.017, -0.45 + i * 0.2);
    source.add(line);
  }
  source.position.set(-3.6, 1.4, 0);
  model.add(source);
  for (let i = 0; i < 4; i++) {
    const card = box(
      0.9,
      0.03,
      1.5,
      -4.08 - i * 0.03,
      1.12 + i * 0.08,
      0,
      paper,
      0.01,
    );
    card.rotation.z = -0.33;
  }
  const lamp = new THREE.PointLight("#d895a7", night ? 12 : 3, 7);
  lamp.position.set(1.2, 2.1, 1.4);
  scene.add(
    lamp,
    new THREE.HemisphereLight("#ffffff", "#9a9890", night ? 1.2 : 2.4),
  );
  const key = new THREE.DirectionalLight("#fff8ec", night ? 3 : 5);
  key.position.set(-3, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7 });
  key.shadow.bias = -0.001;
  scene.add(key);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.ShadowMaterial({
      color: "#1f2424",
      opacity: night ? 0.22 : 0.13,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.16;
  floor.receiveShadow = true;
  scene.add(floor);
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  const visibility = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  });
  visibility.observe(host);
  let dirty = true;
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height);
    const aspect = width / Math.max(1, height);
    camera.left = -5.6;
    camera.right = 5.6;
    camera.top = 5.6 / aspect;
    camera.bottom = -5.6 / aspect;
    camera.updateProjectionMatrix();
    dirty = true;
  });
  resize.observe(host);
  let frame = 0;
  let last = 0;
  let position = -3.6;
  function animate(time: number) {
    frame = requestAnimationFrame(animate);
    if (!visible || document.hidden || time - last < 32) return;
    const delta = Math.min((time - last) / 1000, 0.08);
    last = time;
    const desired = -3.6 + readStage() * 2.4;
    const moving = Math.abs(position - desired) > 0.005;
    if (!dirty && !moving) return;
    position = motion.matches
      ? desired
      : THREE.MathUtils.damp(position, desired, 4, delta);
    source.position.x = position;
    if (!motion.matches && moving) {
      for (const roller of rollers) roller.rotation.y += delta * 0.18;
      for (const gear of gearWheels) gear.rotation.z -= delta * 0.18;
    }
    renderer.render(scene, camera);
    dirty = false;
  }
  frame = requestAnimationFrame(animate);
  return () => {
    cancelAnimationFrame(frame);
    visibility.disconnect();
    resize.disconnect();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((m) => m.dispose());
      }
    });
    target.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
