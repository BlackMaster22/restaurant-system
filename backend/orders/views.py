from rest_framework import viewsets, status, permissions
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
                        
                        # Crear OrderItem sin customizaciones primero
                        order_item = OrderItem.objects.create(
                            order=order,
                            menu_item=menu_item,
                            quantity=item_data['quantity'],
                            notes=item_data.get('notes', ''),
                            # Inicializar precios a 0, se calcularán después
                            unit_price=0,
                            total_price=0
                        )
                        
                        # Agregar customizaciones después de crear el OrderItem
                        customization_ids = item_data.get('customization_ids', [])
                        for choice_id in customization_ids:
                            choice = CustomizationChoice.objects.get(id=choice_id)
                            order_item.customizations.add(choice)
                        
                        # Ahora recalcular y guardar con los precios correctos
                        order_item.save()  # Esto activará el método save actualizado
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
        
from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import TruncDate, TruncHour, TruncWeek, TruncMonth, TruncYear
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal
import json        
        
class EconomicsViewSet(viewsets.ViewSet):
    """
    ViewSet para estadísticas económicas
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def financial_stats(self, request):
        """
        Estadísticas financieras generales
        Query params: date_from, date_to, period
        """
        try:
            # Obtener parámetros de filtro
            date_from = request.query_params.get('date_from')
            date_to = request.query_params.get('date_to')
            period = request.query_params.get('period', 'month')

            # Construir filtros de fecha
            date_filter = Q()
            if date_from and date_to:
                date_filter = Q(created_at__date__range=[date_from, date_to])
            else:
                # Por defecto, último mes
                last_month = timezone.now() - timedelta(days=30)
                date_filter = Q(created_at__gte=last_month)

            # Filtrar órdenes pagadas
            orders = Order.objects.filter(date_filter, status='paid')

            # Métricas básicas
            total_revenue = orders.aggregate(
                total=Sum('total_amount')
            )['total'] or Decimal('0')

            order_count = orders.count()
            average_order_value = total_revenue / order_count if order_count > 0 else Decimal('0')

            # Cálculo de crecimiento vs período anterior
            previous_period_revenue = self._get_previous_period_revenue(date_from, date_to, period)
            revenue_growth = self._calculate_growth(total_revenue, previous_period_revenue)

            # Ingresos por período para gráfico
            revenue_by_period = self._get_revenue_by_period(orders, period)

            # Hora pico de ventas
            best_selling_hour = self._get_best_selling_hour(orders)

            data = {
                'total_revenue': float(total_revenue),
                'average_order_value': float(average_order_value),
                'order_count': order_count,
                'revenue_growth': revenue_growth,
                'best_selling_hour': best_selling_hour,
                'revenue_by_period': revenue_by_period,
            }

            return Response(data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def product_analytics(self, request):
        """
        Análisis de productos por ventas
        """
        try:
            date_from = request.query_params.get('date_from')
            date_to = request.query_params.get('date_to')
            limit = int(request.query_params.get('limit', 10))

            date_filter = Q()
            if date_from and date_to:
                date_filter = Q(order__created_at__date__range=[date_from, date_to])

            # Obtener productos más vendidos
            top_products = OrderItem.objects.filter(
                date_filter,
                order__status='paid'
            ).values(
                'menu_item__id',
                'menu_item__name',
                'menu_item__category__name'
            ).annotate(
                quantity_sold=Sum('quantity'),
                total_revenue=Sum('total_price'),
                order_count=Count('order', distinct=True)
            ).order_by('-total_revenue')[:limit]

            # Calcular porcentajes
            total_revenue_all = sum(item['total_revenue'] for item in top_products) or 1

            product_data = []
            for item in top_products:
                percentage = (item['total_revenue'] / total_revenue_all) * 100
                product_data.append({
                    'product_id': item['menu_item__id'],
                    'product_name': item['menu_item__name'],
                    'category': item['menu_item__category__name'],
                    'quantity_sold': item['quantity_sold'],
                    'total_revenue': float(item['total_revenue']),
                    'order_count': item['order_count'],
                    'percentage_of_total': round(percentage, 2)
                })

            # Productos menos vendidos
            bottom_products = OrderItem.objects.filter(
                date_filter,
                order__status='paid'
            ).values(
                'menu_item__id',
                'menu_item__name'
            ).annotate(
                quantity_sold=Sum('quantity')
            ).order_by('quantity_sold')[:5]

            bottom_products_data = [
                {
                    'product_id': item['menu_item__id'],
                    'product_name': item['menu_item__name'],
                    'quantity_sold': item['quantity_sold']
                }
                for item in bottom_products
            ]

            return Response({
                'top_products': product_data,
                'bottom_products': bottom_products_data
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def temporal_analytics(self, request):
        """
        Análisis temporal de ventas
        """
        try:
            period = request.query_params.get('period', 'day')
            date_from = request.query_params.get('date_from')
            date_to = request.query_params.get('date_to')

            date_filter = Q()
            if date_from and date_to:
                date_filter = Q(created_at__date__range=[date_from, date_to])

            orders = Order.objects.filter(date_filter, status='paid')

            # Agrupar por período
            if period == 'hour':
                orders = orders.annotate(period=TruncHour('created_at'))
            elif period == 'week':
                orders = orders.annotate(period=TruncWeek('created_at'))
            elif period == 'month':
                orders = orders.annotate(period=TruncMonth('created_at'))
            elif period == 'year':
                orders = orders.annotate(period=TruncYear('created_at'))
            else:  # day
                orders = orders.annotate(period=TruncDate('created_at'))

            temporal_data = orders.values('period').annotate(
                revenue=Sum('total_amount'),
                order_count=Count('id'),
                average_order_value=Avg('total_amount')
            ).order_by('period')

            formatted_data = []
            for item in temporal_data:
                if period == 'hour':
                    period_label = item['period'].strftime('%H:%M')
                else:
                    period_label = item['period'].strftime('%Y-%m-%d')
                
                formatted_data.append({
                    'period': period_label,
                    'revenue': float(item['revenue']),
                    'order_count': item['order_count'],
                    'average_order_value': float(item['average_order_value'])
                })

            return Response(formatted_data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def waiter_performance(self, request):
        """
        Métricas de desempeño por camarero
        """
        try:
            date_from = request.query_params.get('date_from')
            date_to = request.query_params.get('date_to')

            date_filter = Q()
            if date_from and date_to:
                date_filter = Q(created_at__date__range=[date_from, date_to])

            waiter_data = Order.objects.filter(
                date_filter, 
                status='paid'
            ).values(
                'waiter__id',
                'waiter__first_name',
                'waiter__last_name'
            ).annotate(
                total_orders=Count('id'),
                total_revenue=Sum('total_amount'),
                average_order_value=Avg('total_amount'),
                tables_served=Count('table', distinct=True)
            ).order_by('-total_revenue')

            performance_data = []
            for data in waiter_data:
                performance_data.append({
                    'waiter_id': data['waiter__id'],
                    'waiter_name': f"{data['waiter__first_name']} {data['waiter__last_name']}",
                    'total_orders': data['total_orders'],
                    'total_revenue': float(data['total_revenue']),
                    'average_order_value': float(data['average_order_value']),
                    'tables_served': data['tables_served']
                })

            return Response(performance_data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    # Métodos auxiliares
    def _get_previous_period_revenue(self, date_from, date_to, period):
        """Calcular ingresos del período anterior para comparación"""
        # Implementación simplificada - en producción sería más compleja
        try:
            if date_from and date_to:
                start = datetime.strptime(date_from, '%Y-%m-%d')
                end = datetime.strptime(date_to, '%Y-%m-%d')
                days_diff = (end - start).days
                
                previous_start = start - timedelta(days=days_diff + 1)
                previous_end = start - timedelta(days=1)
                
                previous_orders = Order.objects.filter(
                    created_at__date__range=[previous_start, previous_end],
                    status='paid'
                )
                
                return previous_orders.aggregate(
                    total=Sum('total_amount')
                )['total'] or Decimal('0')
        except:
            pass
        return Decimal('0')

    def _calculate_growth(self, current, previous):
        """Calcular porcentaje de crecimiento"""
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return float(((current - previous) / previous) * 100)

    def _get_revenue_by_period(self, orders, period):
        if period == 'hour':
            orders_grouped = orders.annotate(period=TruncHour('created_at'))
        elif period == 'day':
            orders_grouped = orders.annotate(period=TruncDate('created_at'))
        elif period == 'week':
            orders_grouped = orders.annotate(period=TruncWeek('created_at'))
        elif period == 'month':
            orders_grouped = orders.annotate(period=TruncMonth('created_at'))
        else:  # default to day
            orders_grouped = orders.annotate(period=TruncDate('created_at'))
        
        revenue_data = list(orders_grouped.values('period').annotate(
            revenue=Sum('total_amount')
        ).order_by('period'))
        
        # Formatear los datos para el frontend
        formatted_data = []
        for item in revenue_data:
            if period == 'hour':
                period_label = item['period'].strftime('%H:%M')
            else:
                period_label = item['period'].strftime('%Y-%m-%d')
            
            formatted_data.append({
                'period': period_label,
                'revenue': float(item['revenue']) if item['revenue'] else 0.0
            })
        
        return formatted_data

    def _get_best_selling_hour(self, orders):
        """Encontrar la hora con más ventas"""
        hourly_data = orders.annotate(
            hour=TruncHour('created_at')
        ).values('hour').annotate(
            revenue=Sum('total_amount')
        ).order_by('-revenue').first()
        
        return hourly_data['hour'].strftime('%H:%M') if hourly_data else 'N/A'        