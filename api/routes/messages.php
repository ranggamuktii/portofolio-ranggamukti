<?php
/**
 * Messages Routes
 * POST   /api/messages          - Send message (public)
 * GET    /api/messages          - Get all messages (admin)
 * PUT    /api/messages/:id/read - Mark as read (admin)
 * DELETE /api/messages/:id      - Delete message (admin)
 */

function handleMessages($method, $segments, $body) {
    $param = $segments[1] ?? null;
    $action = $segments[2] ?? null;

    if ($method === 'POST') {
        sendMessage($body);
    } elseif ($method === 'GET') {
        authenticateToken();
        getMessages();
    } elseif ($method === 'PUT' && $action === 'read' && $param) {
        authenticateToken();
        markAsRead($param);
    } elseif ($method === 'DELETE' && $param) {
        authenticateToken();
        deleteMessage($param);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

function sendMessage($body) {
    $name = $body['name'] ?? '';
    $email = $body['email'] ?? '';
    $company = $body['company'] ?? '';
    $message = $body['message'] ?? '';

    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }

    $db = getDB();
    try {
        $stmt = $db->prepare('INSERT INTO messages (name, email, company, message) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $email, $company, $message]);
        
        http_response_code(201);
        echo json_encode(['message' => 'Message sent successfully', 'id' => (int) $db->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send message']);
    }
}

function getMessages() {
    $db = getDB();
    $stmt = $db->query('SELECT * FROM messages ORDER BY created_at DESC');
    $messages = $stmt->fetchAll();

    $parsed = array_map(function($m) {
        $m['id'] = (int) $m['id'];
        $m['is_read'] = (bool) $m['is_read'];
        return $m;
    }, $messages);

    echo json_encode($parsed);
}

function markAsRead($id) {
    $db = getDB();
    $stmt = $db->prepare('UPDATE messages SET is_read = TRUE WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Message not found']);
        return;
    }

    echo json_encode(['message' => 'Message marked as read']);
}

function deleteMessage($id) {
    $db = getDB();
    $stmt = $db->prepare('DELETE FROM messages WHERE id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Message not found']);
        return;
    }

    echo json_encode(['message' => 'Message deleted successfully']);
}
