from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Establecer la configuración predeterminada de Django para Celery
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HDBAPI.settings')

app = Celery('hermandabd')

# Leer la configuración de Django y usar el prefijo CELERY_ para todas las configuraciones de Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# Descubrir tareas en todos los archivos tasks.py en aplicaciones instaladas
app.autodiscover_tasks()