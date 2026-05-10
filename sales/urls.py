from django.urls import path
from . import views

app_name = 'sales'

urlpatterns = [
    path('wholesale/', views.wholesale, name='wholesale'),
    path('wholesale/checkout/', views.process_wholesale_sale, name='wholesale_checkout'),
    path('retail/', views.retail, name='retail'),
    path('retail/checkout/', views.process_retail_sale, name='retail_checkout'),
]