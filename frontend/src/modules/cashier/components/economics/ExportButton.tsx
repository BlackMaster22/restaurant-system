import React from 'react';
import { useEconomicsStore } from '../../../../stores/economicsStore';

export const ExportButton: React.FC = () => {
    const { financialData, productData, temporalData, waiterData, filters } = useEconomicsStore();

    const exportToCSV = () => {
        // Implementar lógica de exportación a CSV
        console.log('Exportando datos...', { financialData, productData, temporalData, waiterData, filters });
        alert('Funcionalidad de exportación en desarrollo');
    };

    const exportToPDF = () => {
        // Implementar lógica de exportación a PDF
        console.log('Generando PDF...');
        alert('Funcionalidad de PDF en desarrollo');
    };

    return (
        <div className="relative inline-block">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                📥 Exportar
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border hidden">
                <div className="py-1">
                    <button
                        onClick={exportToCSV}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        📊 Exportar a CSV
                    </button>
                    <button
                        onClick={exportToPDF}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        📄 Generar PDF
                    </button>
                </div>
            </div>
        </div>
    );
};