import React, { useState, useEffect } from 'react';
import type { Category, MenuItem } from '../../../types';
import { menuAPI } from '../../../services/api';
import { useOrderStore } from '../../../stores/orderStore';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { PlusIcon, MinusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MenuModalProps {
    onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ onClose }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [customizations, setCustomizations] = useState<{ [optionId: number]: number[] }>({});

    const { addToCart } = useOrderStore();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await menuAPI.getCategories();
            const categoriesWithItems = response.data.filter((category: Category) =>
                category.menu_items.some((item: MenuItem) => item.is_available)
            );
            setCategories(categoriesWithItems);
            if (categoriesWithItems.length > 0) {
                setSelectedCategory(categoriesWithItems[0]);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!selectedItem) return;

        // Recopilar todas las customizaciones seleccionadas
        const selectedCustomizations: any[] = [];
        Object.values(customizations).flat().forEach(choiceId => {
            const choice = selectedItem.customization_options
                .flatMap(opt => opt.choices)
                .find(c => c.id === choiceId);
            if (choice) selectedCustomizations.push(choice);
        });

        const totalPrice = (selectedItem.price + selectedCustomizations.reduce((sum, c) => sum + c.price_extra, 0)) * quantity;

        addToCart({
            menuItem: selectedItem,
            quantity,
            notes,
            customizations: selectedCustomizations,
            totalPrice,
        });

        // Resetear el estado
        setSelectedItem(null);
        setQuantity(1);
        setNotes('');
        setCustomizations({});

        // Mostrar confirmación
        alert(`✅ ${quantity}x ${selectedItem.name} agregado al carrito`);
    };

    const handleCustomizationChange = (optionId: number, choiceId: number, isChecked: boolean) => {
        setCustomizations(prev => {
            const current = prev[optionId] || [];

            // Encontrar la opción para saber si es de selección única o múltiple
            const option = selectedItem?.customization_options.find(opt => opt.id === optionId);

            if (option?.max_choices === 1) {
                // Selección única: reemplazar la selección anterior
                return { ...prev, [optionId]: isChecked ? [choiceId] : [] };
            } else {
                // Selección múltiple: agregar o remover
                if (isChecked) {
                    return { ...prev, [optionId]: [...current, choiceId] };
                } else {
                    return { ...prev, [optionId]: current.filter(id => id !== choiceId) };
                }
            }
        });
    };

    // Filtrar productos basado en la búsqueda
    const filteredProducts = selectedCategory?.menu_items.filter(item =>
        item.is_available &&
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    if (loading) {
        return (
            <Modal isOpen={true} onClose={onClose} title="Menú" size="lg">
                <LoadingSpinner text="Cargando menú..." />
            </Modal>
        );
    }

    return (
        <Modal isOpen={true} onClose={onClose} title="Menú del Restaurante" size="6xl">
            <div className="flex h-[600px]">
                {/* Sidebar de Categorías */}
                <div className="w-1/4 border-r overflow-y-auto bg-gray-50">
                    <div className="p-4 space-y-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setSelectedItem(null);
                                    setSearchTerm('');
                                }}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCategory?.id === category.id
                                        ? 'bg-primary-100 text-primary-700 font-medium border border-primary-200'
                                        : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                                    }`}
                            >
                                <div className="font-medium">{category.name}</div>
                                <div className="text-sm text-gray-500">
                                    {category.menu_items.filter(item => item.is_available).length} productos
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="w-1/3 border-r overflow-y-auto">
                    <div className="p-4">
                        {/* Barra de Búsqueda */}
                        <div className="relative mb-4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>

                        {/* Lista de Productos Filtrados */}
                        <div className="space-y-3">
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 text-4xl mb-2">🔍</div>
                                    <p className="text-gray-500 text-sm">
                                        {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
                                    </p>
                                </div>
                            ) : (
                                filteredProducts.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`w-full text-left p-4 border rounded-lg transition-all ${selectedItem?.id === item.id
                                                ? 'border-primary-500 bg-primary-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <span className="font-semibold text-primary-600 ml-2">
                                                ${item.price}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <span>⏱️ {item.preparation_time} min</span>
                                            {item.allergens.length > 0 && (
                                                <span className="text-orange-600">⚠️ Alérgenos</span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Detalles del Producto y Personalización */}
                <div className="w-2/5 overflow-y-auto">
                    {selectedItem ? (
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {selectedItem.name}
                            </h3>
                            <p className="text-gray-700 mb-4">{selectedItem.description}</p>

                            <div className="flex items-center justify-between mb-6">
                                <div className="text-2xl font-bold text-primary-600">
                                    ${selectedItem.price}
                                </div>
                                <div className="text-sm text-gray-500">
                                    ⏱️ {selectedItem.preparation_time} min
                                </div>
                            </div>

                            {/* Alérgenos */}
                            {selectedItem.allergens.length > 0 && (
                                <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                    <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                                        ⚠️ Contiene:
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedItem.allergens.map((allergen, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded"
                                            >
                                                {allergen}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Customizaciones */}
                            {selectedItem.customization_options.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-4">Personaliza tu pedido</h4>
                                    <div className="space-y-4">
                                        {selectedItem.customization_options.map((option) => (
                                            <div key={option.id} className="border rounded-lg p-4">
                                                <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                                    {option.name}
                                                    {option.is_required && (
                                                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                                            Obligatorio
                                                        </span>
                                                    )}
                                                </h5>
                                                <div className="space-y-2">
                                                    {option.choices.map((choice) => (
                                                        <label key={choice.id} className="flex items-center justify-between space-x-3 p-2 hover:bg-gray-50 rounded">
                                                            <div className="flex items-center space-x-3 flex-1">
                                                                <input
                                                                    type={option.max_choices === 1 ? 'radio' : 'checkbox'}
                                                                    name={`option-${option.id}`}
                                                                    checked={customizations[option.id]?.includes(choice.id) || false}
                                                                    onChange={(e) => handleCustomizationChange(option.id, choice.id, e.target.checked)}
                                                                    className="text-primary-500 focus:ring-primary-500"
                                                                />
                                                                <span className="text-gray-700">{choice.name}</span>
                                                            </div>
                                                            {choice.price_extra > 0 && (
                                                                <span className="text-primary-600 font-medium text-sm">
                                                                    +${choice.price_extra}
                                                                </span>
                                                            )}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cantidad y Notas */}
                            <div className="space-y-4 border-t pt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cantidad
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <span className="w-12 text-center text-lg font-semibold">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notas especiales (opcional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Ej: Sin sal, bien cocido, para llevar, etc."
                                    />
                                </div>
                            </div>

                            {/* Precio Total y Botón */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-semibold text-gray-900">Total:</span>
                                    <span className="text-xl font-bold text-primary-600">
                                        ${(selectedItem.price * quantity).toFixed(2)}
                                    </span>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    className="w-full"
                                    variant="primary"
                                    size="lg"
                                >
                                    Agregar al Carrito
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                            <p className="text-gray-500 text-lg mb-2">Selecciona un producto</p>
                            <p className="text-gray-400 text-sm">
                                Elige un producto del menú para ver los detalles y personalizarlo
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};