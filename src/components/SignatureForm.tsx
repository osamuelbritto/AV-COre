import React, { useRef } from 'react';
import { SignatureData, DEFAULT_SIGNATURE_DATA } from '../types';
import {
  User,
  Briefcase,
  Mail,
  Phone,
  Globe,
  RotateCcw,
  Sparkles,
  Upload,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';

interface SignatureFormProps {
  data: SignatureData;
  onChange: (updated: Partial<SignatureData>) => void;
  onResetToSample: () => void;
  onClear: () => void;
}

const COMMON_ROLES = [
  'Engenheiro de Aplicações em Campo / Pré-Vendas',
  'Consultor Técnico Audiovisual',
  'Executivo de Contas / Vendas',
  'Gerente de Projetos de TI',
  'Especialista em Automação e Áudio/Vídeo',
  'Suporte Técnico e Operações',
  'Diretor Comercial',
];

export const SignatureForm: React.FC<SignatureFormProps> = ({
  data,
  onChange,
  onResetToSample,
  onClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    onChange({ whatsapp: val });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange({ customLogoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-7 space-y-6">
      {/* Header do Formulário */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-[#005fae]" />
            Dados do Colaborador
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Insira os dados que serão exibidos na assinatura de email
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetToSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#005fae] bg-blue-50/80 hover:bg-blue-100 transition-colors border border-blue-100 cursor-pointer"
            title="Preencher com os dados do modelo original (Samuel Britto)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Dados do Modelo
          </button>

          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Limpar campos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar
          </button>
        </div>
      </div>

      {/* Grid de Campos */}
      <div className="space-y-4.5">
        {/* Campo: Nome Completo */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Nome Completo <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="Ex: Samuel Britto"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-[#005fae] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Campo: Cargo / Função */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Cargo / Função <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Linha logo abaixo do nome</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Briefcase className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.role}
              onChange={(e) => onChange({ role: e.target.value })}
              placeholder="Ex: Engenheiro de Aplicações em Campo / Pré-Vendas"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-[#005fae] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          {/* Sugestões rápidas de cargo */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {COMMON_ROLES.slice(0, 3).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => onChange({ role: r })}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors truncate max-w-full text-left cursor-pointer"
              >
                + {r}
              </button>
            ))}
          </div>
        </div>

        {/* Campo: E-mail */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            E-mail Corporativo <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="Ex: samuel.britto@avcore.com.br"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-[#005fae] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
          {data.fullName && !data.email.includes('@') && (
            <p className="mt-1 text-[11px] text-slate-500">
              Dica:{' '}
              <button
                type="button"
                onClick={() => {
                  const slug = data.fullName
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/\s+/g, '.');
                  onChange({ email: `${slug}@avcore.com.br` });
                }}
                className="text-[#005fae] hover:underline cursor-pointer"
              >
                Preencher como{' '}
                {data.fullName
                  .trim()
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/\s+/g, '.')}
                @avcore.com.br
              </button>
            </p>
          )}
        </div>

        {/* Campo: WhatsApp / Telefone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            WhatsApp / Telefone <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.whatsapp}
              onChange={handlePhoneChange}
              placeholder="Ex: +55 11 984232769"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-[#005fae] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Campo: Site da Empresa */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Site
            </label>
            <span className="text-[11px] text-slate-400">Padrão da empresa</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.site}
              onChange={(e) => onChange({ site: e.target.value })}
              placeholder="www.avcore.com.br"
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-[#005fae] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
          </div>
        </div>

        {/* Bloco Opcional de Logotipo da Marca */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-700">
                Logotipo:{' '}
                <strong className="text-slate-900">
                  {data.customLogoUrl ? 'Personalizado' : 'AV CORE (Padrão Oficial)'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {data.customLogoUrl ? (
                <button
                  type="button"
                  onClick={() => onChange({ customLogoUrl: undefined })}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Restaurar padrão
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs text-[#005fae] hover:underline cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Trocar imagem
                </button>
              )}
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
