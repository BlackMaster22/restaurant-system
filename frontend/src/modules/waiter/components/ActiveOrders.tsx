import React from 'react';
import type { Order } from '../../../types';
import { OrderCard } from './OrderCard';

interface ActiveOrdersProps {
    orders: Order[];
    onUpdateStatus: (orderId: number, status: string) => void;
}

export const ActiveOrders: React.FC<ActiveOrdersProps> = ({
    orders,
    onUpdateStatus
}) => {
    const pendingOrders = orders.filter(order =>
        ['pending', 'confirmed', 'preparing'].includes(order.status)
    );
    const readyOrders = orders.filter(order => order.status === 'ready');

    return (
        <div className="space-y-6">
            {/* Órdenes Listas para Servir */}
            {readyOrders.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                        <span className="text-xl mr-2">🔔</span>
                        Listas para Servir ({readyOrders.length})
                    </h3>
                    <div className="space-y-3">
                        {readyOrders.map((order) => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onUpdateStatus={onUpdateStatus}
                                highlight={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Órdenes en Proceso */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">⏳</span>
                    Órdenes en Proceso ({pendingOrders.length})
                </h3>

                <div className="space-y-4">
                    {pendingOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))}

                    {pendingOrders.length === 0 && (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-2">📋</div>
                            <p className="text-gray-500 text-sm">
                                No hay órdenes activas
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Resumen del Turno</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-blue-700">
                        <div className="font-semibold">{orders.length}</div>
                        <div className="text-blue-600">Total Órdenes</div>
                    </div>
                    <div className="text-green-700">
                        <div className="font-semibold">{readyOrders.length}</div>
                        <div className="text-green-600">Listas para servir</div>
                    </div>
                </div>
            </div>
        </div>
    );
};