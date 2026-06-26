import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { getProjects } from '../services/api';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Work() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects();
        const formattedProjects = projects.map((project) => ({
          imgSrc: project.img_src,
          title: project.title,
          tags: project.tags || [],
          projectLink: project.demo_link || project.github_link || '',
          slug: project.slug,
        }));
        setWorks(formattedProjects);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useGSAP(() => {
    if (works.length > 0) {
      const elements = gsap.utils.toArray('#work .reveal-up');
      elements.forEach((element) => {
        // Reset element styles just in case it was previously hidden
        gsap.set(element, { y: 80, opacity: 0 });
        gsap.to(element, {
          scrollTrigger: {
            trigger: element,
            start: '-200 bottom',
            end: 'bottom 80%',
            scrub: true,
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.inOut',
        });
      });
      // Refresh ScrollTrigger to recalculate DOM heights after dynamic render
      ScrollTrigger.refresh();
    }
  }, [works]);

  return (
    <section id="work" className="section">
      <div className="container">
        <h2 className="headline-2 mb-8 reveal-up">My portfolio highlights</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 border-4 border-zinc-300 border-t-sky-400 rounded-full animate-spin"></div>
          </div>
        ) : works.length === 0 ? (
          /* Empty state — rich, professional */
          <div className="flex flex-col items-center text-center py-16 px-6">
            {/* Illustration: code window */}
            <div className="relative mb-8">
              {/* Glow */}
              <div className="absolute -inset-6 bg-gradient-to-br from-[#0ea5e9]/10 via-transparent to-[#6366f1]/10 rounded-full blur-2xl"></div>
              {/* Window frame */}
              <div className="relative w-64 sm:w-72 bg-zinc-800/80 rounded-2xl border border-zinc-700/50 overflow-hidden shadow-xl shadow-zinc-950/30">
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#3f3f46]/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]/80"></span>
                  <span className="ml-2 text-[10px] text-[#71717a] font-mono">projects.js</span>
                </div>
                {/* Code lines */}
                <div className="px-4 py-4 font-mono text-xs leading-relaxed text-left">
                  <p>
                    <span className="text-[#c084fc]">const</span>{' '}
                    <span className="text-[#7dd3fc]">projects</span>{' '}
                    <span className="text-[#71717a]">=</span>{' '}
                    <span className="text-[#fcd34d]">[]</span>
                    <span className="text-[#71717a]">;</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-[#52525b]">{'// '}loading from API...</span>
                  </p>
                  <p className="mt-1">
                    <span className="text-[#c084fc]">await</span>{' '}
                    <span className="text-[#7dd3fc]">deploy</span>
                    <span className="text-[#a1a1aa]">(</span>
                    <span className="text-[#34d399]">&quot;soon&quot;</span>
                    <span className="text-[#a1a1aa]">)</span>
                    <span className="text-[#71717a]">;</span>
                  </p>
                  {/* Blinking cursor */}
                  <span className="inline-block w-2 h-4 bg-sky-400/80 animate-pulse mt-1 rounded-sm"></span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-zinc-200 mb-2">Projects Incoming</h3>
            <p className="text-sm text-zinc-500 max-w-[40ch] mb-6">
              I&apos;m preparing my best work to showcase here. In the meantime, check out my GitHub for the latest code.
            </p>
            <a
              href="https://github.com/ranggamuktii"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              Browse GitHub
              <span className="material-symbols-rounded" aria-hidden="true">open_in_new</span>
            </a>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
            {works.map(({ imgSrc, title, tags, projectLink, slug }, key) => (
              <div key={key} className="break-inside-avoid">
                <ProjectCard imgSrc={imgSrc} title={title} tags={tags} projectLink={projectLink} slug={slug} classes="reveal-up" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Work;
