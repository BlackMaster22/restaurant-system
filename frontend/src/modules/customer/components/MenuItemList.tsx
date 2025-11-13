import React from 'react';
import type { MenuItem } from '../../../types';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface MenuItemListProps {
    item: MenuItem & { category_name?: string };
    onProductSelect: (product: MenuItem) => void;
}

export const MenuItemList: React.FC<MenuItemListProps> = ({
    item,
    onProductSelect
}) => {
    const handleViewDetails = () => {
        onProductSelect(item);
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full md:w-48 h-48 md:h-32 object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhYSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
                        }}
                    />
                ) : (
                    <div className="w-full md:w-48 h-48 md:h-32 bg-gray-200 flex items-center justify-center rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                        <span className="text-gray-400 text-sm">Sin imagen</span>
                    </div>
                )}

                <CardContent className="p-6 flex-1">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                                {item.category_name && (
                                    <Badge variant="secondary" className="mt-1">
                                        {item.category_name}
                                    </Badge>
                                )}
                            </div>
                            <span className="text-2xl font-bold text-primary-600">
                                ${item.price}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    {item.preparation_time} min
                                </span>
                                {item.allergens.length > 0 && (
                                    <span className="text-xs text-orange-600">
                                        {item.allergens.length} alérgeno{item.allergens.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={handleViewDetails}
                                    variant="primary"
                                    size="sm"
                                >
                                    Detalles
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};