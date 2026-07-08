import { useState } from 'react';
import { motion } from 'framer-motion';
import content from '../data/content.json';

const isComingSoon = (item) => typeof item.status === 'string' && item.status.toLowerCase().includes('coming');

// Compact card in the grid. Click to expand (coming-soon stubs don't expand —
// there's nothing more to show).
function Card({ item, onOpen }) {
  const soon = isComingSoon(item);
  return (
    <motion.button
      layoutId={`proj-${item.index}`}
      type="button"
      onClick={soon ? undefined : onOpen}
      disabled={soon}
      className={`row-hover flex h-full flex-col items-start rounded-lg border p-6 text-left ${
        soon ? 'border-edge opacity-70' : 'border-edge hover:border-accent/40'
      }`}
    >
      <div className="mono flex w-full items-baseline justify-between text-[10px]">
        <span className="text-accent">{item.index}</span>
        {soon && <span className="text-accent">COMING SOON</span>}
      </div>
      <h3
        className={`mt-6 font-headline text-2xl font-black tracking-tight md:text-3xl ${
          soon ? 'text-dim' : 'text-cream'
        }`}
      >
        {item.title}
      </h3>
      <div className="mono mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-6 text-[9px] text-grey">
        {(item.tags ?? []).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {!soon && <span className="mono mt-4 text-[9px] text-dim">CLICK TO EXPAND +</span>}
    </motion.button>
  );
}

// Expanded view: spans the full grid width, carries the details + link.
function Expanded({ item, onClose }) {
  return (
    <motion.article
      layoutId={`proj-${item.index}`}
      className="col-span-full rounded-lg border border-accent/40 p-8"
    >
      <div className="mono flex items-baseline justify-between text-[10px]">
        <span className="text-accent">{item.index}</span>
        <button type="button" onClick={onClose} className="text-grey transition-colors hover:text-accent">
          CLOSE ×
        </button>
      </div>

      <h3 className="mt-6 font-headline text-4xl font-black tracking-tight text-cream md:text-6xl">
        {item.title}
      </h3>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey">
          {item.details ?? item.description}
        </p>

        <div className="mono mt-8 flex flex-wrap gap-2 text-[9px]">
          {(item.tags ?? []).map((t) => (
            <span key={t} className="rounded border border-edge px-2.5 py-1 text-grey">
              {t}
            </span>
          ))}
        </div>

        {item.link && (
          <a
            href={item.link.url}
            target="_blank"
            rel="noreferrer"
            className="mono mt-8 inline-flex items-center gap-3 rounded-lg border border-accent/50 px-5 py-2.5 text-[10px] text-accent transition-colors hover:bg-accent hover:text-base"
          >
            {item.link.label} <span aria-hidden>→</span>
          </a>
        )}
      </motion.div>
    </motion.article>
  );
}

// Full project index at #/projects: a dense card grid; a clicked card morphs
// into a full-width detail panel in place.
export default function ProjectsPage({ onBack }) {
  const [open, setOpen] = useState(null);

  return (
    <main className="relative z-10 px-5 pb-16 pt-28">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={onBack}
          className="mono text-[10px] text-grey transition-colors hover:text-accent"
        >
          ← BACK TO INDEX
        </button>

        <div className="mt-10 flex items-baseline justify-between">
          <h1 className="font-headline text-5xl font-black tracking-tight text-cream md:text-7xl">
            ALL PROJECTS
          </h1>
          <span className="mono text-[10px] text-grey">{String(content.work.length).padStart(3, '0')}</span>
        </div>

        <motion.div layout className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.work.map((item) =>
            open === item.index ? (
              <Expanded key={item.index} item={item} onClose={() => setOpen(null)} />
            ) : (
              <Card key={item.index} item={item} onOpen={() => setOpen(item.index)} />
            )
          )}
        </motion.div>
      </div>
    </main>
  );
}
