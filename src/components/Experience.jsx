import { useState, useEffect, useRef } from 'react';
import { getExperiences, getSettings } from '../services/api';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading && experiences.length > 0) {
      const elements = gsap.utils.toArray('.reveal-up', containerRef.current);
      elements.forEach((element) => {
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
      ScrollTrigger.refresh();
    }
  }, { dependencies: [loading, experiences], scope: containerRef });

  useEffect(() => {
    Promise.all([getExperiences(), getSettings()])
      .then(([expData, setData]) => {
        setExperiences(expData);
        setSettings(setData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="experience" className="section">
      <div className="container">
        <h2 className="headline-2 mb-4 reveal-up">Experience & Education</h2>
        <p className="text-zinc-400 mb-10 max-w-[50ch] reveal-up">
          A brief timeline of my professional journey and studies.
        </p>

        {loading ? (
           <div className="flex justify-center py-10">
             <div className="w-8 h-8 border-2 border-zinc-700 border-t-sky-500 rounded-full animate-spin"></div>
           </div>
        ) : experiences.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">No experience records found.</p>
        ) : (
          <div ref={containerRef} className="relative">
            <div className="absolute left-[14px] md:left-[24px] top-4 bottom-0 w-[2px] bg-zinc-800"></div>

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-10 md:pl-16 reveal-up">
                  {/* Timeline dot */}
                  <div className={`absolute left-[9px] md:left-[19px] top-[26px] md:top-[28px] w-[12px] h-[12px] rounded-full border-[3px] shadow-[0_0_0_4px_var(--bg-card)] ${
                    !exp.is_education
                      ? 'border-sky-400 bg-sky-900 [--bg-card:#18181b]'
                      : 'border-emerald-400 bg-emerald-900 [--bg-card:#18181b]'
                  } z-10`}></div>

                  {/* Card */}
                  <div className="bg-zinc-800/50 rounded-2xl p-5 md:p-6 border border-zinc-700/30 hover:border-zinc-600/50 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                          {exp.company_logo ? (
                            <img src={exp.company_logo} alt={exp.company} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-rounded text-zinc-400 text-xl">{exp.logo_icon || (exp.is_education ? 'school' : 'work')}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-sky-400 transition-colors">{exp.title}</h3>
                          <p className="text-sm font-medium text-zinc-400 mt-0.5">{exp.company} {exp.location && `• ${exp.location}`}</p>
                        </div>
                      </div>
                      
                      <span className="text-xs font-mono font-medium text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-700/40 shrink-0 self-start">
                        {exp.start_date} — {exp.end_date}
                      </span>
                    </div>

                    <div className="text-sm text-zinc-400 leading-relaxed mt-2">
                      {exp.description.split(/(?:\n- | - |^- )/).filter(Boolean).map((line, i, arr) => {
                        const text = line.trim();
                        const isList = arr.length > 1 || exp.description.trim().startsWith('-');
                        if (isList) {
                          return (
                            <div key={i} className="flex items-start gap-2 mb-1.5">
                              <span>-</span>
                              <span>{text}</span>
                            </div>
                          );
                        }
                        return <p key={i} className="whitespace-pre-line">{text}</p>;
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center reveal-up">
          <a href="https://linkedin.com/in/ranggamuktii" target="_blank" rel="noreferrer" className="btn btn-primary shadow-lg shadow-sky-500/20">
            View Full Profile
            <span className="material-symbols-rounded" aria-hidden="true">open_in_new</span>
          </a>
          {settings?.cv_link && settings.cv_link !== '#' && (
            <a href={settings.cv_link} target="_blank" rel="noreferrer" className="btn btn-outline">
              Download Resume
              <span className="material-symbols-rounded" aria-hidden="true">download</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default Experience;
