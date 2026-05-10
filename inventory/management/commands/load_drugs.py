from django.core.management.base import BaseCommand
from inventory.models import Drug
import json



class Command(BaseCommand):
    help = 'Load drugs from JSON file.'

    def handle(self, *args, **options):
        drug_file = '/Users/jr/PHARMACY MANAGEMENT SYSTEM/load_data.json'

        with open(drug_file, 'r') as f:
            drug_data = json.load(f)
            

        for drug in drug_data:
            Drug.objects.create(
                name=drug['name'],
                description=drug['description'],
                wholesale_price=drug['wholesale_price'],
                retail_price=drug['retail_price'],
                inventory=drug['inventory']
            )


