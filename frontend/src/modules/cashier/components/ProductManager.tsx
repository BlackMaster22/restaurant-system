import React, { useState } from 'react';
import type { Category, MenuItem } from '../../../types';
import { menuAPI } from '../../../services/api';
import { ProductModal } from './ProductModal';
import { ConfirmModal } from '../../../components/ui';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

interface ProductManagerProps {
    categories: Category[];
    menuItems: MenuItem[];
    onUpdate: () => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({
    categories,
    menuItems,
    onUpdate,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
    const [productToDelete, setProductToDelete] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: MenuItem) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (product: MenuItem) => {
        setProductToDelete(product);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            setLoading(true);
            await menuAPI.deleteMenuItem(productToDelete.id);
            onUpdate();
        } catch (error: any) {
            console.error('Error deleting product:', error);
            alert(error.response?.data?.error || 'Error al eliminar el producto');
        } finally {
            setLoading(false);
            setProductToDelete(null);
        }
    };

    const handleSave = async (data: FormData) => {
        try {
            setLoading(true);
            if (editingProduct) {
                await menuAPI.updateMenuItem(editingProduct.id, data);
            } else {
                await menuAPI.createMenuItem(data);
            }
            setIsModalOpen(false);
            onUpdate();
        } catch (error: any) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.error || 'Error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    const toggleProductAvailability = async (product: MenuItem) => {
        try {
            const formData = new FormData();
            formData.append('is_available', (!product.is_available).toString());

            await menuAPI.updateMenuItem(product.id, formData);
            onUpdate();
        } catch (error: any) {
            console.error('Error updating product:', error);
            alert(error.response?.data?.error || 'Error al actualizar el producto');
        }
    };

    const toggleProductVisibility = async (product: MenuItem) => {
        try {
            const formData = new FormData();
            formData.append('is_visible', (!product.is_visible).toString());

            await menuAPI.updateMenuItem(product.id, formData);
            onUpdate();
        } catch (error: any) {
            console.error('Error updating product:', error);
            alert(error.response?.data?.error || 'Error al actualizar el producto');
        }
    };

    // Filtrar productos
    const filteredProducts = menuItems.filter(product => {
        const categoryMatch = categoryFilter === 'all' || product.category.toString() === categoryFilter;
        const availabilityMatch = availabilityFilter === 'all' ||
            (availabilityFilter === 'available' && product.is_available) ||
            (availabilityFilter === 'unavailable' && !product.is_available);
        return categoryMatch && availabilityMatch;
    });

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Productos del Menú</h3>
                        <p className="text-sm text-gray-500">
                            Gestiona todos los productos del restaurante
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nuevo Producto
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex space-x-4">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Todas las categorías</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name} ({category.product_count})
                            </option>
                        ))}
                    </select>

                    <select
                        value={availabilityFilter}
                        onChange={(e) => setAvailabilityFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="available">Disponibles</option>
                        <option value="unavailable">No disponibles</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Producto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Categoría
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Precio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiempo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {product.image && (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="h-10 w-10 rounded-lg object-cover mr-3"
                                            />
                                        )}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500 line-clamp-1">
                                                {product.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {product.category_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    ${product.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-1">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.is_available
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {product.is_available ? '✅ Disponible' : '❌ No disponible'}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.is_visible
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {product.is_visible ? '👁️ Visible' : '👁️‍🗨️ Oculto'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {product.preparation_time} min
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => toggleProductAvailability(product)}
                                            className={`p-2 rounded-lg transition-colors ${product.is_available
                                                ? 'text-orange-600 hover:bg-orange-50'
                                                : 'text-green-600 hover:bg-green-50'
                                                }`}
                                            title={product.is_available ? 'Marcar como no disponible' : 'Marcar como disponible'}
                                        >
                                            {product.is_available ? '❌' : '✅'}
                                        </button>

                                        <button
                                            onClick={() => toggleProductVisibility(product)}
                                            className={`p-2 rounded-lg transition-colors ${product.is_visible
                                                ? 'text-gray-600 hover:bg-gray-50'
                                                : 'text-blue-600 hover:bg-blue-50'
                                                }`}
                                            title={product.is_visible ? 'Ocultar del menú' : 'Mostrar en el menú'}
                                        >
                                            {product.is_visible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>

                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                                            title="Editar producto"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(product)}
                                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar producto"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredProducts.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                    <p className="text-gray-500 text-lg">No hay productos que coincidan con los filtros</p>
                    <p className="text-gray-400 mt-2">
                        {menuItems.length === 0
                            ? 'Crea tu primer producto para el menú'
                            : 'Intenta con otros filtros de búsqueda'
                        }
                    </p>
                    {menuItems.length === 0 && (
                        <button
                            onClick={handleCreate}
                            className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Crear Primer Producto
                        </button>
                    )}
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                product={editingProduct}
                categories={categories}
                loading={loading}
            />

            <ConfirmModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar Producto"
                message={`¿Estás seguro de que quieres eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText={loading ? "Eliminando..." : "Sí, eliminar"}
                cancelText="Cancelar"
                variant="danger"
                loading={loading}
            />
        </div>
    );
};