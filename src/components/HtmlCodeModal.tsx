import React, { useState } from 'react';
import { X, Check, Copy, Code, CheckCircle2 } from 'lucide-react';

interface HtmlCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlCode: string;
}

export const HtmlCodeModal: React.FC<HtmlCodeModalProps> = ({ isOpen, onClose, htmlCode }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy html code:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#005fae]" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Código HTML da Assinatura</h3>
              <p className="text-xs text-slate-500">
                Código compatível com todos os clientes de e-mail corporativo
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

        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-emerald-400 leading-relaxed selection:bg-blue-600 selection:text-white">
          <pre className="whitespace-pre-wrap break-all">{htmlCode}</pre>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Você pode colar esse código em ferramentas web ou clientes com editor de HTML.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Fechar
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#005fae] hover:bg-[#004f91] transition-all shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  HTML Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar Código HTML
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
