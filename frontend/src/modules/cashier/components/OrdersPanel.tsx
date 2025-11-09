import React, { useState, useEffect } from 'react';
import type { Order } from '../../../types';
import { ordersAPI } from '../../../services/api';
import { OrderTable } from './OrderTable';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export const OrdersPanel: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');

    useEffect(() => {
        loadOrders();
    }, [statusFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersAPI.getOrders(statusFilter || undefined);
            setOrders(response.data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: number, status: string) => {
        try {
            await ordersAPI.updateOrderStatus(orderId, status);
            loadOrders(); // Recargar órdenes
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h2>
                    <p className="text-gray-600">Administra y actualiza el estado de las órdenes</p>
                </div>

                <div className="flex space-x-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">Todos los estados</option>
                        <option value="pending">Pendientes</option>
                        <option value="preparing">En preparación</option>
                        <option value="ready">Listos</option>
                        <option value="served">Servidos</option>
                        <option value="paid">Pagados</option>
                    </select>

                    <button
                        onClick={loadOrders}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Actualizar
                    </button>
                </div>
            </div>

            <OrderTable
                orders={orders}
                onUpdateStatus={updateOrderStatus}
            />
        </div>
    );
};