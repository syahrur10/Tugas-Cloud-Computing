<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$dataFile = __DIR__ . '/data.json';

// Inisialisasi file data
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode(['orders' => []]));
}

$method = $_SERVER['REQUEST_METHOD'];

// GET: Ambil semua order
if ($method === 'GET') {
    $data = json_decode(file_get_contents($dataFile), true);
    echo json_encode($data['orders']);
    exit;
}

// POST: Tambah order baru
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $customer = $input['customer'] ?? '';
    $serviceType = $input['serviceType'] ?? '';
    $weight = floatval($input['weight'] ?? 0);
    
    if (!$customer || !$serviceType || $weight <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
        exit;
    }
    
    $pricePerKg = $serviceType === 'Express' ? 15000 : 10000;
    $total = $pricePerKg * $weight;
    
    $data = json_decode(file_get_contents($dataFile), true);
    $newOrder = [
        'id' => time() . rand(100, 999),
        'customer' => $customer,
        'serviceType' => $serviceType,
        'weight' => $weight,
        'total' => $total,
        'status' => 'Diproses',
        'createdAt' => date('Y-m-d H:i:s')
    ];
    
    $data['orders'][] = $newOrder;
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    
    http_response_code(201);
    echo json_encode($newOrder);
    exit;
}

// DELETE: Hapus order
if ($method === 'DELETE') {
    $path = explode('/', $_SERVER['REQUEST_URI']);
    $id = end($path);
    
    $data = json_decode(file_get_contents($dataFile), true);
    $data['orders'] = array_values(array_filter($data['orders'], function($order) use ($id) {
        return $order['id'] != $id;
    }));
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    
    echo json_encode(['message' => 'Order dihapus']);
    exit;
}
?>