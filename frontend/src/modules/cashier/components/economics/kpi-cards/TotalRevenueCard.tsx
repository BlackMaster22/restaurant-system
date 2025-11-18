// src/modules/cashier/components/economics/kpi-cards/TotalRevenueCard.tsx
import React from 'react';

interface TotalRevenueCardProps {
    total: number;
    growth?: number;
}

export const TotalRevenueCard: React.FC<TotalRevenueCardProps> = ({
    total,
    growth = 0
}) => {
    const isPositive = growth >= 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-2xl">💰</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Ingresos Totales</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        ${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span>
                            {isPositive ? '↗' : '↘'} {Math.abs(growth).toFixed(1)}%
                        </span>
                        <span className="text-gray-500 ml-1">vs período anterior</span>
                    </div>
                </div>
            </div>
        </div>
    );
};