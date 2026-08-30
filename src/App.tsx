import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, RefreshCw, ChevronRight, Eye, Play, Sparkles } from 'lucide-react';
import { InfluenceField } from './components/InfluenceField';
import { FictionalFeed } from './components/FictionalFeed';
import { ChoiceGame } from './components/ChoiceGame';
import { CounterfactualTimeline } from './components/CounterfactualTimeline';
import { SystemThoughts } from './components/SystemThoughts';
import { SimulationEngine, SEED_POSTS } from './components/SimulationEngine';
import type { FeedItem, PersonaType } from './components/SimulationEngine';
import { audio } from './components/AudioService';

type Stage = '01_HOOK' | '02_FEED' | '03_REVEAL' | '04_CHOICE' | '05_NETWORK' | '06_TIMELINE' | '07_INSIGHT' | '08_FINAL';

interface LoadingState {
  active: boolean;
  text: string;
}

function App() {
  const [stage, setStage] = useState<Stage>('01_HOOK');
  const [reveal, setReveal] = useState(false);
  const [userChoice, setUserChoice] = useState<'neutral' | 'outrage' | null>(null);
  const [muted, setMuted] = useState(true);
  const [juryMode, setJuryMode] = useState(false);
  const [loading, setLoading] = useState<LoadingState>({ active: false, text: '' });
  
  // Scripted Hook lines
  const [hookLine1, setHookLine1] = useState(false);
  const [hookLine2, setHookLine2] = useState(false);
  const [hookButton, setHookButton] = useState(false);

  // Simulation State
  const engineRef = useRef(new SimulationEngine('CASUAL'));
  const [userProfile, setUserProfile] = useState(engineRef.current.profile);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [activeCardHoverIndex, setActiveCardHoverIndex] = useState<number | null>(null);
  
  // Scroll Position & Section States
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  // Interaction Telemetry Ledger
  const [auditLog, setAuditLog] = useState<string[]>([]);
  const [metricsCount, setMetricsCount] = useState({ clicks: 0, dwells: 0 });

  // Trigger Hook Script on Mount
  useEffect(() => {
    if (stage === '01_HOOK') {
      const t1 = setTimeout(() => setHookLine1(true), 800);
      const t2 = setTimeout(() => setHookLine2(true), 2000);
      const t3 = setTimeout(() => setHookButton(true), 3200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [stage]);

  // Load feed items initial
  useEffect(() => {
    setFeedItems(engineRef.current.getRankedFeed(SEED_POSTS));
  }, []);

  // Track window scroll progress and calculate centered section
  useEffect(() => {
    if (stage === '01_HOOK') return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(progress);

      // Section ID list matching layout DOM
      const sectionIds = ['sec-feed', 'sec-choice', 'sec-loop', 'sec-timeline', 'sec-insight', 'sec-final'];
      let minDiff = Infinity;
      let closestIndex = 0;

      sectionIds.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Distance of section center from viewport center
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const diff = Math.abs(sectionCenter - viewportCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = index;
          }
        }
      });

      setActiveSection(closestIndex);
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger initial run
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [stage]);

  const appendToAudit = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setAuditLog(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const handleMuteToggle = () => {
    const isMuted = audio.toggleMute();
    setMuted(isMuted);
  };

  const handleStartExperience = () => {
    audio.playSweep();
    setStage('02_FEED');
    appendToAudit('SESSION_START // Initializing baseline casual profile');
    
    // Smooth scroll down slightly after loading to encourage user scroll
    setTimeout(() => {
      scrollToSection('sec-feed');
    }, 100);
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Cinematic loading transition before scrolling
  const transitionToSection = (targetId: string, loadingMessage: string) => {
    audio.playSweep();
    setLoading({ active: true, text: loadingMessage });
    
    setTimeout(() => {
      setLoading({ active: false, text: '' });
      scrollToSection(targetId);
    }, 1500);
  };

  const handleItemInteract = (item: FeedItem, action: 'click' | 'dwell') => {
    engineRef.current.recordInteraction(item, action);
    setUserProfile({ ...engineRef.current.profile });
    setFeedItems(engineRef.current.getRankedFeed(SEED_POSTS));

    if (action === 'click') {
      setMetricsCount(prev => ({ ...prev, clicks: prev.clicks + 1 }));
      appendToAudit(`TELEMETRY::CLICK_DETECTION // ID: ${item.id} (${item.category})`);
    } else {
      setMetricsCount(prev => ({ ...prev, dwells: prev.dwells + 1 }));
      appendToAudit(`TELEMETRY::DWELL_RECORDED // Focus duration >1.5s on ID: ${item.id}`);
    }
  };

  const handleChoiceGameSelection = (choiceType: 'neutral' | 'outrage') => {
    setUserChoice(choiceType);
    
    const simulatedItem = choiceType === 'outrage' 
      ? SEED_POSTS.find(i => i.type === 'outrage')! 
      : SEED_POSTS.find(i => i.type === 'neutral')!;
      
    engineRef.current.recordInteraction(simulatedItem, 'click');
    setUserProfile({ ...engineRef.current.profile });
    setFeedItems(engineRef.current.getRankedFeed(SEED_POSTS));
    
    setMetricsCount(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    appendToAudit(`SPLIT_DECISION_COMMIT // Chosen path: ${choiceType.toUpperCase()}`);
  };

  const resetSimulation = () => {
    engineRef.current = new SimulationEngine('CASUAL');
    setUserProfile(engineRef.current.profile);
    setFeedItems(engineRef.current.getRankedFeed(SEED_POSTS));
    setReveal(false);
    setUserChoice(null);
    setAuditLog([]);
    setMetricsCount({ clicks: 0, dwells: 0 });
    transitionToSection('sec-feed', 'RECALIBRATING_MODEL_TO_CASUAL_BASELINE...');
    appendToAudit('DEMO_RESET // Recalibrating model to CASUAL baseline');
  };

  const applyPersona = (persona: PersonaType) => {
    engineRef.current.setPersona(persona);
    setUserProfile({ ...engineRef.current.profile });
    setFeedItems(engineRef.current.getRankedFeed(SEED_POSTS));
    audio.playSweep();
    appendToAudit(`DEMO_OVERRIDE // Simulating profile persona: ${persona}`);
  };

  return (
    <>
      {/* Background visual components */}
      <div className="background-grid"></div>
      <div className="scanline"></div>
      
      <InfluenceField
        reveal={reveal}
        userProfile={userProfile}
        activeCardIndex={activeCardHoverIndex}
        scrollProgress={scrollProgress}
        activeSection={activeSection}
      />

      {/* Floating Global Utility Controls */}
      <div className="audio-control">
        <button onClick={handleMuteToggle} title={muted ? 'Unmute system' : 'Mute system'}>
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      <div className="jury-mode-toggle">
        <button 
          onClick={() => {
            audio.playClick();
            setJuryMode(!juryMode);
          }} 
          className={juryMode ? 'active' : ''}
          title="Toggle Hackathon Presentation Panel"
        >
          {juryMode ? '◆ JURY MODE' : '◇ JURY MODE'}
        </button>
      </div>

      {/* Cinematic Recalibration Loader Overlay */}
      {loading.active && (
        <div className="calibrating-screen">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="glow-effect" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }}></span>
            <span>{loading.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div style={{ flexGrow: 1, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
        
        {/* Stage 01: The hook */}
        {stage === '01_HOOK' && (
          <div className="curious-hook">
            <div style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {hookLine1 && (
                <p className="hook-text" style={{ animation: 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                  YOU THINK YOU CHOSE THIS.
                </p>
              )}
              {hookLine2 && (
                <p className="hook-text" style={{ 
                  animation: 'fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  color: 'var(--accent-blue)',
                  fontSize: '1rem',
                  letterSpacing: '0.3em'
                }}>
                  LET’S LOOK CLOSER.
                </p>
              )}
            </div>

            {hookButton && (
              <div 
                onClick={handleStartExperience}
                className="hook-hint" 
                style={{ 
                  animation: 'fadeIn 1.2s ease forwards',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Play size={12} fill="currentColor" /> ENTER THE INTERFACE
              </div>
            )}
          </div>
        )}

        {/* Unified Vertical Scrolling Acts */}
        {stage !== '01_HOOK' && (
          <div className="narrative-container">
            
            {/* Act 02 & 03: Simulated Feed Section */}
            <section id="sec-feed" className="section-card" style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <div style={{ marginBottom: '24px' }}>
                <span className="mono-metric">STAGE_02 // SYSTEM INTERACTION</span>
                <h1 style={{ fontSize: '1.8rem', marginTop: '10px' }}>THE SURFACE LAYER</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px', lineHeight: '1.5' }}>
                  Welcome to <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>/latent</span>. Underneath this apparently innocent feed, a telemetry engine is calculating what will keep you scrolling. Hover over a post to simulate a dwell signal, or click a headline.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button 
                  onClick={() => {
                    const mode = !reveal;
                    setReveal(mode);
                    audio.playReveal();
                    appendToAudit(`SYSTEM_TELEMETRY // Visibility set to: ${mode ? 'REVEAL_MODE' : 'NORMAL_MODE'}`);
                  }}
                  className={reveal ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Eye size={14} />
                  {reveal ? 'HIDE ENGINE METRICS' : 'REVEAL THE SYSTEM'}
                </button>

                <button 
                  onClick={() => {
                    transitionToSection('sec-choice', 'RECALIBRATING_MODEL_INPUTS...');
                  }}
                  style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
                >
                  CONTINUE <ChevronRight size={14} />
                </button>
              </div>

              <FictionalFeed
                feedItems={feedItems}
                reveal={reveal}
                onItemInteract={handleItemInteract}
                onHoverCard={setActiveCardHoverIndex}
              />
            </section>

            {/* Act 04: One Small Choice Section */}
            <section id="sec-choice" className="section-card" style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <ChoiceGame
                onChoiceMade={(choice) => {
                  handleChoiceGameSelection(choice);
                  setTimeout(() => {
                    transitionToSection('sec-loop', 'PRUNING_ALTERNATIVE_PATHWAYS...');
                  }, 4800);
                }}
              />
            </section>

            {/* Act 05: The Feedback Loop Details Section */}
            <section id="sec-loop" className="section-card" style={{ textAlign: 'left', animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="mono-metric">STAGE_05 // STRUCTURAL MATRIX</span>
                <h2 style={{ marginTop: '10px', fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                  THE FEEDBACK LOOP
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
                  How your micro-actions feed the recommendation loop in real-time.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                <div style={{ borderLeft: '2px solid var(--accent-blue)', paddingLeft: '16px' }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>1. USER BEHAVIOR [INPUT]</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px', lineHeight: '1.4' }}>
                    Every scroll rate, hover duration, and key focus is compiled. The system does not wait for a click.
                  </p>
                </div>
                <div style={{ alignSelf: 'left', marginLeft: '24px', color: 'var(--text-muted)' }}>↓</div>

                <div style={{ borderLeft: '2px solid var(--accent-blue)', paddingLeft: '16px' }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>2. MODEL PREDICTION [CALCULATION]</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px', lineHeight: '1.4' }}>
                    The algorithm updates vectors to estimate the dwell duration of surrounding posts.
                  </p>
                </div>
                <div style={{ alignSelf: 'left', marginLeft: '24px', color: 'var(--text-muted)' }}>↓</div>

                <div style={{ borderLeft: '2px solid var(--accent-blue)', paddingLeft: '16px' }}>
                  <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>3. CONTENT RANKING [OUTPUT]</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px', lineHeight: '1.4' }}>
                    Paths with low scores are pruned. Retentive headlines are boosted to coordinates.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => {
                    transitionToSection('sec-timeline', 'COMPUTING_COUNTERFACTUAL_TIMELINES...');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  OBSERVE THE DIVIDE <ChevronRight size={14} />
                </button>
              </div>
            </section>

            {/* Act 06: Diverging timeline Section */}
            <section id="sec-timeline" className="section-card" style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <CounterfactualTimeline userChoice={userChoice || 'neutral'} />

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => {
                    transitionToSection('sec-insight', 'GENERATING_INTEREST_FINGERPRINT...');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  ANALYZE RESULTS <ChevronRight size={14} />
                </button>
              </div>
            </section>

            {/* Act 07: Radar fingerprint Section */}
            <section id="sec-insight" className="section-card" style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
              <SystemThoughts userProfile={userProfile} />

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => {
                    transitionToSection('sec-final', 'COMPILING_TELEMETRY_LOGS...');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  CONCLUDE AUDIT <ChevronRight size={14} />
                </button>
              </div>
            </section>

            {/* Act 08: Final recap Section */}
            <section id="sec-final" className="section-card" style={{ animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards', textAlign: 'left' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <span className="mono-metric">STAGE_08 // TELEMETRY AUDIT COMPLETE</span>
                <h1 style={{ fontSize: '2.0rem', marginTop: '10px', letterSpacing: '-0.04em' }}>
                  YOU WERE NEVER JUST SCROLLING.
                  </h1>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Every hover delay, scroll speed adjustments, and keyboard navigation step on this page has been harvested. The system did not wait for your explicit choice—it built an interest profile and pruned alternative timelines in the background.
              </p>

              {/* Technical Audit Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                border: '1px solid var(--border-hairline)',
                padding: '16px',
                background: 'rgba(10, 12, 16, 0.6)'
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>TOTAL_CLICKS</span>
                  <p style={{ fontSize: '1.25rem', color: 'var(--accent-blue)', marginTop: '4px', fontWeight: 'bold' }}>
                    {metricsCount.clicks}
                  </p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>DWELL_SIGNALS</span>
                  <p style={{ fontSize: '1.25rem', color: 'var(--accent-blue)', marginTop: '4px', fontWeight: 'bold' }}>
                    {metricsCount.dwells}
                  </p>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>OUTRAGE_SUSCEPTIBILITY</span>
                  <p style={{ fontSize: '1.25rem', color: '#ff3355', marginTop: '4px', fontWeight: 'bold' }}>
                    {Math.round(userProfile.anger * 100)}%
                  </p>
                </div>
              </div>

              {/* Print telemetry log */}
              <div style={{
                background: 'rgba(5, 6, 8, 0.98)',
                border: '1px solid var(--border-hairline)',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                maxHeight: '180px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                color: 'var(--accent-blue)',
                marginBottom: '40px'
              }}>
                <div style={{ color: 'var(--text-muted)', borderBottom: '1px dashed var(--border-hairline)', paddingBottom: '4px', marginBottom: '8px' }}>
                  TELEMETRY_LOG::DUMP_DATA
                </div>
                {auditLog.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)' }}>[no telemetry records logged - hover or focus cards to generate traces]</span>
                ) : (
                  auditLog.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>

              <div style={{
                borderTop: '1px solid var(--border-hairline)',
                paddingTop: '30px',
                textAlign: 'center',
                color: 'var(--text-primary)'
              }}>
                <p style={{ fontStyle: 'italic', fontSize: '1.1rem', letterSpacing: '0.02em', marginBottom: '24px', color: 'var(--accent-blue)' }}>
                  “THE INVISIBLE IS NOT ABSENT. IT IS JUST HIDDEN.”
                </p>
                
                <button 
                  onClick={resetSimulation}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
                >
                  <RefreshCw size={14} /> RUN THE EXPERIMENT AGAIN
                </button>
              </div>
            </section>

          </div>
        )}
      </div>

      {/* Sleek Presentation / Hackathon Jury Panel */}
      {juryMode && stage !== '01_HOOK' && (
        <div className="demo-controller">
          <div className="demo-controller-header">
            <span>JURY_NAVIGATION_PANEL</span>
            <Sparkles size={11} style={{ color: 'var(--accent-blue)' }} />
          </div>

          <div className="demo-controller-buttons">
            <button 
              onClick={() => { scrollToSection('sec-feed'); setReveal(false); }} 
              className={activeSection === 0 && !reveal ? 'active' : ''}
            >
              1. FEED
            </button>
            <button 
              onClick={() => { scrollToSection('sec-feed'); setReveal(true); }} 
              className={activeSection === 0 && reveal ? 'active' : ''}
            >
              2. REVEAL
            </button>
            <button 
              onClick={() => scrollToSection('sec-choice')} 
              className={activeSection === 1 ? 'active' : ''}
            >
              3. CHOICE
            </button>
            <button 
              onClick={() => scrollToSection('sec-timeline')} 
              className={activeSection === 3 ? 'active' : ''}
            >
              4. DIVIDE
            </button>
            <button 
              onClick={() => scrollToSection('sec-insight')} 
              className={activeSection === 4 ? 'active' : ''}
            >
              5. PROFILE
            </button>
            <button 
              onClick={() => scrollToSection('sec-final')} 
              className={activeSection === 5 ? 'active' : ''}
            >
              6. AUDIT
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid var(--border-hairline)', paddingTop: '8px' }}>
            <span className="mono-metric" style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>INJECT PROFILE PERSONA</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              <button 
                onClick={() => applyPersona('NEWS_ADDICT')} 
                style={{ padding: '2px 4px', fontSize: '0.55rem', border: '1px solid var(--accent-red-dim)', color: 'var(--accent-red)' }}
              >
                OUTRAGE
              </button>
              <button 
                onClick={() => applyPersona('TECH')} 
                style={{ padding: '2px 4px', fontSize: '0.55rem' }}
              >
                TECH
              </button>
              <button 
                onClick={() => applyPersona('SPORTS')} 
                style={{ padding: '2px 4px', fontSize: '0.55rem' }}
              >
                SPORTS
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-hairline)', paddingTop: '8px' }}>
            <button onClick={resetSimulation} style={{ flexGrow: 1, padding: '4px', fontSize: '0.65rem' }}>
              RESET MODEL
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
