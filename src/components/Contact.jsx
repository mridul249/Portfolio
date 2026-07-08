import { motion } from 'framer-motion';
import content from '../data/content.json';
import SectionTag from './SectionTag.jsx';
import { decodeEmail } from '../lib/security.js';

export default function Contact() {
  const { profile, contact } = content;
  const email = decodeEmail(profile.emailEnc);

  const rows = [
    { label: 'EMAIL', value: email.toUpperCase(), href: `mailto:${email}`, external: false },
    ...contact.socials.map((s) => ({ label: s.label, value: '', href: profile.links[s.key], external: true })),
    { label: 'RESUME', value: 'PDF', href: profile.resume, external: true },
  ];

  return (
    <section id="contact" className="px-5 pb-28 pt-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag id="contact" />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mono text-[10px] text-grey"
        >
          {contact.sub}
        </motion.p>

        <div className="mt-10">
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              {...(r.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="rule-x row-hover mono flex items-center justify-between gap-4 py-5 text-[10px] text-grey transition-colors hover:text-accent"
            >
              <span className="text-cream">{r.label}</span>
              <span className="flex items-center gap-4">
                {r.value && <span className="hidden sm:inline">{r.value}</span>}
                <span>→</span>
              </span>
            </a>
          ))}
        </div>

        <p className="mono mt-20 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] text-dim">
          <span>© 2026 MRIDUL KUMAR</span>
          <span className="text-accent">▪</span>
          <span>BANGALORE {content.meta.utcOffset}</span>
        </p>
      </div>
    </section>
  );
}
