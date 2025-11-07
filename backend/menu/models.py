from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='menu_items')
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    preparation_time = models.IntegerField(help_text="Tiempo en minutos", default=15)
    is_available = models.BooleanField(default=True)
    is_visible = models.BooleanField(default=True)
    allergens = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category__display_order', 'name']

    def __str__(self):
        return self.name

class CustomizationOption(models.Model):
    name = models.CharField(max_length=100)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='customization_options')
    is_required = models.BooleanField(default=False)
    max_choices = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.menu_item.name} - {self.name}"

class CustomizationChoice(models.Model):
    option = models.ForeignKey(CustomizationOption, on_delete=models.CASCADE, related_name='choices')
    name = models.CharField(max_length=100)
    price_extra = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.option.name} - {self.name} (+${self.price_extra})"