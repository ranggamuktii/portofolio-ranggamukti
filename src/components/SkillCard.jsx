import PropTypes from 'prop-types';
import { getUploadUrl } from '../services/api';

function SkillCard({ imgSrc, label, desc, classes }) {
  return (
    <div className={`flex items-center gap-4 bg-white/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 backdrop-blur-sm rounded-2xl p-4 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5 group ${classes}`}>
      <figure className="bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden w-14 h-14 flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 transition-colors duration-300">
        <img src={getUploadUrl(imgSrc)} width={32} height={32} alt={label} className="group-hover:scale-110 transition-transform duration-300"></img>
      </figure>
      <div className="flex-1">
        <h3 className="text-zinc-900 dark:text-zinc-100 font-bold group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">{label}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-1">{desc}</p>
      </div>
    </div>
  );
}

SkillCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  classes: PropTypes.string,
};

export default SkillCard;
