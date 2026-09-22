"use client";

import {useEffect, useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import * as THREE from "three";

function createGlowTexture() {
  if (typeof document === "undefined") return null;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0, 255, 60, 1.0)");
  gradient.addColorStop(0.2, "rgba(0, 200, 40, 0)");
  gradient.addColorStop(0.5, "rgba(0, 120, 20, 0)");
  gradient.addColorStop(1, "rgba(0, 50, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

export default function GlowCursor({mousePos}) {
  const {camera} = useThree();
  const meshRef = useRef(null);
  const targetRef = useRef({x: 0, y: 0});
  const [glowTexture, setGlowTexture] = useState(null);

  useEffect(() => {
    setGlowTexture(createGlowTexture());
  }, []);

  useEffect(() => {
    if (mousePos.x === -999) return;
    const zoomLevel = camera.zoom;
    targetRef.current = {
      x: mousePos.x / zoomLevel - window.innerWidth / 2 / zoomLevel,
      y: -(mousePos.y / zoomLevel - window.innerHeight / 2 / zoomLevel),
    };
  }, [camera.zoom, mousePos]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (mousePos.x === -999) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;

    mesh.position.x += (targetRef.current.x - mesh.position.x) * 0.08;
    mesh.position.y += (targetRef.current.y - mesh.position.y) * 0.08;
    mesh.position.z = -5;
  });

  if (!glowTexture) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} visible={false}>
      <planeGeometry args={[28, 28]} />
      <meshBasicMaterial map={glowTexture} transparent opacity={1} depthWrite={false} fog={false} />
    </mesh>
  );
}
