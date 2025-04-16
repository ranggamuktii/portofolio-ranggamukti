import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Sample project database - in a real app, this would come from an API or context
const projectsData = {
  pixstock: {
    title: 'Free stock photo app',
    description: "I designed and developed a landing page website for FC Barcelona. The page highlights the club's history, achievements, and player list, with a modern and responsive design tailored to enhance user experience.",
    imgSrc: '/project-2.jpg', // Replace with actual path
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
  // Add data for other projects here following the same structure
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
  // Add other projects here
};

function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const projectData = projectsData[slug];
      setProject(projectData);
      setLoading(false);
    }, 300);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading project details...</div>
      </div>
    );
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
    <div className="bg-zinc-900 min-h-screen pb-20">
      {/* Navigation */}
      <div className="container pt-8">
        <Link to="/#work" className="flex items-center gap-2 mb-6 text-zinc-400 hover:text-zinc-50 transition-colors">
          <span className="material-symbols-rounded">arrow_back</span>
          <span>Back</span>
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-zinc-400 hover:text-zinc-50 transition-colors">
            Projects
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-50">{project.title}</span>
        </div>

        {/* Project Title */}
        <h1 className="headline-1 mb-8">{project.title}</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <div>
            <p className="text-left text-zinc-300 mb-10">{project.description}</p>

            {/* Tech Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-2xl p-3 hover:bg-zinc-800 transition-colors group">
                <figure className="bg-zinc-700/50 rounded-lg overflow-hidden w-12 h-12 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <span className="material-symbols-rounded text-sky-400">code</span>
                </figure>
                <div>
                  <h3 className="text-left font-semibold text-2xl">{project.totalTech}</h3>
                  <p className="text-zinc-400 text-sm">Total Teknologi</p>
                </div>
              </div>

              <div className="flex items-center gap-3 ring-2 ring-inset ring-zinc-50/10 rounded-2xl p-3 hover:bg-zinc-800 transition-colors group">
                <figure className="bg-zinc-700/50 rounded-lg overflow-hidden w-12 h-12 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                  <span className="material-symbols-rounded text-sky-400">view_list</span>
                </figure>
                <div>
                  <h3 className="text-left font-semibold text-2xl">{project.mainFeatures}</h3>
                  <p className="text-zinc-400 text-sm">Fitur Utama</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              {project.demoLink && (
                <a href={project.demoLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <span>Live Demo</span>
                  <span className="material-symbols-rounded">arrow_outward</span>
                </a>
              )}

              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <span>Github</span>
                  <span className="material-symbols-rounded">arrow_outward</span>
                </a>
              )}
            </div>

            {/* Technologies */}
            <div className="mb-10">
              <h2 className="headline-2 mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 ring-1 ring-inset ring-zinc-50/5">
                    <span className="material-symbols-rounded text-sky-400 flex-shrink-0">code</span>
                    <span>{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Image */}
          <div className="bg-sky-900/30 rounded-2xl overflow-hidden aspect-video lg:aspect-auto">
            <img src={project.imgSrc} alt={project.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-800/50 ring-1 ring-inset ring-zinc-50/5">
          <h2 className="flex items-center gap-3 headline-2 mb-6">
            <span className="material-symbols-rounded text-yellow-400 text-[24px] flex-shrink-0">star</span>
            Key Features
          </h2>

          <ul className="space-y-4">
            {project.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="material-symbols-rounded text-sky-400 mt-1">circle</span>
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
