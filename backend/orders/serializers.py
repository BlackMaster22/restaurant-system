from rest_framework import serializers
from .models import Table, Order, OrderItem
from menu.serializers import MenuItemSerializer, CustomizationChoiceSerializer

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ['id', 'number', 'capacity', 'is_occupied', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    menu_item = MenuItemSerializer(read_only=True)
    customizations = CustomizationChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'menu_item', 'menu_item_name', 'quantity', 'unit_price',
            'total_price', 'notes', 'customizations'
        ]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    waiter_name = serializers.CharField(source='waiter.get_full_name', read_only=True)
    table_number = serializers.IntegerField(source='table.number', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'table', 'table_number', 'waiter', 'waiter_name', 'status',
            'total_amount', 'notes', 'items', 'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        order = Order.objects.create(**validated_data)
        return order

class CreateOrderItemSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    notes = serializers.CharField(required=False, allow_blank=True)
    customization_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list
    )

class CreateOrderSerializer(serializers.Serializer):
    table_id = serializers.IntegerField()
    items = CreateOrderItemSerializer(many=True)
    notes = serializers.CharField(required=False, allow_blank=True)