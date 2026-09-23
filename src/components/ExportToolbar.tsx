import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Code,
  HelpCircle,
  Sparkles,
  Share2,
  FileImage,
  ExternalLink,
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { SignatureData } from '../types';
import { generateSignatureHtml, generateSignaturePlainText } from '../utils/signatureHtml';
import { getLogoPngDataUrl } from '../utils/logoRenderer';

interface ExportToolbarProps {
  data: SignatureData;
  previewElementId: string;
  onOpenInstructions: () => void;
  onOpenHtmlModal: (html: string) => void;
  onOpenPhpModal?: () => void;
  hasCopied: boolean;
  setHasCopied: (v: boolean) => void;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  data,
  previewElementId,
  onOpenInstructions,
  onOpenHtmlModal,
  onOpenPhpModal,
  hasCopied,
  setHasCopied,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  /**
   * Copy rich formatted HTML to clipboard so the user can paste directly (Ctrl+V)
   * into Gmail, Outlook, Apple Mail signature editors.
   */
  const handleCopyFormatted = async () => {
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
        // Fallback for older browsers
        await navigator.clipboard.writeText(htmlContent);
      }

      setHasCopied(true);
      showToast('Assinatura copiada com formatação! Cole (Ctrl+V) no seu Gmail ou Outlook.');
      setTimeout(() => setHasCopied(false), 3000);
    } catch (err) {
      console.error('Copy error:', err);
      // Fallback: select node text or copy raw html
      const logoPng = await getLogoPngDataUrl(data.customLogoUrl);
      const htmlContent = generateSignatureHtml(data, logoPng);
      await navigator.clipboard.writeText(htmlContent);
      setHasCopied(true);
      showToast('Código da assinatura copiado.');
      setTimeout(() => setHasCopied(false), 3000);
    }
  };

  /**
   * Download signature as crisp PNG image
   */
  const handleDownloadPng = async () => {
    const node = document.getElementById(previewElementId);
    if (!node) return;

    try {
      setIsDownloading(true);
      const dataUrl = await htmlToImage.toPng(node, {
        pixelRatio: 2.5, // High resolution for crisp text & logo
        backgroundColor: '#ffffff',
      });

      const safeName = (data.fullName || 'colaborador')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const link = document.createElement('a');
      link.download = `assinatura-avcore-${safeName}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Imagem PNG baixada com sucesso!');
    } catch (err) {
      console.error('PNG download error:', err);
      alert('Não foi possível gerar a imagem no momento. Tente copiar a assinatura formatada.');
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * Copy signature directly as PNG image to clipboard
   */
  const handleCopyImage = async () => {
    const node = document.getElementById(previewElementId);
    if (!node) return;

    try {
      const blob = await htmlToImage.toBlob(node, {
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
      });

      if (blob && navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setImageCopied(true);
        showToast('Imagem PNG copiada para a área de transferência!');
        setTimeout(() => setImageCopied(false), 2500);
      } else {
        await handleDownloadPng();
      }
    } catch (err) {
      console.error('Copy image error:', err);
      await handleDownloadPng();
    }
  };

  const handleOpenHtml = async () => {
    const logoPng = await getLogoPngDataUrl(data.customLogoUrl);
    const htmlContent = generateSignatureHtml(data, logoPng);
    onOpenHtmlModal(htmlContent);
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-xs font-medium leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* Ações Principais */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Botão Principal: Copiar Assinatura Formatada */}
        <button
          type="button"
          onClick={handleCopyFormatted}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-[#005fae] hover:bg-[#004f91] active:scale-[0.98] transition-all shadow-sm hover:shadow cursor-pointer"
          title="Copia com toda a formatação, imagens e links para colar direto no Gmail/Outlook"
        >
          {hasCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Assinatura Copiada!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Assinatura (Gmail / Outlook)</span>
            </>
          )}
        </button>

        {/* Baixar PNG */}
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-[0.98] transition-all shadow-2xs cursor-pointer disabled:opacity-60"
          title="Baixar imagem em alta resolução"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>{isDownloading ? 'Gerando...' : 'Baixar Imagem (PNG)'}</span>
        </button>

        {/* Copiar como Imagem */}
        <button
          type="button"
          onClick={handleCopyImage}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
          title="Copiar imagem PNG para a área de transferência"
        >
          {imageCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Imagem Copiada!</span>
            </>
          ) : (
            <>
              <FileImage className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Copiar Imagem</span>
            </>
          )}
        </button>

        {/* Ver Código HTML */}
        <button
          type="button"
          onClick={handleOpenHtml}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
          title="Ver e copiar o código HTML da assinatura"
        >
          <Code className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Código HTML</span>
        </button>

        {/* Código PHP + Supabase */}
        {onOpenPhpModal && (
          <button
            type="button"
            onClick={onOpenPhpModal}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
            title="Ver e exportar o projeto portado para PHP + Supabase"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Código PHP + Supabase</span>
          </button>
        )}

        {/* Guia de Como Usar */}
        <button
          type="button"
          onClick={onOpenInstructions}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl text-sm font-medium text-[#005fae] bg-blue-50/80 hover:bg-blue-100 border border-blue-100 active:scale-[0.98] transition-all cursor-pointer"
          title="Instruções passo a passo para Gmail, Outlook e Apple Mail"
        >
          <HelpCircle className="w-4 h-4 text-[#005fae]" />
          <span>Como Usar</span>
        </button>
      </div>
    </div>
  );
};
