import { SignatureData } from '../types';

/**
 * Clean phone number to standard international WhatsApp format without spaces/dashes
 */
export function formatWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '#';
  return `https://wa.me/${digits}`;
}

/**
 * Format site link ensuring protocol is present
 */
export function formatSiteLink(site: string): string {
  if (!site) return '#';
  if (/^https?:\/\//i.test(site)) {
    return site;
  }
  return `https://${site}`;
}

/**
 * Generates email-client-compatible HTML table for the signature.
 * Uses inline CSS, standard web fonts (Arial, Helvetica, sans-serif),
 * and standard table layout supported by Gmail, Outlook, Apple Mail, etc.
 */
export function generateSignatureHtml(data: SignatureData, logoImgSrc: string): string {
  const waLink = formatWhatsAppLink(data.whatsapp);
  const siteLink = formatSiteLink(data.site);
  const emailLink = data.email ? `mailto:${data.email}` : '#';

  return `<!-- INICIO ASSINATURA AV CORE -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; line-height: 1.3; background-color: #ffffff; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
  <tr>
    <!-- Coluna da Logo / AV CORE -->
    <td align="center" valign="middle" style="padding: 10px 28px 10px 0; text-align: center; vertical-align: middle;">
      <a href="${siteLink}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
        <img 
          src="${logoImgSrc}" 
          alt="${data.companyName}" 
          width="190" 
          style="display: block; width: 190px; max-width: 190px; height: auto; border: 0; outline: none; text-decoration: none;"
        />
      </a>
    </td>

    <!-- Divisória Vertical Azul Corporativo -->
    <td valign="middle" style="width: 4px; min-width: 4px; max-width: 4px; background-color: #005fae; border-radius: 2px; padding: 0; font-size: 1px; line-height: 1px;">
      &nbsp;
    </td>

    <!-- Coluna de Informações do Colaborador -->
    <td valign="middle" style="padding: 6px 0 6px 28px; vertical-align: middle; font-family: Arial, Helvetica, sans-serif; text-align: left;">
      <!-- Nome Completo -->
      <div style="font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.2; letter-spacing: -0.2px; font-family: Arial, Helvetica, sans-serif;">
        ${escapeHtml(data.fullName || 'Seu Nome')}
      </div>

      <!-- Cargo / Função -->
      <div style="font-size: 14.5px; font-weight: 400; color: #1e293b; margin-top: 4px; margin-bottom: 12px; line-height: 1.3; font-family: Arial, Helvetica, sans-serif;">
        ${escapeHtml(data.role || 'Seu Cargo')}
      </div>

      <!-- Bloco de Contatos -->
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #0f172a; line-height: 1.5; border-collapse: collapse;">
        <!-- E-mail -->
        ${
          data.email
            ? `<tr>
          <td style="padding: 1px 0; font-size: 14px; color: #0f172a; font-family: Arial, Helvetica, sans-serif;">
            <strong style="color: #0f172a; font-weight: 700;">E-mail:</strong>&nbsp;<a href="${emailLink}" style="color: #0f172a; text-decoration: none; font-weight: 400;">${escapeHtml(
                data.email
              )}</a>
          </td>
        </tr>`
            : ''
        }
        <!-- WhatsApp -->
        ${
          data.whatsapp
            ? `<tr>
          <td style="padding: 1px 0; font-size: 14px; color: #0f172a; font-family: Arial, Helvetica, sans-serif;">
            <strong style="color: #0f172a; font-weight: 700;">WhatsApp:</strong>&nbsp;<a href="${waLink}" target="_blank" rel="noopener noreferrer" style="color: #0f172a; text-decoration: none; font-weight: 400;">${escapeHtml(
                data.whatsapp
              )}</a>
          </td>
        </tr>`
            : ''
        }
        <!-- Site -->
        ${
          data.site
            ? `<tr>
          <td style="padding: 1px 0; font-size: 14px; color: #0f172a; font-family: Arial, Helvetica, sans-serif;">
            <strong style="color: #0f172a; font-weight: 700;">Site:</strong>&nbsp;<a href="${siteLink}" target="_blank" rel="noopener noreferrer" style="color: #0f172a; text-decoration: none; font-weight: 400;">${escapeHtml(
                data.site
              )}</a>
          </td>
        </tr>`
            : ''
        }
      </table>
    </td>
  </tr>
</table>
<!-- FIM ASSINATURA AV CORE -->`;
}

/**
 * Generate plain-text fallback representation
 */
export function generateSignaturePlainText(data: SignatureData): string {
  const lines: string[] = [
    data.fullName,
    data.role,
    '',
    `E-mail: ${data.email}`,
    `WhatsApp: ${data.whatsapp}`,
    `Site: ${data.site}`,
    '',
    `${data.companyName} - ${data.companyTagline}`,
  ];
  return lines.filter((l) => l !== undefined).join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
