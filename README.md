# Sistema de Restaurante

Sistema completo de gestión para restaurantes con tres módulos:
- **Menú Digital** para comensales
- **Panel de Camarero** para gestión de pedidos
- **Panel de Caja** para administración

## Tecnologías

### Backend
- Django 4.2
- Django REST Framework
- JWT Authentication
- WebSockets con Channels

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Zustand (gestión de estado)
- React Query

## Instalación

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
