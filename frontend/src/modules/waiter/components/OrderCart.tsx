import React, { useState } from 'react'; 
import type { Table } from '../../../types'; 
import { useOrderStore } from '../../../stores/orderStore';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { CartItemCard } from './CartItemCard';
import { MenuModal } from './MenuModal';
import { ShoppingCartIcon } from '@heroicons/react/24/outline'; 

interface OrderCartProps {
    table: Table;
    onClose: () => void;
    onCreateOrder: (orderData: any) => Promise<void>;
}

export const OrderCart: React.FC<OrderCartProps> = ({
    table,
    onClose,
    onCreateOrder,
}) => {
    const { cart, clearCart, getCartTotal, getCartItemCount } = useOrderStore();
    const [showMenu, setShowMenu] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');

    const handleCreateOrder = async () => {
        if (cart.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de enviar el pedido.');
            return;
        }

        try {
            setIsSubmitting(true);
            const orderData = {
                table_id: table.id,
                items: cart.map(item => ({
                    menu_item_id: item.menuItem.id,
                    quantity: item.quantity,
                    notes: item.notes,
                    customization_ids: item.customizations.map(c => c.id),
                })),
                notes: orderNotes,
            };

            await onCreateOrder(orderData);
            // El cierre del modal se maneja en el componente padre después de crear la orden
        } catch (error: any) {
            console.error('Error creating order:', error);
            const errorMessage = error.response?.data?.error || 'Error al crear el pedido. Por favor, intenta de nuevo.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddMoreItems = () => {
        setShowMenu(true);
    };

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    };

    const calculateCustomizationsTotal = () => {
        return cart.reduce((total, item) => {
            const customizationsTotal = item.customizations.reduce((sum, custom) => sum + custom.price_extra, 0);
            return total + (customizationsTotal * item.quantity);
        }, 0);
    };

    const getEstimatedPreparationTime = () => {
        if (cart.length === 0) return 0;

        const maxTime = Math.max(...cart.map(item => item.menuItem.preparation_time));
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Estimación basada en el tiempo máximo más un buffer por cantidad
        return maxTime + Math.floor(totalItems * 0.5);
    };

    return (
        <>
            <Modal
                isOpen={true}
                onClose={onClose}
                title={`Carrito - Mesa ${table.number}`}
                size="lg"
            >
                <div className="flex flex-col max-h-96">
                    {/* Header del Carrito */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-600">
                                {getCartItemCount()} items en el carrito
                            </span>
                        </div>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                                Vaciar carrito
                            </button>
                        )}
                    </div>

                    {/* Lista de Items */}
                    <div className="flex-1 overflow-y-auto border rounded-lg divide-y max-h-64">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                                <p className="text-gray-500 text-lg">El carrito está vacío</p>
                                <p className="text-gray-400 mt-2">
                                    Agrega productos para tomar el pedido
                                </p>
                            </div>
                        ) : (
                            cart.map((item, index) => (
                                <CartItemCard
                                    key={index}
                                    item={item}
                                    index={index}
                                />
                            ))
                        )}
                    </div>

                    {/* Notas del Pedido */}
                    {cart.length > 0 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notas generales del pedido (opcional)
                            </label>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Ej: Pedido para celebración, cliente con alergias, etc."
                            />
                        </div>
                    )}

                    {/* Resumen y Acciones */}
                    {cart.length > 0 && (
                        <div className="border-t pt-4 mt-4 space-y-4">
                            {/* Desglose de Precios */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                {calculateCustomizationsTotal() > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Personalizaciones:</span>
                                        <span className="text-green-600">+${calculateCustomizationsTotal().toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                    <span className="text-gray-900">Total:</span>
                                    <span className="text-primary-600">${getCartTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Tiempo Estimado */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-blue-700 font-medium">
                                        ⏱️ Tiempo estimado:
                                    </span>
                                    <span className="text-blue-800 font-semibold">
                                        {getEstimatedPreparationTime()} minutos
                                    </span>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={handleAddMoreItems}
                                    className="flex-1"
                                >
                                    Agregar más items
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleCreateOrder}
                                    className="flex-1"
                                    isLoading={isSubmitting}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar a Cocina'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Si el carrito está vacío, mostramos botón para agregar items */}
                    {cart.length === 0 && (
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                onClick={handleAddMoreItems}
                                className="w-full"
                            >
                                Agregar Productos
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modal del Menú */}
            {showMenu && (
                <MenuModal
                    onClose={() => setShowMenu(false)}
                />
            )}
        </>
    );
};