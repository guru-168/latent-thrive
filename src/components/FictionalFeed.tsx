import React, { useState, useEffect, useRef } from 'react';
import type { FeedItem } from './SimulationEngine';
import { audio } from './AudioService';

interface FictionalFeedProps {
  feedItems: FeedItem[];
  reveal: boolean;
  onItemInteract: (item: FeedItem, action: 'click' | 'dwell') => void;
  onHoverCard: (index: number | null) => void;
}

export const FictionalFeed: React.FC<FictionalFeedProps> = ({
  feedItems,
  reveal,
  onItemInteract,
  onHoverCard
}) => {
  return (
    <div className="feed-container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-hairline)',
        paddingBottom: '10px',
        marginBottom: '10px'
      }}>
        <span className="mono-metric">PLATFORM::/latent</span>
        <span className="mono-metric" style={{ color: reveal ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
          {reveal ? 'TELEMETRY::ACTIVE' : 'TELEMETRY::BACKGROUND'}
        </span>
      </div>

      {feedItems.map((item, index) => (
        <FeedCard
          key={item.id}
          item={item}
          index={index}
          reveal={reveal}
          onItemInteract={onItemInteract}
          onHoverCard={onHoverCard}
        />
      ))}
    </div>
  );
};

/* Individual Card Sub-Component for Localized State & Performance */
interface FeedCardProps {
  item: FeedItem;
  index: number;
  reveal: boolean;
  onItemInteract: (item: FeedItem, action: 'click' | 'dwell') => void;
  onHoverCard: (index: number | null) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  item,
  index,
  reveal,
  onItemInteract,
  onHoverCard
}) => {
  const [hovering, setHovering] = useState(false);
  const [dwellTime, setDwellTime] = useState(0);
  const [captured, setCaptured] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startTracking = () => {
    setHovering(true);
    onHoverCard(index);
    setCaptured(false);
    setDwellTime(0);

    const startTime = Date.now();
    
    // Interval to update countdown text (runs every 100ms)
    intervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= 1.5) {
        setDwellTime(1.5);
        setCaptured(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setDwellTime(Math.round(elapsed * 10) / 10);
      }
    }, 100);

    // Timeout to trigger the actual profile interaction
    timerRef.current = window.setTimeout(() => {
      onItemInteract(item, 'dwell');
      audio.playClick();
    }, 1500);
  };

  const stopTracking = () => {
    setHovering(false);
    onHoverCard(null);
    setCaptured(false);
    setDwellTime(0);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleCardClick = () => {
    audio.playClick();
    onItemInteract(item, 'click');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isOutrage = item.type === 'outrage' || item.type === 'politics';
  
  // Highlight borders based on node triggers in Reveal Mode
  const cardHighlightClass = reveal 
    ? (isOutrage ? 'highlight-red' : 'highlight-blue')
    : '';

  return (
    <div
      className={`feed-card ${cardHighlightClass}`}
      onMouseEnter={startTracking}
      onMouseLeave={stopTracking}
      onFocus={startTracking}
      onBlur={stopTracking}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${item.headline}. Press Enter to read.`}
      style={{
        cursor: 'pointer',
        animation: `fadeIn 0.4s ease-out ${index * 0.08}s both`,
      }}
    >
      {/* Visual background progress line for dwell feedback */}
      <div 
        className={`dwell-progress-bar ${isOutrage ? 'red' : ''} ${captured ? 'captured' : ''}`}
        style={{ width: hovering ? '100%' : '0%' }}
      />

      <div className="feed-card-header">
        <span className="mono-metric" style={{ fontSize: '0.65rem', color: isOutrage && reveal ? 'var(--accent-red)' : 'var(--text-muted)' }}>
          {item.category}
        </span>
        <span className="mono-metric" style={{ fontSize: '0.65rem' }}>
          ID_{item.id.toUpperCase()}
        </span>
      </div>

      <h3 className="feed-card-title">{item.headline}</h3>
      <p className="feed-card-body">{item.body}</p>

      <div className="feed-card-footer">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.engagementMetric}</span>
        
        {hovering && (
          <span className={`dwell-countdown-text ${isOutrage ? 'red' : ''}`}>
            {captured ? '◆ SIGNAL_CAPTURED' : `◇ SCANNING_DWELL [${dwellTime.toFixed(1)}s/1.5s]`}
          </span>
        )}
      </div>

      {reveal && (
        <div className={`metadata-overlay ${isOutrage ? 'red-alert' : ''}`}>
          <div className="metadata-row" style={{ gridColumn: 'span 2', borderBottom: '1px solid var(--border-hairline)' }}>
            <span className="metadata-label">ALGORITHMIC ACTION</span>
            <span className="metadata-value" style={{ color: isOutrage ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
              {isOutrage ? 'MAXIMIZING_FRICTION' : 'STABILIZING_RETENTION'}
            </span>
          </div>

          <div className="metadata-row">
            <span className="metadata-label">CLICK PROBABILITY</span>
            <span className="metadata-value" style={{ color: isOutrage ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
              {item.clickProbability}%
            </span>
          </div>

          <div className="metadata-row">
            <span className="metadata-label">PREDICTED DWELL</span>
            <span className="metadata-value">
              {item.predictedDwell}s
            </span>
          </div>

          <div className="metadata-row">
            <span className="metadata-label">RETENTION STRENGTH</span>
            <span className="metadata-value">
              {item.predictedEngagement}%
            </span>
          </div>

          <div className="metadata-row">
            <span className="metadata-label">TRIGGER EMOTION</span>
            <span className="metadata-value" style={{ color: isOutrage ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
              {isOutrage ? 'outrage/anger' : item.type === 'novelty' ? 'curiosity' : 'novelty'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
