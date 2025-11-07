from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Category, MenuItem, CustomizationOption, CustomizationChoice
from .serializers import (
    CategorySerializer, MenuItemSerializer, CustomizationOptionSerializer,
    CustomizationChoiceSerializer, CategoryOrderSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_queryset(self):
        return Category.objects.filter(is_active=True).prefetch_related('menu_items')
    
    @action(detail=False, methods=['post'])
    def update_order(self, request):
        try:
            with transaction.atomic():
                for item in request.data:
                    category = Category.objects.get(id=item['id'])
                    category.display_order = item['display_order']
                    category.save()
            return Response({'status': 'order updated'})
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.filter(is_visible=True)
    serializer_class = MenuItemSerializer
    
    def get_queryset(self):
        queryset = MenuItem.objects.all()
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset.select_related('category').prefetch_related('customization_options__choices')

class CustomizationOptionViewSet(viewsets.ModelViewSet):
    queryset = CustomizationOption.objects.all()
    serializer_class = CustomizationOptionSerializer

class CustomizationChoiceViewSet(viewsets.ModelViewSet):
    queryset = CustomizationChoice.objects.all()
    serializer_class = CustomizationChoiceSerializer