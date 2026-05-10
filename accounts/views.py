from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.http import JsonResponse



# Create your views here.

def login_view(request):
    if request.user.is_authenticated:
        return redirect('inventory:home')

    if request.method == 'POST':
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        role = request.POST.get('role', '')

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.role == role:
                auth_login(request, user)
                if user.is_admin() or user.is_manager():
                    return redirect('inventory:home')
                elif user.is_wholesaler():
                    return redirect('sales:wholesale')
                elif user.is_retailer():
                    return redirect('sales:retail')
        
    return render(request, 'accounts/login.html')




def logout_view(request):
    logout(request)
    return redirect('accounts:login')