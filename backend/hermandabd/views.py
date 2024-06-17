from rest_framework import viewsets
from rest_framework.response import Response
from djoser.views import UserViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .permissions import isRelatedToHermandad
import csv
from django.core.mail import send_mail, EmailMessage
from django.http import HttpResponse, JsonResponse, FileResponse
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from .forms import CSVUploadForm
from .tasks import enviar_correo_task
from reportlab.pdfgen import canvas
import os
from django.conf import settings
from reportlab.lib.pagesizes import A4
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
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

def generate_pdf(request, id):
    pago = Pago.objects.filter(id=id)[0]
    hermanos = pago.hermano.all()
    forma_pago= ""
    # Ruta del PDF original
    if not pago.diseno:
        original_pdf_path = "media/Cuota_ejemplo.pdf"
    else:
        original_pdf_path = pago.diseno    
    width_mm = 296.6
    height_mm = 134.3
    width_points = width_mm * 72 / 25.4
    height_points = height_mm * 72 / 25.4
    custom_page_size = (width_points, height_points)
    # Leer el PDF original
    writer = PdfWriter()

    for hermano in hermanos:
        forma_pago = hermano.forma_pago
        reader = PdfReader(original_pdf_path)
        original_page = reader.pages[0]
        packet = BytesIO()
        can = canvas.Canvas(packet,pagesize=custom_page_size)
        # Agregar contenido al canvas
        year = datetime.now().year
        can.drawString(110, 450, str(year))
        can.drawString(82, 356.5, f"{hermano.nombre} {hermano.apellidos}")
        can.drawString(65, 308, f" {hermano.dni}")
        can.drawString(108, 261.5, f"{hermano.direccion} {hermano.localidad}")
        can.drawString(155,217.8, f"{hermano.numero_hermano}")
        can.drawString(740,160, f"{pago.valor}€")
        can.save()

        # Mover el contenido del canvas al inicio del BytesIO buffer
        packet.seek(0)
        new_pdf = PdfReader(packet).pages[0]

        original_page.merge_page(new_pdf)

        # Añadir una nueva página al writer basada en el original
        """ for page_num in range(len(reader.pages)):
            page = reader.pages[page_num] """
        #writer.add_page(original_page)
        writer.add_page(original_page)
    # Guardar el archivo PDF en una ruta específica
    output_path = f'media/cuota_{forma_pago}.pdf'
    with open(output_path, 'wb') as output_file:
        writer.write(output_file)

    # Enviar el archivo PDF como respuesta
    return FileResponse(open(output_path, 'rb'), content_type='application/pdf', filename=f'cuota_{forma_pago}.pdf')



def generate_papeleta(request, id):
    papeleta = PapeletaSitio.objects.filter(id=id)[0]
    hermanos = papeleta.hermano.all()
    puesto= ""
    # Ruta del PDF original
    if not papeleta.diseno:
        original_pdf_path = "media/Papeleta_ejemplo.pdf"
    else:
        original_pdf_path = papeleta.diseno    
    width_mm = 296.6
    height_mm = 134.3
    width_points = width_mm * 72 / 25.4
    height_points = height_mm * 72 / 25.4
    custom_page_size = (width_points, height_points)
    # Leer el PDF original
    writer = PdfWriter()

    for hermano in hermanos:
        reader = PdfReader(original_pdf_path)
        original_page = reader.pages[0]
        packet = BytesIO()
        can = canvas.Canvas(packet,pagesize=custom_page_size)
        # Agregar contenido al canvas
        year = datetime.now().year
        can.drawString(155, 450, str(year))
        can.drawString(155, 356.5, f"{hermano.nombre} {hermano.apellidos}")
        can.drawString(155, 308, f" {hermano.dni}")
        can.drawString(155,251.8, f"{hermano.numero_hermano}")
        can.drawString(155,200, f"{papeleta.ubicacion} {papeleta.fecha} {papeleta.hora}")
        can.drawString(740,90, f"{papeleta.valor}")
        can.save()

        # Mover el contenido del canvas al inicio del BytesIO buffer
        packet.seek(0)
        new_pdf = PdfReader(packet).pages[0]

        original_page.merge_page(new_pdf)

        # Añadir una nueva página al writer basada en el original
        """ for page_num in range(len(reader.pages)):
            page = reader.pages[page_num] """
        #writer.add_page(original_page)
        writer.add_page(original_page)
    # Guardar el archivo PDF en una ruta específica
    output_path = f'media/papeleta_{papeleta.puesto}.pdf'
    with open(output_path, 'wb') as output_file:
        writer.write(output_file)

    # Enviar el archivo PDF como respuesta
    return FileResponse(open(output_path, 'rb'), content_type='application/pdf', filename=f'papeleta_{papeleta.puesto}.pdf')



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
    
    def perform_create(self, serializer):
        # Guardar la carta en la base de datos
        carta = serializer.save(hermandad=self.request.user.hermandad)
        
        # Datos del correo
        subject = carta.asunto
        body = carta.cuerpo
        recipients = [hermano.email for hermano in carta.destinatarios.all()]  
        reply_to = self.request.data.get('reply_to')  
        try:
            for hermano in recipients:
                #send_mail(subject=subject, message=body, from_email=settings.EMAIL_HOST_USER,recipient_list=[hermano],fail_silently=True)
                email = EmailMessage(
                    subject=subject,
                    body=body,
                    from_email=settings.EMAIL_HOST_USER,
                    to=[hermano],
                    reply_to=[reply_to],
                )
                email.send()
            """ if send_date:
                # Programar la tarea de Celery para una fecha futura
                send_datetime = datetime.combine(send_date, datetime.min.time())
                enviar_correo_task.apply_async(
                    (subject, body, recipients, reply_to), eta=send_datetime)
            else:
                # Enviar el correo inmediatamente
                enviar_correo_task.delay(subject, body, recipients, reply_to)
                 """
            return JsonResponse({'message': 'Email scheduled successfully!'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)


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
    

    
