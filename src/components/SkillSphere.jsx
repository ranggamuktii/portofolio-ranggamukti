import { useEffect, useMemo, useState } from 'react';
import { Cloud, renderSimpleIcon, fetchSimpleIcons } from 'react-icon-cloud';
import PropTypes from 'prop-types';

// Map our DB skill labels to simpleicons.org slugs
const LABEL_TO_SLUG = {
  'figma': 'figma',
  'css': 'css3',
  'css3': 'css3',
  'javascript': 'javascript',
  'js': 'javascript',
  'nodejs': 'nodedotjs',
  'node.js': 'nodedotjs',
  'expressjs': 'express',
  'express': 'express',
  'mongodb': 'mongodb',
  'react': 'react',
  'reactjs': 'react',
  'tailwindcss': 'tailwindcss',
  'tailwind css': 'tailwindcss',
  'tailwind': 'tailwindcss',
  'html': 'html5',
  'html5': 'html5',
  'typescript': 'typescript',
  'python': 'python',
  'git': 'git',
  'github': 'github',
  'docker': 'docker',
  'mysql': 'mysql',
  'postgresql': 'postgresql',
  'firebase': 'firebase',
  'nextjs': 'nextdotjs',
  'next.js': 'nextdotjs',
  'vue': 'vuedotjs',
  'vue.js': 'vuedotjs',
  'angular': 'angular',
  'sass': 'sass',
  'redux': 'redux',
  'graphql': 'graphql',
  'vite': 'vite',
  'vercel': 'vercel',
  'linux': 'linux',
  'php': 'php',
  'laravel': 'laravel',
  'bootstrap': 'bootstrap',
  'java': 'java',
  'kotlin': 'kotlin',
  'swift': 'swift',
  'flutter': 'flutter',
  'dart': 'dart',
  'aws': 'amazonaws',
  'postman': 'postman',
  'npm': 'npm',
  'webpack': 'webpack',
};

// Extra slugs to always show (enriches the sphere even if not in DB)
const EXTRA_SLUGS = [
  'html5',
  'git',
  'github',
  'npm',
  'vite',
  'mysql',
];

function SkillSphere({ skills = [] }) {
  const [iconData, setIconData] = useState(null);

  // Derive unique slugs from the skills prop + extras
  const slugs = useMemo(() => {
    const fromSkills = skills
      .map((s) => LABEL_TO_SLUG[s.label?.toLowerCase()] || null)
      .filter(Boolean);

    const combined = [...new Set([...fromSkills, ...EXTRA_SLUGS])];
    return combined;
  }, [skills]);

  useEffect(() => {
    if (slugs.length === 0) return;
    fetchSimpleIcons({ slugs }).then(setIconData).catch(console.error);
  }, [slugs]);

  const renderedIcons = useMemo(() => {
    if (!iconData) return null;
    return Object.values(iconData.simpleIcons).map((icon) =>
      renderSimpleIcon({
        icon,
        minContrastRatio: 2,
        bgHex: '#09090b', // zinc-950
        size: 48,
        fallbackHex: '#38bdf8', // sky-400
        aProps: {
          href: undefined,
          target: undefined,
          rel: undefined,
          onClick: (e) => e.preventDefault(),
        },
      })
    );
  }, [iconData]);

  if (!renderedIcons) {
    return (
      <div className="skill-sphere-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="skill-sphere-wrapper">
      <Cloud
        id="skill-cloud"
        containerProps={{
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          },
        }}
        options={{
          reverse: true,
          depth: 1,
          wheelZoom: false,
          imageScale: 2,
          activeCursor: 'default',
          tooltip: 'native',
          initial: [0.04, -0.04],
          clickToFront: 500,
          tooltipDelay: 0,
          outlineColour: '#0000',
          maxSpeed: 0.04,
          minSpeed: 0.02,
          dragControl: true,
        }}
      >
        {renderedIcons}
      </Cloud>
    </div>
  );
}

SkillSphere.propTypes = {
  skills: PropTypes.array,
};

export default SkillSphere;
