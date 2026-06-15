import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProjectBySlug } from '../services/api';
import { ThemeContext } from '../ThemeProvider';

const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
    <div className="h-12 w-12 border-4 border-zinc-200 dark:border-zinc-700 border-t-sky-500 dark:border-t-sky-400 rounded-full animate-spin mb-4"></div>
  </div>
);

function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggle } = useContext(ThemeContext);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await getProjectBySlug(slug);
        
        const role = data.role || '';
        const problem = data.problem || '';
        const solution = data.solution || '';
        
        const transformedProject = {
          title: data.title,
          description: data.description,
          imgSrc: data.img_src,
          technologies: data.technologies || [],
          features: data.features || [],
          demoLink: data.demo_link,
          githubLink: data.github_link,
          totalTech: data.technologies?.length || 0,
          mainFeatures: data.features?.length || 0,
          role,
          problem,
          solution
        };
        setProject(transformedProject);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) return <Spinner />;

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
        <h2 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Project Not Found</h2>
        <Link to="/#work" className="btn btn-primary">Back to Projects</Link>
      </div>
    );
  }

  const getDomain = (url) => {
    if (!url) return 'localhost:3000';
    try { return new URL(url).hostname.replace('www.', ''); } catch { return 'portfolio.local'; }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen pb-16 sm:pb-24 font-sans text-zinc-700 dark:text-zinc-300 relative overflow-hidden selection:bg-sky-500/30 transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-sky-200/50 dark:bg-sky-900/20 blur-[120px] rounded-[100%] pointer-events-none transition-colors duration-300"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10">
        
        {/* Navigation & Theme Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-16 sm:mb-24">
          <Link to="/#work" className="group flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-sm sm:text-base font-semibold">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-900/50 flex items-center justify-center ring-1 ring-zinc-200 dark:ring-white/10 group-hover:ring-sky-500/50 group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 transition-all shadow-sm dark:shadow-none">
              <span className="material-symbols-rounded filled text-[20px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            </div>
            <span>Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 text-sm font-semibold tracking-wide">
              <span className="text-zinc-500">Project</span>
              <span className="text-zinc-400 dark:text-zinc-700">/</span>
              <span className="text-zinc-900 dark:text-zinc-100">{project.title}</span>
            </div>
            
            {/* Theme toggle directly on page */}
            <button
               type="button"
               onClick={toggle}
               aria-label="Toggle theme"
               title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
               className="w-10 h-10 grid place-items-center rounded-xl bg-white dark:bg-zinc-50/10 ring-1 ring-inset ring-zinc-200 dark:ring-zinc-50/5 shadow-sm dark:shadow-none transition-all hover:bg-zinc-50 dark:hover:bg-zinc-50/15 active:scale-95 text-zinc-700 dark:text-zinc-300"
             >
               {theme === 'light' ? (
                 <span className="material-symbols-rounded text-lg">dark_mode</span>
               ) : (
                 <span className="material-symbols-rounded text-lg">light_mode</span>
               )}
            </button>
          </div>
        </div>

        {/* Hero Area */}
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-20">
          {project.role && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 ring-1 ring-sky-200 dark:ring-sky-500/20 mb-6 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-colors duration-300">
              <span className="material-symbols-rounded filled text-base">workspace_premium</span>
              <span>{project.role}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:via-sky-100 dark:to-zinc-500 mb-6 tracking-tight leading-[1.2] drop-shadow-sm transition-colors duration-300">
            {project.title}
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-2xl mx-auto font-medium transition-colors duration-300">
            {project.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white dark:text-zinc-950 font-semibold tracking-wide rounded-full transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]">
                <span>Visit Live Site</span>
                <span className="material-symbols-rounded filled text-lg">rocket_launch</span>
              </a>
            )}
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-semibold tracking-wide rounded-full ring-1 ring-zinc-200 dark:ring-sky-500/30 transition-all hover:-translate-y-1 shadow-md hover:shadow-lg dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] dark:hover:shadow-[0_0_25px_rgba(56,189,248,0.2)]">
                <span>Source Code</span>
                <span className="material-symbols-rounded filled text-lg">code</span>
              </a>
            )}
            {!project.demoLink && !project.githubLink && (
              <div className="flex items-center justify-center gap-3 px-6 py-3 bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold tracking-wide rounded-full ring-1 ring-rose-200 dark:ring-rose-500/30 shadow-inner dark:shadow-[0_0_20px_rgba(244,63,94,0.15)] cursor-default transition-all hover:-translate-y-1 backdrop-blur-md">
                <span className="material-symbols-rounded filled text-lg">shield_person</span>
                <span>Confidential / Internal Project</span>
              </div>
            )}
          </div>
        </div>

        {/* Browser Mockup Showcase */}
        <div className="w-full max-w-6xl mx-auto rounded-[2rem] overflow-hidden ring-1 ring-zinc-200 dark:ring-white/10 shadow-xl dark:shadow-[0_20px_60px_-15px_rgba(56,189,248,0.2)] mb-20 sm:mb-32 group relative transition-colors duration-300">
          <div className="bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-3 flex items-center border-b border-zinc-200 dark:border-white/5 transition-colors duration-300">
            <div className="flex gap-2 w-20">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-400 dark:bg-rose-500/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 dark:bg-amber-500/80"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 dark:bg-emerald-500/80"></div>
            </div>
            <div className="mx-auto flex items-center justify-center bg-white dark:bg-zinc-950/50 rounded-lg px-4 py-1.5 text-xs sm:text-sm text-zinc-500 font-mono max-w-md w-full ring-1 ring-zinc-200 dark:ring-white/5 shadow-inner truncate transition-colors duration-300">
              {project.demoLink ? (
                <><span className="material-symbols-rounded filled text-[14px] sm:text-[16px] mr-2 text-zinc-400">lock</span>{getDomain(project.demoLink)}</>
              ) : (
                <><span className="material-symbols-rounded filled text-[14px] sm:text-[16px] mr-2 text-rose-500/70">shield_lock</span><span className="text-rose-600 dark:text-rose-500/70 font-semibold">Secured Internal System</span></>
              )}
            </div>
            <div className="w-20"></div>
          </div>
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-zinc-200 dark:bg-zinc-950 overflow-hidden transition-colors duration-300">
             <img src={project.imgSrc} alt={project.title} className="w-full h-full object-cover object-top transition-transform duration-[2s] ease-out group-hover:scale-[1.03]" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-100/20 dark:from-zinc-950/20 to-transparent pointer-events-none transition-colors duration-300"></div>
          </div>
        </div>

        {/* Deep Dive Content Section */}
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-16 max-w-7xl mx-auto">
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            {(project.problem || project.solution) && (
              <section className="space-y-8">
                {project.problem && (
                  <div className="bg-white dark:bg-zinc-900/40 rounded-3xl p-8 ring-1 ring-zinc-200 dark:ring-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-rose-500/10 dark:from-rose-500/10 to-transparent pointer-events-none"></div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 flex items-center gap-3 relative z-10">
                      <span className="material-symbols-rounded filled text-rose-500 dark:text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)] text-[20px]">psychology_alt</span> The Challenge
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed relative z-10 whitespace-pre-wrap">{project.problem}</p>
                  </div>
                )}

                {project.solution && (
                  <div className="bg-white dark:bg-zinc-900/40 rounded-3xl p-8 ring-1 ring-zinc-200 dark:ring-white/5 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/10 dark:from-emerald-500/10 to-transparent pointer-events-none"></div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2 flex items-center gap-3 relative z-10">
                      <span className="material-symbols-rounded filled text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] text-[20px]">lightbulb</span> The Solution
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed relative z-10 whitespace-pre-wrap">{project.solution}</p>
                  </div>
                )}
              </section>
            )}

            {project.features && project.features.length > 0 && (
              <section className="pt-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-200 dark:ring-amber-500/30 transition-colors duration-300">
                    <span className="material-symbols-rounded filled text-amber-500 dark:text-amber-400 text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">stars</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-wide transition-colors duration-300">Key Features</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 ring-1 ring-zinc-200 dark:ring-white/5 hover:ring-zinc-300 dark:hover:ring-sky-500/20 transition-all duration-300 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                        <span className="material-symbols-rounded filled text-sky-500 dark:text-sky-400 text-xs">check</span>
                      </div>
                      <span className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
               <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 ring-1 ring-zinc-200 dark:ring-white/5 shadow-md hover:shadow-lg dark:shadow-xl group hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all">
                 <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 group-hover:scale-110 transition-transform">{project.totalTech}</span>
                 <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">Tech Stack</span>
               </div>
               <div className="bg-white dark:bg-zinc-900/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 ring-1 ring-zinc-200 dark:ring-white/5 shadow-md hover:shadow-lg dark:shadow-xl group hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all">
                 <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-rose-600 dark:from-amber-400 dark:to-rose-500 group-hover:scale-110 transition-transform">{project.mainFeatures}</span>
                 <span className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">Features</span>
               </div>
            </section>

               <div className="bg-white dark:bg-zinc-900/40 rounded-3xl p-6 ring-1 ring-zinc-200 dark:ring-white/5 shadow-lg dark:shadow-2xl relative overflow-hidden lg:sticky lg:top-8 transition-colors duration-300">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center ring-1 ring-purple-200 dark:ring-purple-500/30 transition-colors duration-300">
                  <span className="material-symbols-rounded filled text-purple-600 dark:text-purple-400 text-lg drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">code_blocks</span>
                </div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-wide transition-colors duration-300">Technologies</h2>
              </div>
              
              <div className="flex flex-wrap gap-2 relative z-10">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="px-3 py-1.5 rounded bg-zinc-100/50 dark:bg-zinc-800/80 text-zinc-600 dark:text-sky-300 ring-1 ring-zinc-200 dark:ring-sky-500/20 text-xs sm:text-sm font-mono tracking-wide hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500/20 dark:hover:text-sky-200 hover:ring-sky-500 dark:hover:ring-sky-400 transition-all cursor-default shadow-sm dark:shadow-[0_0_10px_rgba(56,189,248,0.05)]">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

ProjectDetail.propTypes = { match: PropTypes.object };

export default ProjectDetail;
