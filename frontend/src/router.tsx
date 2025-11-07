import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CustomerMenu } from './modules/customer/CustomerMenu';
import { WaiterDashboard } from './modules/waiter/WaiterDashboard';
import { CashierDashboard } from './modules/cashier/CashierDashboard';
import { Login } from './components/forms/Login';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/menu" replace />,
    },
    {
        path: "/menu",
        element: <CustomerMenu />,
    },
    {
        path: "/menu/:tableId",
        element: <CustomerMenu />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/waiter",
        element: (
            <ProtectedRoute allowedRoles={['waiter', 'cashier', 'admin']}>
                <WaiterDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/cashier",
        element: (
            <ProtectedRoute allowedRoles={['cashier', 'admin']}>
                <CashierDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/unauthorized",
        element: (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">No Autorizado</h1>
                    <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
                </div>
            </div>
        ),
    },
    {
        path: "*",
        element: (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600">Página no encontrada</p>
                </div>
            </div>
        ),
    },
]);