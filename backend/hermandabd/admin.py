from django.contrib import admin
from .models import *
# Register your models here.

@admin.register(Hermandad)
class HermandadAdmin(admin.ModelAdmin):
    pass

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass

@admin.register(Hermano)
class HermanoAdmin(admin.ModelAdmin):
    pass

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    pass

@admin.register(Etiqueta)
class EtiquetaAdmin(admin.ModelAdmin):
    pass

@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    pass

@admin.register(Patrimonio)
class PatrimonioAdmin(admin.ModelAdmin):
    pass

@admin.register(Inventario)
class InventarioAdmin(admin.ModelAdmin):
    pass

@admin.register(PapeletaSitio)
class PapeletaSitioAdmin(admin.ModelAdmin):
    pass

@admin.register(Carta)
class CartaAdmin(admin.ModelAdmin):
    pass