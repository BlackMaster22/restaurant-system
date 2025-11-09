import React, { useState, useEffect } from 'react';
import type { Category, MenuItem } from '../../../types';
import { menuAPI } from '../../../services/api';
import { CategoryManager } from './CategoryManager';
import { ProductManager } from './ProductManager';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export const MenuManagement: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'categories' | 'products'>('categories');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesResponse, itemsResponse] = await Promise.all([
                menuAPI.getCategories(),
                menuAPI.getMenuItems(),
            ]);
            setCategories(categoriesResponse.data);
            setMenuItems(itemsResponse.data);
        } catch (error) {
            console.error('Error loading menu data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDataUpdate = () => {
        loadData();
    };

    if (loading) {
        return <LoadingSpinner text="Cargando datos del menú..." />;
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Menú</h2>
                <p className="text-gray-600">
                    Administra categorías y productos del menú del restaurante
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveSection('categories')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSection === 'categories'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        📁 Categorías ({categories.length})
                    </button>
                    <button
                        onClick={() => setActiveSection('products')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeSection === 'products'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        🍽️ Productos ({menuItems.length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeSection === 'categories' ? (
                <CategoryManager
                    categories={categories}
                    onUpdate={handleDataUpdate}
                />
            ) : (
                <ProductManager
                    categories={categories}
                    menuItems={menuItems}
                    onUpdate={handleDataUpdate}
                />
            )}
        </div>
    );
};