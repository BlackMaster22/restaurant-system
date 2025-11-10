import React from 'react';
import type { MenuItem } from '../../../types';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';

interface MenuItemCardProps {
    item: MenuItem & { category_name?: string };
    onProductSelect: (product: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
    item,
    onProductSelect
}) => {
    const handleViewDetails = () => {
        onProductSelect(item);
    };

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
            {item.image_url ? (
                <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iMC4zNWVtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhYSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
                    }}
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <span className="text-gray-400 text-sm">Imagen no disponible</span>
                </div>
            )}
            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-2xl font-bold text-primary-600">
                        ${item.price}
                    </span>
                </div>

                {item.category_name && (
                    <Badge variant="secondary" className="mb-2 self-start">
                        {item.category_name}
                    </Badge>
                )}

                <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{item.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500">
                        {item.preparation_time} min
                    </span>
                    <Button
                        onClick={handleViewDetails}
                        variant="primary"
                    >
                        Ver detalles
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};