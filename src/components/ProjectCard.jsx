import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ProjectCard({ imgSrc, title, tags, projectLink, slug, classes }) {
  return (
    <div className={'relative p-4 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 active:bg-zinc-200 dark:active:bg-zinc-700/60 ring-1 ring-inset ring-zinc-900/5 dark:ring-zinc-50/5 transition-colors shadow-sm dark:shadow-none ' + classes}>
      <figure className="img-box aspect-square rounded-lg mb-4 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={title} loading="lazy" className="img-cover w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-rounded text-[80px] text-zinc-400 dark:text-zinc-600">
            image
          </span>
        )}
      </figure>
      <div className="flex text-left items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {tags.map((label, key) => (
              <span key={key} className="h-8 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-50/5 grid items-center px-3 rounded-lg">
                {label}
              </span>
            ))}
          </div>
          <h3 className="title-1 mb-4">{title}</h3>
          <div className="flex gap-3 mt-2">
            {projectLink ? (
              <a href={projectLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                Live Demo
                <span className="material-symbols-rounded" aria-hidden="true">
                  arrow_outward
                </span>
              </a>
            ) : (
              <button className="btn bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 cursor-not-allowed" disabled>
                Demo Not Available
              </button>
            )}
            <Link to={`/project/${slug}`} className="btn btn-outline">
              Detail
              <span className="material-symbols-rounded" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>
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
