import React, { useState, useEffect, useRef } from 'react';
import type { Category, MenuItem } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FormData) => Promise<void>;
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

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setImagePreview(product.image_url || '');
        } else {
            resetForm();
        }
    }, [product, categories, isOpen]);

    const resetForm = () => {
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
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de archivo - SOLO JPG
            const allowedTypes = ['image/jpeg', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Por favor, selecciona un archivo JPG válido');
                return;
            }

            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe superar los 5MB');
                return;
            }

            setImageFile(file);

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.name || !formData.price || !formData.category) {
            alert('Por favor, completa los campos obligatorios');
            return;
        }

        try {
            const submitData = new FormData();

            // Agregar campos del formulario
            Object.entries(formData).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(item => submitData.append(key, item));
                } else {
                    submitData.append(key, value.toString());
                }
            });

            // Agregar imagen si existe
            if (imageFile) {
                submitData.append('image', imageFile);
            } else if (product && !imagePreview) {
                // Si estamos editando y removieron la imagen, enviar campo vacío
                submitData.append('image', '');
            }

            await onSave(submitData);
            resetForm();
        } catch (error) {
            console.error('Error al guardar producto:', error);
            throw error; // Re-lanzar el error para que el componente padre lo maneje
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={product ? 'Editar Producto' : 'Nuevo Producto'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sección de Imagen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Imagen del Producto (JPG)
                    </label>

                    <div className="flex flex-col items-center space-y-4">
                        {/* Preview de imagen */}
                        {imagePreview && (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-48 w-48 object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Input de archivo */}
                        <div className="flex items-center justify-center w-full">
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${loading ? 'bg-gray-100 border-gray-300' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                }`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click para subir</span>
                                    </p>
                                    <p className="text-xs text-gray-500">JPG, JPEG (MAX. 5MB)</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,image/jpeg"
                                    onChange={handleImageChange}
                                    disabled={loading}
                                />
                            </label>
                        </div>
                    </div>
                </div>

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
                            disabled={loading}
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
                                disabled={loading}
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
                        disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                        disabled={loading}
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
                        onClick={handleClose}
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