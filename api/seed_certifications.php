<?php
/**
 * Seed Certifications Data
 * Run once via browser: https://yourdomain.com/api/seed_certifications.php
 * DELETE this file after running!
 */

require_once __DIR__ . '/config/database.php';
$db = getDB();

try {
    $db->beginTransaction();

    // Create table if not exists (in case not yet created by API)
    $db->exec("
        CREATE TABLE IF NOT EXISTS certifications (
            id             INT AUTO_INCREMENT PRIMARY KEY,
            name           VARCHAR(255) NOT NULL,
            issuer         VARCHAR(255) NOT NULL DEFAULT '',
            issue_date     VARCHAR(50),
            credential_url TEXT,
            badge_img      TEXT,
            order_index    INT DEFAULT 0,
            created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Clear existing certifications
    $db->exec('DELETE FROM certifications');

    $certifications = [
        [
            'name'           => 'Git & GitHub Dasar (Gold)',
            'issuer'         => 'Skilvul',
            'issue_date'     => '',
            'credential_url' => 'https://badgr.com/public/assertions/-TfOVIBqQR-S3YVClDP4uA?identity__email=r4n994mukti@gmail.com',
            'badge_img'      => 'https://api.badgr.io/public/assertions/-TfOVIBqQR-S3YVClDP4uA/image',
            'order_index'    => 1,
        ],
        [
            'name'           => 'Alibaba Cloud Certified Developer',
            'issuer'         => 'Alibaba Cloud',
            'issue_date'     => '2023',
            'credential_url' => 'https://alicloud-common.oss-ap-southeast-1.aliyuncs.com/2023/Developers/Certified-Developer.jpg',
            'badge_img'      => 'https://alicloud-common.oss-ap-southeast-1.aliyuncs.com/2023/Developers/Certified-Developer.jpg',
            'order_index'    => 2,
        ],
        [
            'name'           => 'Dasar Pemrograman Web',
            'issuer'         => 'Dicoding Indonesia',
            'issue_date'     => '',
            'credential_url' => 'https://www.dicoding.com/certificates/0LZ06GR0QZ65',
            'badge_img'      => 'https://dicoding-web-img.sgp1.cdn.digitaloceanspaces.com/original/academy/dos:dicoding-icon_07112022161708.png',
            'order_index'    => 3,
        ],
        [
            'name'           => 'UI-UX Research and Design: Fullstack Intensive Bootcamp',
            'issuer'         => 'MySkill',
            'issue_date'     => '',
            'credential_url' => 'https://storage.googleapis.com/myskill-v2-certificates/bootcamp-wL1ZPrRVvYujeiMrThU7/RVzCsV4M7NPykbi5Bg36XUpkWU32-ICid2v0sPa9VbN16N3H1.pdf',
            'badge_img'      => 'https://myskill.id/images/logo-myskill-green.png',
            'order_index'    => 4,
        ],
        [
            'name'           => 'Sertifikat Kelas Belajar Dasar HTML',
            'issuer'         => 'CODEPOLITAN',
            'issue_date'     => '',
            'credential_url' => 'https://codepolitan.com/c/9OV5FNH',
            'badge_img'      => 'https://codepolitan.com/img/logo-codepolitan.png',
            'order_index'    => 5,
        ],
    ];

    $stmt = $db->prepare('
        INSERT INTO certifications (name, issuer, issue_date, credential_url, badge_img, order_index)
        VALUES (?, ?, ?, ?, ?, ?)
    ');

    foreach ($certifications as $cert) {
        $stmt->execute([
            $cert['name'],
            $cert['issuer'],
            $cert['issue_date'],
            $cert['credential_url'],
            $cert['badge_img'],
            $cert['order_index'],
        ]);
    }

    $db->commit();
    echo "<h1 style='font-family:sans-serif;color:green'>✅ Berhasil!</h1>";
    echo "<p style='font-family:sans-serif'>" . count($certifications) . " certifications berhasil dimasukkan ke database.</p>";
    echo "<p style='font-family:sans-serif;color:red'><strong>Segera hapus file ini dari server!</strong></p>";

} catch (Exception $e) {
    $db->rollBack();
    echo "<h1 style='font-family:sans-serif;color:red'>❌ Gagal!</h1>";
    echo "<p style='font-family:sans-serif'>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
