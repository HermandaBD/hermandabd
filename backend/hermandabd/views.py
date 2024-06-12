from rest_framework import viewsets
from rest_framework.response import Response
from djoser.views import UserViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .permissions import isRelatedToHermandad
import csv
from .forms import CSVUploadForm
from django.http import HttpResponse
from rest_framework.views import APIView
from datetime import datetime
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
    permission_classes = [IsAuthenticated, isRelatedToHermandad]

    """ def me(self, request, *args, **kwargs):
        serializer = CustomUserSerializer(request.user, context={"request": request})
        return Response(serializer.data) """
        
    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class HermandadViewSet(viewsets.ModelViewSet):
    queryset = Hermandad.objects.all()
    serializer_class = HermandadSerializer


class HermanoViewSet(viewsets.ModelViewSet):
    queryset = Hermano.objects.all()
    serializer_class = HermanoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all()
    serializer_class = DocumentoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_serializer_context(self):
        return {"request": self.request}

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class PatrimonioViewSet(viewsets.ModelViewSet):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class InventarioViewSet(viewsets.ModelViewSet):
    queryset = Inventario.objects.all()
    serializer_class = InventarioSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class PapeletaSitioViewSet(viewsets.ModelViewSet):
    queryset = PapeletaSitio.objects.all()
    serializer_class = PapeletaSitioSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class CartaViewSet(viewsets.ModelViewSet):
    queryset = Carta.objects.all()
    serializer_class = CartaSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [isRelatedToHermandad]

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(hermandad=self.request.user.hermandad)


class ExportHermandadDataView(APIView):
    permission_classes = [IsAuthenticated, isRelatedToHermandad]

    def get(self, request, *args, **kwargs):
        # Get the user's hermandad
        hermandad = request.user.hermandad

        # Prepare the HTTP response
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="hermandad_{hermandad.id}_data.csv"'
        )

        # Create a CSV writer
        writer = csv.writer(response)

        # Write headers for Hermano
        writer.writerow(
            [
                "Hermano - Nombre",
                "Apellidos",
                "DNI",
                "Código Postal",
                "Dirección",
                "Email",
                "Fecha de Nacimiento",
                "Fecha de Alta",
                "Fecha de Baja",
                "Forma de Pago",
                "IBAN",
                "Localidad",
                "Número de Hermano",
                "Provincia",
                "Teléfono",
                "Titular Cuenta Bancaria",
                "Tutor Legal",
            ]
        )
        # Write data for Hermano
        hermanos = Hermano.objects.filter(hermandad=hermandad)
        for hermano in hermanos:
            writer.writerow(
                [
                    hermano.nombre,
                    hermano.apellidos,
                    hermano.dni,
                    hermano.codigo_postal,
                    hermano.direccion,
                    hermano.email,
                    hermano.fecha_nacimiento,
                    hermano.fecha_alta,
                    hermano.fecha_baja,
                    hermano.forma_pago,
                    hermano.iban,
                    hermano.localidad,
                    hermano.numero_hermano,
                    hermano.provincia,
                    hermano.telefono,
                    hermano.titular_cuenta_bancaria,
                    hermano.tutor_legal,
                ]
            )

        return response


class ImportDataView(APIView):
    def post(self, request, model_name):
        form = CSVUploadForm(request.POST, request.FILES)
        if form.is_valid():
            csv_file = request.FILES["file"]
            if not csv_file.name.endswith(".csv"):
                return Response(
                    {"error": "El archivo no es un archivo CSV válido"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                model = {"hermano": Hermano}[model_name]
            except KeyError:
                return Response(
                    {"error": "Modelo no válido"}, status=status.HTTP_400_BAD_REQUEST
                )

            csv_data = csv.reader(csv_file.read().decode("utf-8").splitlines())
            header = next(csv_data)

            for row in csv_data:
                if not any(row):
                    break
                fecha_baja = row[
                    8
                ].strip()  # Elimina espacios en blanco alrededor del valor
                if fecha_baja:  # Verifica si hay un valor
                    try:
                        fecha_baja = datetime.strptime(
                            fecha_baja, "%Y-%m-%d"
                        ).date()  # Convierte a fecha
                    except ValueError:
                        return Response(
                            {"error": "Formato de fecha inválido para fecha_baja"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                if model_name == "hermano":
                    if fecha_baja:
                        Hermano.objects.create(
                            nombre=row[0],
                            apellidos=row[1],
                            dni=row[2],
                            codigo_postal=row[3],
                            direccion=row[4],
                            email=row[5],
                            fecha_nacimiento=row[6],
                            fecha_alta=row[7],
                            fecha_baja=fecha_baja,
                            forma_pago=row[9],
                            hermandad=request.user.hermandad,
                            iban=row[10],
                            localidad=row[11],
                            numero_hermano=row[12],
                            provincia=row[13],
                            telefono=row[14],
                            titular_cuenta_bancaria=row[15],
                            tutor_legal=row[16],
                        )
                    else:
                        Hermano.objects.create(
                            nombre=row[0],
                            apellidos=row[1],
                            dni=row[2],
                            codigo_postal=row[3],
                            direccion=row[4],
                            email=row[5],
                            fecha_nacimiento=row[6],
                            fecha_alta=row[7],
                            forma_pago=row[9],
                            hermandad=request.user.hermandad,
                            iban=row[10],
                            localidad=row[11],
                            numero_hermano=row[12],
                            provincia=row[13],
                            telefono=row[14],
                            titular_cuenta_bancaria=row[15],
                            tutor_legal=row[16],
                        )
            return Response(
                {"success": "Archivo importado con éxito"},
                status=status.HTTP_201_CREATED,
            )
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
