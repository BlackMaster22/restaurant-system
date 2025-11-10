import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Category, MenuItem } from '../../types';
import { menuAPI } from '../../services/api';
import { CustomerHeader } from './components/CustomerHeader';
import { MenuItemCard } from './components/MenuItemCard';
import { MenuItemList } from './components/MenuItemList';
import { MenuItemModal } from './components/MenuItemModal';
import { CategoryFilter } from './components/CategoryFilter';
import { ViewModeToggle } from './components/ViewModeToggle';
import { ProductCounter } from './components/ProductCounter';

export const CustomerMenu: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await menuAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener todos los productos de todas las categorías
  const allMenuItems = categories.flatMap(category =>
    category.menu_items.map(item => ({
      ...item,
      category_name: category.name
    }))
  );

  // Filtrar productos según la categoría seleccionada y búsqueda
  const filteredItems = selectedCategory === 'all'
    ? allMenuItems
    : allMenuItems.filter(item => item.category.toString() === selectedCategory);

  // Obtener solo productos disponibles
  const availableItems = filteredItems.filter(item => item.is_available);

  const handleProductSelect = (product: MenuItem) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
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
      <CustomerHeader tableId={tableId} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros y controles */}
        <div className="mb-6 space-y-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="flex justify-between items-center">
            <ProductCounter
              count={availableItems.length}
              categoryName={selectedCategory !== 'all'
                ? categories.find(cat => cat.id.toString() === selectedCategory)?.name
                : undefined
              }
            />

            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Productos */}
        {availableItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onProductSelect={handleProductSelect}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {availableItems.map((item) => (
                <MenuItemList
                  key={item.id}
                  item={item}
                  onProductSelect={handleProductSelect}
                />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">
              No hay productos disponibles
              {selectedCategory !== 'all' ? ' en esta categoría' : ' en este momento'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <MenuItemModal
          item={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};