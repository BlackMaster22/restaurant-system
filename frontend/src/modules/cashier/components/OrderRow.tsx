import React from 'react';
import type { Order } from '../../../types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderActions } from './OrderActions';

interface OrderRowProps {
    order: Order;
    onUpdateStatus: (orderId: number, status: string) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onUpdateStatus }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                <div className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Mesa {order.table_number}</div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.waiter_name}</div>
                <div className="text-xs text-gray-500">
                    {order.items.length} items
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.status} />
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                    ${order.total_amount}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.created_at).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <OrderActions
                    order={order}
                    onUpdateStatus={onUpdateStatus}
                />
            </td>
        </tr>
    );
};