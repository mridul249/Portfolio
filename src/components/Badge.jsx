import content from '../data/content.json';
import { trackAction } from '../lib/analytics.js';
// Fixed vertical tab docked to the right viewport edge (awards-widget style),
export default function Badge() {
  return (
    <a
      href={content.profile.links.github}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        trackAction('Open Github', 'Github')
      }}
      className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-l-md border border-r-0 border-edge bg-cream px-1.5 py-3 lg:flex"
      title="GitHub"
    >
      <span className="font-headline text-[11px] font-black leading-none text-base">
        <img src="/github.svg" alt="GitHub" className="h-[18px] w-[18px]" />
      </span>
      <span
        className="mono text-[8px] font-semibold text-base"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {content.badge.label}
      </span>
    </a>
  );
}
