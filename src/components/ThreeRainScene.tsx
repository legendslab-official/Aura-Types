import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ActiveRainWord } from '../types';

interface ThreeRainSceneProps {
  words: ActiveRainWord[];
  currentWordIndex: number;
  combo: number;
  streak: number;
  themeAccent: string;
  isPaused: boolean;
  onExplosionComplete?: () => void;
}

export const ThreeRainScene: React.FC<ThreeRainSceneProps> = ({
  words,
  currentWordIndex,
  combo,
  streak,
  themeAccent,
  isPaused,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const wordMeshesRef = useRef<Map<string, { mesh: THREE.Sprite; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; texture: THREE.CanvasTexture }>>(new Map());
  const particlesRef = useRef<THREE.Points | null>(null);
  const laserBeamRef = useRef<THREE.Line | null>(null);
  const shockwavesRef = useRef<{ mesh: THREE.Mesh; life: number; maxLife: number }[]>([]);
  const shakeRef = useRef<number>(0);

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030712, 0.025);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 6, -10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x030712, 1);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x06b6d4, 0x1e293b);
    gridHelper.position.set(0, -1, -10);
    scene.add(gridHelper);

    // Particle Stars / Cyber rain
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(themeAccent || '#06B6D4');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = Math.random() * 30 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const c = Math.random() > 0.3 ? baseColor : new THREE.Color('#ec4899');
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Defense Energy Barrier line at the bottom
    const barrierGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-14, 0.2, 5),
      new THREE.Vector3(14, 0.2, 5),
    ]);
    const barrierMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      linewidth: 3,
      transparent: true,
      opacity: 0.6,
    });
    const barrier = new THREE.Line(barrierGeo, barrierMat);
    scene.add(barrier);

    // Laser Beam between turret and current target word
    const laserGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 10, -5),
    ]);
    const laserMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const laserBeam = new THREE.Line(laserGeo, laserMat);
    scene.add(laserBeam);
    laserBeamRef.current = laserBeam;

    // Resize handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Animate particles (warp rain fall)
      if (particlesRef.current) {
        const posAttr = particlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;
        const speed = 6 + Math.min(combo * 0.3, 10);

        for (let i = 0; i < particleCount; i++) {
          array[i * 3 + 2] += speed * delta;
          if (array[i * 3 + 2] > 20) {
            array[i * 3 + 2] = -40;
            array[i * 3 + 1] = Math.random() * 25;
            array[i * 3] = (Math.random() - 0.5) * 45;
          }
        }
        posAttr.needsUpdate = true;
      }

      // Animate Shockwaves
      shockwavesRef.current = shockwavesRef.current.filter((sw) => {
        sw.life += delta;
        const progress = sw.life / sw.maxLife;
        if (progress >= 1) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          (sw.mesh.material as THREE.Material).dispose();
          return false;
        }
        const scale = 1 + progress * 4;
        sw.mesh.scale.set(scale, scale, scale);
        (sw.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.8;
        return true;
      });

      // Camera Shake
      if (shakeRef.current > 0) {
        camera.position.x = (Math.random() - 0.5) * shakeRef.current * 0.3;
        camera.position.y = 4 + (Math.random() - 0.5) * shakeRef.current * 0.3;
        shakeRef.current = Math.max(0, shakeRef.current - delta * 4);
      } else {
        camera.position.x = Math.sin(time * 0.5) * 0.2;
        camera.position.y = 4 + Math.cos(time * 0.5) * 0.1;
      }

      // Dynamic FOV with combo speed
      const targetFov = 60 + Math.min(streak, 30) * 0.4;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 3);
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update dynamic words in 3D space
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const currentMap = wordMeshesRef.current;
    const activeIds = new Set(words.map((w) => w.id));

    // Remove obsolete meshes
    currentMap.forEach((entry, id) => {
      if (!activeIds.has(id)) {
        // Trigger shockwave explosion at previous position
        const pos = entry.mesh.position;
        const ringGeo = new THREE.RingGeometry(0.3, 0.7, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(themeAccent || '#06B6D4'),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(cameraRef.current?.position || new THREE.Vector3(0, 0, 10));
        scene.add(ring);
        shockwavesRef.current.push({ mesh: ring, life: 0, maxLife: 0.5 });

        // Shake camera on completion
        shakeRef.current = 0.4;

        scene.remove(entry.mesh);
        entry.texture.dispose();
        (entry.mesh.material as THREE.Material).dispose();
        currentMap.delete(id);
      }
    });

    // Create or update active words
    words.forEach((w, index) => {
      const isTarget = index === currentWordIndex;
      let entry = currentMap.get(w.id);

      if (!entry) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          blending: THREE.AdditiveBlending,
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(4.5, 1.12, 1);
        scene.add(sprite);

        entry = { mesh: sprite, canvas, ctx, texture };
        currentMap.set(w.id, entry);
      }

      // Render 2D text texture with typed highlights
      const { ctx, canvas, texture, mesh } = entry;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background badge box
      const isDanger = w.y < 4;
      ctx.fillStyle = isDanger
        ? 'rgba(239, 68, 68, 0.35)'
        : isTarget
        ? 'rgba(6, 182, 212, 0.3)'
        : 'rgba(15, 23, 42, 0.65)';
      ctx.strokeStyle = isDanger
        ? '#ef4444'
        : isTarget
        ? '#06b6d4'
        : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = isTarget ? 4 : 2;

      ctx.beginPath();
      ctx.roundRect(12, 12, canvas.width - 24, canvas.height - 24, 16);
      ctx.fill();
      ctx.stroke();

      // Render text
      ctx.font = 'bold 42px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const fullText = w.text;
      const typedPart = fullText.slice(0, w.typedLength);
      const untypedPart = fullText.slice(w.typedLength);

      const totalWidth = ctx.measureText(fullText).width;
      let startX = canvas.width / 2 - totalWidth / 2;

      // Draw typed characters (cyan/emerald glow)
      if (typedPart.length > 0) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#10B981';
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 12;
        ctx.fillText(typedPart, startX, canvas.height / 2);
        startX += ctx.measureText(typedPart).width;
        ctx.shadowBlur = 0;
      }

      // Draw remaining untyped characters
      ctx.textAlign = 'left';
      ctx.fillStyle = isTarget ? '#FFFFFF' : '#94A3B8';
      ctx.fillText(untypedPart, startX, canvas.height / 2);

      // Category hint label on top of badge if available
      if (w.category) {
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#F59E0B';
        ctx.fillText(w.category, canvas.width / 2, 30);
      }

      texture.needsUpdate = true;

      // Update 3D position
      mesh.position.set(w.x, w.y, w.z);

      // Scale up current target
      const targetScale = isTarget ? 5.2 : 4.2;
      mesh.scale.set(targetScale, targetScale * 0.25, 1);

      // Update laser beam to target
      if (isTarget && laserBeamRef.current) {
        const positions = laserBeamRef.current.geometry.attributes.position as THREE.BufferAttribute;
        positions.setXYZ(0, 0, 0.2, 5); // From shield turret
        positions.setXYZ(1, w.x, w.y, w.z); // To target word
        positions.needsUpdate = true;
        (laserBeamRef.current.material as THREE.LineBasicMaterial).opacity = w.typedLength > 0 ? 0.9 : 0.3;
        (laserBeamRef.current.material as THREE.LineBasicMaterial).color.set(w.typedLength > 0 ? '#10B981' : '#06B6D4');
      }
    });

    if (words.length === 0 && laserBeamRef.current) {
      (laserBeamRef.current.material as THREE.LineBasicMaterial).opacity = 0;
    }
  }, [words, currentWordIndex, themeAccent]);

  return (
    <div className="relative w-full h-full min-h-[460px] flex items-center justify-center overflow-hidden select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
