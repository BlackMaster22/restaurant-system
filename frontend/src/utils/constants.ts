export const API_BASE_URL = 'http://localhost:8000/api';
export const WS_BASE_URL = 'ws://localhost:8000/ws';

export const ORDER_STATUS = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    preparing: 'En preparación',
    ready: 'Listo para servir',
    served: 'Servido',
    paid: 'Pagado',
    cancelled: 'Cancelado',
};

export const USER_ROLES = {
    cashier: 'Caja',
    waiter: 'Camarero',
    admin: 'Administrador',
};