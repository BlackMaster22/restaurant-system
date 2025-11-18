import React, { useState, useEffect } from 'react';
import { useEconomicsStore } from '../../../../stores/economicsStore';

export const EconomicsFilters: React.FC = () => {
    const { filters, setFilters, fetchAllEconomicsData } = useEconomicsStore();
    const [isCustomDate, setIsCustomDate] = useState(filters.period === 'custom');

    const periods = [
        { value: 'day', label: 'Hoy' },
        { value: 'week', label: 'Esta semana' },
        { value: 'month', label: 'Este mes' },
        { value: 'year', label: 'Este año' },
        { value: 'custom', label: 'Personalizado' },
    ];

    useEffect(() => {
        setIsCustomDate(filters.period === 'custom');
    }, [filters.period]);

    const handlePeriodChange = (newPeriod: string) => {
        setFilters({
            period: newPeriod as any,
            ...(newPeriod !== 'custom' && { date_from: undefined, date_to: undefined })
        });

        if (newPeriod !== 'custom') {
            setTimeout(() => fetchAllEconomicsData(), 100);
        }
    };

    const handleDateChange = () => {
        if (filters.date_from && filters.date_to) {
            setTimeout(() => fetchAllEconomicsData(), 500);
        }
    };

    const handleQuickDateRange = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);

        setFilters({
            period: 'custom',
            date_from: start.toISOString().split('T')[0],
            date_to: end.toISOString().split('T')[0]
        });

        setTimeout(() => fetchAllEconomicsData(), 100);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex flex-wrap items-end gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Período
                    </label>
                    <select
                        value={filters.period}
                        onChange={(e) => handlePeriodChange(e.target.value)}
                        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                        {periods.map(period => (
                            <option key={period.value} value={period.value}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>

                {isCustomDate && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Desde
                            </label>
                            <input
                                type="date"
                                value={filters.date_from || ''}
                                onChange={(e) => {
                                    setFilters({ date_from: e.target.value });
                                    handleDateChange();
                                }}
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Hasta
                            </label>
                            <input
                                type="date"
                                value={filters.date_to || ''}
                                onChange={(e) => {
                                    setFilters({ date_to: e.target.value });
                                    handleDateChange();
                                }}
                                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            />
                        </div>

                        {/* Rangos rápidos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rápidos
                            </label>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleQuickDateRange(7)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                                >
                                    7 días
                                </button>
                                <button
                                    onClick={() => handleQuickDateRange(30)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                                >
                                    30 días
                                </button>
                                <button
                                    onClick={() => handleQuickDateRange(90)}
                                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                                >
                                    90 días
                                </button>
                            </div>
                        </div>
                    </>
                )}

                <button
                    onClick={fetchAllEconomicsData}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm"
                >
                    🔄 Actualizar
                </button>
            </div>
        </div>
    );
};