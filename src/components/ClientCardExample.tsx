import React from 'react';
import { ClientCard } from './ClientCard';

export function ClientCardExample() {
  const client = {
    name: 'Daniel Manske',
    clientSince: new Date('2023-01-01'),
    phone: '(47) 9 8833-6386',
    email: 'daniel.manske@gmail.com',
    isPremium: true,
    address: {
      street: 'Rua Otto Wille',
      number: '200',
      complement: 'Apto 1013',
      city: 'Blumenau',
      state: 'SC',
      zipCode: '89042-030',
    },
    birthday: new Date('1981-05-10'),
    sales: [
      {
        id: '1',
        property: 'Prédio',
        date: new Date('2025-06-16'),
        value: 40000,
        type: 'predio' as const,
      },
      {
        id: '2',
        property: 'Comercial',
        date: new Date('2025-05-18'),
        value: 100000,
        type: 'comercial' as const,
      },
    ],
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/5547988336386`, '_blank');
  };

  const handleViewDetails = () => {
    console.log('Ver detalhes');
  };

  const handleEdit = () => {
    console.log('Editar');
  };

  const handleDelete = () => {
    console.log('Excluir');
  };

  const handleNewSale = () => {
    console.log('Nova venda');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ClientCard
        {...client}
        onWhatsAppClick={handleWhatsAppClick}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNewSale={handleNewSale}
      />
    </div>
  );
} 