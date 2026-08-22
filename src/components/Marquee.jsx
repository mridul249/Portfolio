import content from '../data/content.json';

// Auto-scrolling strip of outlined tech chips. Two copies of the list inside
// a w-max track; the keyframe slides it -50% for a seamless loop.
export default function Marquee() {
  const items = content.marquee;
  return (
    <div className="rule-x overflow-hidden py-6" aria-hidden="true">
      <div className="animate-marquee flex w-max gap-3 pr-3">
        {[...items, ...items].map((label, i) => (
          <span
            key={i}
            className="mono whitespace-nowrap rounded-lg border border-accent/25 px-4 py-2 text-[10px] text-grey transition-colors hover:border-accent/60 hover:text-accent"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
