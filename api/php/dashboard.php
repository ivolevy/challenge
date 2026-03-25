<?php
require_once __DIR__ . '/../../backend/config.php';

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Fetch all events and conversions to calculate metrics
// In a large scale app, we would use SQL aggregations, but for this challenge and PostgREST simplicity, 
// we'll fetch then process if volume is low, or use specific RPCs if needed.
// For now, let's fetch counts using select with count.

$eventsTotal = $supabase->select('funnel_events', 'id.count()');
$conversionsTotal = $supabase->select('funnel_conversions', 'id.count()');

// Funnel Metrics
$bannerClicks = $supabase->selectWithFilter('funnel_events', 'event_type=eq.banner_click', 'id.count()');
$pageViews = $supabase->selectWithFilter('funnel_events', 'event_type=eq.page_view', 'id.count()');
$interactions = $supabase->selectWithFilter('funnel_events', 'event_type=in.(input_focus,input_typing)', 'id.count()');
$buttonClicks = $supabase->selectWithFilter('funnel_events', 'event_type=eq.button_click', 'id.count()');
$totalConversions = $supabase->select('funnel_conversions', 'id.count()');

// Variant Breakdown
$variantA = $supabase->selectWithFilter('funnel_conversions', 'variant=eq.A', 'id.count()');
$variantB = $supabase->selectWithFilter('funnel_conversions', 'variant=eq.B', 'id.count()');

// Fetch recent conversions
$recentConversions = $supabase->select('funnel_conversions', '*');
// Sort by date descending (PHP side for simplicity with PostgREST result)
usort($recentConversions, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});
$recentConversions = array_slice($recentConversions, 0, 50);

// Helper to get count from result
function getCount($res) {
    if (isset($res[0]['count'])) return $res[0]['count'];
    return 0;
}

$cBanner = getCount($bannerClicks);
$cPageView = getCount($pageViews);
$cInteraction = getCount($interactions);
$cButtonClick = getCount($buttonClicks);
$cConversion = getCount($totalConversions);

$maxValue = max($cBanner, 1);

$funnel = [
    ['name' => 'Banner Click', 'count' => $cBanner, 'percentage' => round(($cBanner / $maxValue) * 100)],
    ['name' => 'Page View', 'count' => $cPageView, 'percentage' => round(($cPageView / $maxValue) * 100)],
    ['name' => 'Interaction', 'count' => $cInteraction, 'percentage' => round(($cInteraction / $maxValue) * 100)],
    ['name' => 'Button Click', 'count' => $cButtonClick, 'percentage' => round(($cButtonClick / $maxValue) * 100)],
    ['name' => 'Conversion', 'count' => $cConversion, 'percentage' => round(($cConversion / $maxValue) * 100)]
];

sendJson([
    'conversions' => $recentConversions,
    'funnel' => $funnel,
    'stats' => [
        'total' => $cConversion,
        'variantA' => getCount($variantA),
        'variantB' => getCount($variantB),
        'totalEvents' => getCount($eventsTotal)
    ]
]);
