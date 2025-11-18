import React from 'react';

interface GrowthIndicatorCardProps {
    growth: number;
    title: string;
    description: string;
}

export const GrowthIndicatorCard: React.FC<GrowthIndicatorCardProps> = ({
    growth,
    title,
    description
}) => {
    const isPositive = growth >= 0;
    const bgColor = isPositive ? 'bg-green-100' : 'bg-red-100';
    const textColor = isPositive ? 'text-green-600' : 'text-red-600';
    const icon = isPositive ? '📈' : '📉';

    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
                        <span className="text-2xl">{icon}</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className={`text-2xl font-bold ${textColor}`}>
                        {isPositive ? '+' : ''}{growth.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );
};