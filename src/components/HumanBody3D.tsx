'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HumanBody3DProps {
  selectedMuscleGroup?: string | null;
  selectedMuscleSelection?: any;
}

export default function HumanBody3D({ selectedMuscleGroup, selectedMuscleSelection }: HumanBody3DProps) {
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

    // Create detailed human body with individual muscles
    const bodyGroup = new THREE.Group();
    bodyRef.current = bodyGroup;

    // Detailed body parts mapping to actual muscles from muscleGroups.ts
    const bodyParts = {
      // Head (non-muscle)
      head: {
        geometry: new THREE.SphereGeometry(0.3, 16, 16),
        position: [0, 1.7, 0],
        color: 0xfdbcb4
      },

      // CHEST MUSCLES
      pectoralisMajorUpper: {
        geometry: new THREE.BoxGeometry(0.6, 0.3, 0.2),
        position: [0, 1.0, 0.15],
        color: 0x22c55e,
        muscleName: 'Pectoralis Major',
        muscleHead: 'Upper (Clavicular Head)'
      },
      pectoralisMajorMiddle: {
        geometry: new THREE.BoxGeometry(0.7, 0.4, 0.25),
        position: [0, 0.6, 0.15],
        color: 0x22c55e,
        muscleName: 'Pectoralis Major',
        muscleHead: 'Middle (Sternal Head)'
      },
      pectoralisMajorLower: {
        geometry: new THREE.BoxGeometry(0.6, 0.3, 0.2),
        position: [0, 0.2, 0.15],
        color: 0x22c55e,
        muscleName: 'Pectoralis Major',
        muscleHead: 'Lower (Costal Head)'
      },

      // BACK MUSCLES
      latissimusDorsiLeft: {
        geometry: new THREE.BoxGeometry(0.3, 0.8, 0.15),
        position: [-0.25, 0.4, -0.25],
        color: 0x3b82f6,
        muscleName: 'Latissimus Dorsi'
      },
      latissimusDorsiRight: {
        geometry: new THREE.BoxGeometry(0.3, 0.8, 0.15),
        position: [0.25, 0.4, -0.25],
        color: 0x3b82f6,
        muscleName: 'Latissimus Dorsi'
      },
      trapeziusUpper: {
        geometry: new THREE.BoxGeometry(0.8, 0.3, 0.1),
        position: [0, 1.1, -0.3],
        color: 0x3b82f6,
        muscleName: 'Trapezius',
        muscleHead: 'Upper'
      },
      trapeziusMiddle: {
        geometry: new THREE.BoxGeometry(0.6, 0.3, 0.1),
        position: [0, 0.7, -0.3],
        color: 0x3b82f6,
        muscleName: 'Trapezius',
        muscleHead: 'Middle'
      },
      trapeziusLower: {
        geometry: new THREE.BoxGeometry(0.4, 0.3, 0.1),
        position: [0, 0.3, -0.3],
        color: 0x3b82f6,
        muscleName: 'Trapezius',
        muscleHead: 'Lower'
      },
      rhomboidsLeft: {
        geometry: new THREE.BoxGeometry(0.15, 0.4, 0.08),
        position: [-0.15, 0.6, -0.25],
        color: 0x3b82f6,
        muscleName: 'Rhomboids'
      },
      rhomboidsRight: {
        geometry: new THREE.BoxGeometry(0.15, 0.4, 0.08),
        position: [0.15, 0.6, -0.25],
        color: 0x3b82f6,
        muscleName: 'Rhomboids'
      },
      teresMajorLeft: {
        geometry: new THREE.BoxGeometry(0.1, 0.2, 0.1),
        position: [-0.35, 0.8, -0.15],
        color: 0x3b82f6,
        muscleName: 'Teres Major'
      },
      teresMajorRight: {
        geometry: new THREE.BoxGeometry(0.1, 0.2, 0.1),
        position: [0.35, 0.8, -0.15],
        color: 0x3b82f6,
        muscleName: 'Teres Major'
      },
      erectorSpinae: {
        geometry: new THREE.BoxGeometry(0.2, 1.0, 0.1),
        position: [0, 0.0, -0.3],
        color: 0x3b82f6,
        muscleName: 'Erector Spinae (Lower Back)'
      },

      // SHOULDER MUSCLES
      deltoidAnteriorLeft: {
        geometry: new THREE.SphereGeometry(0.12, 12, 12),
        position: [-0.45, 1.1, 0.1],
        color: 0xeab308,
        muscleName: 'Deltoids',
        muscleHead: 'Anterior Deltoid (Front)'
      },
      deltoidAnteriorRight: {
        geometry: new THREE.SphereGeometry(0.12, 12, 12),
        position: [0.45, 1.1, 0.1],
        color: 0xeab308,
        muscleName: 'Deltoids',
        muscleHead: 'Anterior Deltoid (Front)'
      },
      deltoidLateralLeft: {
        geometry: new THREE.SphereGeometry(0.12, 12, 12),
        position: [-0.5, 1.1, 0],
        color: 0xeab308,
        muscleName: 'Deltoids',
        muscleHead: 'Lateral Deltoid (Side)'
      },
      deltoidLateralRight: {
        geometry: new THREE.SphereGeometry(0.12, 12, 12),
        position: [0.5, 1.1, 0],
        color: 0xeab308,
        muscleName: 'Deltoids',
        muscleHead: 'Lateral Deltoid (Side)'
      },
      deltoidPosteriorLeft: {
        geometry: new THREE.SphereGeometry(0.12, 12, 12),
        position: [-0.45, 1.1, -0.1],
        color: 0xeab308,
        muscleName: 'Deltoids',
        muscleHead: 'Posterior Deltoid (Rear)'
      },
      deltoidPosteriorRight: {
        geometry: new THREE.SphereGeometry(0.12, 12, 12),
        position: [0.45, 1.1, -0.1],
        color: 0xeab308,
        muscleName: 'Deltoids',
        muscleHead: 'Posterior Deltoid (Rear)'
      },

      // ARM MUSCLES
      // Biceps
      bicepsBrachiiLongLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8),
        position: [-0.45, 0.8, 0.05],
        color: 0xef4444,
        muscleName: 'Biceps Brachii',
        muscleHead: 'Long Head'
      },
      bicepsBrachiiLongRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8),
        position: [0.45, 0.8, 0.05],
        color: 0xef4444,
        muscleName: 'Biceps Brachii',
        muscleHead: 'Long Head'
      },
      bicepsBrachiiShortLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8),
        position: [-0.5, 0.8, 0],
        color: 0xef4444,
        muscleName: 'Biceps Brachii',
        muscleHead: 'Short Head'
      },
      bicepsBrachiiShortRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8),
        position: [0.5, 0.8, 0],
        color: 0xef4444,
        muscleName: 'Biceps Brachii',
        muscleHead: 'Short Head'
      },
      brachialisLeft: {
        geometry: new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8),
        position: [-0.48, 0.5, 0],
        color: 0xef4444,
        muscleName: 'Brachialis'
      },
      brachialisRight: {
        geometry: new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8),
        position: [0.48, 0.5, 0],
        color: 0xef4444,
        muscleName: 'Brachialis'
      },
      brachioradialisLeft: {
        geometry: new THREE.CylinderGeometry(0.05, 0.07, 0.4, 8),
        position: [-0.5, 0.2, 0],
        color: 0xef4444,
        muscleName: 'Brachioradialis'
      },
      brachioradialisRight: {
        geometry: new THREE.CylinderGeometry(0.05, 0.07, 0.4, 8),
        position: [0.5, 0.2, 0],
        color: 0xef4444,
        muscleName: 'Brachioradialis'
      },

      // Triceps
      tricepsLongLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
        position: [-0.5, 0.8, -0.05],
        color: 0xef4444,
        muscleName: 'Triceps',
        muscleHead: 'Long Head'
      },
      tricepsLongRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
        position: [0.5, 0.8, -0.05],
        color: 0xef4444,
        muscleName: 'Triceps',
        muscleHead: 'Long Head'
      },
      tricepsLateralLeft: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.4, 8),
        position: [-0.52, 0.7, 0],
        color: 0xef4444,
        muscleName: 'Triceps',
        muscleHead: 'Lateral Head'
      },
      tricepsLateralRight: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.4, 8),
        position: [0.52, 0.7, 0],
        color: 0xef4444,
        muscleName: 'Triceps',
        muscleHead: 'Lateral Head'
      },
      tricepsMedialLeft: {
        geometry: new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8),
        position: [-0.48, 0.6, -0.05],
        color: 0xef4444,
        muscleName: 'Triceps',
        muscleHead: 'Medial Head'
      },
      tricepsMedialRight: {
        geometry: new THREE.CylinderGeometry(0.06, 0.08, 0.3, 8),
        position: [0.48, 0.6, -0.05],
        color: 0xef4444,
        muscleName: 'Triceps',
        muscleHead: 'Medial Head'
      },

      // Forearms
      wristFlexorsLeft: {
        geometry: new THREE.CylinderGeometry(0.04, 0.06, 0.3, 8),
        position: [-0.5, 0.0, 0.05],
        color: 0xef4444,
        muscleName: 'Wrist Flexors'
      },
      wristFlexorsRight: {
        geometry: new THREE.CylinderGeometry(0.04, 0.06, 0.3, 8),
        position: [0.5, 0.0, 0.05],
        color: 0xef4444,
        muscleName: 'Wrist Flexors'
      },
      wristExtensorsLeft: {
        geometry: new THREE.CylinderGeometry(0.04, 0.06, 0.3, 8),
        position: [-0.5, 0.0, -0.05],
        color: 0xef4444,
        muscleName: 'Wrist Extensors'
      },
      wristExtensorsRight: {
        geometry: new THREE.CylinderGeometry(0.04, 0.06, 0.3, 8),
        position: [0.5, 0.0, -0.05],
        color: 0xef4444,
        muscleName: 'Wrist Extensors'
      },

      // CORE MUSCLES
      rectusAbdominis: {
        geometry: new THREE.BoxGeometry(0.4, 0.8, 0.15),
        position: [0, -0.1, 0.15],
        color: 0xa855f7,
        muscleName: 'Rectus Abdominis'
      },
      obliquesLeft: {
        geometry: new THREE.BoxGeometry(0.2, 0.6, 0.1),
        position: [-0.3, -0.1, 0.1],
        color: 0xa855f7,
        muscleName: 'Obliques (Internal & External)'
      },
      obliquesRight: {
        geometry: new THREE.BoxGeometry(0.2, 0.6, 0.1),
        position: [0.3, -0.1, 0.1],
        color: 0xa855f7,
        muscleName: 'Obliques (Internal & External)'
      },
      transverseAbdominis: {
        geometry: new THREE.BoxGeometry(0.5, 0.4, 0.1),
        position: [0, -0.3, 0.05],
        color: 0xa855f7,
        muscleName: 'Transverse Abdominis'
      },

      // LEG MUSCLES
      // Quadriceps
      rectusFemorisLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8),
        position: [-0.15, -0.9, 0.1],
        color: 0xf97316,
        muscleName: 'Rectus Femoris'
      },
      rectusFemorisRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8),
        position: [0.15, -0.9, 0.1],
        color: 0xf97316,
        muscleName: 'Rectus Femoris'
      },
      vastusLateralisLeft: {
        geometry: new THREE.CylinderGeometry(0.09, 0.11, 0.7, 8),
        position: [-0.25, -0.9, 0],
        color: 0xf97316,
        muscleName: 'Vastus Lateralis'
      },
      vastusLateralisRight: {
        geometry: new THREE.CylinderGeometry(0.09, 0.11, 0.7, 8),
        position: [0.25, -0.9, 0],
        color: 0xf97316,
        muscleName: 'Vastus Lateralis'
      },
      vastusMedialisLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8),
        position: [-0.1, -0.9, 0],
        color: 0xf97316,
        muscleName: 'Vastus Medialis'
      },
      vastusMedialisRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8),
        position: [0.1, -0.9, 0],
        color: 0xf97316,
        muscleName: 'Vastus Medialis'
      },
      vastusIntermediusLeft: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.5, 8),
        position: [-0.15, -0.9, -0.05],
        color: 0xf97316,
        muscleName: 'Vastus Intermedius'
      },
      vastusIntermediusRight: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.5, 8),
        position: [0.15, -0.9, -0.05],
        color: 0xf97316,
        muscleName: 'Vastus Intermedius'
      },

      // Hamstrings
      bicepsFemorisLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8),
        position: [-0.2, -0.9, -0.1],
        color: 0xf97316,
        muscleName: 'Biceps Femoris'
      },
      bicepsFemorisRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8),
        position: [0.2, -0.9, -0.1],
        color: 0xf97316,
        muscleName: 'Biceps Femoris'
      },
      semitendinosusLeft: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.6, 8),
        position: [-0.15, -0.9, -0.15],
        color: 0xf97316,
        muscleName: 'Semitendinosus'
      },
      semitendinosusRight: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.6, 8),
        position: [0.15, -0.9, -0.15],
        color: 0xf97316,
        muscleName: 'Semitendinosus'
      },
      semimembranosusLeft: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.6, 8),
        position: [-0.1, -0.9, -0.15],
        color: 0xf97316,
        muscleName: 'Semimembranosus'
      },
      semimembranosusRight: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.6, 8),
        position: [0.1, -0.9, -0.15],
        color: 0xf97316,
        muscleName: 'Semimembranosus'
      },

      // Glutes
      gluteusMaximusLeft: {
        geometry: new THREE.BoxGeometry(0.25, 0.3, 0.2),
        position: [-0.15, -0.5, -0.2],
        color: 0xf97316,
        muscleName: 'Gluteus Maximus'
      },
      gluteusMaximusRight: {
        geometry: new THREE.BoxGeometry(0.25, 0.3, 0.2),
        position: [0.15, -0.5, -0.2],
        color: 0xf97316,
        muscleName: 'Gluteus Maximus'
      },
      gluteusMediusLeft: {
        geometry: new THREE.BoxGeometry(0.15, 0.2, 0.15),
        position: [-0.2, -0.4, -0.15],
        color: 0xf97316,
        muscleName: 'Gluteus Medius'
      },
      gluteusMediusRight: {
        geometry: new THREE.BoxGeometry(0.15, 0.2, 0.15),
        position: [0.2, -0.4, -0.15],
        color: 0xf97316,
        muscleName: 'Gluteus Medius'
      },
      gluteusMinimusLeft: {
        geometry: new THREE.BoxGeometry(0.1, 0.15, 0.1),
        position: [-0.22, -0.35, -0.1],
        color: 0xf97316,
        muscleName: 'Gluteus Minimus'
      },
      gluteusMinimusRight: {
        geometry: new THREE.BoxGeometry(0.1, 0.15, 0.1),
        position: [0.22, -0.35, -0.1],
        color: 0xf97316,
        muscleName: 'Gluteus Minimus'
      },

      // Calves
      gastrocnemiusLeft: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
        position: [-0.2, -1.7, 0.05],
        color: 0xf97316,
        muscleName: 'Gastrocnemius'
      },
      gastrocnemiusRight: {
        geometry: new THREE.CylinderGeometry(0.08, 0.1, 0.5, 8),
        position: [0.2, -1.7, 0.05],
        color: 0xf97316,
        muscleName: 'Gastrocnemius'
      },
      soleusLeft: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.4, 8),
        position: [-0.2, -1.8, -0.05],
        color: 0xf97316,
        muscleName: 'Soleus'
      },
      soleusRight: {
        geometry: new THREE.CylinderGeometry(0.07, 0.09, 0.4, 8),
        position: [0.2, -1.8, -0.05],
        color: 0xf97316,
        muscleName: 'Soleus'
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
      mesh.userData = { 
        muscleName: part.muscleName, 
        muscleHead: part.muscleHead,
        name 
      };
      
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

  // Update highlighting based on selected muscle or muscle group
  useEffect(() => {
    if (!bodyRef.current) return;

    // Map muscle names to muscle groups
    const muscleToGroup = {
      'Pectoralis Major': 'Chest',
      'Latissimus Dorsi': 'Back',
      'Trapezius': 'Back',
      'Rhomboids': 'Back',
      'Teres Major': 'Back',
      'Erector Spinae (Lower Back)': 'Back',
      'Deltoids': 'Shoulders',
      'Biceps Brachii': 'Arms',
      'Brachialis': 'Arms',
      'Brachioradialis': 'Arms',
      'Triceps': 'Arms',
      'Wrist Flexors': 'Arms',
      'Wrist Extensors': 'Arms',
      'Rectus Abdominis': 'Core',
      'Obliques (Internal & External)': 'Core',
      'Transverse Abdominis': 'Core',
      'Erector Spinae': 'Core',
      'Rectus Femoris': 'Legs',
      'Vastus Lateralis': 'Legs',
      'Vastus Medialis': 'Legs',
      'Vastus Intermedius': 'Legs',
      'Biceps Femoris': 'Legs',
      'Semitendinosus': 'Legs',
      'Semimembranosus': 'Legs',
      'Gluteus Maximus': 'Legs',
      'Gluteus Medius': 'Legs',
      'Gluteus Minimus': 'Legs',
      'Gastrocnemius': 'Legs',
      'Soleus': 'Legs'
    };

    bodyRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshLambertMaterial) {
        const muscleName = child.userData.muscleName;
        const muscleHead = child.userData.muscleHead;
        const muscleGroup = muscleToGroup[muscleName];
        
        // Skip non-muscle parts (like head)
        if (!muscleName) {
          child.material.opacity = 0.8;
          child.material.emissive.setHex(0x000000);
          return;
        }

        let shouldHighlight = false;

        // Check if specific muscle selection is selected (individual muscle part)
        if (selectedMuscleSelection) {
          // Get the most specific muscle name from the selection
          const selectedMuscleName = selectedMuscleSelection.muscle;
          const selectedSubMuscle = selectedMuscleSelection.subMuscle;
          const selectedHead = selectedMuscleSelection.head;
          
          // Match based on the most specific level available
          if (selectedHead && muscleHead) {
            // Match specific head
            if (muscleHead === selectedHead && (selectedSubMuscle ? muscleName === selectedSubMuscle : muscleName === selectedMuscleName)) {
              shouldHighlight = true;
            }
          } else if (selectedSubMuscle) {
            // Match sub-muscle
            if (muscleName === selectedSubMuscle) {
              shouldHighlight = true;
            }
          } else if (selectedMuscleName) {
            // Match main muscle
            if (muscleName === selectedMuscleName) {
              shouldHighlight = true;
            }
          }
        }
        // Check if muscle group is selected
        else if (selectedMuscleGroup) {
          if (muscleGroup === selectedMuscleGroup) {
            shouldHighlight = true;
          }
        }

        if (shouldHighlight) {
          // Highlight selected muscle/group
          child.material.opacity = 1.0;
          child.material.emissive.setHex(0x444444);
        } else if (selectedMuscleSelection || selectedMuscleGroup) {
          // Dim non-selected muscles
          child.material.opacity = 0.2;
          child.material.emissive.setHex(0x000000);
        } else {
          // Default state
          child.material.opacity = 0.8;
          child.material.emissive.setHex(0x000000);
        }
      }
    });
  }, [selectedMuscleGroup, selectedMuscleSelection]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ minHeight: '500px' }}
    />
  );
}