import React, { useState } from 'react';
import { audio } from './AudioService';

interface ChoiceGameProps {
  onChoiceMade: (choiceType: 'neutral' | 'outrage') => void;
}

export const ChoiceGame: React.FC<ChoiceGameProps> = ({ onChoiceMade }) => {
  const [selected, setSelected] = useState<'neutral' | 'outrage' | null>(null);
  const [step, setStep] = useState<number>(0);

  const choices = {
    neutral: {
      category: 'CIVICS / STANDARD',
      headline: 'Main Street library expansion project enters final approval phase',
      body: 'The municipal council will review structural schematics next Thursday for the new children\'s pavilion and study wing. The project will add 4,000 square feet of public space and is slated for completion in autumn next year.',
      tag: 'NEUTRAL_RESPONSE'
    },
    outrage: {
      category: 'SOCIETY / OUTRAGE',
      headline: 'Restaurant chain implements dynamic seat-pricing during weekend rush hours',
      body: 'Patrons report a national dining franchise has started charging up to 25% extra for tables reserved during peak evening slots. An automatic "urgency fee" is computed and appended if the table wait time exceeds 20 minutes.',
      tag: 'OUTRAGE_REACTION'
    }
  };

  const handleSelection = (type: 'neutral' | 'outrage') => {
    if (selected) return;
    audio.playSweep();
    setSelected(type);
    setStep(1);
    
    // Progress steps automatically for cinematic timing
    setTimeout(() => {
      setStep(2);
      audio.playClick();
    }, 1500);

    setTimeout(() => {
      setStep(3);
      audio.playReveal();
      onChoiceMade(type);
    }, 3500);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'neutral' | 'outrage') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelection(type);
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <span className="mono-metric">STAGE_04 // ONE SMALL CHOICE</span>
        <h2 style={{ marginTop: '10px', fontSize: '1.6rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Select a Path
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px', maxWidth: '580px', margin: '10px auto 0 auto', lineHeight: '1.5' }}>
          The recommendation model is waiting. Click on one of the headlines below. This single choice will recalculate the network constraints and prune your future timelines.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selected ? '1fr' : '1fr 1fr',
        gap: '24px',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        maxWidth: selected ? '500px' : 'none',
        margin: '0 auto'
      }}>
        {(!selected || selected === 'neutral') && (
          <div
            onClick={() => handleSelection('neutral')}
            onKeyDown={(e) => handleKeyDown(e, 'neutral')}
            tabIndex={selected ? -1 : 0}
            role="button"
            aria-label="Civic Path: Main Street library expansion project enters final approval phase. Press Enter to select."
            className={`feed-card ${selected === 'neutral' ? 'highlight-blue' : ''}`}
            style={{
              opacity: selected && selected !== 'neutral' ? 0.1 : 1,
              transform: selected === 'neutral' ? 'scale(1.02)' : 'none',
              transition: 'all 0.5s ease',
              border: selected === 'neutral' ? '1px solid var(--accent-blue)' : '1px solid var(--border-hairline)'
            }}
          >
            <div className="feed-card-header">
              <span className="mono-metric" style={{ color: selected ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                {choices.neutral.category}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.65rem' }}>PATH_01</span>
            </div>
            <h3 className="feed-card-title">{choices.neutral.headline}</h3>
            <p className="feed-card-body">{choices.neutral.body}</p>
            <div className="feed-card-footer" style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '10px' }}>
              <span className="mono-metric" style={{ fontSize: '0.65rem', color: 'var(--accent-blue)' }}>
                PREDICTED_ENGAGEMENT_LOW
              </span>
            </div>
          </div>
        )}

        {(!selected || selected === 'outrage') && (
          <div
            onClick={() => handleSelection('outrage')}
            onKeyDown={(e) => handleKeyDown(e, 'outrage')}
            tabIndex={selected ? -1 : 0}
            role="button"
            aria-label="Outrage Path: Restaurant chain implements dynamic seat-pricing during weekend rush hours. Press Enter to select."
            className={`feed-card ${selected === 'outrage' ? 'highlight-red' : ''}`}
            style={{
              opacity: selected && selected !== 'outrage' ? 0.1 : 1,
              transform: selected === 'outrage' ? 'scale(1.02)' : 'none',
              transition: 'all 0.5s ease',
              border: selected === 'outrage' ? '1px solid var(--accent-red)' : '1px solid var(--border-hairline)'
            }}
          >
            <div className="feed-card-header">
              <span className="mono-metric" style={{ color: selected ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                {choices.outrage.category}
              </span>
              <span className="mono-metric" style={{ fontSize: '0.65rem' }}>PATH_02</span>
            </div>
            <h3 className="feed-card-title">{choices.outrage.headline}</h3>
            <p className="feed-card-body">{choices.outrage.body}</p>
            <div className="feed-card-footer" style={{ borderTop: '1px solid var(--border-hairline)', paddingTop: '10px', marginTop: '10px' }}>
              <span className="mono-metric" style={{ fontSize: '0.65rem', color: 'var(--accent-red)' }}>
                PREDICTED_ENGAGEMENT_HIGH
              </span>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div style={{
          marginTop: '32px',
          padding: '24px',
          border: '1px solid var(--border-hairline)',
          background: 'var(--bg-card)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          textAlign: 'left',
          animation: 'fadeIn 0.5s ease-out forwards'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '8px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)' }}>SYSTEM_RESPONSE_TRACE</span>
            <span style={{ color: selected === 'outrage' ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
              STATUS::COMPUTING
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: step >= 1 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>[x]</span>
              <span style={{ color: step >= 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                1. REGISTERING USER INTERACTION: {selected === 'outrage' ? 'OUTRAGE_TRIGGER' : 'NEUTRAL_STANDARD'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: step >= 2 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                {step >= 2 ? '[x]' : '[ ]'}
              </span>
              <span style={{ color: step >= 2 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                2. RE-WEIGHTING ALGORITHM PROFILE: {selected === 'outrage' ? 'ANGER +20%, NOVELTY +5%' : 'FAMILIARITY +15%, ANGER -10%'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: step >= 3 ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                {step >= 3 ? '[x]' : '[ ]'}
              </span>
              <span style={{ color: step >= 3 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                3. RE-ROUTING RECOMMENDATION GRAPH: FEED DIVERGING SUCCESSFULLY.
              </span>
            </div>
          </div>

          {step >= 3 && (
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px dashed var(--border-hairline)',
              textAlign: 'center',
              color: 'var(--accent-blue)',
              animation: 'fadeIn 0.5s ease-out forwards'
            }}>
              <p style={{ letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 'bold' }}>
                "YOUR CHOICE WAS NOT THE END OF THE STORY."
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                The algorithm has adapted. Scroll down to see the diverging timelines.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
