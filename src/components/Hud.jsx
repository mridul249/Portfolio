import { useEffect, useRef } from 'react';
import content from '../data/content.json';

// Persistent bottom "system console": live scroll/cursor readouts, current
// section, theme swatch, local clock. Readouts write straight into the DOM
// (refs) so the 60hz updates never re-render React.
export default function Hud({ active }) {
  const scrl = useRef(null);
  const crsr = useRef(null);
  const clock = useRef(null);

  const navIndex = content.nav.findIndex((n) => n.id === active);
  const sectionLabel =
    navIndex === -1 ? '00 — INDEX' : `${String(navIndex + 1).padStart(2, '0')} — ${content.nav[navIndex].label}`;

  useEffect(() => {
    const onScroll = () => {
      if (!scrl.current) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const k = max > 0 ? window.scrollY / max : 0;
      scrl.current.textContent = `SCRL ${k.toFixed(2)}`;
    };
    const onMove = (e) => {
      if (!crsr.current) return;
      crsr.current.textContent = `CRSR ${Math.round(e.clientX)}.${String(Math.round(e.clientY)).padStart(3, '0')}`;
    };
    const tickClock = () => {
      if (!clock.current) return;
      const t = new Intl.DateTimeFormat('en-GB', {
        timeZone: content.meta.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
      clock.current.textContent = `${t} ${content.meta.utcOffset}`;
    };

    onScroll();
    tickClock();
    const clockId = setInterval(tickClock, 1000);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      clearInterval(clockId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className="mono fixed inset-x-0 bottom-0 z-40 flex h-7 items-center justify-between gap-4 border-t border-edge bg-base/90 px-4 text-[9px] text-dim backdrop-blur-sm tabular-nums">
      <span ref={scrl}>SCRL 0.00</span>
      <span ref={crsr} className="hidden sm:inline">CRSR 0.000</span>
      <span className="text-grey">{sectionLabel}</span>
      <span className="hidden items-center gap-2 md:flex">
        THEME
        <span className="h-2 w-2 bg-accent" />
        {content.meta.accent}
      </span>
      <span ref={clock}>--:--:-- {content.meta.utcOffset}</span>
    </div>
  );
}
