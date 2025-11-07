from django.contrib import admin
from .models import Category, MenuItem, CustomizationOption, CustomizationChoice

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_order', 'is_active', 'created_at']
    list_editable = ['display_order', 'is_active']
    search_fields = ['name']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'is_available', 'is_visible']
    list_filter = ['category', 'is_available', 'is_visible']
    search_fields = ['name']

admin.site.register(CustomizationOption)
admin.site.register(CustomizationChoice)