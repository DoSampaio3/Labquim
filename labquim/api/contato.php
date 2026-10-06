<?php
/**
 * LabQuim — API de Contato
 * Endpoint: api/contato.php
 * Método: POST (JSON)
 */

// Headers CORS e JSON
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Método não permitido.']);
    exit;
}

// Ler JSON do body
$corpo = file_get_contents('php://input');
$dados = json_decode($corpo, true);

// Fallback para form-data
if (!$dados) {
    $dados = $_POST;
}

// ===== VALIDAÇÃO =====
$erros = [];

$nome     = isset($dados['nome'])     ? trim(strip_tags($dados['nome']))     : '';
$email    = isset($dados['email'])    ? trim(strip_tags($dados['email']))     : '';
$assunto  = isset($dados['assunto'])  ? trim(strip_tags($dados['assunto']))   : 'Contato via site';
$mensagem = isset($dados['mensagem']) ? trim(strip_tags($dados['mensagem']))  : '';
$copia    = isset($dados['copia'])    && $dados['copia'] ? true : false;

if (empty($nome))          $erros[] = 'Nome é obrigatório.';
if (empty($email))         $erros[] = 'E-mail é obrigatório.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erros[] = 'E-mail inválido.';
if (empty($mensagem))      $erros[] = 'Mensagem é obrigatória.';
if (strlen($mensagem) < 10) $erros[] = 'Mensagem muito curta (mínimo 10 caracteres).';
if (strlen($nome) > 100)   $erros[] = 'Nome muito longo.';

// Rate limiting simples via sessão
session_start();
$agora = time();
if (isset($_SESSION['ultimo_envio']) && ($agora - $_SESSION['ultimo_envio']) < 60) {
    $erros[] = 'Aguarde 1 minuto antes de enviar outra mensagem.';
}

if (!empty($erros)) {
    http_response_code(422);
    echo json_encode(['sucesso' => false, 'mensagem' => implode(' ', $erros)]);
    exit;
}

// ===== CONFIGURAÇÕES =====
$destinatario = 'labexa@uefs.br';
$assunto_email = "LabQuim — {$assunto}";

// ===== CORPO DO E-MAIL =====
$corpo_email = "Nova mensagem recebida pelo formulário de contato do LabQuim\n";
$corpo_email .= str_repeat('=', 55) . "\n\n";
$corpo_email .= "Nome:      {$nome}\n";
$corpo_email .= "E-mail:    {$email}\n";
$corpo_email .= "Assunto:   {$assunto}\n";
$corpo_email .= "Data/Hora: " . date('d/m/Y H:i:s') . "\n\n";
$corpo_email .= "Mensagem:\n";
$corpo_email .= str_repeat('-', 40) . "\n";
$corpo_email .= "{$mensagem}\n\n";
$corpo_email .= str_repeat('=', 55) . "\n";
$corpo_email .= "Enviado via site LabQuim — UEFS\n";

// ===== HEADERS DO E-MAIL =====
$headers  = "From: LabQuim Site <noreply@uefs.br>\r\n";
$headers .= "Reply-To: {$nome} <{$email}>\r\n";
$headers .= "X-Mailer: LabQuim-PHP/1.0\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

// ===== ENVIO =====
$enviado = mail($destinatario, $assunto_email, $corpo_email, $headers);

// Cópia para o remetente
if ($enviado && $copia) {
    $corpo_copia  = "Olá, {$nome}!\n\n";
    $corpo_copia .= "Recebemos sua mensagem. Entraremos em contato em breve.\n\n";
    $corpo_copia .= "Sua mensagem:\n";
    $corpo_copia .= str_repeat('-', 40) . "\n";
    $corpo_copia .= "{$mensagem}\n\n";
    $corpo_copia .= str_repeat('-', 40) . "\n";
    $corpo_copia .= "Atenciosamente,\nEquipe LabQuim — UEFS\n";

    $headers_copia  = "From: LabQuim <labexa@uefs.br>\r\n";
    $headers_copia .= "MIME-Version: 1.0\r\n";
    $headers_copia .= "Content-Type: text/plain; charset=UTF-8\r\n";

    mail($email, "Sua mensagem ao LabQuim — cópia", $corpo_copia, $headers_copia);
}

// ===== LOG =====
$log_dir  = __DIR__ . '/../logs';
$log_file = $log_dir . '/contato.log';
if (!is_dir($log_dir)) @mkdir($log_dir, 0755, true);
$log_linha = date('Y-m-d H:i:s') . " | " . ($enviado ? 'OK' : 'FALHA') . " | {$nome} | {$email} | " . substr($mensagem, 0, 60) . "\n";
@file_put_contents($log_file, $log_linha, FILE_APPEND | LOCK_EX);

// ===== RESPOSTA =====
if ($enviado) {
    $_SESSION['ultimo_envio'] = $agora;
    http_response_code(200);
    echo json_encode([
        'sucesso'  => true,
        'mensagem' => 'Mensagem enviada com sucesso! Retornaremos em breve.',
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'sucesso'  => false,
        'mensagem' => 'Não foi possível enviar o e-mail. Por favor, envie diretamente para labexa@uefs.br.',
    ]);
}
