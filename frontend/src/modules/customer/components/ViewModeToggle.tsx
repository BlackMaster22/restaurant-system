import React from 'react';
import { GridIcon, ListIcon } from '../../../components/ui/Icons';

interface ViewModeToggleProps {
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
    viewMode,
    onViewModeChange,
}) => {
    return (
        <div className="flex space-x-2 bg-white rounded-lg border p-1">
            <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                title="Vista de cuadrícula"
            >
                <GridIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                title="Vista de lista"
            >
                <ListIcon className="w-5 h-5" />
            </button>
        </div>
    );
};