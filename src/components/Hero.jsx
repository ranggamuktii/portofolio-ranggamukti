import { useState, useEffect } from 'react';
import { ButtonPrimary } from './Button';
import { getSettings, getSocialLinks } from '../services/api';

function Hero() {
  const [settings, setSettings] = useState(null);
  const [social, setSocial] = useState(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
    getSocialLinks().then(data => {
      const ln = data.find(s => s.platform.toLowerCase() === 'linkedin');
      setSocial(ln ? ln.href : '#');
    }).catch(console.error);
  }, []);

  const roles = settings?.hero_subtitle ? [settings.hero_subtitle, 'Problem Solver', 'UI/UX Enthusiast'] : ['Fullstack Developer', 'UI/UX Enthusiast', 'Problem Solver'];

  useEffect(() => {
    if (!settings) return;
    const current = roles[roleIndex] || roles[0];
    let timeout;
    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 40);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIndex, settings, roles]);

  const titleParts = settings?.hero_title ? settings.hero_title.split(' ') : ["Hi,", "I'm", "Rangga", "Mukti"];
  const titleLine1 = titleParts.length > 2 ? titleParts.slice(0, 2).join(' ') : "Hi, I'm";
  const titleLine2 = titleParts.length > 2 ? titleParts.slice(2).join(' ') : (settings?.hero_title || "Rangga Mukti");

  return (
    <section id="home" className="pt-28 lg:pt-36 pb-10 lg:pb-16">
      <div className="container items-center text-left lg:grid lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 mb-6 animate-fadeIn">
            <span className="relative inline-flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400"></span>
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
            </span>
            <span className="text-emerald-400 text-xs font-medium tracking-wide">Available for work</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="block text-zinc-400 text-lg sm:text-xl font-normal mb-2 animate-fadeIn">{titleLine1}</span>
            <span className="headline-1 !text-[inherit] !text-4xl sm:!text-5xl lg:!text-6xl">{titleLine2}</span>
          </h1>

          <div className="h-8 sm:h-10 flex items-center mb-8">
            <span className="text-sky-400 text-lg sm:text-xl font-medium">
              {displayed || settings?.hero_subtitle || 'Fullstack Developer'}
              <span className="animate-pulse ml-0.5 text-sky-400/70">|</span>
            </span>
          </div>



          <div className="flex items-center gap-3 animate-fadeIn animation-delay-400">
            <ButtonPrimary href="#work" label="See My Work" icon="arrow_downward" />
            <a href="#contact" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1 group">
              Let&apos;s Talk
              <span className="material-symbols-rounded text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </a>
            {social && (
              <a href={social} target="_blank" rel="noreferrer" className="ml-1 w-9 h-9 grid place-items-center rounded-lg ring-1 ring-inset ring-zinc-50/10 text-zinc-400 hover:text-sky-400 hover:ring-sky-400/30 transition-all" title="LinkedIn Profile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5.75 3C4.24 3 3 4.24 3 5.75v12.5C3 19.76 4.24 21 5.75 21h12.5c1.51 0 2.75-1.24 2.75-2.75V5.75C21 4.24 19.76 3 18.25 3H5.75zm0 1.5h12.5c.7 0 1.25.55 1.25 1.25v12.5c0 .7-.55 1.25-1.25 1.25H5.75c-.7 0-1.25-.55-1.25-1.25V5.75c0-.7.55-1.25 1.25-1.25zM7.75 6.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM7 10a.5.5 0 00-.5.5V17a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5v-6.5a.5.5 0 00-.5-.5H7zm3.5 0a.5.5 0 00-.5.5V17a.5.5 0 00.5.5H12a.5.5 0 00.5-.5v-3.75a1.25 1.25 0 012.5 0V17a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5v-4a3.5 3.5 0 00-3-3.46V10.5a.5.5 0 00-.5-.5h-1.5z"/></svg>
              </a>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="hero-orbital">
            {/* Ambient glow */}
            <div className="hero-orbital__glow"></div>

            {/* Orbital rings */}
            <div className="hero-orbital__ring hero-orbital__ring--1">
              <span className="hero-orbital__dot"></span>
            </div>
            <div className="hero-orbital__ring hero-orbital__ring--2">
              <span className="hero-orbital__dot"></span>
            </div>
            <div className="hero-orbital__ring hero-orbital__ring--3">
              <span className="hero-orbital__dot"></span>
            </div>

            {/* Floating particles */}
            <span className="hero-particle hero-particle--1"></span>
            <span className="hero-particle hero-particle--2"></span>
            <span className="hero-particle hero-particle--3"></span>
            <span className="hero-particle hero-particle--4"></span>
            <span className="hero-particle hero-particle--5"></span>
            <span className="hero-particle hero-particle--6"></span>
            <span className="hero-particle hero-particle--7"></span>
            <span className="hero-particle hero-particle--8"></span>

            {/* Photo */}
            <figure className="hero-orbital__photo">
              <img src="/hero-banner.png" width={800} height={800} alt="Hero Banner" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
