import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
//import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    loading = false,
}) => {
    const variantConfig = {
        danger: {
            icon: '🔴',
            confirmColor: 'danger' as const,
        },
        warning: {
            icon: '🟡',
            confirmColor: 'secondary' as const,
        },
        info: {
            icon: '🔵',
            confirmColor: 'primary' as const,
        },
    };

    const config = variantConfig[variant];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="text-center">
                <div className="text-4xl mb-4">{config.icon}</div>

                <p className="text-gray-700 mb-6">
                    {message}
                </p>

                <div className="flex space-x-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={config.confirmColor}
                        onClick={onConfirm}
                        className="flex-1"
                        isLoading={loading}
                        disabled={loading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};