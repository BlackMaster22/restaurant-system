import React from 'react';
import { useAuthStore } from '../../../stores/authStore';

export const Header: React.FC = () => {
    const { user, logout } = useAuthStore();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Caja</h1>
                        <p className="text-sm text-gray-500">
                            Gestión completa del restaurante
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                                Hola, {user?.first_name} {user?.last_name}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                                {user?.profile.role}
                            </p>
                        </div>

                        <button
                            onClick={logout}
                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};