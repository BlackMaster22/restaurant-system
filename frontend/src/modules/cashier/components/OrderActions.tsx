import React, { useState } from 'react';
import type { Order } from '../../../types';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface OrderActionsProps {
    order: Order;
    onUpdateStatus: (orderId: number, status: string) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({
    order,
    onUpdateStatus
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const statusOptions = [
        { value: 'pending', label: '⏳ Pendiente', color: 'text-yellow-600' },
        { value: 'confirmed', label: '✅ Confirmado', color: 'text-blue-600' },
        { value: 'preparing', label: '👨‍🍳 En preparación', color: 'text-orange-600' },
        { value: 'ready', label: '🔔 Listo', color: 'text-green-600' },
        { value: 'served', label: '🍽️ Servido', color: 'text-teal-600' },
        { value: 'paid', label: '💳 Pagado', color: 'text-gray-600' },
        { value: 'cancelled', label: '❌ Cancelado', color: 'text-red-600' },
    ];

    const handleStatusChange = (newStatus: string) => {
        onUpdateStatus(order.id, newStatus);
        setIsOpen(false);
    };

    const currentStatus = statusOptions.find(opt => opt.value === order.status);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
                <span className={currentStatus?.color}>
                    {currentStatus?.label}
                </span>
                <ChevronDownIcon className="w-4 h-4 ml-2 -mr-1 text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 w-56 mt-1 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 ${order.status === option.value ? 'bg-gray-50 font-semibold' : ''
                                    }`}
                            >
                                <span className={option.color}>
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};