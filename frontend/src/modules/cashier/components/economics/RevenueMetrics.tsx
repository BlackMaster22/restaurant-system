import React from 'react';
import { useEconomicsStore } from '../../../../stores/economicsStore';
import { TotalRevenueCard } from './kpi-cards/TotalRevenueCard';
import { AverageOrderCard } from './kpi-cards/AverageOrderCard';
import { OrderCountCard } from './kpi-cards/OrderCountCard';
import { GrowthIndicatorCard } from './kpi-cards/GrowthIndicatorCard';
import { BestHourCard } from './kpi-cards/BestHourCard';

export const RevenueMetrics: React.FC = () => {
    const { financialData } = useEconomicsStore();

    if (!financialData) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <TotalRevenueCard
                total={financialData.total_revenue}
                growth={financialData.revenue_growth}
            />
            <AverageOrderCard average={financialData.average_order_value} />
            <OrderCountCard count={financialData.order_count} />
            <GrowthIndicatorCard
                growth={financialData.revenue_growth}
                title="Crecimiento"
                description="vs período anterior"
            />
            {/* <BestHourCard bestHour={financialData.best_selling_hour} /> */}
        </div>
    );
};