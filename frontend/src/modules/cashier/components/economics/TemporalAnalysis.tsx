// src/modules/cashier/components/economics/TemporalAnalysis.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEconomicsStore } from '../../../../stores/economicsStore';

export const TemporalAnalysis: React.FC = () => {
    const { temporalData } = useEconomicsStore();

    if (!temporalData || temporalData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow border">
                <h2 className="text-lg font-semibold mb-4">🕒 Análisis Temporal</h2>
                <div className="h-80 flex items-center justify-center text-gray-500">
                    No hay datos disponibles
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-4">🕒 Análisis Temporal</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={temporalData}>
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
                    <Bar
                        dataKey="revenue"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};