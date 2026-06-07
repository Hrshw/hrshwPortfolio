"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import UniverseEntry from "./UniverseEntry";
import IdentityProfile from "./IdentityProfile";
import ProfessionalOrbit from "./ProfessionalOrbit";
import NeuralGateway from "./NeuralGateway";
import ProjectPlanet from "./ProjectPlanet";
import CommandCenter from "./CommandCenter";

import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

gsap.registerPlugin(ScrollTrigger);

const CameraController = () => {
  const { camera } = useThree();
  const progressRef = useRef({ val: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 300),       // Start (Entry)
      new THREE.Vector3(0, 0, 200),       // Identity Panel 1
      new THREE.Vector3(0, 0, 150),       // Identity Panel 2
      new THREE.Vector3(0, 0, 100),       // Identity Panel 3
      new THREE.Vector3(0, 0, 50),        // Identity Panel 4
      new THREE.Vector3(30, 10, -50),     // Professional Journey Orbit
      new THREE.Vector3(60, -10, -150),   // Skills Galaxy (Neural Gateway)
      new THREE.Vector3(30, 5, -250),     // Observyze Planet
      new THREE.Vector3(10, -5, -300),    // PulseGuard
      new THREE.Vector3(30, 10, -350),    // Env Secret Lock
      new THREE.Vector3(10, 0, -400),     // SubTrackHub
      new THREE.Vector3(40, -10, -450),   // VidVerbalize
      new THREE.Vector3(15, 5, -500),     // NFT Showcase
      new THREE.Vector3(-20, 0, -600),    // Approaching Command Center
      new THREE.Vector3(-20, 0, -630)     // Final stop looking at Command Center
    ]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(progressRef.current, {
      val: 1,
      ease: "none",
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      tl.kill();
    };
  }, []);

  useFrame(() => {
    const p = progressRef.current.val;
    const point = curve.getPointAt(p);
    camera.position.lerp(point, 0.1);

    const lookAtPoint = curve.getPointAt(Math.min(1, p + 0.05));
    
    // Apply mouse parallax to the lookAt target to simulate head turning
    // Multipliers (e.g., 20 and 15) determine how far the user can "look around"
    lookAtPoint.x += mouseRef.current.x * 25;
    lookAtPoint.y += mouseRef.current.y * 15;

    const currentLookAt = new THREE.Vector3(0,0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLookAt.lerp(lookAtPoint, 0.05);
    camera.lookAt(currentLookAt);
  });

  return null;
};

export default function UniverseCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 300], fov: 45, near: 0.1, far: 1000 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#010204"]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={1} color="#ffffff" />
      
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <CameraController />

      <UniverseEntry position={[0, 0, 280]} />
      <IdentityProfile position={[0, -2, 200]} />
      <ProfessionalOrbit position={[30, 10, -50]} />
      <NeuralGateway position={[60, -10, -150]} />
      
      <ProjectPlanet 
        position={[35, 5, -250]} 
        color="#10b981" 
        title="Observyze" 
        category="Real-time Operations & Analytics Platform"
        description="An enterprise monitoring and coverage analytics platform built to automate performance tracking and code coverage insights. Integrates cloud pipelines and telemetry dashboard reporting."
        technologies={["React.js", "Node.js", "AWS", "Analytics Engine", "SaaS"]}
      />
      
      <ProjectPlanet 
        position={[5, -5, -300]} 
        color="#f59e0b" 
        title="PulseGuard" 
        category="AI Server & Website Monitoring Platform"
        description="A real-time monitoring SaaS that tracks website uptime, DNS modifications, SSL expirations, and server health. Uses AI-driven insights to detect traffic anomalies and includes an AWS EC2 controls integration to manage hosts."
        technologies={["Node.js", "React", "Python", "Redis", "AWS EC2", "AWS Route 53", "PayU"]}
      />
      
      <ProjectPlanet 
        position={[35, 10, -350]} 
        color="#00f2fe" 
        title="Env Secret Lock" 
        category="Developer Environment Secret Manager"
        description="A developer environment secret manager and CLI tool designed to prevent secret sprawl. Secures API credentials, environment variables, and system configurations with encrypted access protocols."
        technologies={["Node.js", "TypeScript", "CLI", "Cryptography", "Security"]}
      />

      <ProjectPlanet 
        position={[5, 0, -400]} 
        color="#a78bfa" 
        title="SubTrackHub" 
        category="SaaS Cost Optimization Analyzer"
        description="An enterprise SaaS analysis tool that hooks into cloud setups, maps active and idle instances, and calculates potential monthly/yearly savings. Uses LLMs to generate efficiency scores and automated reports."
        technologies={["Node.js", "React", "MongoDB", "AWS", "LLM APIs", "RAG"]}
      />

      <ProjectPlanet 
        position={[45, -10, -450]} 
        color="#ef4444" 
        title="VidVerbalize" 
        category="AI Short-Form Video Generator"
        description="An AI system that transcribes YouTube/local media, analyzes key moments, overlays auto-generated subtitles, trims video ratios, and produces ready-to-share social media clips."
        technologies={["Node.js", "Python", "Whisper AI", "FFmpeg", "Social APIs"]}
      />

      <ProjectPlanet 
        position={[10, 5, -500]} 
        color="#f59e0b" 
        title="NFT Showcase Platform" 
        category="Crypto Asset Web Application"
        description="A fully responsive Web3 showcase gallery hosting curated NFT collections. Configured static asset hosting on AWS S3 with Route 53 domain routing for highly optimized content delivery."
        technologies={["HTML5", "CSS3", "JavaScript", "AWS S3", "AWS Route 53"]}
      />
      
      <CommandCenter position={[-20, 0, -650]} />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={new THREE.Vector2(0.002, 0.002)} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
