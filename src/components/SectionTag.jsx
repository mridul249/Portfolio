import { motion } from 'framer-motion';
import content from '../data/content.json';

// Numbered mono section eyebrow, e.g. "01/WORK". The number is derived from
// the section's position in content.nav, so reordering the JSON renumbers
// the whole site.
export default function SectionTag({ id, label }) {
  const i = content.nav.findIndex((n) => n.id === id);
  const item = content.nav[i];
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mono mb-10 text-[10px] text-accent"
    >
      {i === -1 ? label : `${String(i + 1).padStart(2, '0')}/${item.label}`}
    </motion.p>
  );
}
