<?php
// save.php - salva um registro simples no DB
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
  $pdo = new PDO("mysql:host=localhost;dbname=ecocalc", "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

  $total = isset($_POST['total_co2']) ? $_POST['total_co2'] : null;
  if ($total === null) {
    echo "missing_total";
    exit;
  }

  $data = date("Y-m-d H:i:s");
  $stmt = $pdo->prepare("INSERT INTO historico (total_co2, data_registro) VALUES (?, ?)");
  $stmt->execute([$total, $data]);

  echo "ok";
} catch (Exception $e) {
  http_response_code(500);
  echo "error: " . $e->getMessage();
}
