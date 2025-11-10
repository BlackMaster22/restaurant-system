import React from 'react';

interface ProductCounterProps {
    count: number;
    categoryName?: string;
}

export const ProductCounter: React.FC<ProductCounterProps> = ({
    count,
    categoryName,
}) => {
    return (
        <div className="mb-6">
            <p className="text-gray-600">
                Mostrando {count} producto{count !== 1 ? 's' : ''}
                {categoryName && ` en ${categoryName}`}
            </p>
        </div>
    );
};