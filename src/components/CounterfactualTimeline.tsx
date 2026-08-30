import React, { useEffect, useState } from 'react';
import { SEED_POSTS, SimulationEngine } from './SimulationEngine';
import type { FeedItem, UserProfile } from './SimulationEngine';

interface CounterfactualTimelineProps {
  userChoice: 'neutral' | 'outrage';
}

export const CounterfactualTimeline: React.FC<CounterfactualTimelineProps> = ({ userChoice }) => {
  const [yourFeed, setYourFeed] = useState<FeedItem[]>([]);
  const [otherFeed, setOtherFeed] = useState<FeedItem[]>([]);
  const [svgAnimate, setSvgAnimate] = useState(false);

  useEffect(() => {
    const engine = new SimulationEngine();
    
    // Calculate profile parameters
    const userProfile: UserProfile = userChoice === 'outrage'
      ? { curiosity: 0.6, anger: 0.9, novelty: 0.6, familiarity: 0.2, shortFormDwell: 0.8 }
      : { curiosity: 0.6, anger: 0.1, novelty: 0.5, familiarity: 0.8, shortFormDwell: 0.4 };
      
    const otherProfile: UserProfile = userChoice === 'outrage'
      ? { curiosity: 0.6, anger: 0.1, novelty: 0.5, familiarity: 0.8, shortFormDwell: 0.4 }
      : { curiosity: 0.6, anger: 0.9, novelty: 0.6, familiarity: 0.2, shortFormDwell: 0.8 };

    const activeFeed = engine.getCounterfactualFeed(SEED_POSTS, userProfile);
    const counterfactualFeed = engine.getCounterfactualFeed(SEED_POSTS, otherProfile);

    if (userChoice === 'outrage') {
      setYourFeed(activeFeed.filter(item => item.type === 'outrage' || item.type === 'politics').slice(0, 2));
      setOtherFeed(counterfactualFeed.filter(item => item.type === 'neutral' || item.type === 'lifestyle' || item.type === 'novelty').slice(0, 2));
    } else {
      setYourFeed(activeFeed.filter(item => item.type === 'neutral' || item.type === 'lifestyle' || item.type === 'novelty').slice(0, 2));
      setOtherFeed(counterfactualFeed.filter(item => item.type === 'outrage' || item.type === 'politics').slice(0, 2));
    }

    setTimeout(() => setSvgAnimate(true), 200);
  }, [userChoice]);

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span className="mono-metric">STAGE_06 // COUNTERFACTUAL ENGINE</span>
        <h2 style={{ marginTop: '10px', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          Diverging Timelines
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '560px', margin: '8px auto 0 auto', lineHeight: '1.5' }}>
          Observe how a single click branches your narrative. Your choice locked out an entire timeline, creating a filter bubble.
        </p>
      </div>

      {/* SVG Tree Diagram */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '32px',
        position: 'relative',
        height: '160px'
      }}>
        <svg width="400" height="150" viewBox="0 0 400 150" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Root Node */}
          <circle cx="200" cy="20" r="6" fill="#f8fafc" />
          <text x="200" y="8" textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontFamily="var(--font-mono)">
            ROOT_NODE [YOU]
          </text>

          {/* Left Branch */}
          <path
            d="M 200 20 C 130 50, 100 80, 100 110"
            fill="none"
            stroke={userChoice === 'outrage' ? 'var(--accent-red)' : 'var(--accent-blue)'}
            strokeWidth={userChoice === 'outrage' ? '2.5' : '1'}
            strokeDasharray="400"
            strokeDashoffset={svgAnimate ? '0' : '400'}
            style={{
              transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: userChoice === 'outrage' ? 1 : 0.25
            }}
          />

          {/* Right Branch */}
          <path
            d="M 200 20 C 270 50, 300 80, 300 110"
            fill="none"
            stroke={userChoice === 'neutral' ? 'var(--accent-blue)' : 'var(--accent-red)'}
            strokeWidth={userChoice === 'neutral' ? '2.5' : '1'}
            strokeDasharray="400"
            strokeDashoffset={svgAnimate ? '0' : '400'}
            style={{
              transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: userChoice === 'neutral' ? 1 : 0.25
            }}
          />

          {/* Left Target */}
          <circle
            cx="100"
            cy="110"
            r={userChoice === 'outrage' ? '7' : '4'}
            fill={userChoice === 'outrage' ? 'var(--accent-red)' : 'var(--accent-blue)'}
            filter={userChoice === 'outrage' ? 'url(#glow-red)' : 'url(#glow-cyan)'}
            style={{ opacity: svgAnimate ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}
          />
          <text x="100" y="132" textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontFamily="var(--font-mono)">
            {userChoice === 'outrage' ? 'PATH_A [ACTIVE]' : 'PATH_A [LOCKED]'}
          </text>

          {/* Right Target */}
          <circle
            cx="300"
            cy="110"
            r={userChoice === 'neutral' ? '7' : '4'}
            fill={userChoice === 'neutral' ? 'var(--accent-blue)' : 'var(--accent-red)'}
            filter={userChoice === 'neutral' ? 'url(#glow-cyan)' : 'url(#glow-red)'}
            style={{ opacity: svgAnimate ? 1 : 0, transition: 'opacity 0.5s 0.8s' }}
          />
          <text x="300" y="132" textAnchor="middle" fill="var(--text-secondary)" fontSize="8" fontFamily="var(--font-mono)">
            {userChoice === 'neutral' ? 'PATH_B [ACTIVE]' : 'PATH_B [LOCKED]'}
          </text>

          {/* Flow Indicator */}
          {svgAnimate && (
            <circle
              r="3.5"
              fill={userChoice === 'outrage' ? 'var(--accent-red)' : 'var(--accent-blue)'}
              filter={userChoice === 'outrage' ? 'url(#glow-red)' : 'url(#glow-cyan)'}
            >
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                path={userChoice === 'outrage' ? 'M 200 20 C 130 50, 100 80, 100 110' : 'M 200 20 C 270 50, 300 80, 300 110'}
              />
            </circle>
          )}
        </svg>
      </div>

      {/* Side-by-side feed timelines */}
      <div className="split-timeline-container">
        {/* Active choice feed column */}
        <div className="timeline-column">
          <div className="timeline-header" style={{ borderBottomColor: userChoice === 'outrage' ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
            <span className="mono-metric" style={{ color: userChoice === 'outrage' ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
              YOUR TIMELINE [PATH_ACTIVE]
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Shaped by click: {userChoice === 'outrage' ? 'Outrage & Contention' : 'Civic Standard & Exploration'}
            </p>
          </div>

          {yourFeed.map(item => (
            <div
              key={item.id}
              className="feed-card"
              style={{
                borderColor: userChoice === 'outrage' ? 'rgba(255, 51, 85, 0.3)' : 'rgba(0, 229, 255, 0.3)',
                background: 'rgba(10, 12, 16, 0.5)',
                boxShadow: userChoice === 'outrage' ? '0 0 10px rgba(255, 51, 85, 0.05)' : '0 0 10px rgba(0, 229, 255, 0.05)'
              }}
            >
              <span className="mono-metric" style={{ fontSize: '0.6rem', opacity: 0.6 }}>{item.category}</span>
              <h4 style={{ fontSize: '0.95rem', margin: '6px 0', lineHeight: '1.3' }}>{item.headline}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{item.body.slice(0, 80)}...</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-hairline)', paddingTop: '8px', fontFamily: 'var(--font-mono)' }}>
                <span>MATCH_PROBABILITY: {item.clickProbability}%</span>
                <span>DWELL_TARGET: {item.predictedDwell}s</span>
              </div>
            </div>
          ))}
        </div>

        {/* Counterfactual feed column - Visually locked out */}
        <div className="timeline-column" style={{ position: 'relative' }}>
          <div className="timeline-header" style={{ borderBottomColor: 'var(--text-muted)' }}>
            <span className="mono-metric" style={{ color: 'var(--text-muted)' }}>
              ALTERNATE TIMELINE [PATHWAY_LOCKED]
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Pruned by selection (This information bubble was locked out)
            </p>
          </div>

          {otherFeed.map(item => (
            <div
              key={item.id}
              className="feed-card"
              style={{
                borderColor: 'var(--border-hairline)',
                background: 'rgba(5, 6, 8, 0.3)',
                opacity: 0.25,
                filter: 'blur(1.5px)',
                pointerEvents: 'none'
              }}
            >
              <span className="mono-metric" style={{ fontSize: '0.6rem', opacity: 0.4 }}>{item.category}</span>
              <h4 style={{ fontSize: '0.95rem', margin: '6px 0', lineHeight: '1.3' }}>{item.headline}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>{item.body.slice(0, 80)}...</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-hairline)', paddingTop: '8px', fontFamily: 'var(--font-mono)' }}>
                <span>MATCH_PROBABILITY: {item.clickProbability}%</span>
                <span>DWELL_TARGET: {item.predictedDwell}s</span>
              </div>
            </div>
          ))}

          {/* Blur/Lock Overlay */}
          <div style={{
            position: 'absolute',
            top: '55px',
            left: 0,
            width: '100%',
            height: 'calc(100% - 55px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(5,6,8,0.4)',
            zIndex: 10,
            pointerEvents: 'none',
            textAlign: 'center',
            padding: '16px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: '8px' }}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.65rem', 
              color: 'var(--text-secondary)',
              letterSpacing: '0.1em',
              background: 'rgba(5,6,8,0.85)',
              padding: '6px 12px',
              border: '1px solid var(--border-hairline)'
            }}>
              PATHWAY_PRUNED_BY_CHOICE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
