// src/modules/cashier/components/economics/kpi-cards/OrderCountCard.tsx
import React from 'react';

interface OrderCountCardProps {
    count: number;
}

export const OrderCountCard: React.FC<OrderCountCardProps> = ({ count }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 text-2xl">📋</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Total de Órdenes</h3>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-500">Órdenes completadas</p>
                </div>
            </div>
        </div>
    );
};