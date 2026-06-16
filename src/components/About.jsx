import { useState, useEffect } from 'react';
import { getSettings, getProjects, getExperiences, getSkills } from '../services/api';

function About() {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState({ projects: 15, experienceYears: 2 });
  const [skillLabels, setSkillLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSettings(), getProjects(), getExperiences(), getSkills()])
      .then(([settingsData, projectsData, experiencesData, skillsData]) => {
        setSettings(settingsData);
        
        let startYear = new Date().getFullYear() - 2;
        if (experiencesData.length > 0) {
           const years = experiencesData.map(e => parseInt(e.start_date)).filter(y => !isNaN(y));
           if (years.length > 0) startYear = Math.min(...years);
        }

        setStats({
          projects: projectsData.length || 15,
          experienceYears: Math.max(1, new Date().getFullYear() - startYear)
        });

        // Deduplicate skill labels
        const unique = [...new Set(skillsData.map(s => s.label))];
        setSkillLabels(unique.slice(0, 6)); // max 6 for the card

        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const aboutItems = [
    { label: 'Projects completed', number: stats.projects },
    { label: 'Years of experience', number: stats.experienceYears },
  ];

  const devName = settings?.hero_title ? settings.hero_title.replace("Hi, I'm ", '') : 'Rangga Mukti';
  const skills = skillLabels.length > 0 ? skillLabels : ['React', 'Node.js', 'Express', 'MySQL', 'Tailwind', 'Figma'];

  return (
    <section id="about" className="section">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1.2fr,1fr] gap-6 md:gap-10 items-stretch">
          
          <div className="bg-zinc-800/50 text-left p-7 rounded-3xl md:p-12 border border-zinc-700/30 reveal-up flex flex-col justify-between">
            {loading ? (
              <div className="animate-pulse space-y-4 mb-6">
                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                <div className="h-4 bg-zinc-700 rounded w-full"></div>
                <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-zinc-300 mb-6 md:mb-10 md:text-lg md:leading-relaxed max-w-[60ch]">
                {settings?.about_text || "I am a passionate fullstack web developer dedicated to creating modern, responsive, and user-friendly web applications."}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8 mt-auto">
              {aboutItems.map(({ label, number }, key) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex items-center">
                    <span className="text-4xl font-bold md:text-5xl text-zinc-100">{number}</span>
                    <span className="text-sky-400 font-bold md:text-4xl">+</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-500 leading-tight max-w-[100px]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Code editor card */}
          <div className="hidden lg:flex flex-col rounded-3xl bg-zinc-900/80 border border-zinc-700/40 font-mono text-[13px] text-zinc-500 select-none shadow-2xl shadow-black/40 reveal-up overflow-hidden code-editor-card min-w-0">
            {/* Scan line overlay */}
            <div className="code-scanline"></div>

            {/* Title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-800/80">
              <span className="w-3 h-3 rounded-full bg-red-400/80 shadow-[0_0_8px_rgba(248,113,113,0.4)]"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-[0_0_8px_rgba(250,204,21,0.4)]"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></span>
              <span className="ml-3 text-[11px] text-zinc-600 font-semibold tracking-wider uppercase">about.js</span>
            </div>
            
            {/* Code body with line numbers */}
            <div className="flex flex-1 p-4 leading-[2]">
              {/* Line numbers */}
              <div className="pr-4 text-right text-zinc-700 select-none border-r border-zinc-800/60 mr-4 font-mono text-[12px] leading-[2]">
                {Array.from({ length: 13 }, (_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Code content */}
              <div className="flex-1 overflow-hidden">
                {/* Line 1: comment */}
                <p className="text-zinc-600 italic">{'// '}&#9889; who am I?</p>

                {/* Line 2: empty */}
                <p>&nbsp;</p>

                {/* Line 3: const developer = { */}
                <p>
                  <span className="text-purple-400 font-bold">const</span>{' '}
                  <span className="text-sky-300">developer</span>{' '}
                  <span className="text-zinc-500">=</span>{' '}
                  <span className="text-zinc-400">{'{'}</span>
                </p>

                {/* Line 4: name */}
                <p className="pl-5 code-line-hover">
                  <span className="text-sky-300">name</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-emerald-400">&quot;{devName}&quot;</span>
                  <span className="text-zinc-600">,</span>
                </p>

                {/* Line 5: role */}
                <p className="pl-5 code-line-hover">
                  <span className="text-sky-300">role</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-emerald-400">&quot;Fullstack Developer&quot;</span>
                  <span className="text-zinc-600">,</span>
                </p>

                {/* Line 6: skills */}
                <p className="pl-5 code-line-hover whitespace-pre-wrap">
                  <span className="text-sky-300">skills</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-zinc-400">[</span>
                  {skills.map((s, i) => (
                    <span key={s} className="inline-block">
                      <span className="text-amber-300">&quot;{s}&quot;</span>
                      {i < skills.length - 1 && <span className="text-zinc-600 mr-1">,</span>}
                    </span>
                  ))}
                  <span className="text-zinc-400">]</span>
                  <span className="text-zinc-600">,</span>
                </p>

                {/* Line 7: experience */}
                <p className="pl-5 code-line-hover">
                  <span className="text-sky-300">experience</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-amber-400">{stats.experienceYears}</span>
                  <span className="text-zinc-600">,</span>
                  <span className="text-zinc-700 italic">{' // years'}</span>
                </p>

                {/* Line 8: projects */}
                <p className="pl-5 code-line-hover">
                  <span className="text-sky-300">projects</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-amber-400">{stats.projects}</span>
                  <span className="text-zinc-600">,</span>
                </p>

                {/* Line 9: coffee */}
                <p className="pl-5 code-line-hover">
                  <span className="text-sky-300">coffee</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-amber-400">Infinity</span>
                  <span className="text-zinc-600">,</span>
                  <span className="text-zinc-700 italic">{' // ☕'}</span>
                </p>

                {/* Line 10: hireable */}
                <p className="pl-5 code-line-hover">
                  <span className="text-sky-300">hireable</span>
                  <span className="text-zinc-600">:</span>{' '}
                  <span className="text-amber-400 font-bold">true</span>
                  <span className="text-zinc-600">,</span>
                </p>

                {/* Line 11: }; */}
                <p>
                  <span className="text-zinc-400">{'}'}</span>
                  <span className="text-zinc-600">;</span>
                </p>

                {/* Line 12: empty */}
                <p>&nbsp;</p>

                {/* Line 13: export with typing cursor */}
                <p>
                  <span className="text-purple-400 font-bold">export default</span>{' '}
                  <span className="text-sky-300">developer</span>
                  <span className="text-zinc-600">;</span>
                  <span className="code-cursor"></span>
                </p>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-t border-zinc-800/80 text-[10px] text-zinc-600">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  JavaScript
                </span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Ln 13, Col 25</span>
                <span>Prettier</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default About;
