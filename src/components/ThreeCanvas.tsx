"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const towersRef = useRef<THREE.Group | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.012);
    sceneRef.current = scene;

    // --- Camera Setup ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 40, 85);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // --- WebGL Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    // --- Lights Setup (INTENSIFIED for visibility) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const mainPointLight = new THREE.PointLight(0x00f2fe, 6, 200);
    mainPointLight.position.set(0, 35, 20);
    scene.add(mainPointLight);

    const purplePointLight = new THREE.PointLight(0xa78bfa, 4, 200);
    purplePointLight.position.set(30, 25, -20);
    scene.add(purplePointLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(0, 50, -50);
    scene.add(fillLight);

    // --- Cloud Network Core Group ---
    const gridGroup = new THREE.Group();
    gridGroupRef.current = gridGroup;
    scene.add(gridGroup);

    // 1. Cybernetic Grid Floor (Brightened)
    const gridHelper = new THREE.GridHelper(120, 40, 0x00f2fe, 0x374151);
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach(mat => {
        mat.transparent = true;
        mat.opacity = 0.45;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.45;
    }
    gridGroup.add(gridHelper);

    // 2. Cloud Server Towers (Compute Instances)
    const towers = new THREE.Group();
    towersRef.current = towers;
    gridGroup.add(towers);

    // Flat array of tower coordinate structures for line calculations
    const nodePositions: { position: THREE.Vector3; h: number }[] = [];

    // Helper to create a glowing server rack
    const createServer = (x: number, z: number, h: number, color: number, name: string) => {
      const serverGroup = new THREE.Group();
      serverGroup.position.set(x, h / 2, z);
      serverGroup.name = name;

      const geo = new THREE.BoxGeometry(6, h, 6);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x050714,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.25
      });
      const mesh = new THREE.Mesh(geo, mat);
      serverGroup.add(mesh);

      const wireGeo = new THREE.BoxGeometry(6.1, h, 6.1);
      const wireMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      serverGroup.add(wireMesh);

      const ledGeo = new THREE.SphereGeometry(0.3, 8, 8);
      const ledsCount = Math.floor(h / 3);
      const leds: THREE.Mesh[] = [];

      for (let i = 0; i < ledsCount; i++) {
        const ledMat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.4 ? 0x10b981 : 0xef4444,
        });
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(-2.2 + Math.random() * 4.4, (h / 2) - 1.5 - (i * 2.8), 3.05);
        serverGroup.add(led);
        leds.push(led);
      }

      towers.add(serverGroup);
      nodePositions.push({ position: new THREE.Vector3(x, h, z), h });
      return { serverGroup, leds };
    };

    // Spawn Compute Infrastructure Servers
    const ec2_1 = createServer(-18, -18, 18, 0x00f2fe, "Compute_EC2_Primary");
    const ec2_2 = createServer(-22, 12, 14, 0x00f2fe, "Compute_EC2_Backup");
    const rds = createServer(18, -12, 12, 0xa78bfa, "Database_RDS");
    const k8s = createServer(12, 18, 22, 0x10b981, "Orchestrator_EKS");
    const gateway = createServer(0, -28, 8, 0xf59e0b, "API_Gateway");

    // 3. Database Cylinders
    const createDBCylinder = (x: number, z: number, r: number, h: number, name: string) => {
      const dbGroup = new THREE.Group();
      dbGroup.position.set(x, h / 2, z);
      dbGroup.name = name;

      const dbGeo = new THREE.CylinderGeometry(r, r, h, 16);
      const dbMat = new THREE.MeshStandardMaterial({
        color: 0x050714,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.75,
        emissive: 0xa78bfa,
        emissiveIntensity: 0.35
      });
      const dbMesh = new THREE.Mesh(dbGeo, dbMat);
      dbGroup.add(dbMesh);

      const ringGeo = new THREE.CylinderGeometry(r + 0.1, r + 0.1, 0.4, 16, 1, true);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa78bfa,
        transparent: true,
        opacity: 0.8
      });
      
      const ring1 = new THREE.Mesh(ringGeo, ringMat);
      ring1.position.y = h / 4;
      dbGroup.add(ring1);

      const ring2 = new THREE.Mesh(ringGeo, ringMat);
      ring2.position.y = -h / 4;
      dbGroup.add(ring2);

      towers.add(dbGroup);
      nodePositions.push({ position: new THREE.Vector3(x, h, z), h });
    };

    createDBCylinder(24, 14, 4, 7, "Database_RDS_Cyl1");
    createDBCylinder(-6, 24, 3, 5, "Database_RDS_Cyl2");

    // 4. Custom VPC Static Cable Connections
    const cablesGroup = new THREE.Group();
    gridGroup.add(cablesGroup);

    const createCables = (start: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.y += 8;

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(25);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.6
      });
      const line = new THREE.Line(lineGeo, lineMat);
      cablesGroup.add(line);
    };

    createCables(new THREE.Vector3(-18, 9, -18), new THREE.Vector3(18, 6, -12), 0x00f2fe);
    createCables(new THREE.Vector3(18, 6, -12), new THREE.Vector3(24, 3.5, 14), 0xa78bfa);
    createCables(new THREE.Vector3(-22, 7, 12), new THREE.Vector3(12, 11, 18), 0x10b981);
    createCables(new THREE.Vector3(0, 4, -28), new THREE.Vector3(-18, 9, -18), 0xf59e0b);

    // --- Interactive Mouse-to-Node Connections Setup ---
    const mouseNodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const mouseNodeMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.8
    });
    const mouseNodeMesh = new THREE.Mesh(mouseNodeGeo, mouseNodeMat);
    scene.add(mouseNodeMesh);

    const mouseGlowLight = new THREE.PointLight(0x00f2fe, 6, 50);
    mouseNodeMesh.add(mouseGlowLight);

    const maxConnectionLines = 3;
    const dynamicLines: THREE.Line[] = [];
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.85,
      linewidth: 2
    });

    for (let i = 0; i < maxConnectionLines; i++) {
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(6);
      geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const line = new THREE.Line(geom, lineMat);
      scene.add(line);
      dynamicLines.push(line);
    }

    // Mathematical horizontal plane representing grid floor height (y = 0)
    const raycastPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const mouseScreenPos = new THREE.Vector2();
    let mouseWorldPos = new THREE.Vector3(0, 0, 0);

    // Mouse coordinates tracker
    const onMouseMove = (e: MouseEvent) => {
      mouseScreenPos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseScreenPos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- Interactive 3D Click Shockwave Ripple Mesh ---
    const shockwaveRingGeo = new THREE.RingGeometry(0.1, 1, 32);
    shockwaveRingGeo.rotateX(-Math.PI / 2);
    const shockwaveRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    const shockwaveRing = new THREE.Mesh(shockwaveRingGeo, shockwaveRingMat);
    shockwaveRing.position.y = 0.5;
    scene.add(shockwaveRing);

    // Handle Click shockwaves
    const onWindowClick = () => {
      gsap.killTweensOf(shockwaveRing.scale);
      gsap.killTweensOf(shockwaveRingMat);
      
      shockwaveRing.position.copy(mouseWorldPos);
      shockwaveRing.scale.set(1, 1, 1);

      gsap.to(shockwaveRing.scale, {
        x: 60,
        y: 1,
        z: 60,
        duration: 1.2,
        ease: "power2.out"
      });

      gsap.fromTo(
        shockwaveRingMat,
        { opacity: 0.95 },
        { opacity: 0, duration: 1.2, ease: "power2.out" }
      );

      gsap.fromTo(mainPointLight, { intensity: 12 }, { intensity: 6, duration: 1.2 });
      gsap.fromTo(purplePointLight, { intensity: 8 }, { intensity: 4, duration: 1.2 });
    };
    window.addEventListener("click", onWindowClick);

    // --- NEW: Tron Cyber Car (3D Mouse Chaser) ---
    const cyberCar = new THREE.Group();
    cyberCar.position.set(0, 1.2, 0); // Flat on grid (y matches radius of wheels)
    scene.add(cyberCar);

    // Car Body Chassis
    const chassisGeo = new THREE.BoxGeometry(4.5, 1.2, 8.5);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x040816,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.08
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    cyberCar.add(chassis);

    // Car Chassis glowing wireframe overlay
    const chassisWireGeo = new THREE.BoxGeometry(4.55, 1.22, 8.55);
    const chassisWireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const chassisWire = new THREE.Mesh(chassisWireGeo, chassisWireMat);
    cyberCar.add(chassisWire);

    // Car Cabin
    const cabinGeo = new THREE.BoxGeometry(3.5, 0.9, 4.5);
    const cabin = new THREE.Mesh(cabinGeo, chassisMat);
    cabin.position.set(0, 1.05, -1);
    cyberCar.add(cabin);

    // Cabin glowing outline
    const cabinWireGeo = new THREE.BoxGeometry(3.55, 0.92, 4.55);
    const cabinWireMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const cabinWire = new THREE.Mesh(cabinWireGeo, cabinWireMat);
    cabinWire.position.set(0, 1.05, -1);
    cyberCar.add(cabinWire);

    // Headlights (glowing cyan boxes)
    const headlightGeo = new THREE.BoxGeometry(0.8, 0.25, 0.4);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
    
    const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
    headlightL.position.set(-1.8, 0.2, 4.25);
    cyberCar.add(headlightL);

    const headlightR = new THREE.Mesh(headlightGeo, headlightMat);
    headlightR.position.set(1.8, 0.2, 4.25);
    cyberCar.add(headlightR);

    // Taillight bar (glowing red line)
    const taillightGeo = new THREE.BoxGeometry(3.8, 0.2, 0.4);
    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const taillight = new THREE.Mesh(taillightGeo, taillightMat);
    taillight.position.set(0, 0.2, -4.25);
    cyberCar.add(taillight);

    // Spinning Wheels (Cylinders)
    const wheelGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.0, 16);
    wheelGeo.rotateZ(Math.PI / 2); // Rotate wheels horizontal
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.4,
      metalness: 0.8,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.1
    });

    const spawnWheel = (x: number, y: number, z: number) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(x, y, z);
      cyberCar.add(wheel);

      // Add Tron glowing ring on the outer face
      const ringGeo = new THREE.RingGeometry(0.6, 0.9, 16);
      ringGeo.rotateY(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      // Offset slightly to prevent z-fighting with wheel sides
      ring.position.x = x > 0 ? 0.52 : -0.52;
      wheel.add(ring);

      wheelsRef.current.push(wheel);
    };

    // Spawn 4 wheels
    spawnWheel(-2.4, -0.6, 2.5); // Front-Left
    spawnWheel(2.4, -0.6, 2.5);  // Front-Right
    spawnWheel(-2.4, -0.6, -2.5); // Rear-Left
    spawnWheel(2.4, -0.6, -2.5);  // Rear-Right

    // Chassis Underglow Light
    const underglowLight = new THREE.PointLight(0x00f2fe, 5, 20);
    underglowLight.position.set(0, -0.5, 0);
    cyberCar.add(underglowLight);

    // --- HTML hover highlight listener ---
    const handleNodeHighlight = (e: Event) => {
      const customEvent = e as CustomEvent;
      const nodeName = customEvent.detail?.name;
      const activeState = customEvent.detail?.active;

      towers.children.forEach(tower => {
        if (tower.name.startsWith(nodeName)) {
          gsap.to(tower.scale, {
            x: activeState ? 1.3 : 1.0,
            y: activeState ? 1.3 : 1.0,
            z: activeState ? 1.3 : 1.0,
            duration: 0.4,
            ease: "back.out(2)"
          });

          const outerMesh = tower.children[1] as THREE.Mesh;
          if (outerMesh && outerMesh.material) {
            const mat = outerMesh.material as THREE.MeshBasicMaterial;
            gsap.to(mat, {
              opacity: activeState ? 0.95 : 0.6,
              duration: 0.4
            });
            mat.color.setHex(activeState ? 0xffd700 : (tower.name.includes("RDS") ? 0xa78bfa : 0x00f2fe));
          }
        }
      });
    };
    window.addEventListener("node-highlight", handleNodeHighlight);

    // --- Rendering Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle grid floor rotation
      gridGroup.rotation.y = time * 0.025;

      // Status indicator blinking loop
      [ec2_1, ec2_2, rds, k8s, gateway].forEach(tower => {
        tower.leds.forEach((led, i) => {
          if (Array.isArray(led.material)) return;
          const blinkSpeed = 2 + (i % 3);
          const mat = led.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.sin(time * blinkSpeed + i) > 0 ? 1.0 : 0.25;
          mat.transparent = true;
        });
      });

      // Raycast screen coordinates to find mouse 3D target on floor plane
      raycaster.setFromCamera(mouseScreenPos, camera);
      raycaster.ray.intersectPlane(raycastPlane, mouseWorldPos);

      // Smoothly update 3D cursor node position
      mouseNodeMesh.position.lerp(mouseWorldPos, 0.15);

      // Update matrix world of gridGroup before measuring distances to rotating nodes
      gridGroup.updateMatrixWorld(true);

      // Map node positions to world coordinates
      const worldNodePositions = nodePositions.map(node => {
        const localPos = node.position.clone();
        localPos.applyMatrix4(gridGroup.matrixWorld);
        return { pos: localPos, original: node };
      });

      // Sort nodes based on distance to mouseNodeMesh
      worldNodePositions.sort((a, b) => {
        return a.pos.distanceTo(mouseNodeMesh.position) - b.pos.distanceTo(mouseNodeMesh.position);
      });

      // Update lines segment buffers to connect to the top 3 closest nodes
      for (let i = 0; i < maxConnectionLines; i++) {
        const line = dynamicLines[i];
        if (i < worldNodePositions.length) {
          const targetNode = worldNodePositions[i];
          const lineDist = mouseNodeMesh.position.distanceTo(targetNode.pos);

          if (lineDist < 90) {
            const positions = line.geometry.attributes.position.array as Float32Array;
            
            positions[0] = mouseNodeMesh.position.x;
            positions[1] = mouseNodeMesh.position.y;
            positions[2] = mouseNodeMesh.position.z;

            positions[3] = targetNode.pos.x;
            positions[4] = targetNode.pos.y;
            positions[5] = targetNode.pos.z;

            line.geometry.attributes.position.needsUpdate = true;
            
            const mat = line.material as THREE.LineBasicMaterial;
            mat.opacity = (1 - lineDist / 90) * 0.85;
            line.visible = true;
          } else {
            line.visible = false;
          }
        } else {
          line.visible = false;
        }
      }

      // --- TRON CYBER CAR PHYSICS LOGIC (Mouse Chaser) ---
      const carTarget = mouseNodeMesh.position;
      const carPos = cyberCar.position;
      const carDir = new THREE.Vector3().subVectors(carTarget, carPos);
      carDir.y = 0; // Keep car flat on the ground plane
      const carDist = carDir.length();

      const carMaxSpeed = 0.55;
      if (carDist > 5.5) { // Stop near mouse cursor, don't overlap completely
        carDir.normalize();

        // Calculate steer angle (rotation.y face target)
        const targetAngle = Math.atan2(carDir.x, carDir.z);
        
        // Wrap angle diff between -PI and PI
        let angleDiff = targetAngle - cyberCar.rotation.y;
        angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));

        // Smooth steering rotation
        cyberCar.rotation.y += angleDiff * 0.08;

        // Slow down slightly on sharp steering turns
        const alignmentFactor = Math.max(0, Math.cos(angleDiff));
        const currentSpeed = carMaxSpeed * alignmentFactor * Math.min(carDist / 22, 1.0);

        // Move cyberCar position
        cyberCar.position.addScaledVector(carDir, currentSpeed);

        // Spin wheels based on velocity
        wheelsRef.current.forEach(w => {
          w.rotation.x += currentSpeed * 0.4;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- Window resize listener ---
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onWindowClick);
      window.removeEventListener("node-highlight", handleNodeHighlight);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // --- GSAP Scroll Mapping to background camera positions ---
  useGSAP(() => {
    setTimeout(() => {
      const camera = cameraRef.current;
      const grid = gridGroupRef.current;
      if (!camera || !grid) return;

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".portfolio-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        }
      });

      // Scroll Phase 1: Camera orbits and moves down
      mainTimeline.to(camera.position, {
        y: 22,
        z: 65,
        ease: "power2.inOut"
      }, 0);

      // Scroll Phase 2: Slowly rotate layout grid
      mainTimeline.to(grid.rotation, {
        y: Math.PI / 2.5,
        ease: "sine.inOut"
      }, 0.3);

      // Scroll Phase 3: Panning camera upward for projects
      mainTimeline.to(camera.position, {
        x: -15,
        y: 45,
        z: 55,
        ease: "power2.inOut"
      }, 0.6);

      // Scroll Phase 4: Settle camera back to center overview
      mainTimeline.to(camera.position, {
        x: 0,
        y: 35,
        z: 75,
        ease: "power1.inOut"
      }, 0.9);

    }, 200);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        backgroundColor: "var(--bg-color)"
      }}
    />
  );
}
