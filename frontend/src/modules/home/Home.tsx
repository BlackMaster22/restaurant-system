import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">Restaurante Delicias</h1>
                        </div>
                        <nav className="flex space-x-4">
                            <Link
                                to="/menu"
                                className="text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                Menú Digital
                            </Link>
                            <Link
                                to="/login"
                                className="text-gray-600 hover:text-primary-600 transition-colors"
                            >
                                Acceso Empleados
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Bienvenido a <span className="text-primary-600">Restaurante Delicias</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Disfruta de la mejor gastronomía en un ambiente acogedor.
                        Ofrecemos platos preparados con ingredientes frescos y de la más alta calidad.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/menu"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                        >
                            Ver Menú Digital
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 transition-colors"
                        >
                            Acceso Empleados
                        </Link>
                    </div>
                </div>

                {/* Información del restaurante */}
                <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Horario de Atención</h3>
                        <p className="text-gray-600">Lunes a Domingo: 12:00 - 23:00</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ubicación</h3>
                        <p className="text-gray-600">Av. Principal 123, Ciudad</p>
                    </div>

                    <div className="text-center">
                        <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Contacto</h3>
                        <p className="text-gray-600">+1 234 567 890</p>
                        <p className="text-gray-600">info@restaurantedelicias.com</p>
                    </div>
                </section>
            </main>
        </div>
    );
};