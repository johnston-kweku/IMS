from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('create/user/', views.create_user, name='create_user'),
    path('users/', views.user_list, name='user_list'),
    path('<str:username>/active/', views.toggle_user_active, name='toggle_user')
]