<?php
/**
 * Projects Routes
 * GET    /api/projects       - Get all projects
 * GET    /api/projects/:slug - Get project by slug
 * POST   /api/projects       - Create project (admin)
 * PUT    /api/projects/:id   - Update project (admin)
 * DELETE /api/projects/:id   - Delete project (admin)
 */

function handleProjects($method, $segments, $body) {
    $param = $segments[1] ?? null;

    switch ($method) {
        case 'GET':
            if ($param) {
                getProjectBySlug($param);
            } else {
                getAllProjects();
            }
            break;
        case 'POST':
            authenticateToken();
            createProject($body);
            break;
        case 'PUT':
            authenticateToken();
            if ($param) updateProject($param, $body);
            else { http_response_code(400); echo json_encode(['error' => 'Project ID required']); }
            break;
        case 'DELETE':
            authenticateToken();
            if ($param) deleteProject($param);
            else { http_response_code(400); echo json_encode(['error' => 'Project ID required']); }
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function getAllProjects() {
    $db = getDB();
    $stmt = $db->query('
        SELECT id, slug, title, img_src, tags, demo_link, github_link, 
               description, role, problem, solution, technologies, features, screenshots, is_featured, order_index 
        FROM projects 
        ORDER BY order_index ASC, created_at DESC
    ');
    $projects = $stmt->fetchAll();

    // Parse JSON fields
    $parsed = array_map(function($p) {
        $p['tags'] = $p['tags'] ? json_decode($p['tags'], true) : [];
        $p['technologies'] = $p['technologies'] ? json_decode($p['technologies'], true) : [];
        $p['features'] = $p['features'] ? json_decode($p['features'], true) : [];
        $p['screenshots'] = $p['screenshots'] ? json_decode($p['screenshots'], true) : [];
        $p['is_featured'] = (bool) $p['is_featured'];
        $p['order_index'] = (int) $p['order_index'];
        $p['id'] = (int) $p['id'];
        return $p;
    }, $projects);

    echo json_encode($parsed);
}

function getProjectBySlug($slug) {
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM projects WHERE slug = ?');
    $stmt->execute([$slug]);
    $project = $stmt->fetch();

    if (!$project) {
        http_response_code(404);
        echo json_encode(['error' => 'Project not found']);
        return;
    }

    $project['tags'] = $project['tags'] ? json_decode($project['tags'], true) : [];
    $project['technologies'] = $project['technologies'] ? json_decode($project['technologies'], true) : [];
    $project['features'] = $project['features'] ? json_decode($project['features'], true) : [];
    $project['screenshots'] = $project['screenshots'] ? json_decode($project['screenshots'], true) : [];
    $project['is_featured'] = (bool) $project['is_featured'];
    $project['order_index'] = (int) $project['order_index'];
    $project['id'] = (int) $project['id'];

    echo json_encode($project);
}

function createProject($body) {
    $slug = $body['slug'] ?? '';
    $title = $body['title'] ?? '';

    if (empty($slug) || empty($title)) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug and title are required']);
        return;
    }

    $db = getDB();
    try {
        $stmt = $db->prepare('
            INSERT INTO projects 
            (slug, title, img_src, tags, demo_link, github_link, description, 
             role, problem, solution, technologies, features, screenshots, is_featured, order_index) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $slug,
            $title,
            $body['img_src'] ?? null,
            isset($body['tags']) ? json_encode($body['tags']) : null,
            $body['demo_link'] ?? null,
            $body['github_link'] ?? null,
            $body['description'] ?? null,
            $body['role'] ?? null,
            $body['problem'] ?? null,
            $body['solution'] ?? null,
            isset($body['technologies']) ? json_encode($body['technologies']) : null,
            isset($body['features']) ? json_encode($body['features']) : null,
            isset($body['screenshots']) ? json_encode($body['screenshots']) : null,
            $body['is_featured'] ?? false,
            $body['order_index'] ?? 0,
        ]);

        http_response_code(201);
        echo json_encode(['message' => 'Project created successfully', 'id' => (int) $db->lastInsertId()]);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(['error' => 'Project with this slug already exists']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create project']);
        }
    }
}

function updateProject($id, $body) {
    $db = getDB();
    $stmt = $db->prepare('
        UPDATE projects SET 
        slug = ?, title = ?, img_src = ?, tags = ?, demo_link = ?, 
        github_link = ?, description = ?, role = ?, problem = ?, solution = ?, 
        technologies = ?, features = ?, screenshots = ?, is_featured = ?, order_index = ?
        WHERE id = ?
    ');
    $stmt->execute([
        $body['slug'] ?? '',
        $body['title'] ?? '',
        $body['img_src'] ?? null,
        isset($body['tags']) ? json_encode($body['tags']) : null,
        $body['demo_link'] ?? null,
        $body['github_link'] ?? null,
        $body['description'] ?? null,
        $body['role'] ?? null,
        $body['problem'] ?? null,
        $body['solution'] ?? null,
        isset($body['technologies']) ? json_encode($body['technologies']) : null,
        isset($body['features']) ? json_encode($body['features']) : null,
        isset($body['screenshots']) ? json_encode($body['screenshots']) : null,
        $body['is_featured'] ?? false,
        $body['order_index'] ?? 0,
        $id,
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Project not found']);
        return;
    }

    echo json_encode(['message' => 'Project updated successfully']);
}

function deleteProject($id) {
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM projects WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Project not found']);
        return;
    }

    echo json_encode(['message' => 'Project deleted successfully']);
}
