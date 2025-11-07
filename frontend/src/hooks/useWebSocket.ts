import { useState, useEffect } from 'react';
import type { Order } from '../types';

export const useWebSocket = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/orders/');

        ws.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'order_created') {
                setOrders(prev => [data.order, ...prev]);
            }

            if (data.type === 'order_updated') {
                setOrders(prev =>
                    prev.map(order =>
                        order.id === data.order.id ? data.order : order
                    )
                );
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return { orders, isConnected, setOrders };
};