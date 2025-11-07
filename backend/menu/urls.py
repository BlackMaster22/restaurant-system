from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'items', views.MenuItemViewSet)
router.register(r'customization-options', views.CustomizationOptionViewSet)
router.register(r'customization-choices', views.CustomizationChoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('categories/update-order/', views.CategoryViewSet.as_view({'post': 'update_order'})),
]