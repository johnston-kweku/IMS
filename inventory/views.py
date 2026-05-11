from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, F, ExpressionWrapper, DecimalField, Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from .models import Drug
from sales.models import Sale, SaleItem
from datetime import timedelta
from accounts.models import User


# Create your views here.

@login_required
def home(request):
    now = timezone.now()

    monthly_sale = Sale.objects.filter(created_at__month=now.month, created_at__year=now.year).aggregate(total=Sum('total_cost'))

    last_month = now - timedelta(days=30)

    last_month_sales = Sale.objects.filter(
        created_at__month=last_month.month,
        created_at__year=last_month.year
    ).aggregate(total=Sum('total_cost'))

    this_month_total = monthly_sale['total'] or 0
    last_month_total = last_month_sales['total'] or 0

    try:
        revenue_percentage_change = ((this_month_total - last_month_total) / last_month_total) * 100
    except ZeroDivisionError:
        revenue_percentage_change = 0

    this_month_sales_count = Sale.objects.filter(
        created_at__month=now.month, 
        created_at__year=now.year
    ).count()

    last_month_sales_count = Sale.objects.filter(
        created_at__month=last_month.month,
        created_at__year=last_month.year
    ).count()

    try:
        sales_count_change = ((this_month_sales_count - last_month_sales_count) / last_month_sales_count) * 100
    except ZeroDivisionError:
        sales_count_change = 0

    total_drugs = Drug.objects.count()

    users_count = User.objects.count()

    six_months_ago = now - timedelta(days=180)
    monthly_data = SaleItem.objects.filter(sale__created_at__gte=six_months_ago).annotate(
        month=TruncMonth('sale__created_at')
    ).values('month').annotate(
        revenue=Sum('total_cost'),
        profit=Sum(
            ExpressionWrapper(
                F('total_cost') - F('drug__cost_price') * F('quantity'),
                output_field=DecimalField()
            )
        ),
        sales_count=Count('sale')
    ).order_by('month')

    chart_data = [
        {
            'month': item['month'].strftime('%b'),
            'revenue': float(item['revenue']),
            'profit': float(item['profit']),
            'sales_count': item['sales_count']
        }
        for item in monthly_data
    ]

    context = {
        'this_month_total': this_month_total,
        'last_month_total': last_month_total,
        'revenue_percentage_change': round(revenue_percentage_change, 1),
        'sales_count_change': round(sales_count_change, 1),
        'this_month_sales_count':this_month_sales_count,
        'total_drugs': total_drugs,
        'users_count': users_count,
        'chart_data': chart_data
    }

    return render(request, 'inventory/dashboard.html', context)
