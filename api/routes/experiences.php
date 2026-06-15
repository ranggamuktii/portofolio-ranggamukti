<?php
/**
 * Experiences Routes
 * GET    /api/experiences     - Get all experiences
 * POST   /api/experiences     - Create experience (admin)
 * PUT    /api/experiences/:id - Update experience (admin)
 * DELETE /api/experiences/:id - Delete experience (admin)
 */

function handleExperiences($method, $segments, $body) {
    $param = $segments[1] ?? null;

    switch ($method) {
        case 'GET':
            getExperiences();
            break;
        case 'POST':
            authenticateToken();
            createExperience($body);
            break;
        case 'PUT':
            authenticateToken();
            if ($param) updateExperience($param, $body);
            else { http_response_code(400); echo json_encode(['error' => 'Experience ID required']); }
            break;
        case 'DELETE':
            authenticateToken();
            if ($param) deleteExperience($param);
            else { http_response_code(400); echo json_encode(['error' => 'Experience ID required']); }
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function getExperiences() {
    $db = getDB();
    $stmt = $db->query('SELECT * FROM experiences ORDER BY order_index ASC, created_at DESC');
    $experiences = $stmt->fetchAll();
    
    // cast data
    $parsed = array_map(function($e) {
        $e['id'] = (int) $e['id'];
        $e['order_index'] = (int) $e['order_index'];
        $e['is_education'] = (bool) $e['is_education'];
        return $e;
    }, $experiences);

    echo json_encode($parsed);
}

function createExperience($body) {
    $db = getDB();
    $stmt = $db->prepare('
        INSERT INTO experiences (title, company, location, start_date, end_date, description, is_education, order_index, logo_icon, company_logo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $body['title'] ?? '',
        $body['company'] ?? '',
        $body['location'] ?? null,
        $body['start_date'] ?? null,
        $body['end_date'] ?? null,
        $body['description'] ?? null,
        $body['is_education'] ?? false,
        $body['order_index'] ?? 0,
        $body['logo_icon'] ?? 'work',
        $body['company_logo'] ?? ''
    ]);

    http_response_code(201);
    echo json_encode(['message' => 'Experience created successfully', 'id' => (int) $db->lastInsertId()]);
}

function updateExperience($id, $body) {
    $db = getDB();
    $stmt = $db->prepare('
        UPDATE experiences SET title = ?, company = ?, location = ?, start_date = ?, end_date = ?, description = ?, is_education = ?, order_index = ?, logo_icon = ?, company_logo = ? 
        WHERE id = ?
    ');
    $stmt->execute([
        $body['title'] ?? '',
        $body['company'] ?? '',
        $body['location'] ?? null,
        $body['start_date'] ?? null,
        $body['end_date'] ?? null,
        $body['description'] ?? null,
        $body['is_education'] ?? false,
        $body['order_index'] ?? 0,
        $body['logo_icon'] ?? 'work',
        $body['company_logo'] ?? '',
        $id
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Experience not found']);
        return;
    }

    echo json_encode(['message' => 'Experience updated successfully']);
}

function deleteExperience($id) {
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM experiences WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Experience not found']);
        return;
    }

    echo json_encode(['message' => 'Experience deleted successfully']);
}
