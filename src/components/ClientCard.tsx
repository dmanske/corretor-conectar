import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Sale {
  id: string;
  property: string;
  date: Date | string;
  value: number;
  type: 'predio' | 'comercial' | 'casa';
}

interface ClientCardProps {
  name: string;
  avatar?: string;
  clientSince: Date | string;
  phone: string;
  email: string;
  isPremium?: boolean;
  address: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  birthday: Date | string;
  sales: Sale[];
  onWhatsAppClick?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onNewSale?: () => void;
  onViewSale?: (saleId: string) => void;
  onEditSale?: (saleId: string) => void;
  onDeleteSale?: (saleId: string) => void;
  compact?: boolean;
}

// Função para formatar data string 'YYYY-MM-DD' sem perder um dia
function formatDateString(date: Date | string, formatStr: string) {
  if (!date) return '';
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const [year, month, day] = date.split('T')[0].split('-').map(Number);
    // Cria a data manualmente sem fuso
    const d = new Date(year, month - 1, day);
    return format(d, formatStr, { locale: ptBR });
  }
  return format(date as Date, formatStr, { locale: ptBR });
}

export function ClientCard({
  name,
  avatar,
  clientSince,
  phone,
  email,
  isPremium,
  address,
  birthday,
  sales,
  onWhatsAppClick,
  onViewDetails,
  onEdit,
  onDelete,
  onNewSale,
  onViewSale,
  onEditSale,
  onDeleteSale,
  compact = false,
}: ClientCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPropertyIcon = (type: Sale['type']) => {
    switch (type) {
      case 'predio':
        return (
          <div className="sale-property-icon bg-gray-100 rounded-md flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
        );
      case 'comercial':
        return (
          <div className="sale-property-icon bg-gray-100 rounded-md flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13"></path>
              <path d="M3 16h18"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="sale-property-icon bg-gray-100 rounded-md flex items-center justify-center w-6 h-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        );
    }
  };

  const lastSale = sales.length > 0 ? sales.reduce((a, b) => (a.date > b.date ? a : b)) : null;

  if (compact) {
    // Card compacto para listagem
    return (
      <div className="client-card bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.05)] mb-4 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="client-avatar w-12 h-12 rounded-full bg-[#0052cc] text-white flex items-center justify-center text-lg font-semibold">
            {avatar ? <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" /> : getInitials(name)}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-[#1a1a1a] truncate">{name}</span>
              {isPremium && (
                <span className="contact-item badge badge-premium bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] rounded-full px-2 py-1 text-xs font-medium">Premium</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center text-xs text-[#4b5563]">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                {phone}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                {email}
              </span>
            </div>
            {sales.length > 0 && (
              <div className="text-xs text-blue-700 mt-1 truncate">
                Última venda: {formatDateString(sales[sales.length-1].date, 'dd/MM/yyyy')} - {formatCurrency(sales[sales.length-1].value)}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <button onClick={onWhatsAppClick} className="whatsapp-button bg-[#25D366] hover:bg-[#128C7E] border-none rounded-lg px-3 py-1 text-white font-medium text-xs flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            WhatsApp
          </button>
          <div className="flex gap-1 mt-2">
            <button onClick={onViewDetails} className="footer-button view-details px-2 py-1 rounded-lg border border-[#d1d5db] bg-white text-[#4b5563] flex items-center gap-1 text-xs font-medium hover:bg-[#f3f4f6] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button onClick={onEdit} className="footer-button edit-button px-2 py-1 rounded-lg border border-[#d1d5db] bg-[#f3f4f6] text-[#4b5563] flex items-center gap-1 text-xs font-medium hover:bg-[#e5e7eb] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
            </button>
            <button onClick={onDelete} className="footer-button delete-button px-2 py-1 rounded-lg border border-[#fecaca] bg-[#fee2e2] text-[#dc2626] flex items-center gap-1 text-xs font-medium hover:bg-[#fecaca] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-card bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.05)] mb-6 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="client-header flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
        <div className="client-info flex items-center gap-4">
          <div className="client-avatar w-12 h-12 rounded-full bg-[#0052cc] text-white flex items-center justify-center text-lg font-semibold">
            {avatar ? <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" /> : getInitials(name)}
          </div>
          <div className="client-name-container flex flex-col">
            <div className="client-name text-[18px] font-semibold text-[#1a1a1a] mb-1">{name}</div>
            <div className="client-since flex items-center gap-1 text-xs text-[#6b7280] font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
              Cliente desde {formatDateString(clientSince, 'yyyy')}
            </div>
          </div>
        </div>
        <div className="client-actions flex gap-3">
          <button onClick={onWhatsAppClick} className="whatsapp-button bg-[#25D366] hover:bg-[#128C7E] border-none rounded-lg px-4 py-2 text-white font-medium text-[14px] flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="client-content px-6 py-4">
        <div className="contact-section flex flex-wrap gap-3 mb-4">
          <div className="contact-item flex items-center gap-2 bg-[#f9fafb] px-3 py-2 rounded-lg text-[14px] text-[#4b5563]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {phone}
          </div>
          <div className="contact-item flex items-center gap-2 bg-[#f9fafb] px-3 py-2 rounded-lg text-[14px] text-[#4b5563]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            {email}
          </div>
          {isPremium && (
            <div className="contact-item badge badge-premium bg-[#fff7ed] text-[#c2410c] border border-[#ffedd5] rounded-full px-3 py-2 text-[14px] font-medium">Cliente Premium</div>
          )}
        </div>

        <div className="client-details grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="detail-item flex flex-col gap-1">
            <div className="detail-label text-xs font-medium text-[#6b7280] uppercase tracking-wide">Endereço</div>
            <div className="detail-value text-[14px] font-medium text-[#111827]">{address.street}, {address.number}{address.complement && `, ${address.complement}`}</div>
            <div className="detail-value text-[14px] font-medium text-[#111827]">{address.city}/{address.state} - CEP: {address.zipCode}</div>
          </div>
          <div className="detail-item flex flex-col gap-1">
            <div className="detail-label text-xs font-medium text-[#6b7280] uppercase tracking-wide">Aniversário</div>
            <div className="detail-value text-[14px] font-medium text-[#111827]">{formatDateString(birthday, "dd/MM/yyyy")} ({new Date().getFullYear() - new Date(birthday as Date).getFullYear()} anos)</div>
          </div>
        </div>

        {lastSale && (
          <div className="last-sale flex items-center justify-between mt-5 pt-3 border-t border-dashed border-[#e5e7eb]">
            <div className="last-sale-label flex items-center gap-2 text-[13px] font-medium text-[#6b7280]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 20h.01"></path>
                <path d="M7 20v-4"></path>
                <path d="M12 20v-8"></path>
                <path d="M17 20V8"></path>
                <path d="M22 4v16"></path>
              </svg>
              Última venda: {formatDateString(lastSale.date, 'dd/MM/yyyy')}
            </div>
            <div className="sale-value text-[15px] font-semibold text-[#047857]">{formatCurrency(lastSale.value)}</div>
          </div>
        )}

        {/* Vendas */}
        <div className="sales-section mt-6">
          <div className="sales-header flex items-center justify-between mb-4">
            <div className="sales-title flex items-center gap-2 text-[16px] font-semibold text-[#111827]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="2" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Vendas
              <span className="sales-count bg-[#e5e7eb] rounded-2xl px-2 py-0.5 text-xs font-medium text-[#4b5563]">{sales.length}</span>
            </div>
            <button onClick={onNewSale} className="new-sale-button bg-[#1a56db] hover:bg-[#1e429f] border-none rounded-lg px-4 py-2 text-white font-medium text-[14px] flex items-center gap-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              Nova Venda
            </button>
          </div>
          <div className="sales-list flex flex-col gap-3">
            {sales.map((sale) => (
              <div key={sale.id} className="sale-item flex items-center justify-between px-4 py-4 rounded-xl bg-[#f9fafb] border border-[#f0f0f0]">
                <div className="sale-info flex flex-col gap-1">
                  <div className="sale-property flex items-center gap-2 text-[15px] font-medium text-[#111827]">
                    {getPropertyIcon(sale.type)}
                    {sale.property}
                  </div>
                  <div className="sale-date text-[13px] text-[#6b7280]">{formatDateString(sale.date, "dd/MM/yyyy")}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="sale-value text-[15px] font-semibold text-[#047857]">{formatCurrency(sale.value)}</div>
                  <div className="sale-actions flex gap-2">
                    <button className="sale-action bg-transparent border-none rounded-md p-1.5 flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827] transition-colors" title="Ver detalhes" onClick={() => onViewSale && onViewSale(sale.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <button className="sale-action bg-transparent border-none rounded-md p-1.5 flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827] transition-colors" title="Editar" onClick={() => onEditSale && onEditSale(sale.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                      </svg>
                    </button>
                    <button className="sale-action bg-transparent border-none rounded-md p-1.5 flex items-center justify-center text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827] transition-colors" title="Excluir" onClick={() => onDeleteSale && onDeleteSale(sale.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer flex justify-end gap-3 px-6 py-4 bg-[#f9fafb] border-t border-[#f0f0f0]">
        <button onClick={onViewDetails} className="footer-button view-details px-4 py-2 rounded-lg border border-[#d1d5db] bg-white text-[#4b5563] flex items-center gap-2 text-[14px] font-medium hover:bg-[#f3f4f6] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Ver detalhes
        </button>
        <button onClick={onEdit} className="footer-button edit-button px-4 py-2 rounded-lg border border-[#d1d5db] bg-[#f3f4f6] text-[#4b5563] flex items-center gap-2 text-[14px] font-medium hover:bg-[#e5e7eb] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
          </svg>
          Editar
        </button>
        <button onClick={onDelete} className="footer-button delete-button px-4 py-2 rounded-lg border border-[#fecaca] bg-[#fee2e2] text-[#dc2626] flex items-center gap-2 text-[14px] font-medium hover:bg-[#fecaca] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          Excluir
        </button>
      </div>
    </div>
  );
} 