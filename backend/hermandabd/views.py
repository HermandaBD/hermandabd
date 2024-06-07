from rest_framework import viewsets
from rest_framework.response import Response
from djoser.views import UserViewSet
from rest_framework.permissions import IsAuthenticated
from .models import (
    Hermandad,
    Hermano,
    Evento,
    Etiqueta,
    Documento,
    Patrimonio,
    Inventario,
    PapeletaSitio,
    Carta,
    Pago,
)
from .serializers import (
    HermandadSerializer,
    HermanoSerializer,
    EventoSerializer,
    EtiquetaSerializer,
    DocumentoSerializer,
    PatrimonioSerializer,
    InventarioSerializer,
    PapeletaSitioSerializer,
    CartaSerializer,
    PagoSerializer,
    CustomUserSerializer
)


class CustomUserViewSet(UserViewSet):
    permission_classes = [IsAuthenticated]

    def me(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(request.user, context={"request": request})
        return Response(serializer.data)


class HermandadViewSet(viewsets.ModelViewSet):
    queryset = Hermandad.objects.all()
    serializer_class = HermandadSerializer


class HermanoViewSet(viewsets.ModelViewSet):
    queryset = Hermano.objects.all()
    serializer_class = HermanoSerializer


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer


class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer


class PatrimonioViewSet(viewsets.ModelViewSet):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer


class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer


class PapeletaSitioViewSet(viewsets.ModelViewSet):
    queryset = PapeletaSitio.objects.all()
    serializer_class = PapeletaSitioSerializer


class CartaViewSet(viewsets.ModelViewSet):
    queryset = Carta.objects.all()
    serializer_class = CartaSerializer


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
