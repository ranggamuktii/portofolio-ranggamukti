<?php
/**
 * Analytics Routes
 * POST /api/analytics/track - Track page view (public)
 * GET  /api/analytics       - Get analytics summary (admin)
 */

function handleAnalytics($method, $segments, $body) {
    $action = $segments[1] ?? null;

    if ($method === 'POST' && $action === 'track') {
        trackAnalytics($body);
    } elseif ($method === 'GET' && !$action) {
        authenticateToken();
        getAnalytics();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

function trackAnalytics($body) {
    $path = $body['path'] ?? '';

    if (empty($path)) {
        http_response_code(400);
        echo json_encode(['error' => 'Path is required']);
        return;
    }

    $db = getDB();
    try {
        $stmt = $db->prepare('
            INSERT INTO page_views (page_path, view_count) 
            VALUES (?, 1) 
            ON DUPLICATE KEY UPDATE view_count = view_count + 1, last_viewed = CURRENT_TIMESTAMP
        ');
        $stmt->execute([$path]);

        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to track view']);
    }
}

function getAnalytics() {
    $db = getDB();
    try {
        $stmt = $db->query('SELECT * FROM page_views ORDER BY view_count DESC');
        $views = $stmt->fetchAll();

        $stmtTotal = $db->query('SELECT SUM(view_count) as total FROM page_views');
        $totalViews = $stmtTotal->fetch()['total'] ?? 0;

        $stmtUnread = $db->query('SELECT COUNT(*) as unread FROM messages WHERE is_read = FALSE');
        $unreadCount = $stmtUnread->fetch()['unread'] ?? 0;

        echo json_encode([
            'details' => $views,
            'totalViews' => (int) $totalViews,
            'unreadCount' => (int) $unreadCount
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch analytics']);
    }
}
