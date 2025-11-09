import React, { useState } from 'react';
import type { User } from '../../../types';
import { usersAPI } from '../../../services/api';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { Button } from '../../../components/ui/Button';
import { PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/20/solid';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onUpdate: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({
    users,
    onEdit,
    onUpdate
}) => {
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const handleDelete = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            setLoading(true);
            await usersAPI.deleteUser(userToDelete.id);
            onUpdate();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.error || 'Error al eliminar el usuario');
        } finally {
            setLoading(false);
            setUserToDelete(null);
        }
    };

    const getRoleBadge = (role: string) => {
        const roles = {
            waiter: { label: '🍽️ Camarero', color: 'bg-blue-100 text-blue-800' },
            cashier: { label: '💰 Caja', color: 'bg-green-100 text-green-800' },
            admin: { label: '👑 Administrador', color: 'bg-purple-100 text-purple-800' },
        };
        const roleConfig = roles[role as keyof typeof roles] || { label: role, color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleConfig.color}`}>
                {roleConfig.label}
            </span>
        );
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ✅ Activo
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ❌ Inactivo
            </span>
        );
    };

    // Filtrar usuarios
    const filteredUsers = users.filter(user => {
        const roleMatch = roleFilter === 'all' || user.profile.role === roleFilter;
        const statusMatch = statusFilter === 'all' ||
            (statusFilter === 'active' && user.profile.is_active) ||
            (statusFilter === 'inactive' && !user.profile.is_active);
        return roleMatch && statusMatch;
    });

    if (users.length === 0) {
        return (
            <div className="px-6 py-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
                <p className="text-gray-400 mt-2">
                    Comienza agregando el primer usuario del sistema
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex space-x-4">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Todos los roles</option>
                        <option value="waiter">Camareros</option>
                        <option value="cashier">Caja</option>
                        <option value="admin">Administradores</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="inactive">Inactivos</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contacto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha de registro
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-primary-800 font-medium">
                                                {user.first_name[0]}{user.last_name[0]}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                @{user.username}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                                            {user.email}
                                        </div>
                                        {user.profile.phone && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.profile.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getRoleBadge(user.profile.role)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(user.profile.is_active)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(user.profile.created_at).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(user)}
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(user)}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">No hay usuarios que coincidan con los filtros</p>
                    <p className="text-gray-400 mt-2">
                        Intenta con otros criterios de búsqueda
                    </p>
                </div>
            )}

            <ConfirmModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que quieres eliminar al usuario "${userToDelete?.first_name} ${userToDelete?.last_name}"? Esta acción no se puede deshacer.`}
                confirmText={loading ? "Eliminando..." : "Sí, eliminar"}
                cancelText="Cancelar"
                variant="danger"
                loading={loading}
            />
        </>
    );
};