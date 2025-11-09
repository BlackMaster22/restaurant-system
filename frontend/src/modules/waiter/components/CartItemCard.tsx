import React from 'react';
import type { CartItem } from '../../../types';
import { useOrderStore } from '../../../stores/orderStore';
import { Button } from '../../../components/ui/Button';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

interface CartItemCardProps {
    item: CartItem;
    index: number;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, index }) => {
    const { removeFromCart, updateCartItem } = useOrderStore();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(index);
            return;
        }
        updateCartItem(index, { quantity: newQuantity });
    };

    const handleRemove = () => {
        removeFromCart(index);
    };

    const handleNotesChange = (newNotes: string) => {
        updateCartItem(index, { notes: newNotes });
    };

    const calculateItemBasePrice = () => {
        return item.menuItem.price * item.quantity;
    };

    const calculateCustomizationsPrice = () => {
        return item.customizations.reduce((sum, custom) => sum + custom.price_extra, 0) * item.quantity;
    };

    return (
        <div className="p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex justify-between items-start space-x-4">
                {/* Información del Producto */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-900 truncate">
                            {item.menuItem.name}
                        </h5>
                        <div className="text-right ml-2">
                            <div className="font-semibold text-gray-900">
                                ${item.totalPrice.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">
                                ${item.menuItem.price} c/u
                            </div>
                        </div>
                    </div>

                    {/* Customizaciones */}
                    {item.customizations.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Personalizaciones:</p>
                            <div className="flex flex-wrap gap-1">
                                {item.customizations.map((custom, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                    >
                                        {custom.name}
                                        {custom.price_extra > 0 && ` (+$${custom.price_extra})`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    <div className="mb-2">
                        <label className="text-xs text-gray-500 block mb-1">
                            Notas:
                        </label>
                        <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            placeholder="Agregar notas..."
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Contador de Cantidad */}
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1">
                            <button
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium text-sm">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                                <PlusIcon className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Desglose de Precio */}
                        <div className="text-xs text-gray-500">
                            {calculateCustomizationsPrice() > 0 && (
                                <div>
                                    Base: ${calculateItemBasePrice().toFixed(2)}
                                    <span className="text-green-600 ml-1">
                                        +${calculateCustomizationsPrice().toFixed(2)} extras
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Botón Eliminar */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};