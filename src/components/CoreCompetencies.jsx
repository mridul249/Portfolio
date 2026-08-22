import { motion } from 'framer-motion';
import content from '../data/content.json';

// Line icons, 24px, cyan stroke, inheriting currentColor.
const icons = {
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  gauge: (
    <>
      <path d="M3 14a9 9 0 0 1 18 0" />
      <path d="m12 14 4-4" />
      <circle cx="12" cy="14" r="1.2" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M9 20h6M12 16v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] ?? icons.bolt}
    </svg>
  );
}

export default function CoreCompetencies() {
  const { label, items } = content.competencies;
  return (
    <section id="competencies" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mono mb-14 text-[10px] text-accent">{label}</p>

        <div>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="rule-x row-hover group flex items-center gap-6 py-8"
            >
              <span className="text-accent transition-transform duration-300 group-hover:scale-110">
                <Icon name={item.icon} />
              </span>
              <h3 className="font-headline text-2xl font-black uppercase tracking-tight text-cream transition-colors group-hover:text-accent md:text-4xl">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
