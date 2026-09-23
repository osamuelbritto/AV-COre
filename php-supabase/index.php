<?php
require_once __DIR__ . '/supabase.php';

$client = new SupabaseClient();
$message = null;
$messageType = 'info';

// Processar ações de formulário (Salvar / Deletar)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'save';

    if ($action === 'save') {
        $signatureData = [
            'id' => !empty($_POST['id']) ? trim($_POST['id']) : null,
            'full_name' => trim($_POST['full_name'] ?? ''),
            'role' => trim($_POST['role'] ?? ''),
            'email' => trim($_POST['email'] ?? ''),
            'whatsapp' => trim($_POST['whatsapp'] ?? ''),
            'site' => trim($_POST['site'] ?? 'www.avcore.com.br'),
            'company_name' => 'AV CORE',
            'company_tagline' => 'Soluções em Tecnologia e Interatividade',
        ];

        if (!empty($signatureData['full_name']) && !empty($signatureData['role'])) {
            $result = $client->saveSignature($signatureData);
            if ($result['code'] >= 200 && $result['code'] < 300) {
                $message = "Assinatura de {$signatureData['full_name']} salva com sucesso no Supabase!";
                $messageType = 'success';
            } else {
                $message = "Aviso: Não foi possível sincronizar com o Supabase. Verifique suas credenciais no config.php (" . json_encode($result) . ")";
                $messageType = 'warning';
            }
        }
    } elseif ($action === 'delete' && !empty($_POST['delete_id'])) {
        $client->deleteSignature($_POST['delete_id']);
        $message = "Assinatura excluída com sucesso!";
        $messageType = 'success';
    }
}

// Carregar assinaturas do Supabase
$savedSignatures = $client->getSignatures();

// Dados padrão iniciais (Modelo Samuel Britto)
$currentData = [
    'full_name' => 'Samuel Britto',
    'role' => 'Engenheiro de Aplicações em Campo / Pré-Vendas',
    'email' => 'samuel.britto@avcore.com.br',
    'whatsapp' => '+55 11 984232769',
    'site' => 'www.avcore.com.br',
    'company_name' => 'AV CORE',
    'company_tagline' => 'Soluções em Tecnologia e Interatividade'
];

// Se clicou para editar uma assinatura salva
if (isset($_GET['edit_id'])) {
    $found = $client->getSignatureById($_GET['edit_id']);
    if ($found) {
        $currentData = $found;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gerador de Assinatura AV CORE - PHP + Supabase</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .sig-font { font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">

  <!-- Cabeçalho Institucional -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-[#005fae] flex items-center justify-center text-white font-black text-sm tracking-wider shadow-xs">
          AV
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-slate-900 tracking-tight text-lg">AV CORE</span>
            <span class="text-xs font-semibold text-[#005fae] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              PHP + Supabase
            </span>
          </div>
          <p class="text-[11px] text-slate-500">Gerador de Assinaturas Corporativas</p>
        </div>
      </div>
      <div class="text-xs text-slate-500 hidden sm:block">
        Backend: <strong>PHP 8.x</strong> &bull; Database: <strong>Supabase (PostgreSQL)</strong>
      </div>
    </div>
  </header>

  <!-- Notificação -->
  <?php if ($message): ?>
    <div class="max-w-7xl mx-auto px-4 mt-4 w-full">
      <div class="p-4 rounded-xl text-sm font-medium <?= $messageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200' ?>">
        <?= htmlspecialchars($message) ?>
      </div>
    </div>
  <?php endif; ?>

  <!-- Conteúdo Principal -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Coluna da Esquerda: Formulário PHP -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Dados do Colaborador</h2>
              <p class="text-xs text-slate-500">Altere os dados para gerar a assinatura</p>
            </div>
            <button type="button" onclick="loadDefaultModel()" class="text-xs font-semibold text-[#005fae] bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
              Preencher Modelo
            </button>
          </div>

          <form method="POST" id="signatureForm" class="space-y-4">
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="id" id="field_id" value="<?= htmlspecialchars($currentData['id'] ?? '') ?>">

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Nome Completo *</label>
              <input type="text" name="full_name" id="input_full_name" required value="<?= htmlspecialchars($currentData['full_name']) ?>"
                oninput="updatePreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#005fae] outline-none transition-all">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Cargo / Função *</label>
              <input type="text" name="role" id="input_role" required value="<?= htmlspecialchars($currentData['role']) ?>"
                oninput="updatePreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#005fae] outline-none transition-all">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">E-mail Corporativo *</label>
              <input type="email" name="email" id="input_email" required value="<?= htmlspecialchars($currentData['email']) ?>"
                oninput="updatePreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#005fae] outline-none transition-all">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">WhatsApp / Telefone *</label>
              <input type="text" name="whatsapp" id="input_whatsapp" required value="<?= htmlspecialchars($currentData['whatsapp']) ?>"
                oninput="updatePreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#005fae] outline-none transition-all">
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Site</label>
              <input type="text" name="site" id="input_site" value="<?= htmlspecialchars($currentData['site'] ?? 'www.avcore.com.br') ?>"
                oninput="updatePreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#005fae] outline-none transition-all">
            </div>

            <div class="pt-2 flex gap-3">
              <button type="submit" class="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#005fae] hover:bg-[#004f91] shadow-xs transition-all">
                Salvar no Supabase
              </button>
              <button type="button" onclick="clearFields()" class="py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">
                Limpar
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de Colaboradores Salvos no Supabase -->
        <?php if (!empty($savedSignatures)): ?>
          <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 class="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Assinaturas Salvas no Supabase (<?= count($savedSignatures) ?>)</span>
            </h3>
            <div class="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              <?php foreach ($savedSignatures as $sig): ?>
                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <strong class="text-slate-900"><?= htmlspecialchars($sig['full_name']) ?></strong>
                    <p class="text-slate-500 truncate max-w-[200px]"><?= htmlspecialchars($sig['role']) ?></p>
                  </div>
                  <div class="flex gap-2">
                    <a href="?edit_id=<?= urlencode($sig['id']) ?>" class="text-[#005fae] hover:underline font-semibold">Editar</a>
                    <form method="POST" onsubmit="return confirm('Deseja excluir esta assinatura?');">
                      <input type="hidden" name="action" value="delete">
                      <input type="hidden" name="delete_id" value="<?= htmlspecialchars($sig['id']) ?>">
                      <button type="submit" class="text-rose-600 hover:underline">Excluir</button>
                    </form>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>
      </div>

      <!-- Coluna da Direita: Prévia e Ações -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-900">Prévia da Assinatura</h2>
            <span class="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
              Modelo AV CORE Oficial
            </span>
          </div>

          <!-- O Contêiner da Assinatura (Fiel ao Modelo) -->
          <div class="overflow-x-auto p-6 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-center">
            <div id="signature-preview-area" class="bg-white p-6 rounded-lg select-text inline-block min-w-[560px]">
              <table cellpadding="0" cellspacing="0" border="0" class="sig-font" style="font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; border-collapse: collapse;">
                <tr>
                  <!-- Logotipo da AV CORE -->
                  <td align="center" valign="middle" style="padding: 10px 24px 10px 0; text-align: center; vertical-align: middle;">
                    <div style="width: 190px;">
                      <!-- SVG inline ou PNG -->
                      <svg viewBox="0 0 320 260" width="190" height="154" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(160, 84)">
                          <circle cx="0" cy="0" r="74" fill="#005fae" />
                          <path d="M -5 -46 L 5 -46 L 46 40 L 28 40 L 19 20 L -19 20 L -28 40 L -46 40 Z M -12 6 L 12 6 L 0 -24 Z" fill="#ffffff" />
                          <path d="M -22 -6 L 0 38 L 22 -6 L 10 -6 L 0 16 L -10 -6 Z" fill="#ffffff" />
                          <path d="M -50 18 L -20 18 L -20 28 L -50 28 Z" fill="#ffffff" />
                        </g>
                        <text x="160" y="204" text-anchor="middle" font-size="36" font-weight="800" font-family="Arial, sans-serif" letter-spacing="1.5">
                          <tspan fill="#005fae">AV</tspan><tspan fill="#111827"> CORE</tspan>
                        </text>
                        <text x="160" y="232" text-anchor="middle" font-size="14" font-weight="500" font-family="Arial, sans-serif" fill="#1e293b">
                          Soluções em Tecnologia e Interatividade
                        </text>
                      </svg>
                    </div>
                  </td>

                  <!-- Divisória Azul (4px) -->
                  <td valign="middle" style="width: 4px; min-width: 4px; max-width: 4px; background-color: #005fae; border-radius: 2px; padding: 0;">
                    &nbsp;
                  </td>

                  <!-- Dados do Usuário -->
                  <td valign="middle" style="padding: 6px 0 6px 24px; vertical-align: middle; text-align: left;">
                    <div id="preview_name" style="font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.2;">
                      <?= htmlspecialchars($currentData['full_name']) ?>
                    </div>
                    <div id="preview_role" style="font-size: 14.5px; font-weight: 400; color: #1e293b; margin-top: 4px; margin-bottom: 12px; line-height: 1.3;">
                      <?= htmlspecialchars($currentData['role']) ?>
                    </div>
                    <table cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; color: #0f172a; line-height: 1.5;">
                      <tr>
                        <td style="padding: 1px 0;">
                          <strong style="color: #0f172a; font-weight: 700;">E-mail:</strong>&nbsp;<a id="preview_email" href="mailto:<?= htmlspecialchars($currentData['email']) ?>" style="color: #0f172a; text-decoration: none;"><?= htmlspecialchars($currentData['email']) ?></a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 1px 0;">
                          <strong style="color: #0f172a; font-weight: 700;">WhatsApp:</strong>&nbsp;<a id="preview_whatsapp" href="#" target="_blank" style="color: #0f172a; text-decoration: none;"><?= htmlspecialchars($currentData['whatsapp']) ?></a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 1px 0;">
                          <strong style="color: #0f172a; font-weight: 700;">Site:</strong>&nbsp;<a id="preview_site" href="https://<?= htmlspecialchars($currentData['site'] ?? 'www.avcore.com.br') ?>" target="_blank" style="color: #0f172a; text-decoration: none;"><?= htmlspecialchars($currentData['site'] ?? 'www.avcore.com.br') ?></a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="flex flex-wrap items-center gap-3">
            <button type="button" onclick="copySignatureFormatted()" class="flex-1 py-3 px-5 rounded-xl text-sm font-bold text-white bg-[#005fae] hover:bg-[#004f91] shadow-xs transition-all">
              Copiar Assinatura (Gmail / Outlook)
            </button>
            <button type="button" onclick="copyHtmlSource()" class="py-3 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all">
              Copiar Código HTML
            </button>
          </div>
        </div>
      </div>

    </div>
  </main>

  <script>
    function updatePreview() {
      const name = document.getElementById('input_full_name').value || 'Nome Completo';
      const role = document.getElementById('input_role').value || 'Cargo / Especialidade';
      const email = document.getElementById('input_email').value || '';
      const whatsapp = document.getElementById('input_whatsapp').value || '';
      const site = document.getElementById('input_site').value || 'www.avcore.com.br';

      document.getElementById('preview_name').innerText = name;
      document.getElementById('preview_role').innerText = role;
      
      const emailEl = document.getElementById('preview_email');
      emailEl.innerText = email;
      emailEl.href = email ? 'mailto:' + email : '#';

      const waEl = document.getElementById('preview_whatsapp');
      waEl.innerText = whatsapp;
      const cleanWa = whatsapp.replace(/\D/g, '');
      waEl.href = cleanWa ? 'https://wa.me/' + cleanWa : '#';

      const siteEl = document.getElementById('preview_site');
      siteEl.innerText = site;
      siteEl.href = site.startsWith('http') ? site : 'https://' + site;
    }

    function loadDefaultModel() {
      document.getElementById('field_id').value = '';
      document.getElementById('input_full_name').value = 'Samuel Britto';
      document.getElementById('input_role').value = 'Engenheiro de Aplicações em Campo / Pré-Vendas';
      document.getElementById('input_email').value = 'samuel.britto@avcore.com.br';
      document.getElementById('input_whatsapp').value = '+55 11 984232769';
      document.getElementById('input_site').value = 'www.avcore.com.br';
      updatePreview();
    }

    function clearFields() {
      document.getElementById('field_id').value = '';
      document.getElementById('input_full_name').value = '';
      document.getElementById('input_role').value = '';
      document.getElementById('input_email').value = '';
      document.getElementById('input_whatsapp').value = '';
      document.getElementById('input_site').value = 'www.avcore.com.br';
      updatePreview();
    }

    async function copySignatureFormatted() {
      const el = document.getElementById('signature-preview-area');
      const html = el.innerHTML;
      try {
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([el.innerText], { type: 'text/plain' });
        await navigator.clipboard.write([
          new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })
        ]);
        alert('Assinatura copiada com sucesso! Cole (Ctrl+V) no seu Gmail ou Outlook.');
      } catch (e) {
        navigator.clipboard.writeText(html);
        alert('Código HTML copiado!');
      }
    }

    function copyHtmlSource() {
      const el = document.getElementById('signature-preview-area');
      navigator.clipboard.writeText(el.innerHTML);
      alert('Código HTML copiado para a área de transferência!');
    }
  </script>
</body>
</html>
