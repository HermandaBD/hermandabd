from rest_framework import viewsets
from rest_framework.response import Response
from djoser.views import UserViewSet
from rest_framework.permissions import IsAuthenticated
from .permissions import isRelatedToHermandad
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
    CustomUserSerializer,
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
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_serializer_context(self):
        return {"request": self.request}

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class PatrimonioViewSet(viewsets.ModelViewSet):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class PapeletaSitioViewSet(viewsets.ModelViewSet):
    queryset = PapeletaSitio.objects.all()
    serializer_class = PapeletaSitioSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class CartaViewSet(viewsets.ModelViewSet):
    queryset = Carta.objects.all()
    serializer_class = CartaSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)
