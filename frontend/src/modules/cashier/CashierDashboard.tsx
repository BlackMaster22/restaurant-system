import React, { useState } from 'react';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { OrdersPanel } from './components/OrdersPanel';
import { MenuManagement } from './components/MenuManagement';
import { UserManagement } from './components/UserManagement';
import { EconomicsDashboard } from './components/economics/EconomicsDashboard';

export const CashierDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'users' | 'economics'>('orders');

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'orders':
                return <OrdersPanel />;
            case 'menu':
                return <MenuManagement />;
            case 'users':
                return <UserManagement />;
            case 'economics':
                return <EconomicsDashboard />;
            default:
                return <OrdersPanel />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="mt-6">
                    {renderActiveTab()}
                </div>
            </div>
        </div>
    );
};