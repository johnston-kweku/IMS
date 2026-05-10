from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    class UserRoles(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        MANAGER = 'MANAGER', 'Manager'
        WHOLESALER = 'WHOLESALER', 'Wholesaler'
        RETAILER = 'RETAILER', 'Retailer'

    full_name = models.CharField(max_length=100)
    role = models.CharField(
        max_length=50,
        choices=UserRoles.choices,
        null=False,
        blank=False
    )


    def is_admin(self):
        return self.role == self.UserRoles.ADMIN
    
    def is_manager(self):
        return self.role == self.UserRoles.MANAGER
    
    def is_wholesaler(self):
        return self.role == self.UserRoles.WHOLESALER
    
    def is_retailer(self):
        return self.role == self.UserRoles.RETAILER
