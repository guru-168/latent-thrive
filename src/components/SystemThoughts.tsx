import React, { useEffect, useRef, useState } from 'react';
import type { UserProfile } from './SimulationEngine';
import { audio } from './AudioService';

interface SystemThoughtsProps {
  userProfile: UserProfile;
}

export const SystemThoughts: React.FC<SystemThoughtsProps> = ({ userProfile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fadeText, setFadeText] = useState(false);

  const handleReveal = () => {
    audio.playReveal();
    setRevealed(true);
    // Slow cinematic delay for climax statement
    setTimeout(() => {
      setFadeText(true);
    }, 2800);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const size = 250;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = 85; // Slightly reduced to guarantee zero viewport boundary clipping

    const labels = ['CURIOSITY', 'OUTRAGE', 'NOVELTY', 'FAMILIARITY', 'DWELL'];
    
    let currentValues = {
      curiosity: userProfile.curiosity,
      anger: userProfile.anger,
      novelty: userProfile.novelty,
      familiarity: userProfile.familiarity,
      dwell: userProfile.shortFormDwell,
    };

    const drawRadar = () => {
      ctx.clearRect(0, 0, size, size);

      // Interpolations for smooth updates
      currentValues.curiosity += (userProfile.curiosity - currentValues.curiosity) * 0.05;
      currentValues.anger += (userProfile.anger - currentValues.anger) * 0.05;
      currentValues.novelty += (userProfile.novelty - currentValues.novelty) * 0.05;
      currentValues.familiarity += (userProfile.familiarity - currentValues.familiarity) * 0.05;
      currentValues.dwell += (userProfile.shortFormDwell - currentValues.dwell) * 0.05;

      const profileData = [
        currentValues.curiosity,
        currentValues.anger,
        currentValues.novelty,
        currentValues.familiarity,
        currentValues.dwell
      ];

      // Draw concentric circular background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxRadius / 4) * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Axes Lines
      const angles = labels.map((_, i) => (Math.PI * 2 / labels.length) * i - Math.PI / 2);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      angles.forEach(angle => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius);
        ctx.stroke();
      });

      // Draw active polygon area
      const vertices = profileData.map((val, i) => {
        const radius = val * maxRadius;
        return {
          x: cx + Math.cos(angles[i]) * radius,
          y: cy + Math.sin(angles[i]) * radius
        };
      });

      ctx.beginPath();
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < vertices.length; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
      ctx.closePath();

      const isRed = currentValues.anger > 0.6;
      ctx.fillStyle = isRed ? 'rgba(255, 51, 85, 0.15)' : 'rgba(0, 229, 255, 0.15)';
      ctx.fill();
      ctx.strokeStyle = isRed ? '#ff3355' : '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw dots and mathematically align label text offsets
      vertices.forEach((v, i) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isRed ? '#ff3355' : '#00e5ff';
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '8px "JetBrains Mono"';
        
        const label = labels[i];
        const valText = `${Math.round(profileData[i] * 100)}%`;
        const displayString = `${label}: ${valText}`;
        
        const cosAngle = Math.cos(angles[i]);
        const textDist = maxRadius + 12;
        
        // Compute alignment offsets to prevent screen edge clipping
        let tx = cx + cosAngle * textDist;
        let ty = cy + Math.sin(angles[i]) * textDist + 3;
        
        if (cosAngle > 0.2) {
          ctx.textAlign = 'left';
        } else if (cosAngle < -0.2) {
          ctx.textAlign = 'right';
        } else {
          ctx.textAlign = 'center';
          // Shift vertically slightly to clear overlapping center axes
          ty += Math.sin(angles[i]) > 0 ? 5 : -5;
        }

        ctx.fillText(displayString, tx, ty);
      });

      animId = requestAnimationFrame(drawRadar);
    };

    drawRadar();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [userProfile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span className="mono-metric">STAGE_07 // ALGORITHMIC IDENTIFICATION</span>
        <h2 style={{ marginTop: '10px', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Your Interest Fingerprint
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '520px', margin: '6px auto 0 auto' }}>
          The dynamic shape represents the model\'s ongoing profiling calculations. Every scroll hover and choice re-vectors the nodes.
        </p>
      </div>

      <div className="fingerprint-container">
        <canvas ref={canvasRef} className="fingerprint-canvas" />
      </div>

      {/* Metric Explanations for Clarity */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        border: '1px solid var(--border-hairline)',
        background: 'rgba(10, 12, 16, 0.4)',
        padding: '16px',
        fontSize: '0.75rem',
        textAlign: 'left',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-secondary)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px 20px',
        marginBottom: '32px'
      }}>
        <div>
          <span style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '2px' }}>◆ CURIOSITY</span>
          Preference for novel, unclassified anomalies and discoveries.
        </div>
        <div>
          <span style={{ color: '#ff3355', display: 'block', marginBottom: '2px' }}>◆ OUTRAGE</span>
          Susceptibility to conflict, HOA arguments, and seat pricing friction.
        </div>
        <div>
          <span style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '2px' }}>◆ NOVELTY</span>
          Search for rare deep ocean footage and new graphene tech.
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>◆ FAMILIARITY</span>
          Retention via standard community updates and mechanical setups.
        </div>
        <div style={{ gridColumn: 'span 2', borderTop: '1px dashed var(--border-hairline)', paddingTop: '8px' }}>
          <span style={{ color: 'var(--accent-blue)', display: 'block', marginBottom: '2px' }}>◆ DWELL ATTENTION RETENTION</span>
          Preference for quick visual hits. High values indicate a degraded attention span targeted for rapid triggers.
        </div>
      </div>

      {!revealed ? (
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleReveal} 
            className="glow-effect" 
            style={{ padding: '14px 28px', fontSize: '0.85rem', fontWeight: '500' }}
          >
            SHOW WHAT THE ALGORITHM THINKS I AM
          </button>
        </div>
      ) : (
        <div className="creepy-reveal-screen" style={{ animation: 'fadeIn 1s ease-out forwards', width: '100%', maxWidth: '520px' }}>
          {!fadeText ? (
            <div style={{ animation: 'fadeIn 0.5s ease-out forwards' }}>
              <span className="mono-metric" style={{ color: 'var(--accent-red)' }}>CLASSIFICATION::PROJECTION_LOCKED</span>
              <h3 style={{ fontSize: '1.25rem', marginTop: '15px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                YOU ARE PREDICTED TO BE:
              </h3>
              <ul style={{
                listStyle: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginTop: '15px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <li style={{ borderBottom: '1px dashed var(--border-hairline)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>CURIOSITY SCORE</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{Math.round(userProfile.curiosity * 100)}%</span>
                </li>
                <li style={{ borderBottom: '1px dashed var(--border-hairline)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>NOVELTY ORIENTATION</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{Math.round(userProfile.novelty * 100)}%</span>
                </li>
                <li style={{ borderBottom: '1px dashed var(--border-hairline)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>EMOTIONAL SUSCEPTIBILITY (ANGER)</span>
                  <span style={{ color: '#ff3355' }}>{Math.round(userProfile.anger * 100)}%</span>
                </li>
                <li style={{ borderBottom: '1px dashed var(--border-hairline)', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>SHORT-FORM RETENTION FOCUS</span>
                  <span style={{ color: 'var(--accent-blue)' }}>{Math.round(userProfile.shortFormDwell * 100)}%</span>
                </li>
              </ul>
            </div>
          ) : (
            <div style={{ animation: 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <h3 style={{ 
                fontSize: '1.8rem', 
                letterSpacing: '-0.03em', 
                color: 'var(--text-primary)', 
                textTransform: 'uppercase',
                lineHeight: '1.2' 
              }}>
                THIS IS NOT WHO YOU ARE.
              </h3>
              <p style={{
                fontSize: '1.05rem',
                color: 'var(--accent-blue)',
                fontStyle: 'italic',
                maxWidth: '480px',
                margin: '16px auto 0 auto',
                lineHeight: '1.5'
              }}>
                This is what the system predicts will keep you scrolling.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
