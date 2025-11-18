// src/modules/cashier/components/economics/kpi-cards/AverageOrderCard.tsx
import React from 'react';

interface AverageOrderCardProps {
    average: number;
}

export const AverageOrderCard: React.FC<AverageOrderCardProps> = ({ average }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-2xl">📦</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Ticket Promedio</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        ${average.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500">Por orden</p>
                </div>
            </div>
        </div>
    );
};