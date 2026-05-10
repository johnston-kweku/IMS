from django.contrib import admin
from .models import Sale, SaleItem

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = [
        'seller', 'type', 'total_cost', 'created_at'
    ]


admin.site.register(SaleItem)