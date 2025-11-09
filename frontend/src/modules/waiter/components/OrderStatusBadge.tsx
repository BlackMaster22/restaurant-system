import React from 'react';
import type { OrderStatus } from '../../../types';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    const getStatusConfig = (status: OrderStatus) => {
        const configs = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                label: '⏳ Pendiente',
                text: 'Esperando confirmación'
            },
            confirmed: {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                label: '✅ Confirmado',
                text: 'Orden confirmada'
            },
            preparing: {
                color: 'bg-orange-100 text-orange-800 border-orange-200',
                label: '👨‍🍳 En preparación',
                text: 'En cocina'
            },
            ready: {
                color: 'bg-green-100 text-green-800 border-green-200',
                label: '🔔 Listo',
                text: 'Listo para servir'
            },
            served: {
                color: 'bg-teal-100 text-teal-800 border-teal-200',
                label: '🍽️ Servido',
                text: 'Entregado al cliente'
            },
            paid: {
                color: 'bg-gray-100 text-gray-800 border-gray-200',
                label: '💳 Pagado',
                text: 'Orden completada'
            },
            cancelled: {
                color: 'bg-red-100 text-red-800 border-red-200',
                label: '❌ Cancelado',
                text: 'Orden cancelada'
            }
        };

        return configs[status] || configs.pending;
    };

    const { color, label, text } = getStatusConfig(status);

    return (
        <div
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
            title={text}
        >
            {label}
        </div>
    );
};