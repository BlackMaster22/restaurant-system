import React, { useEffect } from 'react';
import { useEconomicsStore } from '../../../../stores/economicsStore';
import { EconomicsFilters } from './EconomicsFilters';
import { RevenueMetrics } from './RevenueMetrics';
import { RevenueChart } from './RevenueChart';
import { ProductPerformance } from './ProductPerformance';
import { TemporalAnalysis } from './TemporalAnalysis';
import { StaffPerformance } from './StaffPerformance';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';

export const EconomicsDashboard: React.FC = () => {
    const {
        fetchAllEconomicsData,
        isLoading,
        error,
        clearError,
        financialData,
        productData,
        temporalData,
        waiterData
    } = useEconomicsStore();

    useEffect(() => {
        fetchAllEconomicsData();
    }, [fetchAllEconomicsData]);

    const hasData = financialData || productData || temporalData.length > 0 || waiterData.length > 0;

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-red-800 font-medium">Error</h3>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                    <button
                        onClick={clearError}
                        className="text-red-600 hover:text-red-800"
                    >
                        ×
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📊 Gestión Económica</h1>
                    <p className="text-gray-600 mt-1">
                        Análisis completo de ingresos, productos y desempeño del personal
                    </p>
                </div>
                <EconomicsFilters />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Cargando datos económicos...</p>
                    </div>
                </div>
            ) : !hasData ? (
                <div className="bg-white rounded-lg shadow border p-12 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No hay datos disponibles
                    </h3>
                    <p className="text-gray-600 mb-4">
                        No se encontraron datos económicos para el período seleccionado.
                    </p>
                    <button
                        onClick={fetchAllEconomicsData}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        Reintentar
                    </button>
                </div>
            ) : (
                <>
                    <div
                        className=""
                    >
                     <RevenueMetrics />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueChart />
                        <TemporalAnalysis />
                    </div>
                    <ProductPerformance />
                    <StaffPerformance />
                </>
            )}
        </div>
    );
};