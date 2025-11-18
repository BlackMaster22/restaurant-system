import React from 'react';

interface TabNavigationProps {
    activeTab: 'orders' | 'menu' | 'users' | 'economics';
    onTabChange: (tab: 'orders' | 'menu' | 'users' | 'economics') => void;
}

const tabs = [
    { id: 'orders', name: 'Órdenes', icon: '📋' },
    { id: 'menu', name: 'Gestión de Menú', icon: '🍽️' },
    { id: 'users', name: 'Gestión de Usuarios', icon: '👥' },
    { id: 'economics', name: 'Gestión Económica', icon: '📊' },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
    activeTab,
    onTabChange,
}) => {
    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as any)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.name}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};