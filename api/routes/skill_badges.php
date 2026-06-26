<?php
/**
 * Skill Badges Routes
 * GET    /api/skill-badges         - Public: get all badges
 * POST   /api/skill-badges         - Admin: create badge
 * PUT    /api/skill-badges/{id}    - Admin: update badge
 * DELETE /api/skill-badges/{id}    - Admin: delete badge
 */

function handleSkillBadges($method, $segments, $body) {
    $id = isset($segments[1]) ? (int)$segments[1] : null;

    switch ($method) {
        case 'GET':
            getSkillBadges();
            break;
        case 'POST':
            authenticateToken();
            createSkillBadge($body);
            break;
        case 'PUT':
            authenticateToken();
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID required']); return; }
            updateSkillBadge($id, $body);
            break;
        case 'DELETE':
            authenticateToken();
            if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID required']); return; }
            deleteSkillBadge($id);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function initSkillBadgesTable($db) {
    $db->exec("
        CREATE TABLE IF NOT EXISTS skill_badges (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            name        TEXT    NOT NULL,
            category    TEXT    NOT NULL DEFAULT 'General',
            icon_url    TEXT,
            level       TEXT    DEFAULT 'Intermediate',
            color       TEXT    DEFAULT '#38bdf8',
            order_index INTEGER DEFAULT 0,
            created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");
}

function getSkillBadges() {
    $db = getDB();
    initSkillBadgesTable($db);
    $stmt = $db->query('SELECT * FROM skill_badges ORDER BY category ASC, order_index ASC, name ASC');
    $badges = $stmt->fetchAll();
    $parsed = array_map(function($b) {
        $b['id']          = (int)$b['id'];
        $b['order_index'] = (int)$b['order_index'];
        return $b;
    }, $badges);
    echo json_encode($parsed);
}

function createSkillBadge($body) {
    $db = getDB();
    initSkillBadgesTable($db);
    $stmt = $db->prepare('
        INSERT INTO skill_badges (name, category, icon_url, level, color, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $body['name']        ?? '',
        $body['category']    ?? 'General',
        $body['icon_url']    ?? null,
        $body['level']       ?? 'Intermediate',
        $body['color']       ?? '#38bdf8',
        $body['order_index'] ?? 0,
    ]);
    $id = $db->lastInsertId();
    http_response_code(201);
    echo json_encode(['id' => (int)$id, 'message' => 'Skill badge created']);
}

function updateSkillBadge($id, $body) {
    $db = getDB();
    $stmt = $db->prepare('
        UPDATE skill_badges
        SET name=?, category=?, icon_url=?, level=?, color=?, order_index=?
        WHERE id=?
    ');
    $stmt->execute([
        $body['name']        ?? '',
        $body['category']    ?? 'General',
        $body['icon_url']    ?? null,
        $body['level']       ?? 'Intermediate',
        $body['color']       ?? '#38bdf8',
        $body['order_index'] ?? 0,
        $id,
    ]);
    echo json_encode(['message' => 'Skill badge updated']);
}

function deleteSkillBadge($id) {
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM skill_badges WHERE id=?');
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Skill badge deleted']);
}
