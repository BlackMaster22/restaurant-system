import React, { useState, useEffect } from 'react';
import type { User } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    user: User | null;
    loading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    onSave,
    user,
    loading = false,
}) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'waiter',
        phone: '',
        is_active: true,
        password: '',
    });

    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.profile.role,
                phone: user.profile.phone || '',
                is_active: user.profile.is_active,
                password: '', // No mostramos la contraseña existente
            });
            setConfirmPassword('');
        } else {
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                role: 'waiter',
                phone: '',
                is_active: true,
                password: '',
            });
            setConfirmPassword('');
        }
    }, [user, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
        if (!user && !formData.password) {
            alert('La contraseña es obligatoria para nuevos usuarios');
            return;
        }

        if (formData.password && formData.password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Si estamos editando y no se cambió la contraseña, no la enviamos
        const dataToSend = { ...formData };
        if (user && !dataToSend.password) {
            const { password, ...dataWithoutPassword } = dataToSend;
            onSave(dataWithoutPassword);
        } else {
            onSave(dataToSend);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const getRoleDescription = (role: string) => {
        const descriptions = {
            waiter: 'Puede tomar pedidos y gestionar mesas',
            cashier: 'Puede gestionar menú, usuarios y ver reportes',
            admin: 'Acceso completo a todas las funcionalidades'
        };
        return descriptions[role as keyof typeof descriptions] || '';
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={user ? 'Editar Usuario' : 'Nuevo Usuario'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={(e) => handleChange('first_name', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ej: Juan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={(e) => handleChange('last_name', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ej: Pérez"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de usuario *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: juan.perez"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Ej: juan@restaurante.com"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rol *
                        </label>
                        <select
                            required
                            value={formData.role}
                            onChange={(e) => handleChange('role', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="waiter">🍽️ Camarero</option>
                            <option value="cashier">💰 Caja</option>
                            <option value="admin">👑 Administrador</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            {getRoleDescription(formData.role)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Ej: +34 123 456 789"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {!user ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar contraseña *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Repite la contraseña"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Dejar en blanco para no cambiar"
                                />
                            </div>
                            {formData.password && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar nueva contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Repite la nueva contraseña"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleChange('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                        Usuario activo
                    </label>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        isLoading={loading}
                        disabled={loading}
                    >
                        {user ? 'Actualizar' : 'Crear'} Usuario
                    </Button>
                </div>
            </form>
        </Modal>
    );
};