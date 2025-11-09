import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'md',
    text = 'Cargando...',
    className = ''
}) => {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <div
                className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-500 ${sizes[size]}`}
            ></div>
            {text && (
                <p className="mt-3 text-sm text-gray-600 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};