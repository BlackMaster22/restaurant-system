from django.db import models
from django.contrib.auth.models import User
from menu.models import MenuItem, CustomizationChoice

class Table(models.Model):
    number = models.IntegerField(unique=True)
    capacity = models.IntegerField(default=4)
    is_occupied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Mesa {self.number}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('confirmed', 'Confirmado'),
        ('preparing', 'En preparación'),
        ('ready', 'Listo para servir'),
        ('served', 'Servido'),
        ('paid', 'Pagado'),
        ('cancelled', 'Cancelado'),
    ]

    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders')
    waiter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Orden #{self.id} - Mesa {self.table.number}"

    def calculate_total(self):
        return sum(item.total_price for item in self.items.all())

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    customizations = models.ManyToManyField(CustomizationChoice, blank=True)

    def save(self, *args, **kwargs):
        # Calcular precio total
        customization_extra = sum(choice.price_extra for choice in self.customizations.all())
        self.unit_price = self.menu_item.price + customization_extra
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} - Orden #{self.order.id}"