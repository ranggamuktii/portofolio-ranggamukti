import { useState, useEffect, useRef } from 'react';
import { getCertifications, getUploadUrl } from '../services/api';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!loading && certifications.length > 0) {
      const elements = gsap.utils.toArray('.cert-reveal', containerRef.current);
      elements.forEach((el, i) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: el,
              start: '-150 bottom',
              end: 'bottom 80%',
              scrub: true,
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          }
        );
      });
      ScrollTrigger.refresh();
    }
  }, { dependencies: [loading, certifications], scope: containerRef });

  useEffect(() => {
    getCertifications()
      .then(data => { setCertifications(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading || certifications.length === 0) return null;

  return (
    <section id="certifications" className="section">
      <div className="container" ref={containerRef}>
        <h2 className="headline-2 mb-4 reveal-up">Certifications &amp; Badges</h2>
        <p className="text-zinc-400 mb-10 max-w-[50ch] reveal-up">
          Verified credentials and skill badges I&#39;ve earned along the way.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="cert-reveal group relative bg-zinc-800/50 border border-zinc-700/30 hover:border-sky-500/40 rounded-2xl p-5 flex gap-4 items-start transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5 hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="w-14 h-14 rounded-xl bg-zinc-900/80 border border-zinc-700/50 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                {cert.badge_img ? (
                  <img
                    src={getUploadUrl(cert.badge_img)}
                    alt={cert.name}
                    className="w-full h-full object-contain p-1.5"
                    loading="lazy"
                  />
                ) : (
                  <span className="material-symbols-rounded text-sky-400 text-2xl">workspace_premium</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-zinc-100 text-sm leading-snug mb-1 group-hover:text-sky-400 transition-colors">
                  {cert.name}
                </h3>
                <p className="text-xs font-medium text-sky-500 dark:text-sky-400 mb-1">{cert.issuer}</p>
                {cert.issue_date && (
                  <p className="text-xs text-zinc-500 font-mono">{cert.issue_date}</p>
                )}

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-zinc-400 hover:text-sky-400 transition-colors group/link"
                  >
                    <span className="material-symbols-rounded text-[14px]">verified</span>
                    Verify Credential
                    <span className="material-symbols-rounded text-[12px] opacity-0 group-hover/link:opacity-100 translate-x-0 group-hover/link:translate-x-0.5 transition-all">arrow_forward</span>
                  </a>
                )}
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-b-2xl"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certifications;
