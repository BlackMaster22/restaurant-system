// src/modules/cashier/components/economics/ProductPerformance.tsx
import React from 'react';
import { useEconomicsStore } from '../../../../stores/economicsStore';

export const ProductPerformance: React.FC = () => {
    const { productData } = useEconomicsStore();

    if (!productData) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-4">🍕 Rendimiento de Productos</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productos más vendidos */}
                <div>
                    <h3 className="font-medium text-gray-900 mb-3">Productos Más Vendidos</h3>
                    <div className="space-y-3">
                        {productData.top_products.map((product, index) => (
                            <div key={product.product_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <div>
                                    <p className="font-medium text-gray-900">{product.product_name}</p>
                                    <p className="text-sm text-gray-500">{product.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">
                                        ${product.total_revenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {product.quantity_sold} unidades
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Productos menos vendidos */}
                <div>
                    <h3 className="font-medium text-gray-900 mb-3">Productos Menos Vendidos</h3>
                    <div className="space-y-3">
                        {productData.bottom_products.map((product) => (
                            <div key={product.product_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                <p className="font-medium text-gray-900">{product.product_name}</p>
                                <p className="text-red-600 font-semibold">
                                    {product.quantity_sold} unidades
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};