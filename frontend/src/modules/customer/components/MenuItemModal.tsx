import React from 'react';
import type { MenuItem } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface MenuItemModalProps {
    item: MenuItem;
    onClose: () => void;
}

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
    item,
    onClose,
}) => {
    return (
        <Modal isOpen={true} onClose={onClose} size="lg" title={item.name}>
            <div className="space-y-4">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-64 object-cover rounded-lg"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400">Imagen no disponible</span>
                    </div>
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