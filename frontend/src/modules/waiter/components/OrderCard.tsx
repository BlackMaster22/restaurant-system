import React from 'react';
import type { Order } from '../../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '../../../components/ui/Button';
import { ClockIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface OrderCardProps {
    order: Order;
    onUpdateStatus: (orderId: number, status: string) => void;
    highlight?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
    order,
    onUpdateStatus,
    highlight = false
}) => {
    const getTimeElapsed = () => {
        const created = new Date(order.created_at);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;

        const diffHours = Math.floor(diffMins / 60);
        return `Hace ${diffHours} h`;
    };

    const getNextStatusAction = () => {
        switch (order.status) {
            case 'pending':
                return {
                    label: 'Comenzar Preparación',
                    status: 'preparing',
                    variant: 'primary' as const
                };
            case 'preparing':
                return {
                    label: 'Marcar como Listo',
                    status: 'ready',
                    variant: 'primary' as const
                };
            case 'ready':
                return {
                    label: 'Entregar al Cliente',
                    status: 'served',
                    variant: 'primary' as const
                };
            default:
                return null;
        }
    };

    const nextAction = getNextStatusAction();

    return (
        <div className={`border rounded-lg p-4 transition-all ${highlight
                ? 'bg-green-50 border-green-200 shadow-sm'
                : 'bg-white border-gray-200 hover:shadow-sm'
            }`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-semibold text-gray-900 flex items-center">
                        Orden #{order.id}
                        {highlight && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                ¡Lista!
                            </span>
                        )}
                    </h4>
                    <p className="text-sm text-gray-600">Mesa {order.table_number}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>

            {/* Información de la Orden */}
            <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>{order.waiter_name}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>{getTimeElapsed()}</span>
                </div>
                <div className="flex items-center text-sm font-semibold text-gray-900">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                    <span>${order.total_amount}</span>
                </div>
            </div>

            {/* Items de la Orden */}
            <div className="mb-4">
                <div className="text-xs font-medium text-gray-700 mb-1">
                    {order.items.length} items:
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                    {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <span>
                                {item.quantity}x {item.menu_item_name}
                            </span>
                            <span>${item.total_price}</span>
                        </div>
                    ))}
                    {order.items.length > 3 && (
                        <div className="text-gray-500">
                            +{order.items.length - 3} más...
                        </div>
                    )}
                </div>
            </div>

            {/* Acciones */}
            {nextAction && (
                <Button
                    variant={nextAction.variant}
                    size="sm"
                    className="w-full"
                    onClick={() => onUpdateStatus(order.id, nextAction.status)}
                >
                    {nextAction.label}
                </Button>
            )}

            {order.status === 'served' && (
                <div className="text-center text-sm text-green-600 font-medium">
                    ✅ Entregada al cliente
                </div>
            )}
        </div>
    );
};