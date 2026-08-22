import { useState } from 'react';
import { motion } from 'framer-motion';
import content from '../data/content.json';
import SectionTag from './SectionTag.jsx';
import { trackAction } from '../lib/analytics.js';

export default function About() {
  const { blurb, education,rows } = content.about;
  const [preview, setPreview] = useState(false);
  return (
    <section id="about" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag id="about" />

        <div className="grid gap-12 md:grid-cols-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md text-base leading-relaxed text-cream"
          >
            {blurb}
          </motion.p>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Education Row */}
            <div className="rule-x flex items-baseline justify-between gap-6 py-4">
              <dt className="mono text-[10px] text-grey">{education.label}</dt>
              <dd className="mono flex flex-wrap justify-end gap-x-2 text-right text-[10px] text-white">
                <span>{education.value.bachelors}</span>
                <span className="text-grey/50">|</span>
                <span>{education.value["12th"]}</span>
                <span className="text-grey/50">|</span>
                <span>{education.value["10th"]}</span>
                <span className="text-grey/50">|</span>
              </dd>
            </div>

            {/* Dynamic Rows */}
            {rows.map((row) => (
              <div key={row.label} className="rule-x flex items-baseline justify-between gap-6 py-4">
                <dt className="mono text-[10px] text-grey">{row.label}</dt>
                <dd className="mono text-right text-[10px] text-white">{row.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Resume: inline preview toggle + download. */}
        <div className="rule-x mt-16 pt-2">
          <div className="row-hover flex flex-wrap items-center justify-between gap-4 py-4">
            <span className="mono text-[10px] text-white">RESUME</span>
            <div className="mono flex items-center gap-6 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  setPreview((v) => !v)
                  trackAction('Prev Resume', 'RESUME')
                }}
                className="text-cream transition-colors hover:text-accent"
              >
                {preview ? 'CLOSE PREVIEW ×' : 'PREVIEW ▸'}
              </button>
              <a
                href={content.profile.resume}
                download
                onClick={() => {
                  trackAction('Download Resume', 'RESUME')
                }}
                className="text-grey transition-colors hover:text-accent"
              >
                DOWNLOAD ↓
              </a>
              <a
                href={content.profile.resume}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackAction('Open Resume', 'RESUME')
                }}
                className="text-grey transition-colors hover:text-accent"
              >
                OPEN →
              </a>
            </div>
          </div>
          {preview && (
            <iframe
              src={`${content.profile.resume}#toolbar=0`}
              title="Resume preview"
              className="mb-4 h-[520px] w-full rounded-sm border border-edge bg-panel"
            />
          )}
        </div>
      </div>
    </section>
  );
}
