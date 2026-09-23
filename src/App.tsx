import React, { useState, useEffect, useRef } from 'react';
import { SignatureData, DEFAULT_SIGNATURE_DATA } from './types';
import { SignatureForm } from './components/SignatureForm';
import { SignaturePreview } from './components/SignaturePreview';
import { ExportToolbar } from './components/ExportToolbar';
import { InstructionsModal } from './components/InstructionsModal';
import { HtmlCodeModal } from './components/HtmlCodeModal';
import { PhpSupabaseModal } from './components/PhpSupabaseModal';
import {
  Eye,
  Mail,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Laptop,
  Check,
  Building2,
  Info,
  Database,
} from 'lucide-react';
import { generateSignatureHtml, generateSignaturePlainText } from './utils/signatureHtml';
import { getLogoPngDataUrl } from './utils/logoRenderer';

const STORAGE_KEY = 'avcore_signature_data_v1';

export default function App() {
  const [data, setData] = useState<SignatureData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved signature data', e);
    }
    return DEFAULT_SIGNATURE_DATA;
  });

  const [previewMode, setPreviewMode] = useState<'clean' | 'email_mock'>('clean');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isPhpModalOpen, setIsPhpModalOpen] = useState(false);
  const [currentHtmlCode, setCurrentHtmlCode] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving signature data', e);
    }
  }, [data]);

  const handleDataChange = (updated: Partial<SignatureData>) => {
    setData((prev) => ({ ...prev, ...updated }));
  };

  const handleResetToSample = () => {
    setData(DEFAULT_SIGNATURE_DATA);
  };

  const handleClear = () => {
    setData({
      fullName: '',
      role: '',
      email: '',
      whatsapp: '',
      site: 'www.avcore.com.br',
      companyName: 'AV CORE',
      companyTagline: 'Soluções em Tecnologia e Interatividade',
    });
  };

  const handleCopyFormattedDirect = async () => {
    try {
      const logoPng = await getLogoPngDataUrl(data.customLogoUrl);
      const htmlContent = generateSignatureHtml(data, logoPng);
      const plainText = generateSignaturePlainText(data);

      if (navigator.clipboard && window.ClipboardItem) {
        const blobHtml = new Blob([htmlContent], { type: 'text/html' });
        const blobText = new Blob([plainText], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobText,
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(htmlContent);
      }

      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 3000);
    } catch (err) {
      console.error('Direct copy error', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans">
      {/* Top Corporate Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#005fae] flex items-center justify-center text-white font-black text-sm tracking-wider shadow-xs">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                  AV CORE
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold text-[#005fae] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Gerador de Assinatura
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Padrão Corporativo de E-mail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsPhpModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100 cursor-pointer"
              title="Acessar projeto portado para PHP + Supabase"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>PHP + Supabase</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInstructionsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#005fae]" />
              <span className="hidden sm:inline">Como Configurar</span>
            </button>

            <button
              type="button"
              onClick={handleCopyFormattedDirect}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#005fae] hover:bg-[#004f91] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copiado!
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  Copiar Assinatura
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
        {/* Intro Banner */}
        <div className="mb-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Gerador de Assinaturas de E-mail
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Preencha apenas os dados do colaborador abaixo. A assinatura é gerada automaticamente
              seguindo fielmente a identidade visual e o modelo oficial da AV CORE.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Compatível com Gmail, Outlook e Apple Mail</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Coluna da Esquerda: Formulário de Entrada (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            <SignatureForm
              data={data}
              onChange={handleDataChange}
              onResetToSample={handleResetToSample}
              onClear={handleClear}
            />

            {/* Guia Rápido / Dicas */}
            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100 text-xs text-slate-600 space-y-2.5">
              <div className="flex items-center gap-2 text-[#005fae] font-semibold text-sm">
                <Info className="w-4 h-4" />
                Como colar no Gmail / Outlook?
              </div>
              <p>
                1. Digite seus dados no formulário acima.
              </p>
              <p>
                2. Clique no botão azul <strong>"Copiar Assinatura (Gmail / Outlook)"</strong>.
              </p>
              <p>
                3. Vá nas configurações de assinatura do seu cliente de email e pressione{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-800 font-mono text-[11px]">
                  Ctrl + V
                </kbd>
                . A tabela com a imagem e divisória será colada pronta!
              </p>
            </div>
          </div>

          {/* Coluna da Direita: Prévia Ao Vivo & Exportação (7 colunas) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-6">
              {/* Header da Prévia com Alternador de Visualização */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#005fae]" />
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Prévia em Tempo Real
                  </h2>
                </div>

                {/* Alternador de Modo: Limpo vs Simulação de E-mail */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('clean')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      previewMode === 'clean'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Visualização Pura
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('email_mock')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      previewMode === 'email_mock'
                        ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    Simulação de E-mail
                  </button>
                </div>
              </div>

              {/* Área da Prévia */}
              {previewMode === 'clean' ? (
                <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-slate-50/40 p-4 sm:p-6 flex justify-center items-center">
                  <SignaturePreview ref={previewRef} data={data} />
                </div>
              ) : (
                /* Simulação de Janela de Redação de E-mail */
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
                  {/* Barra da Janela do E-mail */}
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Nova Mensagem</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    </div>
                  </div>
                  {/* Cabeçalho do E-mail Mock */}
                  <div className="px-4 py-3 border-b border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-700">Para:</span> cliente@empresa.com.br
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Assunto:</span> Proposta Comercial - Soluções Audiovisuais AV CORE
                    </div>
                  </div>
                  {/* Corpo do E-mail Mock */}
                  <div className="p-5 text-sm text-slate-700 space-y-4">
                    <p>Olá,</p>
                    <p>
                      Conforme alinhado em nossa reunião, segue em anexo a proposta técnica de interatividade e sistemas da AV CORE para o seu projeto.
                    </p>
                    <p>Fico à total disposição para esclarecer qualquer dúvida.</p>
                    <p className="text-slate-600">Atenciosamente,</p>

                    {/* A Assinatura dentro do E-mail */}
                    <div className="pt-2 border-t border-slate-100 overflow-x-auto">
                      <SignaturePreview data={data} />
                    </div>
                  </div>
                </div>
              )}

              {/* Barra de Exportação e Cópia */}
              <div className="pt-2">
                <ExportToolbar
                  data={data}
                  previewElementId="email-signature-container"
                  onOpenInstructions={() => setIsInstructionsOpen(true)}
                  onOpenHtmlModal={(html) => {
                    setCurrentHtmlCode(html);
                    setIsHtmlModalOpen(true);
                  }}
                  onOpenPhpModal={() => setIsPhpModalOpen(true)}
                  hasCopied={hasCopied}
                  setHasCopied={setHasCopied}
                />
              </div>
            </div>

            {/* Card com Detalhes do Modelo e Fidelidade Visual */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#005fae]" />
                Especificações do Modelo AV CORE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-semibold text-slate-800">Cores Oficiais:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#005fae] border border-slate-300"></span>
                    <span>Azul Royal (#005fae)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#0f172a] border border-slate-300"></span>
                    <span>Grafite Escuro (#0f172a)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-semibold text-slate-800">Tipografia & Estrutura:</span>
                  <p>Fontes compatíveis universais (Arial, Segoe UI, sans-serif).</p>
                  <p>Tabela com divisória sólida de 4px.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="mt-12 bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AV CORE - Soluções em Tecnologia e Interatividade</span>
          <span>Gerador de Assinaturas de E-mail Corporativas</span>
        </div>
      </footer>

      {/* Modais */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        onCopySignature={handleCopyFormattedDirect}
        hasCopied={hasCopied}
      />

      <HtmlCodeModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        htmlCode={currentHtmlCode}
      />

      <PhpSupabaseModal
        isOpen={isPhpModalOpen}
        onClose={() => setIsPhpModalOpen(false)}
      />
    </div>
  );
}
