import React, { useEffect, useRef } from 'react';
import type { UserProfile } from './SimulationEngine';

interface InfluenceFieldProps {
  reveal: boolean;
  userProfile: UserProfile;
  activeCardIndex?: number | null;
  scrollProgress: number; // 0 to 1
  activeSection: number;  // 0 to 5
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
}

interface NetworkNode {
  id: string;
  name: string;
  // Normalized target positions (0 to 1) for each section (0 to 5)
  targets: { x: number; y: number }[];
  easeX: number; // Current eased X position (0 to 1)
  easeY: number; // Current eased Y position (0 to 1)
  value: number;
  color: string;
  pulseOffset: number;
}

export const InfluenceField: React.FC<InfluenceFieldProps> = ({
  reveal,
  userProfile,
  activeCardIndex,
  scrollProgress,
  activeSection
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Pentagon angles for Stage 4 (Insight) circular radial layout
    const pentagonAngles = [0, 1, 2, 3, 4].map(i => (Math.PI * 2 / 5) * i - Math.PI / 2);

    // Setup node targets for each activeSection (0 to 5)
    // 0: Feed, 1: Choice, 2: Feedback Loop, 3: Timelines, 4: Radar Insight, 5: Final Audit
    const nodes: NetworkNode[] = [
      {
        id: 'curiosity',
        name: 'Curiosity',
        targets: [
          { x: 0.15, y: 0.25 }, // Feed
          { x: 0.20, y: 0.40 }, // Choice (left)
          { x: 0.50, y: 0.35 }, // Loop (chain)
          { x: 0.35, y: 0.45 }, // Timeline (branch left)
          { x: 0.5 + Math.cos(pentagonAngles[0]) * 0.12, y: 0.5 + Math.sin(pentagonAngles[0]) * 0.22 }, // Pentagon
          { x: -0.1, y: -0.1 }  // Final (drift out)
        ],
        easeX: 0.15,
        easeY: 0.25,
        value: userProfile.curiosity,
        color: '#00e5ff',
        pulseOffset: 0
      },
      {
        id: 'anger',
        name: 'Outrage (Anger)',
        targets: [
          { x: 0.85, y: 0.20 }, // Feed
          { x: 0.80, y: 0.40 }, // Choice (right)
          { x: 0.50, y: 0.80 }, // Loop (chain)
          { x: 0.65, y: 0.45 }, // Timeline (branch right)
          { x: 0.5 + Math.cos(pentagonAngles[1]) * 0.12, y: 0.5 + Math.sin(pentagonAngles[1]) * 0.22 }, // Pentagon
          { x: 1.1, y: -0.1 }   // Final
        ],
        easeX: 0.85,
        easeY: 0.20,
        value: userProfile.anger,
        color: '#ff3355',
        pulseOffset: Math.PI / 4
      },
      {
        id: 'novelty',
        name: 'Novelty Seek',
        targets: [
          { x: 0.20, y: 0.75 }, // Feed
          { x: 0.25, y: 0.65 }, // Choice (left lower)
          { x: 0.50, y: 0.50 }, // Loop
          { x: 0.25, y: 0.70 }, // Timeline (left target)
          { x: 0.5 + Math.cos(pentagonAngles[2]) * 0.12, y: 0.5 + Math.sin(pentagonAngles[2]) * 0.22 }, // Pentagon
          { x: -0.1, y: 1.1 }   // Final
        ],
        easeX: 0.20,
        easeY: 0.75,
        value: userProfile.novelty,
        color: '#00e5ff',
        pulseOffset: Math.PI / 2
      },
      {
        id: 'familiarity',
        name: 'Familiarity',
        targets: [
          { x: 0.80, y: 0.80 }, // Feed
          { x: 0.75, y: 0.65 }, // Choice (right lower)
          { x: 0.50, y: 0.65 }, // Loop
          { x: 0.75, y: 0.70 }, // Timeline (right target)
          { x: 0.5 + Math.cos(pentagonAngles[3]) * 0.12, y: 0.5 + Math.sin(pentagonAngles[3]) * 0.22 }, // Pentagon
          { x: 1.1, y: 1.1 }    // Final
        ],
        easeX: 0.80,
        easeY: 0.80,
        value: userProfile.familiarity,
        color: '#94a3b8',
        pulseOffset: Math.PI
      },
      {
        id: 'attention',
        name: 'Attention Span',
        targets: [
          { x: 0.50, y: 0.15 }, // Feed
          { x: 0.50, y: 0.10 }, // Choice (top)
          { x: 0.50, y: 0.20 }, // Loop
          { x: 0.50, y: 0.15 }, // Timeline (root)
          { x: 0.5 + Math.cos(pentagonAngles[4]) * 0.12, y: 0.5 + Math.sin(pentagonAngles[4]) * 0.22 }, // Pentagon
          { x: 0.5, y: -0.2 }   // Final
        ],
        easeX: 0.50,
        easeY: 0.15,
        value: 1 - userProfile.shortFormDwell,
        color: '#00e5ff',
        pulseOffset: (Math.PI * 3) / 4
      }
    ];

    const particles: Particle[] = [];

    // Helper to spawn a particle from a node towards the center
    const spawnParticle = (fromNode: NetworkNode, targetX: number, targetY: number) => {
      const startX = fromNode.easeX * width;
      const startY = fromNode.easeY * height;
      
      particles.push({
        x: startX,
        y: startY,
        vx: 0,
        vy: 0,
        color: fromNode.color,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.5,
        targetX,
        targetY,
        progress: 0,
        speed: 0.004 + Math.random() * 0.008
      });
    };

    let frameCount = 0;

    // Animation loop
    const draw = () => {
      frameCount++;
      
      // Update mouse easing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      // Update Node values from props
      nodes[0].value = userProfile.curiosity;
      nodes[1].value = userProfile.anger;
      nodes[2].value = userProfile.novelty;
      nodes[3].value = userProfile.familiarity;
      nodes[4].value = 1 - userProfile.shortFormDwell;

      // Clean background
      ctx.fillStyle = reveal ? 'rgba(5, 6, 8, 0.15)' : 'rgba(5, 6, 8, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Large, Atmospheric Background Glows (Gradual shifts)
      // Drift glows slowly using mouse coordinates and scroll position
      const parallaxScrollShift = scrollProgress * height * 0.15;
      
      // Left Cyan Glow
      const glow1X = 0.2 * width + Math.sin(frameCount * 0.002) * 50;
      const glow1Y = 0.4 * height - parallaxScrollShift + Math.cos(frameCount * 0.001) * 30;
      const grad1 = ctx.createRadialGradient(glow1X, glow1Y, 10, glow1X, glow1Y, 300);
      grad1.addColorStop(0, 'rgba(0, 229, 255, 0.05)');
      grad1.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(glow1X, glow1Y, 300, 0, Math.PI * 2);
      ctx.fill();

      // Right Red Glow (Grows intense in outrage section or with anger user traits)
      const glow2X = 0.8 * width + Math.cos(frameCount * 0.002) * 60;
      const glow2Y = 0.6 * height - parallaxScrollShift + Math.sin(frameCount * 0.0015) * 40;
      const outrageIntensity = Math.max(userProfile.anger * 0.08, activeSection === 1 || activeSection === 3 ? 0.08 : 0.02);
      
      const grad2 = ctx.createRadialGradient(glow2X, glow2Y, 10, glow2X, glow2Y, 350);
      grad2.addColorStop(0, `rgba(255, 51, 85, ${outrageIntensity})`);
      grad2.addColorStop(1, 'rgba(5, 6, 8, 0)');
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(glow2X, glow2Y, 350, 0, Math.PI * 2);
      ctx.fill();

      // 2. Parallax vertical scroll offset for drawing nodes
      // Subtracts a fraction of scroll offset to make background drift slower than content (depth effect)
      const centerYOffset = -parallaxScrollShift;
      
      const centerX = width / 2;
      const centerY = height / 2 + centerYOffset;

      // 3. Update Node easing targets based on activeSection prop
      const resolvedNodes = nodes.map(node => {
        // Clamp index safety
        const targetSec = Math.min(node.targets.length - 1, Math.max(0, activeSection));
        const target = node.targets[targetSec];

        // Smoothly interpolate coordinate parameters (0 to 1)
        node.easeX += (target.x - node.easeX) * 0.05;
        node.easeY += (target.y - node.easeY) * 0.05;

        // Map to actual pixel screen width/height, applying node floating wiggle
        const wiggleX = Math.sin(frameCount * 0.012 + node.pulseOffset) * 12;
        const wiggleY = Math.cos(frameCount * 0.012 + node.pulseOffset) * 12;

        return {
          ...node,
          currentX: node.easeX * width + wiggleX,
          currentY: node.easeY * height + centerYOffset + wiggleY
        };
      });

      // Spawning particles
      resolvedNodes.forEach(node => {
        // Suppress spawns if final audit (index 5)
        if (activeSection === 5) return;

        let spawnChance = 0.015 + node.value * 0.04;
        if (activeCardIndex !== undefined && activeCardIndex !== null) {
          spawnChance *= 2.2; 
        }
        if (Math.random() < spawnChance) {
          spawnParticle(node, centerX, centerY);
        }
      });

      // Connections overlay in Reveal Mode
      if (reveal) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        
        resolvedNodes.forEach((node, i) => {
          resolvedNodes.forEach((otherNode, j) => {
            if (i < j && activeSection !== 5) {
              ctx.beginPath();
              ctx.moveTo(node.currentX, node.currentY);
              ctx.lineTo(otherNode.currentX, otherNode.currentY);
              ctx.stroke();
            }
          });

          if (activeSection !== 5) {
            ctx.beginPath();
            const strength = node.value;
            ctx.strokeStyle = node.id === 'anger' 
              ? `rgba(255, 51, 85, ${strength * 0.12})` 
              : `rgba(0, 229, 255, ${strength * 0.12})`;
            ctx.lineWidth = strength * 2;
            ctx.moveTo(node.currentX, node.currentY);
            ctx.lineTo(centerX, centerY);
            ctx.stroke();

            ctx.fillStyle = node.id === 'anger' ? 'rgba(255, 51, 85, 0.35)' : 'rgba(0, 229, 255, 0.35)';
            ctx.font = '9px "JetBrains Mono"';
            const tagText = `${node.name.toUpperCase()}::${Math.round(node.value * 100)}%`;
            ctx.fillText(tagText, node.currentX - 50, node.currentY - 15);
          }
        });
      }

      // Draw and Update Particles
      particles.forEach((p) => {
        p.progress += p.speed;
        
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        
        // Curve particle orbits slightly
        const currentTargetX = p.targetX + (dy * 0.08 * Math.sin(p.progress * Math.PI));
        const currentTargetY = p.targetY - (dx * 0.08 * Math.sin(p.progress * Math.PI));

        p.x += (currentTargetX - p.x) * 0.04;
        p.y += (currentTargetY - p.y) * 0.04;

        // Mouse repulsion
        const mdx = mouseRef.current.x - p.x;
        const mdy = mouseRef.current.y - p.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 100) {
          const force = (100 - mDist) / 100;
          p.x -= (mdx / mDist) * force * 15;
          p.y -= (mdy / mDist) * force * 15;
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (1 - p.progress) * (reveal ? 0.8 : 0.35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Remove completed particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].progress >= 1.0) {
          particles.splice(i, 1);
        }
      }

      // Draw Nodes
      resolvedNodes.forEach(node => {
        // Disperse logic hides dots completely in Stage 5
        if (activeSection === 5) return;

        const radius = 6 + node.value * 12;
        
        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, radius + (reveal ? Math.sin(frameCount * 0.05) * 3 : 0), 0, Math.PI * 2);
        ctx.fillStyle = node.id === 'anger' ? 'rgba(255, 51, 85, 0.08)' : 'rgba(0, 229, 255, 0.08)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.currentX, node.currentY, reveal ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = reveal ? 0.75 : 0.35;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (reveal) {
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.currentX, node.currentY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Draw Center User Focus node (hide if in stage 5 final)
      if (activeSection !== 5) {
        const centerPulse = 12 + Math.sin(frameCount * 0.03) * 3 + (userProfile.anger * 6);
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerPulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = userProfile.anger > 0.6 ? 'rgba(255, 51, 85, 0.03)' : 'rgba(0, 229, 255, 0.03)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, centerPulse, 0, Math.PI * 2);
        ctx.strokeStyle = userProfile.anger > 0.6 ? 'rgba(255, 51, 85, 0.25)' : 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fillStyle = userProfile.anger > 0.6 ? '#ff3355' : '#00e5ff';
        ctx.fill();

        if (reveal) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.font = '8px "JetBrains Mono"';
          ctx.fillText('SUBJECT_NODE_0', centerX - 35, centerY + 20);
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [reveal, userProfile, activeCardIndex, scrollProgress, activeSection]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
        opacity: reveal ? 0.95 : 0.65,
        transition: 'opacity 0.8s ease'
      }}
    />
  );
};
