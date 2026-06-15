<?php
/**
 * Social Links Routes
 * GET /api/social - Get all social links
 * PUT /api/social - Replace all social links (admin)
 */

function handleSocial($method, $segments, $body) {
    switch ($method) {
        case 'GET':
            getSocialLinks();
            break;
        case 'PUT':
            authenticateToken();
            updateSocialLinks($body);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function getSocialLinks() {
    $db = getDB();
    $stmt = $db->query('SELECT * FROM social_links ORDER BY order_index ASC');
    $links = $stmt->fetchAll();
    
    // cast numbers
    $parsed = array_map(function($l) {
        $l['id'] = (int) $l['id'];
        $l['order_index'] = (int) $l['order_index'];
        return $l;
    }, $links);

    echo json_encode($parsed);
}

function updateSocialLinks($body) {
    $links = $body['links'] ?? null;

    if (!is_array($links)) {
        http_response_code(400);
        echo json_encode(['error' => 'Links must be an array']);
        return;
    }

    $db = getDB();
    try {
        $db->beginTransaction();

        // Delete existing links
        $db->exec('DELETE FROM social_links');

        // Insert new ones
        if (count($links) > 0) {
            $stmt = $db->prepare('INSERT INTO social_links (platform, label, href, icon, order_index) VALUES (?, ?, ?, ?, ?)');
            foreach ($links as $link) {
                $stmt->execute([
                    $link['platform'] ?? '',
                    $link['label'] ?? '',
                    $link['href'] ?? '',
                    $link['icon'] ?? null,
                    $link['order_index'] ?? 0
                ]);
            }
        }

        $db->commit();
        echo json_encode(['message' => 'Social links updated successfully']);
    } catch (PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update social links']);
    }
}
