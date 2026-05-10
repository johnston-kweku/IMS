from django.core.management.base import BaseCommand
from django.db.models.functions import Length
from inventory.models import Drug


class Command(BaseCommand):
    help = 'Delete all drugs who have names exceeding 50 chars.'

    def handle(self, *args, **options):
        deleted_count, _ = Drug.objects.annotate(name_len=Length('name')).filter(name_len__gte=50).delete()
        self.stdout.write(f'Deleted {deleted_count} drugs successfully.')

