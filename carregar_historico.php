<?php
// carregar_historico.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
  $pdo = new PDO("mysql:host=localhost;dbname=ecocalc", "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  $q = $pdo->query("SELECT total_co2, data_registro FROM historico ORDER BY id DESC LIMIT 20");
  $dados = $q->fetchAll(PDO::FETCH_ASSOC);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($dados);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
