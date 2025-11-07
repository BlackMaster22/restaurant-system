from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Table, Order, OrderItem

@admin.register(Table)
class TableAdmin(admin.ModelAdmin):
    list_display = ['number', 'capacity', 'is_occupied', 'created_at']
    list_editable = ['is_occupied']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'table', 'waiter', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['table__number', 'waiter__username']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'menu_item', 'quantity', 'total_price']
    list_filter = ['order__status']