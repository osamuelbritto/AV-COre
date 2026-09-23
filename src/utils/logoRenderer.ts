/**
 * Logo generator and converter for AV CORE.
 * In email clients (like Gmail, Outlook, Thunderbird), raw <svg> tags are stripped,
 * so we convert the logo SVG into a crisp high-DPI PNG data URL for clipboard copying and HTML export.
 */

export const AV_CORE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 280" width="320" height="280">
  <defs>
    <style>
      .av-blue { fill: #005fae; }
      .av-core-text { font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 800; }
      .av-sub-text { font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 500; fill: #1e293b; }
    </style>
  </defs>

  <!-- Blue Circle Badge -->
  <g transform="translate(160, 92)">
    <circle cx="0" cy="0" r="76" fill="#005fae" />
    
    <!-- Stylized Geometric AV Monogram -->
    <!-- Outer A frame and connected ribbons -->
    <path d="
      M -4 -48 L 4 -48 L 42 38 L 26 38 L 18 18 L -18 18 L -26 38 L -42 38 Z
      M -12 4 L 12 4 L 0 -26 Z
    " fill="#ffffff" />
    
    <!-- Inner V chevron overlay & horizontal dynamics -->
    <path d="
      M -48 38 L -16 38 L -3 -6 L -16 -6 L -26 18 L -48 18 Z
    " fill="#ffffff" opacity="0.95" />

    <path d="
      M 0 46 L -22 -4 L -9 -4 L 0 20 L 9 20 L 22 -4 L 35 -4 Z
    " fill="#005fae" />
    
    <path d="
      M -20 -10 L 0 36 L 20 -10 L 9 -10 L 0 14 L -9 -10 Z
    " fill="#ffffff" />
    
    <path d="
      M -44 14 L -18 14 L -18 25 L -44 25 Z
    " fill="#ffffff" />
  </g>

  <!-- Brand Typography -->
  <!-- "AV CORE" -->
  <text x="160" y="214" text-anchor="middle" class="av-core-text" font-size="34" letter-spacing="1">
    <tspan fill="#005fae">AV</tspan>
    <tspan fill="#111827"> CORE</tspan>
  </text>

  <!-- Subtitle Tagline -->
  <text x="160" y="244" text-anchor="middle" class="av-sub-text" font-size="14.5" letter-spacing="-0.1">
    Soluções em Tecnologia e Interatividade
  </text>
</svg>`;

// Cache for generated PNG Data URL
let cachedPngDataUrl: string | null = null;

/**
 * Converts the AV CORE SVG into a high-resolution PNG data URL
 * so that email clients (which block SVG) display the logo perfectly.
 */
export async function getLogoPngDataUrl(customUrl?: string): Promise<string> {
  if (customUrl) {
    return customUrl;
  }
  if (cachedPngDataUrl) {
    return cachedPngDataUrl;
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    const img = new Image();
    const svgBlob = new Blob([AV_CORE_LOGO_SVG], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Render at 2x resolution (640x560) for retina screens
        canvas.width = 640;
        canvas.height = 560;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 640, 560);
          cachedPngDataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(cachedPngDataUrl);
          return;
        }
      } catch (e) {
        console.error('Canvas export error:', e);
      }
      URL.revokeObjectURL(url);
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(AV_CORE_LOGO_SVG)}`);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(AV_CORE_LOGO_SVG)}`);
    };

    img.src = url;
  });
}
