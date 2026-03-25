<?php
require_once __DIR__ . '/../../backend/config.php';

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

$requiredFields = ['transaction_id', 'variant', 'event_type'];
foreach ($requiredFields as $field) {
    if (!isset($input[$field])) {
        sendJson(['error' => "Missing required field: $field"], 400);
    }
}

// Map metadata if exists
$event = [
    'transaction_id' => $input['transaction_id'],
    'variant' => $input['variant'],
    'event_type' => $input['event_type'],
    'metadata' => isset($input['metadata']) ? $input['metadata'] : null,
    'timestamp' => isset($input['timestamp']) ? $input['timestamp'] : date('c')
];

$result = $supabase->insert('funnel_events', $event);

if (isset($result['error'])) {
    sendJson(['error' => 'Failed to log event', 'details' => $result['message']], 500);
}

sendJson(['success' => true]);
