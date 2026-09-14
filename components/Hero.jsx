"use client";

import {Suspense, useEffect, useMemo, useRef, useState} from "react";
import {Canvas, useFrame, useThree, useLoader} from "@react-three/fiber";
import * as THREE from "three";
import GlowCursor from "@/components/GlowCursor";

const CUBE_SIZE = 1.0;
const GAP = 0.05;
const STEP = CUBE_SIZE + GAP;
const XY_OFFSET_MAX = STEP * 0.025;
const SEED = 7331;

function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function CubeGrid() {
  const {viewport} = useThree();
  const cubesRef = useRef([]);
  const animatedCubesRef = useRef([]);
  const matcapTexture = useLoader(THREE.TextureLoader, "/images/matcap-steel.png");

  const cols = Math.ceil(viewport.width / STEP) + 6;
  const rows = Math.ceil(viewport.height / STEP) + 6;

  const {geometries, materials} = useMemo(() => {
    if (typeof window === "undefined") return {geometries: null, materials: null};
    if (!matcapTexture) return {geometries: null, materials: null};

    const boxGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);

    const matHigh = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      color: "#3a3a3a", // cinza médio — volume
    });
    const matMid = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      color: "#161616", // carvão
    });
    const matDark = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
      color: "#080808", // quase preto
    });

    const edgeMatDark = new THREE.LineBasicMaterial({
      color: "#2a2a2a",
      transparent: true,
      opacity: 0.55,
    });
    const edgeMatLight = new THREE.LineBasicMaterial({
      color: "#4a4a4a",
      transparent: true,
      opacity: 0.75,
    });

    return {
      geometries: {box: boxGeo, edge: edgeGeo},
      materials: {high: matHigh, mid: matMid, dark: matDark, edgeDark: edgeMatDark, edgeLight: edgeMatLight},
    };
  }, [matcapTexture]);

  useEffect(() => {
    const cubes = cubesRef.current.filter(Boolean);
    const shuffled = [...cubes].sort(() => Math.random() - 0.5);
    const animCount = Math.floor(shuffled.length * 0.2);
    const animatedCubes = [];

    cubes.forEach((child) => {
      if (!child) return;
      child.userData.originX = child.position.x;
      child.userData.originY = child.position.y;
      child.userData.originZ = child.position.z;
      child.userData.animated = false;
    });

    const axes = ["x", "y", "z"];

    shuffled.slice(0, animCount).forEach((child, i) => {
      child.userData.animated = true;
      child.userData.axis = axes[i % 3];
      child.userData.phase = Math.random() * Math.PI * 2;
      child.userData.speed = 0.3 + Math.random() * 0.4;
      child.userData.amplitude = 0.2 + Math.random() * 0.2;
      animatedCubes.push(child);
    });

    animatedCubesRef.current = animatedCubes;
  }, [cols, rows]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    animatedCubesRef.current.forEach((child) => {
      if (!child) return;
      const {axis, phase, speed, amplitude} = child.userData;
      const delta = Math.sin(t * speed + phase) * amplitude;
      if (axis === "x") child.position.x = child.userData.originX + delta;
      else if (axis === "y") child.position.y = child.userData.originY + delta;
      else child.position.z = child.userData.originZ + delta;
    });
  });

  const cubeData = useMemo(() => {
    if (!materials) return [];
    const rng = makeRng(SEED);
    const offsetX = ((cols - 1) * STEP) / 2;
    const offsetY = ((rows - 1) * STEP) / 2;
    const data = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = col * STEP - offsetX;
        const baseY = row * STEP - offsetY;
        const dX = (rng() - 0.5) * 2 * XY_OFFSET_MAX;
        const dY = (rng() - 0.5) * 2 * XY_OFFSET_MAX;
        const z = -0.8 + rng() * 1.6;
        const rotX = (rng() - 0.5) * 0.04;
        const rotY = (rng() - 0.5) * 0.04;
        const scale = 0.95 + rng() * 0.1;

        const nx = col / (cols - 1);
        const ny = row / (rows - 1);

        // Zonas: superior esquerdo, superior direito, inferior centro
        const topLeft = Math.exp(-((nx - 0.0) ** 2 / 0.04 + (ny - 0.0) ** 2 / 0.05));
        const topRight = Math.exp(-((nx - 1.0) ** 2 / 0.04 + (ny - 0.0) ** 2 / 0.05)) * 0.7;
        const bottomCenter = Math.exp(-((nx - 0.5) ** 2 / 0.04 + (ny - 1.0) ** 2 / 0.05)) * 0.6;

        const influence = Math.min(topLeft + topRight + bottomCenter, 1.0);
        const noise = (rng() - 0.5) * 0.06;
        const brightness = Math.max(0, influence + noise);

        let mat;
        if (brightness > 0.75) mat = materials.high;
        else if (brightness > 0.4) mat = materials.mid;
        else mat = materials.dark;

        const edgeMat = brightness > 0.4 ? materials.edgeLight : materials.edgeDark;
        data.push({x: baseX + dX, y: baseY + dY, z, rotX, rotY, rotZ: 0, scale, mat, edgeMat});
      }
    }
    return data;
  }, [cols, rows, materials]);

  if (!geometries || !materials) return null;

  return (
    <group>
      {cubeData.map((c, i) => (
        <group
          key={i}
          ref={(node) => {
            cubesRef.current[i] = node;
          }}
          position={[c.x, c.y, c.z]}
          rotation={[c.rotX, c.rotY, c.rotZ]}
          scale={c.scale}>
          <mesh geometry={geometries.box} material={c.mat} />
          <lineSegments geometry={geometries.edge} material={c.edgeMat} />
        </group>
      ))}
    </group>
  );
}

function CameraRig() {
  const {camera} = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

function Scene() {
  return <ambientLight intensity={0.35} color="#e8e8e8" />;
}

export default function Hero() {
  const [mouse, setMouse] = useState({x: -999, y: -999});
  const [isHeroActive, setIsHeroActive] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener?.("change", updateMotionPreference);

    if (!section || !("IntersectionObserver" in window)) {
      return () => motionQuery.removeEventListener?.("change", updateMotionPreference);
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsHeroActive(entry.isIntersecting);
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener?.("change", updateMotionPreference);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const next = {x: e.clientX - rect.left, y: e.clientY - rect.top};
        setMouse(next);
      }}
      onMouseLeave={() => {
        const next = {x: -999, y: -999};
        setMouse(next);
      }}
      className="relative w-full overflow-hidden bg-[#080808] h-dvh min-h-dvh max-h-dvh">
      <Canvas
        orthographic
        frameloop={isHeroActive && !prefersReducedMotion ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{alpha: true}}
        camera={{position: [0, 0, 100], zoom: 80, near: 0.1, far: 500}}
        style={{position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1}}>
        <Suspense fallback={null}>
          <CameraRig />
          <Scene />
          <GlowCursor mousePos={mouse} />
          <CubeGrid />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 z-[3] pointer-events-none opacity-70" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none">
          <path d="M0 690H1440" stroke="rgba(190,190,190,0.12)" strokeWidth="1" />
          <path d="M1015 0V900" stroke="rgba(190,190,190,0.09)" strokeWidth="1" />
          <path d="M1015 690H1440V310H1180L1015 145" stroke="rgba(190,190,190,0.16)" strokeWidth="1" />
          <path d="M1180 310V690" stroke="rgba(190,190,190,0.07)" strokeWidth="1" />
          <path d="M120 690V664H180" stroke="rgba(190,190,190,0.22)" strokeWidth="1" />
          <circle cx="1015" cy="690" r="3" fill="rgba(210,210,210,0.55)" />
          <circle cx="1180" cy="310" r="3" fill="rgba(210,210,210,0.45)" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-4 right-auto -translate-y-1/2 z-10 pointer-events-none flex flex-col items-start text-left gap-6 sm:left-[clamp(1.5rem,3vw,3rem)] sm:gap-[2.75rem] w-[calc(100%-2rem)] sm:w-auto max-w-[min(42rem,90vw)]">
        <h1
          className="font-ivy-presto text-[clamp(3.3rem,12vw,4.8rem)] sm:text-[clamp(3rem,4.7vw+1.4rem,6.4rem)] font-bold tracking-[0.01em] sm:tracking-[0.03em] text-[#eaeaea] leading-[0.92] sm:leading-[0.95] m-0 max-w-[13ch] sm:max-w-none"
          style={{textShadow: "0 2px 3px rgba(0,0,0,0.72)"}}>
          Seu projeto é nosso projeto
        </h1>
        <p className="font-ivy-presto text-[clamp(0.95rem,3.8vw,1.1rem)] sm:text-[clamp(1.05rem,1.5vw+0.4rem,1.1rem)] font-bold tracking-[0.06em] sm:tracking-[0.08em] leading-[1.35] text-[#b7b1ab] m-0 max-w-[24rem] sm:max-w-[30rem]">
          Criamos como se fosse para nossa casa !
        </p>

        <a
          href="https://wa.me/5516981984000"
          target="_blank"
          rel="noreferrer"
          className="font-neuehaas inline-flex items-center w-fit px-[1.15rem] py-[0.6rem] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] bg-[#f5f5f5] text-[#000000] font-extralight text-[0.65rem] tracking-[0.16em] uppercase no-underline mt-[0.35rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.15)] pointer-events-auto">
          <span>Solicite seu orçamento →</span>
        </a>
      </div>

      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{background: "radial-gradient(ellipse 55% 60% at 50% 50%, transparent 0%, rgba(8,8,8,0.4) 100%)"}}
      />

      <div className="absolute bottom-[clamp(3.3rem,16.5vh,7.6rem)] left-4 sm:bottom-[clamp(3rem,8vh,6rem)] sm:left-[clamp(1.5rem,3vw,3rem)] z-10 pointer-events-none flex items-center gap-2 sm:gap-3 font-neuehaas text-[0.63rem] sm:text-[0.55rem] tracking-[0.16em] sm:tracking-[0.24em] text-[#8d8d8d] uppercase w-max max-w-[90vw] whitespace-nowrap">
        <span className="h-px w-8 bg-[#8d8d8d]/60" />
        <span>Vidraçaria · Serralheria · Alto padrão</span>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-[clamp(1.5rem,4vh,3rem)] sm:left-auto sm:right-[clamp(1.5rem,3vw,3rem)] sm:translate-x-0 z-10 pointer-events-none flex items-center gap-2 sm:gap-3 font-neuehaas text-[0.48rem] sm:text-[0.55rem] tracking-[0.16em] sm:tracking-[0.24em] text-[#8d8d8d] uppercase max-w-[38vw] justify-end text-right">
        <span>Scroll para explorar</span>
        <span className="h-7 sm:h-10 w-px bg-[#b7b1ab]/60" />
      </div>
    </section>
  );
}
