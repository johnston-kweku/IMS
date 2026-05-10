import json
from django.shortcuts import render, get_object_or_404
from django.db import transaction
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from .models import Sale, SaleItem
from django.contrib.auth.decorators import login_required
from inventory.models import Drug
from accounts.decorators import role_required

# Create your views here.
@login_required
@role_required('ADMIN', 'MANAGER', 'WHOLESALER')
def wholesale(request):
    drugs = Drug.objects.filter(inventory__gt=0)
    return render(request, 'sales/wholesaleUI.html', {
        'drugs':drugs
    })

@login_required
@role_required('ADMIN', 'MANAGER', 'WHOLESALER')
def process_wholesale_sale(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        items = data.get('items', [])

        if not items:
            return JsonResponse({'success': False, 'message': 'No items in cart'}, status=400)

        with transaction.atomic():
            sale = Sale.objects.create(
                seller=request.user,
                type=Sale.SaleType.WHOLESALE
            )

            for item in items:
                drug = get_object_or_404(Drug, id=item['id'])
                quantity = int(item['quantity'])
                
                SaleItem.objects.create(
                    sale=sale,
                    drug=drug,
                    quantity=quantity,
                )

        return JsonResponse({
            'success': True,
            'message': 'Sale processed successfully',
            'updated_stock': [
                {'id': item.drug.id, 'inventory':item.drug.inventory}
                for item in sale.saleitem_set.all()
            ]
        })

    except (json.JSONDecodeError, KeyError, ValueError) as e:
        return JsonResponse({'success': False, 'message': f'Invalid data: {str(e)}'}, status=400)
    except ValidationError as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Server error: {str(e)}'}, status=500)
    
@login_required
@role_required('ADMIN', 'MANAGER', 'RETAILER')
def retail(request):
    drugs = Drug.objects.filter(inventory__gt=0)
    return render(request, 'sales/retailUI.html', {
        'drugs':drugs
    })

@login_required
@role_required('ADMIN', 'MANAGER', 'RETAILER')
def process_retail_sale(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

    try:
        data = json.loads(request.body)
        items = data.get('items', [])

        if not items:
            return JsonResponse({'success': False, 'message': 'No items in cart'}, status=400)

        with transaction.atomic():
            sale = Sale.objects.create(
                seller=request.user,
                type=Sale.SaleType.RETAIL
            )

            for item in items:
                drug = get_object_or_404(Drug, id=item['id'])
                quantity = int(item['quantity'])
                
                SaleItem.objects.create(
                    sale=sale,
                    drug=drug,
                    quantity=quantity,
                )

        return JsonResponse({
            'success': True,
            'message': 'Sale processed successfully',
            'updated_stock': [
                {'id': item.drug.id, 'inventory':item.drug.inventory}
                for item in sale.saleitem_set.all()
            ]
        })

    except (json.JSONDecodeError, KeyError, ValueError) as e:
        return JsonResponse({'success': False, 'message': f'Invalid data: {str(e)}'}, status=400)
    except ValidationError as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Server error: {str(e)}'}, status=500)