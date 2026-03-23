<?php
// PHP Script to verify endpoints

$baseUrl = 'http://localhost:8000';

function testEndpoint($url, $method = 'GET', $data = null) {
    echo "Testing $method $url...\n";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    if ($data) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    }
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "Status: $httpCode\n";
    echo "Response: $response\n\n";
    return ['code' => $httpCode, 'body' => json_decode($response, true)];
}

$transactionId = "550e8400-e29b-41d4-a716-446655440000";

// 1. Test Track
testEndpoint("$baseUrl/api/track.php", 'POST', [
    'transaction_id' => $transactionId,
    'variant' => 'A',
    'event_type' => 'page_view',
    'timestamp' => date('c')
]);

// 2. Test Subscribe
testEndpoint("$baseUrl/api/subscribe.php", 'POST', [
    'phone' => '+541122334455',
    'transaction_id' => $transactionId,
    'variant' => 'A'
]);

// 3. Test Dashboard
testEndpoint("$baseUrl/api/dashboard.php");
