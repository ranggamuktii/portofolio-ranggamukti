-- Seed data for projects based on existing frontend data
USE portfolio_db;

-- Insert projects
INSERT IGNORE INTO projects (slug, title, img_src, tags, demo_link, github_link, description, technologies, features, is_featured, order_index) VALUES

('musify', 'Full stack music app', '/project-1.jpg', 
 '["API", "MVC", "Development"]',
 'https://musify-5al0.onrender.com/',
 '#',
 'A comprehensive music streaming application built with a full stack approach.',
 '["React", "Node.js", "MongoDB"]',
 '["User authentication system with secure password storage", "Music streaming with playlist creation functionality", "Artist and album discovery features"]',
 1, 1),

('pixstock', 'Free stock photo app', '/project-2.jpg',
 '["API", "SPA"]',
 'https://pixstock-official.vercel.app/',
 '#',
 'I designed and developed a landing page website for FC Barcelona. The page highlights the club history, achievements, and player list, with a modern and responsive design tailored to enhance user experience.',
 '["HTML", "CSS", "Javascript"]',
 '["Responsive Design: The website is fully responsive, ensuring a seamless experience across desktops, tablets, and mobile devices.", "Player List Section: A dedicated section showcasing the current squad, including player profiles and positions.", "Trophy Showcase: An interactive display of trophies won by the club, highlighting its achievements over the years."]',
 1, 2),

('recipe-app', 'Recipe app', '/project-3.jpg',
 '["Development", "API"]',
 '',
 '#',
 'A modern recipe discovery application that allows users to search and save their favorite recipes.',
 '["React", "REST API", "CSS"]',
 '["Search recipes by ingredients", "Save favorite recipes", "Responsive design for all devices"]',
 0, 3),

('wealthome', 'Real state website', '/project-4.jpg',
 '["Web-design", "Development"]',
 'https://github.com/codewithsadee-org/wealthome',
 'https://github.com/codewithsadee-org/wealthome',
 'A real estate website template with modern design and property listings.',
 '["HTML", "CSS", "JavaScript"]',
 '["Property listings with filtering", "Responsive grid layout", "Contact form integration"]',
 0, 4),

('anon-ecommerce', 'eCommerce website', '/project-5.jpg',
 '["eCommerce", "Development"]',
 'https://github.com/codewithsadee/anon-ecommerce-website',
 'https://github.com/codewithsadee/anon-ecommerce-website',
 'A fully functional eCommerce website template with shopping cart and checkout.',
 '["HTML", "CSS", "JavaScript"]',
 '["Product catalog with categories", "Shopping cart functionality", "Responsive checkout process"]',
 0, 5),

('vcard-portfolio', 'vCard Personal portfolio', '/project-6.jpg',
 '["Web-design", "Development"]',
 'https://github.com/codewithsadee/vcard-personal-portfolio',
 'https://github.com/codewithsadee/vcard-personal-portfolio',
 'A personal portfolio website template in the style of a vCard.',
 '["HTML", "CSS", "JavaScript"]',
 '["Professional vCard design", "Skills showcase", "Contact form"]',
 0, 6);

-- Insert skills
INSERT IGNORE INTO skills (img_src, label, category, order_index) VALUES
('/figma.svg', 'Figma', 'design', 1),
('/css3.svg', 'CSS', 'frontend', 2),
('/javascript.svg', 'JavaScript', 'frontend', 3),
('/nodejs.svg', 'NodeJS', 'backend', 4),
('/expressjs.svg', 'ExpressJS', 'backend', 5),
('/mongodb.svg', 'MongoDB', 'database', 6),
('/react.svg', 'React', 'frontend', 7),
('/tailwindcss.svg', 'TailwindCSS', 'frontend', 8);

-- Insert reviews
INSERT IGNORE INTO reviews (name, content, img_src, company, rating, order_index) VALUES
('Sophia Ramirez', 'I had the pleasure of working with Alex on a web development project, and I was thoroughly impressed with his expertise and professionalism.', '/people-1.jpg', 'Tech Company', 5, 1),
('Ethan Caldwell', 'Alex ability to bring our vision to life was exceptional. The project was delivered on time, and the quality of work was outstanding.', '/people-2.jpg', 'Digital Agency', 5, 2),
('Liam Bennett', 'Professional work and excellent communication throughout the project. Highly recommended for web development services.', '/people-3.jpg', 'Startup Inc', 5, 3),
('Noah Williams', 'Outstanding developer! Delivered a beautiful, responsive website that exceeded our expectations.', '/people-4.jpg', 'Creative Studio', 5, 4),
('Ava Thompson', 'Great attention to detail and very responsive to feedback. Will definitely work with Alex again.', '/people-5.jpg', 'Marketing Firm', 5, 5),
('Jonathan', 'Excellent work! The website looks amazing and functions perfectly across all devices.', '/people-6.jpg', 'E-commerce Business', 5, 6);

-- Insert generic experiences seed
INSERT IGNORE INTO experiences (title, company, location, start_date, end_date, description, logo_icon, is_education, order_index) VALUES
('Fullstack Developer', 'Tech Solutions Inc.', 'Remote', '2022', 'Present', 'Developing and maintaining core web applications using React, Node.js, and MySQL. Integrating REST APIs and managing database architectures.', 'terminal', FALSE, 1),
('Frontend Developer', 'Creative Agency', 'Jakarta, ID', '2020', '2022', 'Created highly interactive and pixel-perfect UI experiences using modern JavaScript frameworks and TailwindCSS.', 'code_blocks', FALSE, 2),
('Bachelor of Computer Science', 'Universitas Teknologi', 'Jakarta, ID', '2016', '2020', 'Graduated with honors. Specialized in software engineering and web technologies.', 'school', TRUE, 3);
