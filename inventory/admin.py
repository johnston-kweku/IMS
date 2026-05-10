from django.contrib import admin
from .models import Drug
# Register your models here.

@admin.register(Drug)
class DrugAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'description', 'wholesale_price', 'retail_price', 'inventory'
    ] 