import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Mail } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopySignature: () => void;
  hasCopied: boolean;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  onCopySignature,
  hasCopied,
}) => {
  const [activeTab, setActiveTab] = useState<'gmail' | 'outlook' | 'apple' | 'thunderbird'>('gmail');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100/70 text-[#005fae]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Como Usar a Assinatura no seu Email
              </h3>
              <p className="text-xs text-slate-500">
                Siga os passos simples para o seu cliente de email favorito
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

        {/* Abas dos Clientes */}
        <div className="px-6 pt-3 border-b border-slate-100 flex gap-2 overflow-x-auto">
          {[
            { id: 'gmail', label: 'Gmail' },
            { id: 'outlook', label: 'Outlook (Web / App)' },
            { id: 'apple', label: 'Apple Mail' },
            { id: 'thunderbird', label: 'Thunderbird' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#005fae] text-[#005fae]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conteúdo das Instruções */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'gmail' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#005fae] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  <strong className="text-slate-900">Copie a assinatura:</strong> Clique no botão{' '}
                  <span className="font-semibold text-[#005fae]">"Copiar Assinatura"</span> na
                  página principal.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  Abra o <strong>Gmail</strong> no navegador e clique no ícone de engrenagem no topo
                  direito (<strong>Configurações</strong>) &gt;{' '}
                  <strong>Ver todas as configurações</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  Na aba <strong>Geral</strong>, role a página até a seção <strong>Assinatura</strong>.
                  Clique em <em>"Criar nova"</em> ou selecione a assinatura existente.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <div>
                  Na caixa de texto da assinatura, aperte{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-xs">
                    Ctrl + V
                  </kbd>{' '}
                  (ou <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-xs">Cmd + V</kbd> no Mac).
                  A assinatura com o logotipo da AV CORE, divisória azul e seus dados aparecerá exatamente como no modelo!
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  5
                </span>
                <div>
                  Defina a assinatura para <em>"Para novos e-mails"</em> e <em>"Em respostas/encaminhamentos"</em>, e role até o final da página para clicar em{' '}
                  <strong>Salvar alterações</strong>.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outlook' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#005fae] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <div>
                  Copie a assinatura clicando no botão azul <strong>"Copiar Assinatura"</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <div>
                  No <strong>Outlook Web</strong> (navegador): clique no ícone de engrenagem &gt;{' '}
                  <strong>Email</strong> &gt; <strong>Redigir e responder</strong> &gt;{' '}
                  <strong>Assinatura de email</strong>.
                  <br />
                  No <strong>Outlook Desktop (Windows/Mac)</strong>: vá em <em>Arquivo &gt; Opções &gt; Email &gt; Assinaturas</em>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <div>
                  Crie uma nova assinatura, clique no campo de edição e cole com{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-xs">
                    Ctrl + V
                  </kbd>
                  .
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <div>
                  Clique em <strong>Salvar</strong>. Pronto! Seus próximos emails já sairão com a assinatura profissional.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'apple' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                <p>
                  <strong>No macOS:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
                  <li>Abra o aplicativo <strong>Mail</strong>.</li>
                  <li>Vá em <em>Mail &gt; Ajustes (ou Preferências) &gt; Assinaturas</em>.</li>
                  <li>Clique no botão <strong>+</strong> para criar uma nova assinatura.</li>
                  <li>Desmarque a opção <em>"Sempre usar a fonte padrão da mensagem"</em>.</li>
                  <li>Cole com <kbd className="px-1 py-0.5 bg-slate-200 rounded">Cmd + V</kbd>.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'thunderbird' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600">
                  <li>Vá em <strong>Ferramentas &gt; Configurações da Conta</strong>.</li>
                  <li>Selecione sua conta de email na lateral esquerda.</li>
                  <li>Você pode colar o texto formatado no campo de assinatura ou marcar a opção <strong>"Usar HTML"</strong> e colar o código HTML gerado no botão <em>"Código HTML"</em>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal com Ação Rápida */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            {hasCopied ? 'Assinatura copiada com sucesso!' : 'Clique abaixo para copiar agora mesmo:'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={onCopySignature}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005fae] hover:bg-[#004f91] transition-all shadow-xs cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Assinatura
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
