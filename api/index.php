<?php
/**
 * API Router - Main entry point for all /api/* requests
 * Routes requests to the appropriate handler based on URL path.
 */

// CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load database config (this also loads .env)
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/middleware/auth.php';

// Parse the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/api';

// Remove query string
$path = parse_url($requestUri, PHP_URL_PATH);

// Remove /api prefix to get the route
$route = substr($path, strlen($basePath));
$route = $route ?: '/';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get JSON body
$inputBody = file_get_contents('php://input');
$body = json_decode($inputBody, true) ?? [];

// Simple router
$segments = array_values(array_filter(explode('/', $route)));
$resource = $segments[0] ?? '';

// Health check
if ($resource === 'health') {
    echo json_encode(['status' => 'ok', 'message' => 'Portfolio API is running (PHP)']);
    exit;
}

// Route to appropriate handler
switch ($resource) {
    case 'auth':
        require_once __DIR__ . '/routes/auth.php';
        handleAuth($method, $segments, $body);
        break;
    case 'projects':
        require_once __DIR__ . '/routes/projects.php';
        handleProjects($method, $segments, $body);
        break;
    case 'skills':
        require_once __DIR__ . '/routes/skills.php';
        handleSkills($method, $segments, $body);
        break;
    case 'experiences':
        require_once __DIR__ . '/routes/experiences.php';
        handleExperiences($method, $segments, $body);
        break;
    case 'social':
        require_once __DIR__ . '/routes/social.php';
        handleSocial($method, $segments, $body);
        break;
    case 'settings':
        require_once __DIR__ . '/routes/settings.php';
        handleSettings($method, $segments, $body);
        break;
    case 'messages':
        require_once __DIR__ . '/routes/messages.php';
        handleMessages($method, $segments, $body);
        break;
    case 'analytics':
        require_once __DIR__ . '/routes/analytics.php';
        handleAnalytics($method, $segments, $body);
        break;
    case 'chat':
        require_once __DIR__ . '/routes/chat.php';
        handleChat($method, $segments, $body);
        break;
    case 'upload':
        require_once __DIR__ . '/routes/upload.php';
        handleUpload($method, $segments);
        break;
    case 'certifications':
        require_once __DIR__ . '/routes/certifications.php';
        handleCertifications($method, $segments, $body);
        break;
    case 'skill-badges':
        require_once __DIR__ . '/routes/skill_badges.php';
        handleSkillBadges($method, $segments, $body);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Route not found']);
        break;
}
