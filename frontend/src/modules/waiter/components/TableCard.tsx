import React from 'react';
import type { Table } from '../../../types';

interface TableCardProps {
    table: Table;
    onSelect: (table: Table) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onSelect }) => {
    const getTableStatus = () => {
        if (table.is_occupied) {
            return {
                bgColor: 'bg-red-50 border-red-200',
                textColor: 'text-red-800',
                borderColor: 'border-red-300',
                status: 'Ocupada',
                icon: '🔴',
                buttonText: 'Ver Pedido',
                buttonColor: 'bg-red-100 hover:bg-red-200 text-red-700'
            };
        } else {
            return {
                bgColor: 'bg-green-50 border-green-200',
                textColor: 'text-green-800',
                borderColor: 'border-green-300',
                status: 'Disponible',
                icon: '🟢',
                buttonText: 'Tomar Pedido',
                buttonColor: 'bg-green-100 hover:bg-green-200 text-green-700'
            };
        }
    };

    const status = getTableStatus();

    return (
        <div className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${status.bgColor} ${status.borderColor}`}>
            <div className="text-center">
                {/* Icono y Número de Mesa */}
                <div className="text-3xl mb-2">{status.icon}</div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                    Mesa {table.number}
                </div>

                {/* Estado */}
                <div className={`text-sm font-medium mb-3 ${status.textColor}`}>
                    {status.status}
                </div>

                {/* Capacidad */}
                <div className="text-xs text-gray-600 mb-4">
                    💺 Capacidad: {table.capacity} personas
                </div>

                {/* Botón de Acción */}
                <button
                    onClick={() => onSelect(table)}
                    className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors ${status.buttonColor}`}
                >
                    {status.buttonText}
                </button>
            </div>
        </div>
    );
};