import { motion } from 'framer-motion';
import content from '../data/content.json';
import SectionTag from './SectionTag.jsx';

function ExperienceRow({ item, i }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="rule-x row-hover grid gap-4 py-9 md:grid-cols-[130px_1fr_200px] md:gap-8"
    >
      <div className="mono text-[10px] text-accent">{item.index}</div>

      <div>
        <h3 className="font-headline text-2xl font-extrabold tracking-tight text-cream md:text-3xl">
          {item.company}
        </h3>
        <p className="mono mt-1 text-[10px] text-grey">{item.role}</p>
        <ul className="mt-4 space-y-1.5">
          {item.points.map((p, j) => (
            <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-grey">
              <span className="mt-[7px] h-1 w-1 shrink-0 bg-accent" />
              {p}
            </li>
          ))}
        </ul>
      </div>

      <span className="mono text-[10px] text-grey md:justify-self-end">{item.period}</span>
    </motion.article>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag id="experience" />
        <div>
          {content.experience.map((item, i) => (
            <ExperienceRow key={item.index} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
