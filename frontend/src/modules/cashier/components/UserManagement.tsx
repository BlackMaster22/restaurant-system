import React, { useState, useEffect } from 'react';
import type { User } from '../../../types';
import { usersAPI } from '../../../services/api';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import { PlusIcon } from '@heroicons/react/20/solid';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        try {
            if (editingUser) {
                await usersAPI.updateUser(editingUser.id, data);
            } else {
                await usersAPI.createUser(data);
            }
            setIsModalOpen(false);
            loadUsers();
        } catch (error: any) {
            console.error('Error saving user:', error);
            alert(error.response?.data?.error || 'Error al guardar el usuario');
        }
    };

    if (loading) {
        return <LoadingSpinner text="Cargando usuarios..." />;
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <p className="text-gray-600">
                    Administra los usuarios del sistema (Camareros y Cajeros)
                </p>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Usuarios del Sistema</h3>
                        <p className="text-sm text-gray-500">
                            {users.length} usuarios registrados
                        </p>
                    </div>
                    <Button
                        onClick={handleCreate}
                        variant="primary"
                        size="lg"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Nuevo Usuario
                    </Button>
                </div>

                <UserTable
                    users={users}
                    onEdit={handleEdit}
                    onUpdate={loadUsers}
                />
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                user={editingUser}
            />
        </div>
    );
};