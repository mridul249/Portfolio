import { motion } from 'framer-motion';
import content from '../data/content.json';

// Fixed top bar. Its shell shares layoutId "nav-shell" with the loader stub,
// so the loading bar physically grows into this navbar.
export default function Navbar({ active }) {
  return (
    <motion.header
      layoutId="nav-shell"
      className="fixed inset-x-0 top-0 z-50 border-b border-edge bg-base/85 backdrop-blur-sm"
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5"
      >
        {/* Logo + wordmark */}
        <a href="#hero" className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-[6px] border border-cream/25 font-headline text-[11px] font-extrabold text-cream">
            {content.meta.logo}
          </span>
          <span className="mono hidden text-[10px] text-grey sm:inline">{content.meta.wordmark}</span>
        </a>

        {/* Numbered section list */}
        <ol className="mono hidden items-center gap-6 text-[10px] lg:flex">
          {content.nav.map((item, i) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={isActive ? 'text-accent' : 'text-grey transition-colors hover:text-cream'}
                >
                  {isActive && <span className="mr-1">(</span>}
                  {String(i + 1).padStart(2, '0')}/{item.label}
                  {isActive && <span className="ml-1">)</span>}
                </a>
              </li>
            );
          })}
        </ol>

        {/* Resume + CTA */}
        <div className="flex items-center gap-2.5">
          <a
            href={content.profile.resume}
            target="_blank"
            rel="noreferrer"
            className="mono hidden rounded-full border border-accent/60 px-4 py-1.5 text-[10px] font-semibold text-accent transition-colors hover:bg-accent/10 sm:inline-block"
          >
            RESUME
          </a>
          <a
            href="#contact"
            className="mono rounded-full bg-accent px-4 py-1.5 text-[10px] font-semibold text-base transition-opacity hover:opacity-80"
          >
            GET IN TOUCH
          </a>
        </div>
      </motion.nav>
    </motion.header>
  );
}
