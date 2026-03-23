<?php

// Database configuration
define('SUPABASE_URL', 'https://uweyfkmvidpfqcpajyje.supabase.co');
define('SUPABASE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3ZXlma212aWRwZnFjcGFqeWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODgwMjQsImV4cCI6MjA4MTg2NDAyNH0.K2NCruCSqgqZNMSOmImMihsldjaLiI7RI1Bh_DMw3-s');

require_once __DIR__ . '/src/Supabase.php';

$supabase = new Supabase(SUPABASE_URL, SUPABASE_KEY);

function sendJson($data, $status = 200) {
    header('Content-Type: application/json');
    http_response_code($status);
    echo json_encode($data);
    exit;
}
