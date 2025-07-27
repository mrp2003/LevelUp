'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HumanBody3DProps {
  selectedMuscleGroup?: string | null;
}

export default function HumanBody3D({ selectedMuscleGroup }: HumanBody3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const bodyRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create simplified human body
    const bodyGroup = new THREE.Group();
    bodyRef.current = bodyGroup;

    // Body parts with different colors for muscle groups
    const bodyParts = {
      // Head
      head: {
        geometry: new THREE.SphereGeometry(0.3, 16, 16),
        position: [0, 1.7, 0],
        color: 0xfdbcb4
      },
      // Torso
      chest: {
        geometry: new THREE.BoxGeometry(0.8, 1.2, 0.4),
        position: [0, 0.6, 0],
        color: 0x22c55e, // Green for chest
        muscleGroup: 'Chest'
      },
      // Back (behind chest)
      back: {
        geometry: new THREE.BoxGeometry(0.8, 1.2, 0.2),
        position: [0, 0.6, -0.3],
        color: 0x3b82f6, // Blue for back
        muscleGroup: 'Back'
      },
      // Arms
      leftUpperArm: {
        geometry: new THREE.CylinderGeometry(0.1, 0.12, 0.6, 8),
        position: [-0.5, 0.8, 0],
        color: 0xef4444, // Red for arms
        muscleGroup: 'Arms'
      },
      rightUpperArm: {
        geometry: new THREE.CylinderGeometry(0.1, 0.12, 0.6, 8),
        position: [0.5, 0.8, 0],
        color: 0xef4444,
        muscleGroup: 'Arms'
      },
      leftForearm: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
        position: [-0.5, 0.1, 0],
        color: 0xef4444,
        muscleGroup: 'Arms'
      },
      rightForearm: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
        position: [0.5, 0.1, 0],
        color: 0xef4444,
        muscleGroup: 'Arms'
      },
      // Shoulders
      leftShoulder: {
        geometry: new THREE.SphereGeometry(0.15, 12, 12),
        position: [-0.45, 1.1, 0],
        color: 0xeab308, // Yellow for shoulders
        muscleGroup: 'Shoulders'
      },
      rightShoulder: {
        geometry: new THREE.SphereGeometry(0.15, 12, 12),
        position: [0.45, 1.1, 0],
        color: 0xeab308,
        muscleGroup: 'Shoulders'
      },
      // Core
      core: {
        geometry: new THREE.BoxGeometry(0.6, 0.8, 0.3),
        position: [0, -0.2, 0],
        color: 0xa855f7, // Purple for core
        muscleGroup: 'Core'
      },
      // Legs
      leftThigh: {
        geometry: new THREE.CylinderGeometry(0.12, 0.15, 0.8, 8),
        position: [-0.2, -1.0, 0],
        color: 0xf97316, // Orange for legs
        muscleGroup: 'Legs'
      },
      rightThigh: {
        geometry: new THREE.CylinderGeometry(0.12, 0.15, 0.8, 8),
        position: [0.2, -1.0, 0],
        color: 0xf97316,
        muscleGroup: 'Legs'
      },
      leftCalf: {
        geometry: new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8),
        position: [-0.2, -1.8, 0],
        color: 0xf97316,
        muscleGroup: 'Legs'
      },
      rightCalf: {
        geometry: new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8),
        position: [0.2, -1.8, 0],
        color: 0xf97316,
        muscleGroup: 'Legs'
      }
    };

    // Create meshes for each body part
    Object.entries(bodyParts).forEach(([name, part]) => {
      const material = new THREE.MeshLambertMaterial({ 
        color: part.color,
        transparent: true,
        opacity: 0.8
      });
      
      const mesh = new THREE.Mesh(part.geometry, material);
      mesh.position.set(...part.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { muscleGroup: part.muscleGroup, name };
      
      bodyGroup.add(mesh);
    });

    scene.add(bodyGroup);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      const rect = mountRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      if (isMouseDown) {
        bodyGroup.rotation.y += (event.movementX * 0.01);
        bodyGroup.rotation.x += (event.movementY * 0.01);
      }
    };

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    // Add event listeners
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('mousedown', handleMouseDown);
    mountRef.current.addEventListener('mouseup', handleMouseUp);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Auto-rotate when not interacting
      if (!isMouseDown) {
        bodyGroup.rotation.y += 0.005;
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update highlighting based on selected muscle group
  useEffect(() => {
    if (!bodyRef.current) return;

    bodyRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshLambertMaterial) {
        const muscleGroup = child.userData.muscleGroup;
        
        if (selectedMuscleGroup && muscleGroup === selectedMuscleGroup) {
          // Highlight selected muscle group
          child.material.opacity = 1.0;
          child.material.emissive.setHex(0x333333);
        } else if (selectedMuscleGroup && muscleGroup !== selectedMuscleGroup) {
          // Dim non-selected muscle groups
          child.material.opacity = 0.3;
          child.material.emissive.setHex(0x000000);
        } else {
          // Default state
          child.material.opacity = 0.8;
          child.material.emissive.setHex(0x000000);
        }
      }
    });
  }, [selectedMuscleGroup]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ minHeight: '500px' }}
    />
  );
}