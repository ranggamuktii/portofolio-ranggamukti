<?php
/**
 * Upload Routes
 * POST /api/upload - Upload image (admin)
 */

function handleUpload($method, $segments) {
    if ($method === 'POST') {
        authenticateToken();
        uploadFile();
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
}

function uploadFile() {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or upload error']);
        return;
    }

    $file = $_FILES['image'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Validate extension
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    if (!in_array($ext, $allowed)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type']);
        return;
    }

    // Create uploads dir if not exists (in public_html/uploads)
    $uploadDir = dirname(__DIR__, 2) . '/uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = time() . '-' . rand(100000000, 999999999) . '.webp';
    $targetPath = $uploadDir . '/' . $filename;

    // Compress and convert to WEBP using PHP GD
    $sourceImage = null;
    switch($ext) {
        case 'jpg':
        case 'jpeg':
            $sourceImage = @imagecreatefromjpeg($file['tmp_name']);
            break;
        case 'png':
            $sourceImage = @imagecreatefrompng($file['tmp_name']);
            // preserve transparency
            if ($sourceImage) {
                imagepalettetotruecolor($sourceImage);
                imagealphablending($sourceImage, true);
                imagesavealpha($sourceImage, true);
            }
            break;
        case 'gif':
            $sourceImage = @imagecreatefromgif($file['tmp_name']);
            break;
        case 'webp':
            $sourceImage = @imagecreatefromwebp($file['tmp_name']);
            break;
    }

    if ($sourceImage) {
        // Save as WebP with 80% quality
        imagewebp($sourceImage, $targetPath, 80);
        imagedestroy($sourceImage);
        echo json_encode(['url' => '/uploads/' . $filename]);
    } else {
        // Fallback for SVGs or if GD fails
        $fallbackFilename = time() . '-' . rand(100000000, 999999999) . '.' . $ext;
        $fallbackPath = $uploadDir . '/' . $fallbackFilename;
        if (move_uploaded_file($file['tmp_name'], $fallbackPath)) {
            echo json_encode(['url' => '/uploads/' . $fallbackFilename]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save file']);
        }
    }
}
