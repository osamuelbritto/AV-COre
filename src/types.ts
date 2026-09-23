export interface SignatureData {
  fullName: string;
  role: string;
  email: string;
  whatsapp: string;
  site: string;
  companyName: string;
  companyTagline: string;
  customLogoUrl?: string;
}

export const DEFAULT_SIGNATURE_DATA: SignatureData = {
  fullName: 'Samuel Britto',
  role: 'Engenheiro de Aplicações em Campo / Pré-Vendas',
  email: 'samuel.britto@avcore.com.br',
  whatsapp: '+55 11 984232769',
  site: 'www.avcore.com.br',
  companyName: 'AV CORE',
  companyTagline: 'Soluções em Tecnologia e Interatividade',
};
