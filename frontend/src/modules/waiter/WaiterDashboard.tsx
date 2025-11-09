import React, { useState, useEffect } from 'react';
import type { Table, Order } from '../../types';
import { ordersAPI } from '../../services/api';
import { useOrderStore } from '../../stores/orderStore';
import { useAuthStore } from '../../stores/authStore';
import { Header } from './components/Header';
import { TableGrid } from './components/TableGrid';
import { ActiveOrders } from './components/ActiveOrders';
import { OrderCart } from './components/OrderCart';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const WaiterDashboard: React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [showCart, setShowCart] = useState(false);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();
    const {
        currentTable,
        setCurrentTable,
        clearCart,
        addOrder
    } = useOrderStore();

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [tablesResponse, ordersResponse] = await Promise.all([
                ordersAPI.getTables(),
                ordersAPI.getOrders('pending'),
            ]);
            setTables(tablesResponse.data);
            setActiveOrders(ordersResponse.data);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTableSelect = (table: Table) => {
        setCurrentTable(table);
        setShowCart(true);
    };

    const handleCreateOrder = async (orderData: any) => {
        try {
            const response = await ordersAPI.createOrder(orderData);
            addOrder(response.data);
            clearCart();
            setShowCart(false);
            // Recargar órdenes activas
            const ordersResponse = await ordersAPI.getOrders('pending');
            setActiveOrders(ordersResponse.data);
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const handleUpdateOrderStatus = async (orderId: number, status: string) => {
        try {
            await ordersAPI.updateOrderStatus(orderId, status);
            // Recargar órdenes activas
            const ordersResponse = await ordersAPI.getOrders('pending');
            setActiveOrders(ordersResponse.data);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return <LoadingSpinner text="Cargando datos del restaurante..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Panel de Camarero</h1>
                    <p className="text-gray-600">
                        Bienvenido, {user?.first_name}. Gestiona mesas y pedidos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sección principal - Mesas */}
                    <div className="lg:col-span-2">
                        <TableGrid
                            tables={tables}
                            onTableSelect={handleTableSelect}
                        />
                    </div>

                    {/* Sidebar - Órdenes Activas */}
                    <div className="lg:col-span-1">
                        <ActiveOrders
                            orders={activeOrders}
                            onUpdateStatus={handleUpdateOrderStatus}
                        />
                    </div>
                </div>
            </div>

            {/* Modal del Carrito */}
            {showCart && currentTable && (
                <OrderCart
                    table={currentTable}
                    onClose={() => setShowCart(false)}
                    onCreateOrder={handleCreateOrder}
                />
            )}
        </div>
    );
};