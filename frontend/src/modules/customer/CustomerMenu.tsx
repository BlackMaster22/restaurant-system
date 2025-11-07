import React, { useState, useEffect } from 'react';
import type { Category, MenuItem } from '../../types';
import { menuAPI } from '../../services/api';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const CustomerMenu: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await menuAPI.getCategories();
            setCategories(response.data);
            if (response.data.length > 0) {
                setSelectedCategory(response.data[0]);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-gray-900">Menú Digital</h1>
                        <div className="text-sm text-gray-500">
                            Bienvenido a nuestro restaurante
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Categorías */}
                <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedCategory?.id === category.id
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Productos */}
                {selectedCategory && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
                            {selectedCategory.name}
                        </h2>
                        {selectedCategory.description && (
                            <p className="text-gray-600 mb-8">{selectedCategory.description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {selectedCategory.menu_items.map((item) => (
                                <MenuItemCard key={item.id} item={item} />
                            ))}
                        </div>

                        {selectedCategory.menu_items.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    No hay productos disponibles en esta categoría
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
    const [showDetails, setShowDetails] = useState(false);

    if (!item.is_available) return null;

    return (
        <>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                {item.image && (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                )}
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <span className="text-2xl font-bold text-primary-600">
                            ${item.price}
                        </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            {item.preparation_time} min
                        </span>
                        <Button
                            onClick={() => setShowDetails(true)}
                            variant="primary"
                        >
                            Ver detalles
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showDetails && (
                <MenuItemModal item={item} onClose={() => setShowDetails(false)} />
            )}
        </>
    );
};

const MenuItemModal: React.FC<{ item: MenuItem; onClose: () => void }> = ({
    item,
    onClose,
}) => {
    return (
        <Modal isOpen={true} onClose={onClose} size="lg" title={item.name}>
            <div className="space-y-4">
                {item.image && (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                )}

                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                    <span className="text-3xl font-bold text-primary-600">
                        ${item.price}
                    </span>
                </div>

                <p className="text-gray-700">{item.description}</p>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Tiempo de preparación</h4>
                        <p className="text-gray-600">{item.preparation_time} minutos</p>
                    </div>

                    {item.allergens.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Alérgenos</h4>
                            <div className="flex flex-wrap gap-1">
                                {item.allergens.map((allergen) => (
                                    <Badge key={allergen} variant="error">
                                        {allergen}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {item.customization_options.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Opciones de personalización</h4>
                        <div className="space-y-4">
                            {item.customization_options.map((option) => (
                                <div key={option.id} className="border rounded-lg p-4">
                                    <h5 className="font-medium text-gray-900 mb-2">
                                        {option.name}
                                        {option.is_required && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </h5>
                                    <div className="space-y-2">
                                        {option.choices.map((choice) => (
                                            <label key={choice.id} className="flex items-center space-x-3">
                                                <input
                                                    type={option.max_choices === 1 ? 'radio' : 'checkbox'}
                                                    name={`option-${option.id}`}
                                                    className="text-primary-500 focus:ring-primary-500"
                                                />
                                                <span className="text-gray-700">{choice.name}</span>
                                                {choice.price_extra > 0 && (
                                                    <span className="text-primary-600 font-medium">
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

                <div className="flex space-x-4 pt-4">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1"
                    >
                        Cerrar
                    </Button>
                    <Button className="flex-1">
                        Agregar al pedido
                    </Button>
                </div>
            </div>
        </Modal>
    );
};