<?php
include "conexao.php";

$nome = $_POST['nome'];
$email = $_POST['email'];
$valor = $_POST['valor'];

// anti-injeção
$nome = $conn->real_escape_string($nome);
$email = $conn->real_escape_string($email);

$sql = "INSERT INTO pagamentos (nome, email, valor) VALUES ('$nome', '$email', '$valor')";

if ($conn->query($sql) === TRUE) {
    echo "Pagamento registrado com sucesso!";
} else {
    echo "Erro: " . $conn->error;
}

$conn->close();
?>
