from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EconomicsViewSet
from . import views

router = DefaultRouter()
router.register(r'tables', views.TableViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'economics', views.EconomicsViewSet, basename='economics')

urlpatterns = [
    path('', include(router.urls)),
]