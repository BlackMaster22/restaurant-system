import React from 'react';

interface BestHourCardProps {
    bestHour: string;
}

export const BestHourCard: React.FC<BestHourCardProps> = ({ bestHour }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 text-2xl">⏰</span>
                    </div>
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Hora Pico de Ventas</h3>
                    <p className="text-2xl font-bold text-gray-900">{bestHour}</p>
                    <p className="text-sm text-gray-500">Mayor actividad comercial</p>
                </div>
            </div>
        </div>
    );
};