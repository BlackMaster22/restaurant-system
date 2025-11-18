import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEconomicsStore } from '../../../../stores/economicsStore';

export const RevenueChart: React.FC = () => {
    const { financialData } = useEconomicsStore();

    if (!financialData || !financialData.revenue_by_period) {
        return (
            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-4">📈 Tendencia de Ingresos</h2>
                <div className="h-80 flex items-center justify-center text-gray-500">
                    No hay datos disponibles
                </div>
            </div>
        );
    }

    const chartData = financialData.revenue_by_period;

    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-4">📈 Tendencia de Ingresos</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                        dataKey="period"
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, 'Ingresos']}
                        labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#1d4ed8' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};