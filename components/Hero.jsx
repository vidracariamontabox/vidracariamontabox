"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
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

/* ──────────────────────────────────────────────────────────────
   CursorLight: PointLight que segue o cursor em coordenadas de mundo
   Valores extraídos do Spline: cor #c3ff00, intensidade 5.72
   ────────────────────────────────────────────────────────────── */
function CursorLight({ cursorWorldPos }) {
  const lightRef = useRef();

  useFrame(() => {
    if (!lightRef.current || !cursorWorldPos) return;
    const active = cursorWorldPos.active;
    // Interpola suavemente para a posição do cursor
    lightRef.current.position.x = cursorWorldPos.x;
    lightRef.current.position.y = cursorWorldPos.y;
    lightRef.current.position.z = 8;
    // Intensidade aparece/desaparece com o cursor
    lightRef.current.intensity = active * 5.72;
  });

  return (
    <pointLight
      ref={lightRef}
      color="#c3ff00"
      intensity={0}
      distance={28}
      decay={2}
      position={[0, 0, 8]}
    />
  );
}

function CubeGrid({ cursorWorldPos }) {
  const { viewport } = useThree();
  const cubesRef = useRef([]);
  const animatedCubesRef = useRef([]);

  const roughness3 = useLoader(
    THREE.TextureLoader,
    "/images/matcap_roughness_3.jpg"
  );

  const cols = Math.ceil(viewport.width / STEP) + 6;
  const rows = Math.ceil(viewport.height / STEP) + 6;

  const { geometries, material } = useMemo(() => {
    if (typeof window === "undefined") return { geometries: null, material: null };

    const boxGeo = new RoundedBoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE, 4, 0.04);
    boxGeo.computeVertexNormals();

    roughness3.colorSpace = THREE.SRGBColorSpace;

    return {
      geometries: { box: boxGeo },
      material: new THREE.MeshMatcapMaterial({
        matcap: roughness3,
        color: new THREE.Color("#888888"),
      }),
    };
  }, [roughness3]);

  /* ── Dados dos cubos: posição, rotação, brilho, material individual ── */
  const cubeData = useMemo(() => {
    if (!material) return [];
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
        const z = -0.9 + rng() * 1.8;
        const rotX = (rng() - 0.5) * 0.035;
        const rotY = (rng() - 0.5) * 0.035;
        const scale = 0.96 + rng() * 0.08;

        const mat = material;

        data.push({
          x: baseX + dX, y: baseY + dY, z,
          rotX, rotY, rotZ: 0, scale,
          mat,
        });

      }
    }
    return data;
  }, [cols, rows, material]);

  /* ── Animação de flutuação ── */
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

  /* ── Frame loop: animação + reação ao cursor ── */
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Animação de flutuação
    animatedCubesRef.current.forEach((child) => {
      if (!child) return;
      const { axis, phase, speed, amplitude } = child.userData;
      const delta = Math.sin(t * speed + phase) * amplitude;
      if (axis === "x") child.position.x = child.userData.originX + delta;
      else if (axis === "y") child.position.y = child.userData.originY + delta;
      else child.position.z = child.userData.originZ + delta;
    });

    // Reação ao cursor: cubos próximos sobem levemente em Z
    if (cursorWorldPos && cursorWorldPos.active > 0.05) {
      const cx = cursorWorldPos.x;
      const cy = cursorWorldPos.y;
      const active = cursorWorldPos.active;
      const RADIUS = 4.5; // raio de influência em unidades de mundo

      cubesRef.current.forEach((child) => {
        if (!child) return;
        const dx = child.userData.originX - cx;
        const dy = child.userData.originY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const lift = (1 - dist / RADIUS) * 1.8 * active;
          child.position.z = child.userData.originZ + lift;
        }
      });
    }
  });

  if (!geometries || cubeData.length === 0) return null;

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
        </group>
      ))}
    </group>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

/* ─────────────────────────────────────────────
   CursorTracker: converte posição do mouse em
   coordenadas de mundo e expõe via ref mutável
   ───────────────────────────────────────────── */
function CursorTracker({ mousePos, cursorWorldPos }) {
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mousePos.x === -999) return;
    const zoomLevel = 50;
    targetRef.current = {
      x: mousePos.x / zoomLevel - window.innerWidth / 2 / zoomLevel,
      y: -(mousePos.y / zoomLevel - window.innerHeight / 2 / zoomLevel),
    };
  }, [mousePos]);

  useFrame(() => {
    if (!cursorWorldPos) return;

    if (mousePos.x === -999) {
      cursorWorldPos.active += (0 - cursorWorldPos.active) * 0.08;
      return;
    }

    cursorWorldPos.active += (1 - cursorWorldPos.active) * 0.08;
    cursorWorldPos.x += (targetRef.current.x - cursorWorldPos.x) * 0.08;
    cursorWorldPos.y += (targetRef.current.y - cursorWorldPos.y) * 0.08;
  });

  return null;
}

export default function Hero() {
  const [mouse, setMouse] = useState({ x: -999, y: -999 });
  const [isHeroActive, setIsHeroActive] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef(null);

  // Objeto mutável compartilhado entre CursorTracker e CubeGrid
  const cursorWorldPos = useMemo(() => ({ x: 0, y: 0, active: 0 }), []);

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
        setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => {
        setMouse({ x: -999, y: -999 });
      }}
      className="relative w-full overflow-hidden bg-[#080808] h-dvh min-h-dvh max-h-dvh">
      <Canvas
        orthographic
        frameloop={isHeroActive && !prefersReducedMotion ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 100], zoom: 80, near: 0.1, far: 500 }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
        <Suspense fallback={null}>
          {/* Iluminação do cenário extraída fielmente do Spline */}
          <ambientLight intensity={0.45} color="#222830" />
          <directionalLight
            position={[-10, 14, 16]}
            intensity={3.95}
            color="#ffffff"
            castShadow={false}
          />
          <CursorLight cursorWorldPos={cursorWorldPos} />
          <CameraRig />
          <CursorTracker mousePos={mouse} cursorWorldPos={cursorWorldPos} />
          <GlowCursor mousePos={mouse} />
          <CubeGrid cursorWorldPos={cursorWorldPos} />
        </Suspense>
      </Canvas>

      {/* Vinheta suave e elegante para profundidade, sem sufocar a geometria 3D */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        aria-hidden="true"
        style={{
          background: `radial-gradient(
            circle at 50% 50%,
            rgba(0, 0, 0, 0) 60%,
            rgba(0, 0, 0, 0.45) 100%
          )`,
        }}
      />

      {/* ── Vinheta azulada nos cantos (cor/glow, sem blur) ── 
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 45% 45% at 0% 0%, rgba(40,80,180,0.22) 0%, transparent 100%)",
            "radial-gradient(ellipse 45% 45% at 100% 0%, rgba(40,80,180,0.18) 0%, transparent 100%)",
            "radial-gradient(ellipse 35% 35% at 0% 100%, rgba(30,60,140,0.10) 0%, transparent 100%)",
            "radial-gradient(ellipse 35% 35% at 100% 100%, rgba(30,60,140,0.08) 0%, transparent 100%)",
          ].join(", "),
        }}
      />*/}

      {/* Passo 4: Overlays SVG de linhas arquitetônicas removidos.
          O Spline original NÃO usa esses elementos — toda a estética
          vem do material 3D, iluminação e chanfros. */}

      <div className="absolute top-1/2 left-4 right-auto -translate-y-1/2 z-10 pointer-events-none flex flex-col items-start text-left gap-6 sm:left-[clamp(1.5rem,3vw,3rem)] sm:gap-[2.75rem] w-[calc(100%-2rem)] sm:w-auto max-w-[min(42rem,90vw)]">
        <h1
          className="font-ivy-presto text-[clamp(3.3rem,12vw,4.8rem)] sm:text-[clamp(3rem,4.7vw+1.4rem,6.4rem)] font-bold tracking-[0.01em] sm:tracking-[0.03em] text-[#eaeaea] leading-[0.92] sm:leading-[0.95] m-0 max-w-[13ch] sm:max-w-none"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.90), 0 1px 3px rgba(0,0,0,0.95)" }}>
          Seu projeto é nosso projeto
        </h1>
        <p
          className="font-ivy-presto text-[clamp(0.95rem,3.8vw,1.1rem)] sm:text-[clamp(1.05rem,1.5vw+0.4rem,1.1rem)] font-bold tracking-[0.06em] sm:tracking-[0.08em] leading-[1.35] text-[#d0cbc5] m-0 max-w-[24rem] sm:max-w-[30rem]"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.85)" }}>
          Criamos como se fosse para nossa casa !
        </p>

        <a
          href="https://wa.me/5516981984000"
          target="_blank"
          rel="noreferrer"
          className="font-neuehaas inline-flex items-center w-fit px-[1.15rem] py-[0.6rem] rounded-tr-[99px] rounded-bl-[99px] rounded-br-[99px] bg-[#f5f5f5] text-[#000000] font-extralight text-[0.65rem] tracking-[0.16em] uppercase no-underline mt-[0.35rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_12px_rgba(0,0,0,0.4)] pointer-events-auto">
          <span>Solicite seu orçamento →</span>
        </a>
      </div>

      <div
        className="absolute bottom-[clamp(3.3rem,16.5vh,7.6rem)] left-4 sm:bottom-[clamp(3rem,8vh,6rem)] sm:left-[clamp(1.5rem,3vw,3rem)] z-10 pointer-events-none flex items-center gap-2 sm:gap-3 font-neuehaas text-[0.63rem] sm:text-[0.55rem] tracking-[0.16em] sm:tracking-[0.24em] text-[#b0b0b0] uppercase w-max max-w-[90vw] whitespace-nowrap"
        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
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
