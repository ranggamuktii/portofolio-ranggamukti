import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUploadUrl } from '../services/api';

function ProjectCard({ imgSrc, title, tags, projectLink, slug, classes }) {
  return (
    <div className={`group flex flex-col bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 backdrop-blur-sm rounded-[32px] overflow-hidden hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/10 ${classes}`}>
      
      {/* Image Container */}
      <figure className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
        {imgSrc ? (
          <>
            <img 
              src={getUploadUrl(imgSrc)} 
              alt={title} 
              loading="lazy" 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800">
            <span className="material-symbols-rounded text-6xl group-hover:scale-110 transition-transform duration-500">image</span>
          </div>
        )}
      </figure>
      
      {/* Content */}
      <div className="flex flex-col flex-1 p-6 relative">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((label, key) => (
            <span key={key} className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 border border-transparent dark:border-zinc-700/50">
              {label}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 border border-transparent dark:border-zinc-700/50">
              +{tags.length - 3}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
          {title}
        </h3>
        
        <div className="mt-auto pt-6 flex flex-wrap sm:flex-nowrap items-center gap-3">
          <Link 
            to={`/project/${slug}`} 
            className="flex-1 text-center py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors border border-transparent dark:border-zinc-700"
          >
            Details
          </Link>
          {projectLink ? (
            <a 
              href={projectLink} 
              target="_blank" 
              rel="noreferrer" 
              className="flex-1 flex justify-center items-center gap-2 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-sm hover:bg-sky-600 dark:hover:bg-sky-500 hover:text-white dark:hover:text-white transition-all shadow-md group/btn"
            >
              Demo
              <span className="material-symbols-rounded text-[18px] group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform">arrow_outward</span>
            </a>
          ) : (
            <button 
              className="flex-1 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/30 text-zinc-400 font-bold text-sm cursor-not-allowed border border-zinc-200 dark:border-zinc-800"
              disabled
            >
              No Demo
            </button>
          )}
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
