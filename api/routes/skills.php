<?php
/**
 * Skills Routes
 * GET    /api/skills     - Get all skills
 * POST   /api/skills     - Create skill (admin)
 * PUT    /api/skills/:id - Update skill (admin)
 * DELETE /api/skills/:id - Delete skill (admin)
 */

function handleSkills($method, $segments, $body) {
    $param = $segments[1] ?? null;

    switch ($method) {
        case 'GET':
            getSkills();
            break;
        case 'POST':
            authenticateToken();
            createSkill($body);
            break;
        case 'PUT':
            authenticateToken();
            if ($param) updateSkill($param, $body);
            else { http_response_code(400); echo json_encode(['error' => 'Skill ID required']); }
            break;
        case 'DELETE':
            authenticateToken();
            if ($param) deleteSkill($param);
            else { http_response_code(400); echo json_encode(['error' => 'Skill ID required']); }
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function getSkills() {
    $db = getDB();
    $stmt = $db->query('SELECT * FROM skills ORDER BY order_index ASC, created_at DESC');
    $skills = $stmt->fetchAll();
    
    // cast numbers
    $parsed = array_map(function($s) {
        $s['id'] = (int) $s['id'];
        $s['order_index'] = (int) $s['order_index'];
        return $s;
    }, $skills);

    echo json_encode($parsed);
}

function createSkill($body) {
    $db = getDB();
    $stmt = $db->prepare('
        INSERT INTO skills (img_src, label, description, category, order_index) 
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $body['img_src'] ?? '',
        $body['label'] ?? '',
        $body['description'] ?? null,
        $body['category'] ?? null,
        $body['order_index'] ?? 0
    ]);

    http_response_code(201);
    echo json_encode(['message' => 'Skill created successfully', 'id' => (int) $db->lastInsertId()]);
}

function updateSkill($id, $body) {
    $db = getDB();
    $stmt = $db->prepare('
        UPDATE skills SET img_src = ?, label = ?, description = ?, category = ?, order_index = ? 
        WHERE id = ?
    ');
    $stmt->execute([
        $body['img_src'] ?? '',
        $body['label'] ?? '',
        $body['description'] ?? null,
        $body['category'] ?? null,
        $body['order_index'] ?? 0,
        $id
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Skill not found']);
        return;
    }

    echo json_encode(['message' => 'Skill updated successfully']);
}

function deleteSkill($id) {
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM skills WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Skill not found']);
        return;
    }

    echo json_encode(['message' => 'Skill deleted successfully']);
}
