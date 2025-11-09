import React, { useState, useEffect } from 'react';
import type { Category } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    category: Category | null;
    loading?: boolean;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSave,
    category,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                display_order: category.display_order,
                is_active: category.is_active,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                display_order: 0,
                is_active: true,
            });
        }
    }, [category, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={category ? 'Editar Categoría' : 'Nueva Categoría'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la categoría *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: Entradas, Platos Principales, Postres..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Descripción opcional de la categoría..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Orden de visualización
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.display_order}
                            onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Número menor aparece primero
                        </p>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => handleChange('is_active', e.target.checked)}
                            className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                            Categoría activa
                        </label>
                    </div>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        isLoading={loading}
                        disabled={loading}
                    >
                        {category ? 'Actualizar' : 'Crear'} Categoría
                    </Button>
                </div>
            </form>
        </Modal>
    );
};