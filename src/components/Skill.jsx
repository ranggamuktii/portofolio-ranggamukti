import { useState, useEffect, useRef } from 'react';
import SkillCard from './SkillCard';
import SkillSphere from './SkillSphere';
import { getSkills, getUploadUrl } from '../services/api';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Skill() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading && skills.length > 0) {
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
  }, { dependencies: [loading, skills], scope: containerRef });

  useEffect(() => {
    getSkills()
      .then(data => { setSkills(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  // Deduplicate skills by label for both the sphere and the grid
  const uniqueSkills = skills.filter((skill, index, self) =>
    index === self.findIndex((s) => s.label === skill.label)
  );

  return (
    <section className="section">
      <div className="container text-left">
        <h2 className="headline-2 reveal-up">Essential Tools I use</h2>
        <p className="text-zinc-400 mt-3 mb-8 max-w-[50ch] reveal-up">Discover the powerful tools and technologies I use to create exceptional, high-performing websites & applications.</p>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-sky-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left: 3D Skill Sphere */}
            <div className="skill-sphere-section reveal-up">
              <div className="skill-sphere-container">
                <SkillSphere skills={uniqueSkills} />
              </div>
              <p className="skill-sphere-hint">
                <span className="material-symbols-rounded text-sm align-middle mr-1">touch_app</span>
                Drag to rotate the sphere
              </p>
            </div>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {uniqueSkills.map(({ id, img_src, label, description }) => {
                const getIcon = (lbl) => {
                  const l = lbl.toLowerCase();
                  if (l.includes('react')) return '/react.svg';
                  if (l.includes('node')) return '/nodejs.svg';
                  if (l.includes('express')) return '/expressjs.svg';
                  if (l.includes('tailwind')) return '/tailwindcss.svg';
                  if (l.includes('mongo')) return '/mongodb.svg';
                  if (l.includes('java')) return '/javascript.svg';
                  if (l.includes('css')) return '/css3.svg';
                  if (l.includes('laravel')) return '/laravel.svg';
                  if (l.includes('mysql')) return '/mysql.svg';
                  if (l.includes('postgres')) return '/postgresql.svg';
                  if (l.includes('git')) return '/git.svg';
                  return `https://ui-avatars.com/api/?name=${encodeURIComponent(lbl)}&background=38bdf8&color=fff&rounded=true&bold=true`;
                };
                return (
                  <SkillCard key={id} imgSrc={img_src ? getUploadUrl(img_src) : getIcon(label)} label={label} desc={description || 'Development Tool'} classes="reveal-up" />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Skill;
