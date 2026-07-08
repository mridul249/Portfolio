// src/components/LadderBot.jsx
import { useEffect, useRef } from 'react';

const STATE = {
  IDLE: 'idle',
  CLIMBING: 'climbing',
  FALLING: 'falling',
};

export default function LadderBot() {
  const containerRef = useRef(null);
  const botContainerRef = useRef(null);
  const spriteRef = useRef(null);
  const progressTrackRef = useRef(null);

  const state = useRef(STATE.IDLE);
  const currentY = useRef(0);
  const targetY = useRef(0);
  const fallStart = useRef(0);

  useEffect(() => {
    let rafId;
    const threshold = 2; 
    const fallDuration = 600; 
    const climbLerp = 0.2; 

    const updateTarget = () => {
      if (!containerRef.current) return;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const trackHeight = containerRef.current.clientHeight;
      targetY.current = progress * trackHeight;
    };

    const loop = (time) => {
      updateTarget();
      const dy = targetY.current - currentY.current;

      if (state.current === STATE.FALLING) {
        if (time - fallStart.current > fallDuration) {
          currentY.current = targetY.current;
          state.current = STATE.IDLE;
        } else if (dy < -threshold) {
          state.current = STATE.CLIMBING;
        }
      } else {
        if (dy > threshold) {
          state.current = STATE.FALLING;
          fallStart.current = time;
        } else if (dy < -threshold) {
          state.current = STATE.CLIMBING;
          currentY.current += dy * climbLerp; 
        } else {
          state.current = STATE.IDLE;
          currentY.current = targetY.current;
        }
      }

      if (botContainerRef.current && spriteRef.current) {
        if (state.current !== STATE.FALLING) {
          botContainerRef.current.style.transform = `translateY(${currentY.current}px)`;
        }
        spriteRef.current.dataset.state = state.current;
      }

      if (progressTrackRef.current) {
        progressTrackRef.current.style.height = `${targetY.current}px`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      id="pipeline-ladder"
      ref={containerRef}
      className="fixed left-[4.5rem] top-[15vh] bottom-[15vh] w-6 z-40 pointer-events-none"
    >
      {/* Background Track (Thin dashed line) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] -translate-x-1/2 border-l border-dashed border-[#404040] z-0" />

      {/* Lit Green Progress Track */}
      <div
        ref={progressTrackRef}
        className="absolute top-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.4)] z-10"
        style={{ height: '0px', willChange: 'height' }}
      />

      {/* Rungs (Thin horizontal hash marks matching image 2) */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center z-10">
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} className="w-[14px] h-[2px] bg-[#404040]" />
        ))}
      </div>

      {/* Bot Container */}
      <div
        ref={botContainerRef}
        className="absolute left-1/2 -ml-[12px] top-[-12px] w-[24px] h-[24px] z-30"
        style={{ willChange: 'transform' }}
      >
        {/* Placeholder bot face matching the minimalist aesthetic - replace with actual sprite/canvas component */}
        <div 
          ref={spriteRef} 
          className="ladder-bot-sprite w-full h-full bg-[#111] border-[1.5px] border-[#4ade80] rounded-[4px] shadow-[0_0_10px_rgba(74,222,128,0.3)] flex items-center justify-center gap-[2px]"
          data-state="idle"
        >
          <div className="w-1.5 h-1.5 bg-[#4ade80]" />
          <div className="w-1.5 h-1.5 bg-[#4ade80]" />
        </div>
      </div>

      <style>{`
        .ladder-bot-sprite {
          transition: transform 0.15s ease-out;
        }
        
        .ladder-bot-sprite[data-state="idle"] {
          transform: scale(1);
        }
        
        .ladder-bot-sprite[data-state="climbing"] {
          animation: ladder-climb 0.3s infinite alternate ease-in-out;
        }
        
        .ladder-bot-sprite[data-state="falling"] {
          animation: ladder-fall 0.6s forwards cubic-bezier(0.5, 0, 1, 1);
        }

        @keyframes ladder-climb {
          0% { transform: translateY(0px) rotate(-6deg); }
          100% { transform: translateY(-4px) rotate(6deg); }
        }

        @keyframes ladder-fall {
          0% { 
            transform: translate(0, 0) rotate(0deg); 
            opacity: 1; 
          }
          20% { 
            transform: translate(-15px, -10px) rotate(-25deg); 
            opacity: 1; 
          }
          100% { 
            transform: translate(-30px, 120px) rotate(-180deg); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}