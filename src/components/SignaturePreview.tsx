import React, { forwardRef } from 'react';
import { SignatureData } from '../types';
import { AvCoreLogo } from './AvCoreLogo';
import { formatWhatsAppLink, formatSiteLink } from '../utils/signatureHtml';

interface SignaturePreviewProps {
  data: SignatureData;
  scale?: number;
}

export const SignaturePreview = forwardRef<HTMLDivElement, SignaturePreviewProps>(
  ({ data, scale = 1 }, ref) => {
    const waLink = formatWhatsAppLink(data.whatsapp);
    const siteLink = formatSiteLink(data.site);

    return (
      <div
        ref={ref}
        id="email-signature-container"
        className="bg-white p-6 md:p-8 rounded-lg select-text text-left inline-block"
        style={{
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
          minWidth: '580px',
        }}
      >
        <div className="flex items-center gap-6 sm:gap-7">
          {/* Coluna da Logo AV CORE */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <AvCoreLogo size={195} customLogoUrl={data.customLogoUrl} />
          </div>

          {/* Divisória Vertical Azul */}
          <div
            className="self-stretch w-1 bg-[#005fae] rounded-full flex-shrink-0 my-1"
            style={{ width: '4px', backgroundColor: '#005fae' }}
            aria-hidden="true"
          />

          {/* Coluna de Informações do Usuário */}
          <div className="flex flex-col justify-center text-left min-w-[280px]">
            {/* Nome do Usuário */}
            <h1
              className="text-[#0f172a] text-[22px] sm:text-[23px] font-bold leading-tight tracking-[-0.2px] m-0"
              style={{
                fontFamily:
                  'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {data.fullName || 'Nome Completo'}
            </h1>

            {/* Cargo / Função */}
            <p
              className="text-[#1e293b] text-[14.5px] font-normal mt-1 mb-3.5 leading-snug"
              style={{
                fontFamily:
                  'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {data.role || 'Cargo / Especialidade'}
            </p>

            {/* Linhas de Contato */}
            <div
              className="space-y-1 text-[14px] text-[#0f172a]"
              style={{
                fontFamily:
                  'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {/* E-mail */}
              {data.email && (
                <div className="leading-snug">
                  <span className="font-bold text-[#0f172a]">E-mail:</span>{' '}
                  <a
                    href={`mailto:${data.email}`}
                    className="text-[#0f172a] hover:text-[#005fae] transition-colors"
                  >
                    {data.email}
                  </a>
                </div>
              )}

              {/* WhatsApp */}
              {data.whatsapp && (
                <div className="leading-snug">
                  <span className="font-bold text-[#0f172a]">WhatsApp:</span>{' '}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f172a] hover:text-[#005fae] transition-colors"
                  >
                    {data.whatsapp}
                  </a>
                </div>
              )}

              {/* Site */}
              {data.site && (
                <div className="leading-snug">
                  <span className="font-bold text-[#0f172a]">Site:</span>{' '}
                  <a
                    href={siteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f172a] hover:text-[#005fae] transition-colors"
                  >
                    {data.site}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SignaturePreview.displayName = 'SignaturePreview';
