<?php
require_once __DIR__ . '/../backend/config.php';

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendJson(['error' => 'Invalid JSON'], 400);
}

$requiredFields = ['phone', 'transaction_id', 'variant'];
foreach ($requiredFields as $field) {
    if (!isset($input[$field])) {
        sendJson(['error' => "Missing required field: $field"], 400);
    }
}

$phone = trim($input['phone']);
$transactionId = $input['transaction_id'];
$variant = $input['variant'];

// 1. Validate Phone (Simple regex for example: at least 8 digits)
if (!preg_match('/^[0-9+ \-]{8,20}$/', $phone)) {
    sendJson(['error' => 'Formato de teléfono inválido'], 400);
}

// 2. Check for Duplicates
$existing = $supabase->selectWithFilter('funnel_conversions', "phone=eq.$phone", "id");
if (!isset($existing['error']) && !empty($existing)) {
    sendJson(['error' => 'El número ya se encuentra suscrito'], 409);
}

// 3. Generate Unique Hash
// Replicating a bit of the frontend logic but making it robust
$hash = strtoupper(substr(md5($phone . $transactionId . microtime()), 0, 8));

// 4. Save Conversion
$conversion = [
    'phone' => $phone,
    'transaction_id' => $transactionId,
    'variant' => $variant,
    'hash' => $hash,
    'headers' => getallheaders(),
    'created_at' => date('c')
];

$result = $supabase->insert('funnel_conversions', $conversion);

if (isset($result['error'])) {
    sendJson(['error' => 'Error al procesar la alta', 'details' => $result['message']], 500);
}

// 5. Also log a 'conversion' event
$supabase->insert('funnel_events', [
    'transaction_id' => $transactionId,
    'variant' => $variant,
    'event_type' => 'conversion',
    'metadata' => ['phone' => $phone],
    'timestamp' => date('c')
]);

sendJson(['success' => true, 'hash' => $hash]);
