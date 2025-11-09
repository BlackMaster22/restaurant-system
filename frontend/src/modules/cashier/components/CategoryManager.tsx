import React, { useState } from 'react';
import type { Category } from '../../../types';
import { menuAPI } from '../../../services/api';
import { CategoryModal } from './CategoryModal';
import { ConfirmModal } from '../../../components/ui';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';

interface CategoryManagerProps {
    categories: Category[];
    onUpdate: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
    categories,
    onUpdate,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (category: Category) => {
        if (category.product_count > 0) {
            alert(`No se puede eliminar la categoría "${category.name}" porque tiene ${category.product_count} productos asociados. Primero mueve o elimina los productos.`);
            return;
        }
        setCategoryToDelete(category);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            setLoading(true);
            await menuAPI.deleteCategory(categoryToDelete.id);
            onUpdate();
        } catch (error: any) {
            console.error('Error deleting category:', error);
            alert(error.response?.data?.error || 'Error al eliminar la categoría');
        } finally {
            setLoading(false);
            setCategoryToDelete(null);
        }
    };

    const handleSave = async (data: any) => {
        try {
            setLoading(true);
            if (editingCategory) {
                await menuAPI.updateCategory(editingCategory.id, data);
            } else {
                await menuAPI.createCategory(data);
            }
            setIsModalOpen(false);
            onUpdate();
        } catch (error: any) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.error || 'Error al guardar la categoría');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Categorías del Menú</h3>
                    <p className="text-sm text-gray-500">
                        Organiza los productos por categorías
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Nueva Categoría
                </button>
            </div>

            <div className="divide-y divide-gray-200">
                {categories.map((category) => (
                    <div key={category.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                    <h4 className="text-sm font-semibold text-gray-900">
                                        {category.name}
                                    </h4>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {category.product_count} productos
                                    </span>
                                    {!category.is_active && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Inactiva
                                        </span>
                                    )}
                                </div>
                                {category.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {category.description}
                                    </p>
                                )}
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                    <span>Orden: {category.display_order}</span>
                                    <span>
                                        Creada: {new Date(category.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="inline-flex items-center p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                                    title="Editar categoría"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category)}
                                    className="inline-flex items-center p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar categoría"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📁</div>
                    <p className="text-gray-500 text-lg">No hay categorías creadas</p>
                    <p className="text-gray-400 mt-2">
                        Crea tu primera categoría para organizar el menú
                    </p>
                    <button
                        onClick={handleCreate}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Crear Primera Categoría
                    </button>
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                category={editingCategory}
                loading={loading}
            />

            <ConfirmModal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar Categoría"
                message={`¿Estás seguro de que quieres eliminar la categoría "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`}
                confirmText={loading ? "Eliminando..." : "Sí, eliminar"}
                cancelText="Cancelar"
                variant="danger"
                loading={loading}
            />
        </div>
    );
};