<?php
/**
 * Certifications Routes
 * GET    /api/certifications     - Get all certifications (public)
 * POST   /api/certifications     - Create certification (admin)
 * PUT    /api/certifications/:id - Update certification (admin)
 * DELETE /api/certifications/:id - Delete certification (admin)
 */

function handleCertifications($method, $segments, $body) {
    $param = $segments[1] ?? null;

    switch ($method) {
        case 'GET':
            getCertifications();
            break;
        case 'POST':
            authenticateToken();
            createCertification($body);
            break;
        case 'PUT':
            authenticateToken();
            if ($param) updateCertification($param, $body);
            else { http_response_code(400); echo json_encode(['error' => 'Certification ID required']); }
            break;
        case 'DELETE':
            authenticateToken();
            if ($param) deleteCertification($param);
            else { http_response_code(400); echo json_encode(['error' => 'Certification ID required']); }
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function getCertifications() {
    $db = getDB();
    // Ensure the table exists before querying
    $db->exec("CREATE TABLE IF NOT EXISTS certifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        issuer VARCHAR(255) NOT NULL,
        issue_date VARCHAR(50),
        credential_url VARCHAR(500),
        badge_img VARCHAR(500),
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    $stmt = $db->query('SELECT * FROM certifications ORDER BY order_index ASC, created_at DESC');
    $certifications = $stmt->fetchAll();

    $parsed = array_map(function($c) {
        $c['id'] = (int) $c['id'];
        $c['order_index'] = (int) $c['order_index'];
        return $c;
    }, $certifications);

    echo json_encode($parsed);
}

function createCertification($body) {
    $db = getDB();
    $stmt = $db->prepare('
        INSERT INTO certifications (name, issuer, issue_date, credential_url, badge_img, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $body['name'] ?? '',
        $body['issuer'] ?? '',
        $body['issue_date'] ?? null,
        $body['credential_url'] ?? null,
        $body['badge_img'] ?? '',
        $body['order_index'] ?? 0,
    ]);

    http_response_code(201);
    echo json_encode(['message' => 'Certification created successfully', 'id' => (int) $db->lastInsertId()]);
}

function updateCertification($id, $body) {
    $db = getDB();
    $stmt = $db->prepare('
        UPDATE certifications SET name = ?, issuer = ?, issue_date = ?, credential_url = ?, badge_img = ?, order_index = ?
        WHERE id = ?
    ');
    $stmt->execute([
        $body['name'] ?? '',
        $body['issuer'] ?? '',
        $body['issue_date'] ?? null,
        $body['credential_url'] ?? null,
        $body['badge_img'] ?? '',
        $body['order_index'] ?? 0,
        $id
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Certification not found']);
        return;
    }

    echo json_encode(['message' => 'Certification updated successfully']);
}

function deleteCertification($id) {
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM certifications WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Certification not found']);
        return;
    }

    echo json_encode(['message' => 'Certification deleted successfully']);
}
