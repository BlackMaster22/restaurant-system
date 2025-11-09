import React from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { useOrderStore } from '../../../stores/orderStore';
import { Button } from '../../../components/ui/Button';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { getCartItemCount } = useOrderStore();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-900">🍽️ Restaurant</h1>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm text-gray-600">
                                Hola, <span className="font-semibold">{user?.first_name}</span>
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                                {user?.profile.role}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Indicador del Carrito */}
                        <div className="relative">
                            <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg">
                                <ShoppingCartIcon className="w-5 h-5 text-primary-600" />
                                <span className="text-sm font-medium text-primary-700">
                                    {getCartItemCount()} items
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            onClick={logout}
                            size="sm"
                        >
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};