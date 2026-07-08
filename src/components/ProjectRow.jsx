import { motion } from 'framer-motion';

const isComingSoon = (item) => typeof item.status === 'string' && item.status.toLowerCase().includes('coming');

// One project entry: meta column (index + tags), title + description, and the
// project's own outbound link. Entries with status "coming soon" collapse to
// just the dimmed title and a tag.
export default function ProjectRow({ item, i }) {
  const soon = isComingSoon(item);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="rule-x row-hover group grid gap-5 py-10 md:grid-cols-[130px_1fr_130px] md:gap-8"
    >
      <div className="mono text-[10px] leading-[1.9]">
        <div className="text-accent">{item.index}</div>
        {(item.tags ?? []).map((t) => (
          <div key={t} className="text-grey">{t}</div>
        ))}
      </div>

      <div>
        <h3
          className={
            soon
              ? 'font-headline text-4xl font-black tracking-tight text-dim md:text-6xl'
              : 'font-headline text-4xl font-black tracking-tight text-cream transition-colors group-hover:text-accent md:text-6xl'
          }
        >
          {item.title}
        </h3>
        {!soon && item.description && (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-grey">{item.description}</p>
        )}
      </div>

      {soon ? (
        <span className="mono self-start text-[10px] text-accent md:justify-self-end">COMING SOON</span>
      ) : (
        item.link && (
          <a
            href={item.link.url}
            target="_blank"
            rel="noreferrer"
            className="mono self-start text-[10px] text-grey transition-colors hover:text-accent md:justify-self-end"
          >
            {item.link.label} →
          </a>
        )
      )}
    </motion.article>
  );
}
