import { useEffect, useState } from 'react';
import content from '../data/content.json';
import SectionTag from './SectionTag.jsx';
import { safeUrl } from '../lib/security.js';

// Blog section. Fetches from content.articles.apiUrl when one is configured;
// until then (or on any error / empty response) it shows the empty state.
// Expected API shape: [{ "title": "...", "date": "...", "url": "...", "tags": ["..."] }]
export default function Articles() {
  const { apiUrl, emptyMessage } = content.articles;
  const [items, setItems] = useState(null); // null = loading, [] = nothing

  useEffect(() => {
    if (!apiUrl) {
      setItems([]);
      return;
    }
    let alive = true;
    fetch(apiUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => alive && setItems(Array.isArray(data) ? data : []))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
  }, [apiUrl]);

  return (
    <section id="articles" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag id="articles" />

        {items === null ? (
          <p className="mono rule-x py-14 text-[10px] text-dim">FETCHING…</p>
        ) : items.length === 0 ? (
          <p className="mono rule-x py-14 text-[10px] text-dim">[ {emptyMessage} ]</p>
        ) : (
          <div>
            {items.map((a, i) => (
              <a
                key={a.url ?? i}
                href={safeUrl(a.url)}
                target="_blank"
                rel="noreferrer"
                className="rule-x row-hover group grid gap-3 py-8 md:grid-cols-[130px_1fr_110px] md:gap-8"
              >
                <span className="mono text-[10px] text-accent">{String(i + 1).padStart(3, '0')}</span>
                <div>
                  <h3 className="font-headline text-2xl font-extrabold tracking-tight text-cream transition-colors group-hover:text-accent md:text-3xl">
                    {a.title}
                  </h3>
                  {a.tags?.length > 0 && (
                    <p className="mono mt-2 text-[10px] text-grey">{a.tags.join(' · ')}</p>
                  )}
                </div>
                <span className="mono text-[10px] text-grey md:justify-self-end">{a.date}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
