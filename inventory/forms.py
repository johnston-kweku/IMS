from django import forms
from .models import Drug

class DrugForm(forms.ModelForm):
    class Meta:
        model = Drug
        fields = ['name', 'description', 'wholesale_price', 'retail_price', 'inventory', 'cost_price']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium',
                'placeholder': 'Enter drug name'
            }),
            'description': forms.Textarea(attrs={
                'class': 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium',
                'placeholder': 'Enter drug description',
                'rows': 3
            }),
            'wholesale_price': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium',
                'placeholder': '0.00',
                'step': '0.01'
            }),
            'retail_price': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium',
                'placeholder': '0.00',
                'step': '0.01'
            }),
            'inventory': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium',
                'placeholder': '0'
            }),
            'cost_price': forms.NumberInput(attrs={
                'class': 'w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium',
                'placeholder': '0.00',
                'step': '0.01'
            }),
        }
