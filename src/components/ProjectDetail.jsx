import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const projectsData = {
  pixstock: {
    title: 'Free stock photo app',
    description: "I designed and developed a landing page website for FC Barcelona. The page highlights the club's history, achievements, and player list, with a modern and responsive design tailored to enhance user experience.",
    imgSrc: '/project-2.jpg',
    technologies: ['HTML', 'CSS', 'Javascript'],
    features: [
      'Responsive Design: The website is fully responsive, ensuring a seamless experience across desktops, tablets, and mobile devices.',
      'Player List Section: A dedicated section showcasing the current squad, including player profiles and positions.',
      'Trophy Showcase: An interactive display of trophies won by the club, highlighting its achievements over the years.',
    ],
    demoLink: 'https://pixstock-official.vercel.app/',
    githubLink: '#',
    totalTech: 3,
    mainFeatures: 3,
  },
  musify: {
    title: 'Full stack music app',
    description: 'A comprehensive music streaming application built with a full stack approach.',
    imgSrc: '/project-1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB'],
    features: ['User authentication system with secure password storage', 'Music streaming with playlist creation functionality', 'Artist and album discovery features'],
    demoLink: 'https://musify-5al0.onrender.com/',
    githubLink: '#',
    totalTech: 3,
    mainFeatures: 3,
  },
};

const Spinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <div className="h-12 w-12 border-4 border-zinc-300 border-t-sky-400 rounded-full animate-spin mb-4"></div>
  </div>
);

function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const projectData = projectsData[slug];
      setProject(projectData);
      setLoading(false);
    }, 300);
  }, [slug]);

  if (loading) {
    return <Spinner />;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="headline-2 mb-4">Project Not Found</h2>
        <Link to="/#work" className="btn btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 min-h-screen pb-12 sm:pb-20">
      {/* Navigation */}
      <div className="container pt-4 sm:pt-8">
        <Link to="/#work" className="flex items-center gap-2 mb-4 sm:mb-6 text-zinc-400 hover:text-zinc-50 transition-colors text-sm sm:text-base">
          <span className="material-symbols-rounded filled flex items-center justify-center">arrow_back</span>
          <span>Back</span>
        </Link>

        <div className="flex items-center gap-2 mb-4 sm:mb-6 text-sm">
          <Link to="/" className="text-zinc-400 hover:text-zinc-50 transition-colors">
            Projects
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-50">{project.title}</span>
        </div>

        {/* Project Title */}
        <h1 className="headline-1 text-left text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-8">{project.title}</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6 sm:gap-8">
          <div>
            <p className="text-left text-zinc-300 text-sm sm:text-base mb-6 sm:mb-10">{project.description}</p>

            {/* Tech Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 hover:bg-zinc-800 transition-colors group">
                <figure className="bg-zinc-700/50 rounded-lg overflow-hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <span className="material-symbols-rounded filled text-sky-400 text-xl sm:text-2xl flex items-center justify-center w-full h-full">code</span>
                </figure>
                <div>
                  <h3 className="text-left font-semibold text-xl sm:text-2xl">{project.totalTech}</h3>
                  <p className="text-left text-zinc-400 text-xs sm:text-sm">Teknologi</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-xl sm:rounded-2xl p-2 sm:p-3 hover:bg-zinc-800 transition-colors group">
                <figure className="bg-zinc-700/50 rounded-lg overflow-hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <span className="material-symbols-rounded filled text-sky-400 text-xl sm:text-2xl flex items-center justify-center w-full h-full">view_list</span>
                </figure>
                <div>
                  <h3 className="text-left font-semibold text-xl sm:text-2xl">{project.mainFeatures}</h3>
                  <p className="text-left text-zinc-400 text-xs sm:text-sm">Fitur Utama</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-10">
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="btn btn-primary text-sm">
                  <span>Live Demo</span>
                  <span className="material-symbols-rounded filled flex items-center justify-center">arrow_outward</span>
                </a>
              )}

              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn-outline text-sm">
                  <span>Github</span>
                  <span className="material-symbols-rounded filled flex items-center justify-center">arrow_outward</span>
                </a>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-6 sm:mb-10">
              <h2 className="headline-2 text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-zinc-800 text-zinc-300 ring-1 ring-inset ring-zinc-50/5 text-sm">
                    <span className="material-symbols-rounded filled text-sky-400 flex-shrink-0 text-base sm:text-lg flex items-center justify-center">code</span>
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Image */}
          <div className="bg-sky-900/30 rounded-xl sm:rounded-2xl overflow-hidden aspect-video lg:aspect-auto">
            <img src={project.imgSrc} alt={project.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Key Features */}
        <div className="text-left mt-6 sm:mt-12 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-800/50 ring-1 ring-inset ring-zinc-50/5">
          <h2 className="flex items-center gap-2 sm:gap-3 headline-2 text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-6">
            <span className="material-symbols-rounded filled text-yellow-400 text-xl sm:text-[24px] flex-shrink-0 flex items-center justify-center">star</span>
            Key Features
          </h2>

          <ul className="space-y-3 sm:space-y-4">
            {project.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 sm:gap-4 text-sm sm:text-base">
                <span className="material-symbols-rounded filled text-sky-400 mt-0.5 text-base sm:text-lg flex items-center justify-center h-6 w-6">check_circle</span>
                <span className="text-zinc-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

ProjectDetail.propTypes = {
  match: PropTypes.object,
};

export default ProjectDetail;
