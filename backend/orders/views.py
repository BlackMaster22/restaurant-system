from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Table, Order, OrderItem
from .serializers import (
    TableSerializer, OrderSerializer, CreateOrderSerializer,
    CreateOrderItemSerializer
)
from menu.models import MenuItem, CustomizationChoice

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        queryset = Order.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset.select_related('table', 'waiter').prefetch_related('items')
    
    def create(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    table = Table.objects.get(id=serializer.validated_data['table_id'])
                    order = Order.objects.create(
                        table=table,
                        waiter=request.user,
                        notes=serializer.validated_data.get('notes', '')
                    )
                    
                    total_amount = 0
                    for item_data in serializer.validated_data['items']:
                        menu_item = MenuItem.objects.get(id=item_data['menu_item_id'])
                        order_item = OrderItem.objects.create(
                            order=order,
                            menu_item=menu_item,
                            quantity=item_data['quantity'],
                            notes=item_data.get('notes', '')
                        )
                        
                        # Agregar customizaciones
                        customization_ids = item_data.get('customization_ids', [])
                        for choice_id in customization_ids:
                            choice = CustomizationChoice.objects.get(id=choice_id)
                            order_item.customizations.add(choice)
                        
                        order_item.save()
                        total_amount += order_item.total_price
                    
                    order.total_amount = total_amount
                    order.save()
                    
                    # Notificar via WebSocket
                    self.notify_order_created(order)
                    
                    return Response(
                        OrderSerializer(order).data,
                        status=status.HTTP_201_CREATED
                    )
                    
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            
            # Notificar cambio de estado
            self.notify_order_updated(order)
            
            return Response({'status': 'updated'})
        return Response(
            {'error': 'Estado inválido'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def notify_order_created(self, order):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'orders',
            {
                'type': 'order_created',
                'order': OrderSerializer(order).data
            }
        )
    
    def notify_order_updated(self, order):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'orders',
            {
                'type': 'order_updated',
                'order': OrderSerializer(order).data
            }
        )