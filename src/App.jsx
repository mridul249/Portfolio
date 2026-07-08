import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import Loader from './components/Loader.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Experience from './components/Experience.jsx';
import Work from './components/Work.jsx';
import CoreCompetencies from './components/CoreCompetencies.jsx';
import Articles from './components/Articles.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import ProjectsPage from './components/ProjectsPage.jsx';
import Hud from './components/Hud.jsx';
import Badge from './components/Badge.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import RailLadder from './components/RailLadder.jsx';
import Bysters from './bysters/Bysters.jsx';
import { trackVisit } from './lib/analytics.js';

export default function App() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState('hero');
  // Tiny hash router: "#/..." = page route, plain "#id" = home anchor.
  const [route, setRoute] = useState(window.location.hash);
  const isProjects = route.startsWith('#/projects');

  const homeScrollRef = useRef(0); // last scroll position while on the home page
  const enteredFromRef = useRef(''); // home hash we launched the projects page from
  const restoreRef = useRef(false); // next home render should restore homeScrollRef
  const prevRouteRef = useRef(route);
  const didInitRef = useRef(false); // first navigation effect run = initial load

  // Own scroll on reload: the browser's default 'auto' restoration drops you
  // back where you last were (often the bottom). Force the top instead.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  // First-party visitor analytics (no-op unless an endpoint is configured).
  useEffect(() => {
    trackVisit();
  }, []);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Continuously remember where the visitor is on the home page.
  useEffect(() => {
    if (!ready || isProjects) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        homeScrollRef.current = window.scrollY;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ready, isProjects]);

  // Navigation side-effects: leaving to the projects page scrolls it to top and
  // records the origin; returning restores the exact spot you left (or honors an
  // explicit section anchor chosen from the nav).
  useEffect(() => {
    if (!ready) return;
    const prev = prevRouteRef.current;
    const wasProjects = prev.startsWith('#/projects');
    prevRouteRef.current = route;

    // Initial load: land at the top (ignore any stale #section hash), except a
    // page route which renders its own page.
    if (!didInitRef.current) {
      didInitRef.current = true;
      if (!isProjects) window.scrollTo(0, 0);
      return;
    }

    if (isProjects) {
      if (!wasProjects) enteredFromRef.current = prev;
      window.scrollTo(0, 0);
      return;
    }

    if (wasProjects) {
      if (restoreRef.current) {
        restoreRef.current = false;
        const y = homeScrollRef.current;
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
        return;
      }
      const id = route.slice(1);
      if (id) {
        requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView()));
      } else {
        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, homeScrollRef.current)));
      }
      return;
    }

    // Normal in-page anchor nav.
    const id = route.slice(1);
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [route, ready, isProjects]);

  // Return from the projects page to the exact section/scroll you left.
  const goBack = () => {
    restoreRef.current = true;
    const to = enteredFromRef.current || '';
    if (window.location.hash === to) setRoute(to);
    else window.location.hash = to; // '' clears the fragment -> hashchange fires
  };

  // Track which home section owns the viewport (navbar brackets + HUD).
  useEffect(() => {
    if (!ready || isProjects) return;
    const sections = document.querySelectorAll('main section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ready, isProjects]);

  return (
    <LayoutGroup>
      <CustomCursor />

      <AnimatePresence>{!ready && <Loader key="loader" onDone={() => setReady(true)} />}</AnimatePresence>
      {ready && <Navbar active={isProjects ? 'work' : active} />}

      {ready &&
        (isProjects ? (
          <ProjectsPage onBack={goBack} />
        ) : (
          <main className="relative z-10 pb-7">
            <RailLadder />
            <Hero />
            <Marquee />
            <Experience />
            <Work />
            <Articles />
            <About />
            <CoreCompetencies />
            <Contact />
          </main>
        ))}

      {ready && (
        <>
          <Hud active={isProjects ? 'work' : active} />
          <Badge />
          {/* Bysters climb the rail-ladder terrain and follow your scroll. */}
          {!isProjects && <Bysters />}
        </>
      )}
    </LayoutGroup>
  );
}
