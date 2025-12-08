/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, Torus, Box, Cylinder, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

const WireframeOrb = ({ position, scale = 1, speed = 1 }: { position: [number, number, number]; scale?: number; speed?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime() * speed;
      ref.current.position.y = position[1] + Math.sin(t + position[0]) * 0.2;
      ref.current.rotation.x = t * 0.1;
      ref.current.rotation.y = t * 0.15;
    }
  });

  return (
    <Icosahedron ref={ref} args={[1, 1]} position={position} scale={scale}>
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.15}
      />
    </Icosahedron>
  );
};

const DataRing = () => {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
       const t = state.clock.getElapsedTime();
       ref.current.rotation.z = t * 0.05;
       ref.current.rotation.y = Math.PI / 4;
    }
  });

  return (
    <Torus ref={ref} args={[3.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#333333" transparent opacity={0.5} />
    </Torus>
  );
}

export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <fog attach="fog" args={['#050505', 5, 15]} />
        <ambientLight intensity={0.2} />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <WireframeOrb position={[0, 0, 0]} scale={1.5} speed={0.5} />
          <DataRing />
        </Float>
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
           <WireframeOrb position={[-3, 1, -2]} scale={0.4} />
           <WireframeOrb position={[3, -1, -3]} scale={0.5} />
           <WireframeOrb position={[2, 2, -4]} scale={0.3} />
        </Float>
        
        <Stars radius={100} depth={50} count={2000} factor={2} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

const Monolith = () => {
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if(boxRef.current) {
        boxRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  })

  return (
    <Box ref={boxRef} args={[1.5, 3, 1.5]} position={[0, 0, 0]}>
        <meshPhysicalMaterial 
            color="#000000" 
            roughness={0} 
            metalness={0.8} 
            clearcoat={1}
            clearcoatRoughness={0}
            reflectivity={1}
        />
        {/* Wireframe Outline */}
        <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(1.5, 3, 1.5)]} />
            <lineBasicMaterial color="#333333" />
        </lineSegments>
    </Box>
  );
}

export const FocusMonolithScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 2, 5], fov: 35 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#444444" />
        
        <Float rotationIntensity={0} floatIntensity={0.2} speed={1}>
          <group position={[0, -0.5, 0]}>
            
            {/* The Monolith - extracted to component to allow useFrame */}
            <Monolith />

             {/* Base Platform Grid */}
             <gridHelper args={[10, 20, 0x333333, 0x111111]} position={[0, -1.8, 0]} />

             {/* Floating Data Particles */}
             {Array.from({ length: 5 }).map((_, i) => (
                 <Float key={i} position={[
                     Math.sin(i) * 2, 
                     Math.cos(i) * 2, 
                     Math.sin(i * 2) * 2
                 ]} speed={2}>
                    <Box args={[0.05, 0.05, 0.05]}>
                        <meshBasicMaterial color="white" />
                    </Box>
                 </Float>
             ))}

          </group>
        </Float>
      </Canvas>
    </div>
  );
}