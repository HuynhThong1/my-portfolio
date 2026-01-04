'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
  size?: number;
}

function FloatingShape({ position, color, speed = 1, distort = 0.3, size = 1 }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={size}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function ParticleField({ isDark }: { isDark: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Use blue tones for dark mode, rose tones for light mode
      if (isDark) {
        colors[i * 3] = 0.2 + Math.random() * 0.3;     // R - low
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3; // G - medium
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B - high (blue)
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2;     // R - high (rose)
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.2; // G - low
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.3; // B - medium
      }
    }

    return [positions, colors];
  }, [isDark]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  const positionsAttribute = useMemo(() => new THREE.BufferAttribute(positions, 3), [positions]);
  const colorsAttribute = useMemo(() => new THREE.BufferAttribute(colors, 3), [colors]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <primitive attach="attributes-position" object={positionsAttribute} />
        <primitive attach="attributes-color" object={colorsAttribute} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene({ isDark }: { isDark: boolean }) {
  // Theme-aware colors
  // Dark mode: Blue (#3B82F6), Cyan (#06B6D4)
  // Light mode: Rose (#F43F5E), Purple (#A855F7)
  const primaryColor = isDark ? '#3B82F6' : '#F43F5E';
  const secondaryColor = isDark ? '#06B6D4' : '#A855F7';
  const accentColor = isDark ? '#1E40AF' : '#BE185D';

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color={primaryColor} />

      {/* Main floating shapes */}
      <FloatingShape position={[3, 1, -2]} color={primaryColor} speed={0.8} size={0.8} distort={0.4} />
      <FloatingShape position={[-3, -1, -3]} color={secondaryColor} speed={1.2} size={0.6} distort={0.3} />
      <FloatingShape position={[0, 2, -4]} color={secondaryColor} speed={0.6} size={0.5} distort={0.5} />
      <FloatingShape position={[-2, 1.5, -2]} color={accentColor} speed={1} size={0.4} distort={0.3} />
      <FloatingShape position={[2, -1.5, -3]} color={primaryColor} speed={0.9} size={0.3} distort={0.4} />

      {/* Particle field */}
      <ParticleField isDark={isDark} />
    </>
  );
}

export function FloatingShapesBackground() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial dark mode state
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene isDark={isDark} />
      </Canvas>
    </div>
  );
}
