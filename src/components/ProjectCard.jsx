import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ProjectCard({ imgSrc, title, tags, projectLink, slug, classes }) {
  return (
    <div className={`group relative flex flex-col p-5 rounded-[32px] bg-white dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none ${classes}`}>
      
      {/* Image Container */}
      <figure className="relative aspect-video rounded-2xl mb-6 bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <>
            <img src={imgSrc} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <span className="material-symbols-rounded text-[80px] text-zinc-300 dark:text-zinc-700 transition-transform duration-500 group-hover:scale-110">
            image
          </span>
        )}
      </figure>
      
      {/* Content */}
      <div className="flex flex-col flex-1 text-left px-1">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tags.map((label, key) => (
            <span key={key} className="text-[11px] font-bold tracking-wider uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-3 py-1.5 rounded-lg border border-sky-100 dark:border-sky-500/20">
              {label}
            </span>
          ))}
        </div>
        
        <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-auto">
          {projectLink ? (
            <a href={projectLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-sky-500/20">
              Live Demo
              <span className="material-symbols-rounded text-[18px]" aria-hidden="true">
                arrow_outward
              </span>
            </a>
          ) : (
             <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm font-bold cursor-not-allowed" disabled>
               No Demo
             </button>
          )}
          <Link to={`/project/${slug}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-200 dark:border-zinc-800 hover:border-sky-600 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 text-sm font-bold transition-all duration-300">
            Details
            <span className="material-symbols-rounded text-[18px] transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectLink: PropTypes.string,
  slug: PropTypes.string.isRequired,
  classes: PropTypes.string,
};

export default ProjectCard;
