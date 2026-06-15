<?php
/**
 * Settings Routes
 * GET /api/settings - Get global settings
 * PUT /api/settings - Update settings (admin)
 */

function handleSettings($method, $segments, $body) {
    switch ($method) {
        case 'GET':
            getSettings();
            break;
        case 'PUT':
            authenticateToken();
            updateSettings($body);
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
}

function getSettings() {
    $db = getDB();
    $stmt = $db->query('SELECT key_name, value FROM settings');
    $settings = $stmt->fetchAll();

    $settingsObj = [];
    foreach ($settings as $row) {
        $settingsObj[$row['key_name']] = $row['value'];
    }

    $defaultSettings = [
        'hero_title' => "Hi, I'm Rangga Mukti",
        'hero_subtitle' => "Fullstack Web Developer crafting seamless digital experiences.",
        'about_text' => "I am an enthusiastic Fullstack Developer with a passion for building scalable web applications. I love solving complex problems and turning ideas into reality.",
        'cv_link' => "#",
        'contact_email' => 'hello@ranggamukti.com'
    ];

    $mergedSettings = array_merge($defaultSettings, $settingsObj);

    echo json_encode($mergedSettings);
}

function updateSettings($body) {
    $settings = $body['settings'] ?? null;

    if (!is_array($settings)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid settings format']);
        return;
    }

    $db = getDB();
    try {
        $db->beginTransaction();
        
        $stmt = $db->prepare('
            INSERT INTO settings (key_name, value) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE value = VALUES(value)
        ');

        foreach ($settings as $key => $val) {
            $stmt->execute([$key, $val]);
        }

        $db->commit();
        echo json_encode(['message' => 'Settings updated successfully']);
    } catch (PDOException $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update settings']);
    }
}
