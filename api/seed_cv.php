<?php
// Script ini hanya untuk memasukkan data CV ke database.
// Hapus file ini setelah dieksekusi di server untuk keamanan.

require_once __DIR__ . '/config/database.php';
$db = getDB();

try {
    $db->beginTransaction();

    // 1. UPDATE SETTINGS
    $settings = [
        'hero_title' => 'Hi, I\'m Rangga Mukti Daniswara',
        'hero_subtitle' => 'Fullstack Web Developer',
        'about_text' => 'Passionate Web Developer with hands-on experience in front-end and full-stack development using JavaScript, Node.js, React, Tailwind CSS, Laravel, and Git. Experienced in building responsive, user-friendly web applications and contributing effectively in collaborative, fast-paced environments.',
        'contact_email' => 'daniswara.ranggamukti@gmail.com',
        'phone' => '089678344743',
        'location' => 'Karawang, West Java 41373'
    ];
    $stmt = $db->prepare('INSERT INTO settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)');
    foreach ($settings as $key => $val) {
        $stmt->execute([$key, $val]);
    }

    // 2. UPDATE SOCIAL LINKS
    $db->exec('DELETE FROM social_links');
    $socials = [
        ['LinkedIn', 'LinkedIn', 'https://www.linkedin.com/in/ranggamukti', 'logo-linkedin', 1],
        ['GitHub', 'GitHub', 'https://github.com/ranggamuktii', 'logo-github', 2]
    ];
    $stmt = $db->prepare('INSERT INTO social_links (platform, label, href, icon, order_index) VALUES (?, ?, ?, ?, ?)');
    foreach ($socials as $s) {
        $stmt->execute($s);
    }

    // 3. UPDATE EXPERIENCES (Work & Education)
    $db->exec('DELETE FROM experiences');
    $experiences = [
        [
            'Bachelor of Undergraduate in Information Systems', 
            'Singaperbangsa Karawang University', 
            'Karawang, Indonesia', 
            'Sep 2022', 
            'Aug 2026 (Expected)', 
            'GPA: 3.93/4.00. Relevant Courses: Algorithms & Data Structures, Database, Object Based Programming, Web Based Programming.',
            1, // is_education
            1, // order_index
            'school'
        ],
        [
            'Fullstack Web Developer - Internship', 
            'ADVICS Manufacturing Indonesia', 
            'Karawang, Indonesia', 
            'Aug 2025', 
            'Feb 2026', 
            "- Developed 7 internal full-stack web applications to support operational efficiency and manufacturing digitalization.\n- Handled end-to-end development from requirement analysis and system design to implementation and optimization.\n- Built web-based solutions using Laravel, React, MySQL, PostgreSQL, and Tailwind CSS, improving workflow accuracy, traceability, and system reliability.",
            0,
            2,
            'work'
        ],
        [
            'Fullstack Web Developer - Independent Study', 
            'Vocasia', 
            '', 
            'Aug 2024', 
            'Dec 2024', 
            "- Developed and deployed 10+ fullstack web projects using React.js, Node.js, Express.js, MongoDB, and Tailwind CSS, including a Pokémon app, QR generator, and task manager with JWT auth and VPS deployment.\n- Led GitHub workflow in a 5 member team, managed branching strategies, pull requests, and code reviews to ensure clean, collaborative development.\n- Completed the fullstack web development program with a final score of 98.13, demonstrating strong technical proficiency.",
            0,
            3,
            'work'
        ]
    ];
    $stmt = $db->prepare('INSERT INTO experiences (title, company, location, start_date, end_date, description, is_education, order_index, logo_icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($experiences as $e) {
        $stmt->execute($e);
    }

    // 4. UPDATE PROJECTS
    $db->exec('DELETE FROM projects');
    $projects = [
        [
            'genbi-unsika', 
            'GenBI UNSIKA Website', 
            'Fullstack Developer', 
            "- Built and maintained a full-stack website using React, Node.js (Express), and RESTful APIs for public information, scholarship registration, and admin CMS.\n- Developed core modules for content management, scholarship information, online registration, and role-based admin management.\n- Improved scholarship workflow scalability, supporting applicant growth from 145 to 300 through centralized data and verification management.",
            json_encode(["React", "Node.js", "Express", "REST API"]),
            1
        ],
        [
            'tixchain', 
            'Tixchain', 
            'Front-end Developer', 
            "- Built and maintained responsive front-end interfaces using React and Tailwind CSS.\n- Integrated UI with blockchain-based backend APIs for digital ticket verification and event listing.\n- Collaborated with design and smart contract teams to ensure secure and user-friendly experience.\n- Focused on usability, performance, and cross-device compatibility for optimal user engagement.",
            json_encode(["React", "Tailwind CSS", "Blockchain"]),
            2
        ],
        [
            'helpdesk-ticketing', 
            'Helpdesk Ticketing System', 
            'Fullstack Developer', 
            "- Developed a full-stack helpdesk application using Laravel 11, React + Vite, and Tailwind CSS for structured IT support and ticket management.\n- Built features including ticket tracking, technician assignment, approval workflow, RBAC, notifications, dashboard statistics, and Excel/PDF export.\n- Designed separate user and admin portals to improve visibility, responsiveness, and operational efficiency in IT support processes.",
            json_encode(["Laravel 11", "React", "Vite", "Tailwind CSS"]),
            3
        ]
    ];
    $stmt = $db->prepare('INSERT INTO projects (slug, title, role, description, technologies, order_index) VALUES (?, ?, ?, ?, ?, ?)');
    foreach ($projects as $p) {
        $stmt->execute($p);
    }

    // 5. UPDATE SKILLS
    $db->exec('DELETE FROM skills');
    $skills = [
        ['JavaScript', 'frontend', 1],
        ['React.js', 'frontend', 2],
        ['Node.js', 'backend', 3],
        ['Express.js', 'backend', 4],
        ['Laravel', 'backend', 5],
        ['Tailwind CSS', 'frontend', 6],
        ['MySQL', 'database', 7],
        ['PostgreSQL', 'database', 8],
        ['MongoDB', 'database', 9],
        ['Git', 'tools', 10]
    ];
    $stmt = $db->prepare('INSERT INTO skills (label, category, order_index, img_src) VALUES (?, ?, ?, \'\')');
    foreach ($skills as $s) {
        $stmt->execute($s);
    }

    $db->commit();
    echo "<h1>Berhasil!</h1><p>Semua data CV berhasil dimasukkan ke Database.</p><p>Hapus file <code>api/seed_cv.php</code> setelah selesai.</p>";

} catch (PDOException $e) {
    $db->rollBack();
    echo "<h1>Gagal!</h1><p>Error: " . $e->getMessage() . "</p>";
}
