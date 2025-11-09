import React from 'react';
import type { Order } from '../../../types';
import { OrderRow } from './OrderRow';

interface OrderTableProps {
    orders: Order[];
    onUpdateStatus: (orderId: number, status: string) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
    orders,
    onUpdateStatus,
}) => {
    if (orders.length === 0) {
        return (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">No hay órdenes disponibles</p>
                <p className="text-gray-400 mt-2">Las órdenes aparecerán aquí cuando los camareros las creen</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Orden
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mesa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Camarero
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hora
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <OrderRow
                                key={order.id}
                                order={order}
                                onUpdateStatus={onUpdateStatus}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};