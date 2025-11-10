from rest_framework import serializers
from .models import Category, MenuItem, CustomizationOption, CustomizationChoice
from django.urls import reverse

class CustomizationChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomizationChoice
        fields = ['id', 'name', 'price_extra']

class CustomizationOptionSerializer(serializers.ModelSerializer):
    choices = CustomizationChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = CustomizationOption
        fields = ['id', 'name', 'is_required', 'max_choices', 'choices']

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    customization_options = CustomizationOptionSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    image_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_name',
            'image', 'image_url', 'image_thumbnail', 'preparation_time', 
            'is_available', 'is_visible', 'allergens', 'customization_options', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['image_url', 'image_thumbnail']

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

    def get_image_thumbnail(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None

class CategorySerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    product_count = serializers.IntegerField(source='menu_items.count', read_only=True)
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'description', 'image', 'display_order',
            'is_active', 'menu_items', 'product_count', 'created_at', 'updated_at'
        ]

class CategoryOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'display_order']