<?php
/**
 * Auth Routes
 * POST /api/auth/login - Login
 * GET  /api/auth/me    - Verify token
 */

function handleAuth($method, $segments, $body) {
    $action = $segments[1] ?? '';

    if ($action === 'login' && $method === 'POST') {
        authLogin($body);
    } elseif ($action === 'me' && $method === 'GET') {
        authMe();
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Auth route not found']);
    }
}

function authLogin($body) {
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    // Verify password (compatible with bcryptjs from Node.js)
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    // Generate JWT
    $token = createJWT([
        'id' => $user['id'],
        'username' => $user['username'],
        'name' => $user['name'],
    ], getJWTSecret(), 86400); // 24 hours

    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'name' => $user['name'],
        ],
    ]);
}

function authMe() {
    $payload = authenticateToken();

    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, name FROM users WHERE id = ?');
    $stmt->execute([$payload['id']]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'User not found']);
        return;
    }

    echo json_encode(['user' => $user]);
}
