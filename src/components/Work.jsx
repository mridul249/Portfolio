import content from '../data/content.json';
import SectionTag from './SectionTag.jsx';
import ProjectRow from './ProjectRow.jsx';

// Home slice of the project list; the full list lives on #/projects.
export default function Work() {
  const limit = content.workHomeLimit ?? 3;
  const items = content.work.slice(0, limit);

  return (
    <section id="work" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionTag id="work" />
        <div>
          {items.map((item, i) => (
            <ProjectRow key={item.index} item={item} i={i} />
          ))}
        </div>
        <div className="rule-x pt-10">
          <a
            href="#/projects"
            className="mono inline-flex items-center gap-4 rounded-lg border border-accent/50 px-7 py-3.5 text-[11px] text-accent transition-colors hover:bg-accent hover:text-base"
          >
            SEE ALL PROJECTS ({String(content.work.length).padStart(2, '0')})
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
