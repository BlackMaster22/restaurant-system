import React from 'react';
import type { Category } from '../../../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex justify-center w-full">
      <div className="flex space-x-1 overflow-x-auto bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id.toString())}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === category.id.toString()
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};