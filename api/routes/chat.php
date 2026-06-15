<?php
/**
 * Chat Routes
 * POST /api/chat      - Handle chat messages
 * GET  /api/chat/faqs - Get all FAQs
 */

function handleChat($method, $segments, $body) {
    $action = $segments[1] ?? null;

    if ($method === 'POST' && !$action) {
        postChat($body);
    } elseif ($method === 'GET' && $action === 'faqs') {
        getFaqs();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

function postChat($body) {
    $message = $body['message'] ?? '';
    $sessionId = $body['sessionId'] ?? null;

    if (empty($message)) {
        http_response_code(400);
        echo json_encode(['error' => 'Message is required']);
        return;
    }

    $db = getDB();
    try {
        // Search for FAQ match
        $stmt = $db->prepare('
            SELECT * FROM faqs 
            WHERE LOWER(question) LIKE LOWER(?) 
            ORDER BY order_index ASC 
            LIMIT 1
        ');
        $stmt->execute(['%' . $message . '%']);
        $faq = $stmt->fetch();

        $isFaq = true;
        if ($faq) {
            $response = $faq['answer'];
        } else {
            $response = 'Maaf, saya belum bisa menjawab pertanyaan tersebut. Silakan hubungi saya langsung melalui form kontak atau social media yang tertera di footer.';
            $isFaq = false;
        }

        // Log the conversation
        $logStmt = $db->prepare('INSERT INTO chat_messages (session_id, message, response, is_faq) VALUES (?, ?, ?, ?)');
        $logStmt->execute([$sessionId, $message, $response, (int)$isFaq]);

        echo json_encode([
            'response' => $response,
            'isFaq' => $isFaq,
            'timestamp' => date('c')
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to process chat message']);
    }
}

function getFaqs() {
    $db = getDB();
    try {
        $stmt = $db->query('SELECT id, question, answer, category, order_index FROM faqs ORDER BY order_index ASC');
        $faqs = $stmt->fetchAll();

        $parsed = array_map(function($f) {
            $f['id'] = (int) $f['id'];
            $f['order_index'] = (int) $f['order_index'];
            return $f;
        }, $faqs);

        echo json_encode($parsed);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch FAQs']);
    }
}
