import { useState, useEffect, useRef } from 'react';
import { getSkillBadges, getUploadUrl } from '../services/api';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const LEVEL_ORDER = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };

function SkillBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading && badges.length > 0) {
      const items = gsap.utils.toArray('.badge-reveal', containerRef.current);
      items.forEach((el) => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          {
            scrollTrigger: { trigger: el, start: '-120 bottom', end: 'bottom 80%', scrub: true },
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      });
      ScrollTrigger.refresh();
    }
  }, { dependencies: [loading, badges], scope: containerRef });

  useEffect(() => {
    getSkillBadges()
      .then(data => { setBadges(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || badges.length === 0) return null;

  // Group by category, sort categories alphabetically
  const categories = [...new Set(badges.map(b => b.category))].sort();

  return (
    <section id="skill-badges" className="section">
      <div className="container" ref={containerRef}>
        <h2 className="headline-2 mb-4 reveal-up">Skill Badges</h2>
        <p className="text-zinc-400 mb-10 max-w-[50ch] reveal-up">
          A quick glance at my tech stack and proficiency levels across different domains.
        </p>

        <div className="space-y-10">
          {categories.map((cat) => {
            const catBadges = badges
              .filter(b => b.category === cat)
              .sort((a, b) => (LEVEL_ORDER[b.level] || 0) - (LEVEL_ORDER[a.level] || 0));

            return (
              <div key={cat} className="badge-reveal">
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{cat}</h3>
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2.5">
                  {catBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="group relative flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-default"
                      style={{
                        borderColor: badge.color + '40',
                        backgroundColor: badge.color + '0d',
                        boxShadow: `0 0 0 0 ${badge.color}00`,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.boxShadow = `0 4px 20px ${badge.color}30`;
                        e.currentTarget.style.borderColor = badge.color + '80';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.boxShadow = `0 0 0 0 ${badge.color}00`;
                        e.currentTarget.style.borderColor = badge.color + '40';
                      }}
                    >
                      {/* Icon */}
                      {badge.icon_url ? (
                        <img
                          src={badge.icon_url.startsWith('http') ? badge.icon_url : getUploadUrl(badge.icon_url)}
                          alt={badge.name}
                          className="w-5 h-5 object-contain shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                          style={{ backgroundColor: badge.color, color: '#fff' }}
                        >
                          {badge.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}

                      {/* Name */}
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-none">
                        {badge.name}
                      </span>

                      {/* Level dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 opacity-80"
                        style={{ backgroundColor: badge.color }}
                        title={badge.level}
                      />

                      {/* Tooltip on hover */}
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10"
                        style={{ backgroundColor: badge.color, color: '#fff' }}>
                        {badge.level}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: badge.color }} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default SkillBadges;
