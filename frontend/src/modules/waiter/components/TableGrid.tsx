import React from 'react';
import type { Table } from '../../../types';
import { TableCard } from './TableCard';

interface TableGridProps {
    tables: Table[];
    onTableSelect: (table: Table) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableSelect }) => {
    const occupiedTables = tables.filter(table => table.is_occupied);
    const availableTables = tables.filter(table => !table.is_occupied);

    return (
        <div className="space-y-6">
            {/* Estadísticas Rápidas */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                    <div className="text-2xl font-bold text-gray-900">{tables.length}</div>
                    <div className="text-sm text-gray-600">Total Mesas</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                    <div className="text-2xl font-bold text-green-600">{availableTables.length}</div>
                    <div className="text-sm text-gray-600">Disponibles</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                    <div className="text-2xl font-bold text-orange-600">{occupiedTables.length}</div>
                    <div className="text-sm text-gray-600">Ocupadas</div>
                </div>
            </div>

            {/* Grid de Mesas */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Mesas del Restaurante</h2>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">Disponible</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600">Ocupada</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {tables.map((table) => (
                        <TableCard
                            key={table.id}
                            table={table}
                            onSelect={onTableSelect}
                        />
                    ))}
                </div>

                {tables.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                        <p className="text-gray-500 text-lg">No hay mesas configuradas</p>
                        <p className="text-gray-400 mt-2">
                            Contacta con administración para configurar las mesas
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};