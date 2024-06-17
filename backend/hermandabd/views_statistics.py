# views_statistics.py
from django.db.models import Avg, Count, Sum
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Hermandad, Hermano, Evento, Documento, Etiqueta, Patrimonio, PapeletaSitio, Carta, Pago

@api_view(['GET'])
def get_statistics(request):
    num_hermandades = Hermandad.objects.count()
    num_hermanos = Hermano.objects.count()
    promedio_hermanos_por_hermandad = Hermandad.objects.annotate(num_hermanos=Count('hermano')).aggregate(promedio=Avg('num_hermanos'))['promedio']
    num_eventos = Evento.objects.count()
    num_documentos = Documento.objects.count()
    num_etiquetas = Etiqueta.objects.count()
    valor_total_patrimonio = Patrimonio.objects.aggregate(total_valor=Sum('valor'))['total_valor']
    num_papeletas = PapeletaSitio.objects.count()
    num_cartas = Carta.objects.count()
    num_pagos = Pago.objects.count()

    data = {
        'num_hermandades': num_hermandades,
        'promedio_hermanos_por_hermandad': promedio_hermanos_por_hermandad,
        'num_eventos': num_eventos,
        'num_documentos': num_documentos,
        'num_etiquetas': num_etiquetas,
        'valor_total_patrimonio': valor_total_patrimonio,
        'num_papeletas': num_papeletas,
        'num_cartas': num_cartas,
        'num_pagos': num_pagos,
    }

    return Response(data)
