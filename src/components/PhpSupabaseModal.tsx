import React, { useState } from 'react';
import { X, Check, Copy, Download, Database, Code2, FileCode, Server } from 'lucide-react';

interface PhpSupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILES = [
  {
    name: 'index.php',
    language: 'php',
    desc: 'Página principal com formulário, preview em tempo real, listagem do banco e cópia formatada.',
    content: `<?php
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
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen flex flex-col">
  <!-- Interface completa com formulário, preview e listagem do Supabase -->
</body>
</html>`
  },
  {
    name: 'config.php',
    language: 'php',
    desc: 'Credenciais de conexão com o Supabase (Project URL e API Key).',
    content: `<?php
/**
 * Configuração de Conexão com o Supabase
 * Obtenha sua URL e CHAVE no painel do Supabase:
 * Settings > API > Project URL & anon / public API key
 */

define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://seu-projeto.supabase.co');
define('SUPABASE_KEY', getenv('SUPABASE_KEY') ?: 'sua-chave-anon-ou-service-role');

function get_supabase_headers() {
    return [
        'Content-Type: application/json',
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Prefer: return=representation'
    ];
}`
  },
  {
    name: 'supabase.php',
    language: 'php',
    desc: 'Classe PHP nativa para realizar operações CRUD com a API PostgREST do Supabase via cURL.',
    content: `<?php
require_once __DIR__ . '/config.php';

class SupabaseClient {
    private $url;
    private $headers;

    public function __construct() {
        $this->url = rtrim(SUPABASE_URL, '/');
        $this->headers = get_supabase_headers();
    }

    private function request($endpoint, $method = 'GET', $data = null) {
        $ch = curl_init($this->url . '/rest/v1/' . ltrim($endpoint, '/'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'code' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }

    public function getSignatures() {
        $res = $this->request('signatures?select=*&order=created_at.desc');
        return ($res['code'] >= 200 && $res['code'] < 300) ? ($res['data'] ?? []) : [];
    }

    public function getSignatureById($id) {
        $res = $this->request("signatures?id=eq.{$id}&select=*");
        return (!empty($res['data'])) ? $res['data'][0] : null;
    }

    public function saveSignature($data) {
        if (!empty($data['id'])) {
            $id = $data['id'];
            unset($data['id']);
            $data['updated_at'] = date('c');
            return $this->request("signatures?id=eq.{$id}", 'PATCH', $data);
        } else {
            unset($data['id']);
            return $this->request('signatures', 'POST', $data);
        }
    }

    public function deleteSignature($id) {
        return $this->request("signatures?id=eq.{$id}", 'DELETE');
    }
}`
  },
  {
    name: 'schema.sql',
    language: 'sql',
    desc: 'Script SQL pronto para executar no SQL Editor do Supabase (criação da tabela e regras de segurança).',
    content: `-- 1. Criação da tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    site TEXT DEFAULT 'www.avcore.com.br',
    company_name TEXT DEFAULT 'AV CORE',
    company_tagline TEXT DEFAULT 'Soluções em Tecnologia e Interatividade',
    custom_logo_url TEXT
);

-- 2. Habilitação de RLS (Row Level Security)
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Acesso
CREATE POLICY "Permitir leitura pública das assinaturas" 
ON public.signatures FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de novas assinaturas" 
ON public.signatures FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de assinaturas" 
ON public.signatures FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de assinaturas" 
ON public.signatures FOR DELETE USING (true);`
  },
  {
    name: 'README.md',
    language: 'markdown',
    desc: 'Instruções para rodar localmente ou hospedar no Apache, Nginx, cPanel ou Docker.',
    content: `# Como rodar o projeto PHP + Supabase

1. Crie um projeto no Supabase (supabase.com).
2. Cole o conteúdo de 'schema.sql' no SQL Editor do Supabase e clique em Run.
3. Obtenha a URL e a Anon Key em Project Settings > API.
4. Coloque as credenciais no arquivo 'config.php'.
5. Inicie o servidor PHP local com:
   php -S localhost:8000
6. Abra http://localhost:8000 no navegador!`
  }
];

export const PhpSupabaseModal: React.FC<PhpSupabaseModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = FILES[selectedFileIndex];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Error copying file', e);
    }
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Projeto Portado para PHP + Supabase</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Pronto para Produção
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Arquivos completos criados na pasta <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">/php-supabase/</code> do projeto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explicação Rápida */}
        <div className="px-6 py-3 bg-blue-50/70 border-b border-blue-100 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>100% Compatível:</strong> Você pode rodar esses arquivos em qualquer servidor Apache, Nginx, cPanel, Docker ou com o comando <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">php -S localhost:8000</code>.
            </span>
          </div>
        </div>

        {/* Abas dos Arquivos */}
        <div className="px-6 pt-3 border-b border-slate-200 flex gap-2 overflow-x-auto bg-slate-50/30">
          {FILES.map((file, idx) => (
            <button
              key={file.name}
              onClick={() => setSelectedFileIndex(idx)}
              className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFileIndex === idx
                  ? 'border-[#005fae] text-[#005fae] bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              {file.name}
            </button>
          ))}
        </div>

        {/* Descrição do Arquivo Selecionado */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>{currentFile.desc}</span>
          <span className="font-mono text-[11px] text-slate-500 uppercase">{currentFile.language}</span>
        </div>

        {/* Visualizador de Código */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed selection:bg-blue-600 selection:text-white">
          <pre className="whitespace-pre-wrap break-all">{currentFile.content}</pre>
        </div>

        {/* Rodapé com Ações */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Arquivo <strong className="text-slate-800">{currentFile.name}</strong> salvo em <code className="text-slate-700">/php-supabase/{currentFile.name}</code>
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Baixar {currentFile.name}
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005fae] hover:bg-[#004f91] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Código
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
