import React, { useState, useEffect } from 'react';
import type { Category, MenuItem } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    product: MenuItem | null;
    categories: Category[];
    loading?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
    isOpen,
    onClose,
    onSave,
    product,
    categories,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        category: '',
        preparation_time: 15,
        is_available: true,
        is_visible: true,
        allergens: [] as string[],
    });

    const commonAllergens = [
        'Gluten', 'Lactosa', 'Frutos secos', 'Mariscos', 'Pescado',
        'Huevos', 'Soja', 'Sésamo', 'Mostaza', 'Apio', 'Sulfitos'
    ];

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category.toString(),
                preparation_time: product.preparation_time,
                is_available: product.is_available,
                is_visible: product.is_visible,
                allergens: product.allergens || [],
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                category: categories[0]?.id.toString() || '',
                preparation_time: 15,
                is_available: true,
                is_visible: true,
                allergens: [],
            });
        }
    }, [product, categories, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            price: parseFloat(formData.price.toString()),
            category: parseInt(formData.category),
            preparation_time: parseInt(formData.preparation_time.toString()),
        };

        onSave(submitData);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleAllergen = (allergen: string) => {
        setFormData(prev => ({
            ...prev,
            allergens: prev.allergens.includes(allergen)
                ? prev.allergens.filter(a => a !== allergen)
                : [...prev.allergens, allergen],
        }));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={product ? 'Editar Producto' : 'Nuevo Producto'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del producto *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ej: Ceviche, Lomo Saltado..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Precio *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                className="pl-7 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción *
                    </label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe el producto, ingredientes, preparación..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiempo de preparación (minutos) *
                        </label>
                        <input
                            type="number"
                            min="1"
                            required
                            value={formData.preparation_time}
                            onChange={(e) => handleChange('preparation_time', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_available}
                                onChange={(e) => handleChange('is_available', e.target.checked)}
                                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                Producto disponible
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_visible}
                                onChange={(e) => handleChange('is_visible', e.target.checked)}
                                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                                Mostrar en menú digital
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Alérgenos
                        </label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {commonAllergens.map((allergen) => (
                                <label key={allergen} className="flex items-center space-x-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={formData.allergens.includes(allergen)}
                                        onChange={() => toggleAllergen(allergen)}
                                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                    />
                                    <span className="text-gray-700">{allergen}</span>
                                </label>
                            ))}
                        </div>
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
                        {product ? 'Actualizar' : 'Crear'} Producto
                    </Button>
                </div>
            </form>
        </Modal>
    );
};