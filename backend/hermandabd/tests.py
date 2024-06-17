from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate, APITestCase
from .models import Hermandad, Hermano, User, Evento, Etiqueta, Documento, Patrimonio, Inventario, Carta, Pago, PapeletaSitio
from .serializers import HermandadSerializer, HermanoSerializer, EventoSerializer, EtiquetaSerializer, DocumentoSerializer, PatrimonioSerializer, InventarioSerializer, CartaSerializer, PagoSerializer, PapeletaSitioSerializer
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
import datetime


User = get_user_model()


# TEST DE HERMANDAD


class HermandadModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

    def test_invalid_cif_length(self):
        hermandad = Hermandad(
            nombre="Hermandad Test 2",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="123456789A0",  # CIF con longitud incorrecta
            email="test2@hermandad.com",
            telefono="123456789",
        )
        with self.assertRaises(ValidationError) as cm:
            hermandad.full_clean()

        error_message = cm.exception.message_dict["cif"][0]
        self.assertEqual(
            error_message,
            "Asegúrese de que este valor tenga menos de 9 caracteres (tiene 11).",
        )

    def test_invalid_telefono_length(self):
        hermandad = Hermandad(
            nombre="Hermandad Test 3",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test3@hermandad.com",
            telefono="12345678901234567890",  # Teléfono con longitud incorrecta
        )
        with self.assertRaises(ValidationError) as cm:
            hermandad.full_clean()

        error_message = cm.exception.message_dict["telefono"][0]
        self.assertEqual(
            error_message,
            "Asegúrese de que este valor tenga menos de 12 caracteres (tiene 20).",
        )


class HermandadSerializerTest(TestCase):
    def test_valid_data(self):
        data = {
            "nombre": "Hermandad Test",
            "descripcion": "Descripción Test",
            "poblacion": "Población Test",
            "cif": "12345678A",
            "email": "test@hermandad.com",
            "telefono": "123456789",
        }
        serializer = HermandadSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_cif_length(self):
        data = {
            "nombre": "Hermandad Test",
            "descripcion": "Descripción Test",
            "poblacion": "Población Test",
            "cif": "123456789A0",  # CIF con longitud incorrecta
            "email": "test@hermandad.com",
            "telefono": "123456789",
        }
        serializer = HermandadSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_invalid_telefono_length(self):
        data = {
            "nombre": "Hermandad Test",
            "descripcion": "Descripción Test",
            "poblacion": "Población Test",
            "cif": "12345678A",
            "email": "test@hermandad.com",
            "telefono": "12345678901234567890",  # Teléfono con longitud incorrecta
        }
        serializer = HermandadSerializer(data=data)
        self.assertFalse(serializer.is_valid())


class HermandadViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="password"
        )
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

    def test_get_hermandad_list(self):
        url = "/api/v1/hermandades/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data), 1
        )  # Asegura que devuelve exactamente una hermandad

    def test_create_hermandad(self):
        url = "/api/v1/hermandades/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        data = {
            "nombre": "Nueva Hermandad",
            "descripcion": "Descripción de la nueva hermandad",
            "poblacion": "Población de la nueva hermandad",
            "cif": "98765432B",
            "email": "nueva@hermandad.com",
            "telefono": "987654321",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_hermandad(self):
        url = f"/api/v1/hermandades/{self.hermandad.id}/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        data = {
            "nombre": "Hermandad Modificada",
            "descripcion": "Descripción modificada",
            "poblacion": "Población modificada",
            "cif": "12345678A",
            "email": "test@hermandad.com",
            "telefono": "123456789",
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_hermandad(self):
        url = f"/api/v1/hermandades/{self.hermandad.id}/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


#TEST DE HERMANO

class HermanoModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

    def test_invalid_codigo_postal(self):
        hermano = Hermano(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=53001,  # Código postal inválido
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        with self.assertRaises(ValidationError) as cm:
            hermano.full_clean()

        error_message = cm.exception.message_dict["codigo_postal"][0]
        self.assertEqual(
            error_message, "Asegúrese de que este valor es menor o igual a 53000."
        )

    def test_invalid_dni_format(self):
        hermano = Hermano(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345671412341234A",  # DNI incorrecto
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        with self.assertRaises(ValidationError) as cm:
            hermano.full_clean()

        error_message = cm.exception.message_dict["dni"][0]
        self.assertEqual(
            error_message,
            "Asegúrese de que este valor tenga menos de 9 caracteres (tiene 18).",
        )


class HermanoSerializerTest(TestCase):
    def setUp(self):

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_data(self):
        data = {
            "nombre": "Juan",
            "apellidos": "Pérez",
            "dni": "12345678Z",
            "codigo_postal": 28001,
            "direccion": "Calle Mayor, 1",
            "email": "juan@example.com",
            "fecha_nacimiento": "1990-01-01",
            "fecha_alta": "2023-01-01",
            "forma_pago": "Transferencia",
            "hermandad": self.hermandad.id,
            "iban": "ES9121000418450200051332",
            "localidad": "Madrid",
            "numero_hermano": 1,
            "provincia": "Madrid",
            "telefono": "123456789",
            "titular_cuenta_bancaria": "Juan Pérez",
        }

        request = self.client.post("/", data)
        request.user = self.user

        serializer = HermanoSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        print(serializer.errors)  # Agrega esta línea para ver los errores de validación
        self.assertTrue(is_valid)

"""     def test_invalid_dni_format(self):
        data = {
            "nombre": "Juan",
            "apellidos": "Pérez",
            "dni": "1234567A",  # DNI incorrecto
            "codigo_postal": 28001,
            "direccion": "Calle Mayor, 1",
            "email": "juan@example.com",
            "fecha_nacimiento": "1990-01-01",
            "fecha_alta": "2023-01-01",
            "forma_pago": "Transferencia",
            "hermandad": self.hermandad.id,
            "iban": "ES9121000418450200051332",
            "localidad": "Madrid",
            "numero_hermano": 1,
            "provincia": "Madrid",
            "telefono": "123456789",
            "titular_cuenta_bancaria": "Juan Pérez",
        }
        request = RequestFactory().get("/")
        request.user = self.user
        serializer = HermanoSerializer(data=data, context={"request": request})
        self.assertFalse(serializer.is_valid()) """


class HermanoViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )

    def test_get_hermano_list(self):
        url = "/api/v1/hermanos/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_hermano(self):
        url = "/api/v1/hermanos/"
        data = {
            "nombre": "Nuevo Hermano",
            "apellidos": "Apellido Nuevo",
            "dni": "98765432A",
            "codigo_postal": 28002,
            "direccion": "Calle Nueva, 2",
            "email": "nuevo@example.com",
            "fecha_nacimiento": "1995-01-01",
            "fecha_alta": "2023-06-01",
            "forma_pago": "Efectivo",
            "hermandad": self.hermandad.id,
            "iban": "ES9121000418450200051444",
            "localidad": "Madrid",
            "numero_hermano": 2,
            "provincia": "Madrid",
            "telefono": "987654321",
            "titular_cuenta_bancaria": "Nuevo Hermano",
        }

        # Imprime los datos que estás enviando para depurar
        print(f"Datos de creación del hermano: {data}")

        response = self.client.post(url, data, format="json")
        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)  # Imprime la respuesta para ver detalles del error
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_hermano(self):
        url = f"/api/v1/hermanos/{self.hermano.id}/"
        data = {
            "nombre": "Juan Modificado",
            "apellidos": "Pérez Modificado",
            "dni": "12345678Z",
            "codigo_postal": 28001,
            "direccion": "Calle Mayor, 1",
            "email": "juan@example.com",
            "fecha_nacimiento": "1990-01-01",
            "fecha_alta": "2023-01-01",
            "forma_pago": "Transferencia",
            "hermandad": self.hermandad.id,
            "iban": "ES9121000418450200051332",
            "localidad": "Madrid",
            "numero_hermano": 1,
            "provincia": "Madrid",
            "telefono": "123456789",
            "titular_cuenta_bancaria": "Juan Pérez",
        }
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_hermano(self):
        url = f"/api/v1/hermanos/{self.hermano.id}/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)



    def test_invalid_codigo_postal(self):
        url = "/api/v1/hermanos/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        data = {
            "nombre": "Nuevo",
            "apellidos": "Hermano",
            "dni": "98765432X",
            "codigo_postal": 99999,  # Código postal fuera de rango válido
            "direccion": "Calle Nueva, 2",
            "email": "nuevo@example.com",
            "fecha_nacimiento": "1995-01-01",
            "fecha_alta": "2023-01-01",
            "forma_pago": "Transferencia",
            "hermandad": self.hermandad.id,
            "iban": "ES9121000418450200051332",
            "localidad": "Madrid",
            "numero_hermano": 2,
            "provincia": "Madrid",
            "telefono": "987654321",
            "titular_cuenta_bancaria": "Nuevo Hermano",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    """ def test_invalid_dni_format(self):
        url = "/api/v1/hermanos/"  # URL directa sin namespace
        self.client.force_authenticate(user=self.user)
        data = {
            "nombre": "Nuevo",
            "apellidos": "Hermano",
            "dni": "1234567A",  # DNI con formato incorrecto
            "codigo_postal": 28002,
            "direccion": "Calle Nueva, 2",
            "email": "nuevo@example.com",
            "fecha_nacimiento": "1995-01-01",
            "fecha_alta": "2023-01-01",
            "forma_pago": "Transferencia",
            "hermandad": self.hermandad.id,
            "iban": "ES9121000418450200051332",
            "localidad": "Madrid",
            "numero_hermano": 2,
            "provincia": "Madrid",
            "telefono": "987654321",
            "titular_cuenta_bancaria": "Nuevo Hermano",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) """
    


#TEST DE EVENTOS:

class EventoModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

    def test_valid_evento(self):
        evento = Evento(
            descripcion="Evento de Prueba",
            fecha_inicio=datetime.datetime(2024, 6, 1, 10, 0, 0),
            fecha_fin=datetime.datetime(2024, 6, 1, 12, 0, 0),
            hermandad=self.hermandad,
        )
        evento.full_clean()  # Debe pasar sin lanzar excepciones
        evento.save()  # Guardamos el evento en la base de datos
        self.assertEqual(Evento.objects.count(), 1)

    

class EventoSerializerTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "title": "Evento de Prueba",
            "start": "2024-06-01T10:00:00Z",
            "end": "2024-06-01T12:00:00Z",
            "hermandad": self.hermandad.id,
        }

        # Simulamos una solicitud HTTP
        factory = APIRequestFactory()
        request = factory.post("/api/v1/eventos/", data, format="json")
        request.user = self.user

        serializer = EventoSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)

    """ def test_invalid_serializer_data(self):
        data = {
            "title": "Evento de Prueba",
            "start": "2024-06-01T12:00:00Z",
            "end": "2023-06-01T10:00:00Z",
            "hermandad": self.hermandad.id,
        }

        # Simulamos una solicitud HTTP
        factory = APIRequestFactory()
        request = factory.post("/api/v1/eventos/", data, format="json")
        request.user = self.user

        serializer = EventoSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertFalse(is_valid) """


class EventoViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

        self.client.force_authenticate(user=self.user)

        self.evento = Evento.objects.create(
            descripcion="Evento de Prueba",
            fecha_inicio=datetime.datetime(2024, 6, 1, 10, 0, 0),
            fecha_fin=datetime.datetime(2024, 6, 1, 12, 0, 0),
            hermandad=self.hermandad,
        )

    def test_get_evento_list(self):
        url = "/api/v1/eventos/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_evento(self):
        url = "/api/v1/eventos/"
        data = {
            "title": "Nuevo Evento",
            "start": "2024-06-01T14:00:00Z",
            "end": "2024-06-01T16:00:00Z",
            "hermandad": self.hermandad.id,
        }

        response = self.client.post(url, data, format="json")
        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)  # Imprimimos la respuesta para ver detalles del error
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_evento(self):
        url = f"/api/v1/eventos/{self.evento.id}/"
        data = {
            "title": "Evento Modificado",
            "start": "2024-06-01T10:00:00Z",
            "end": "2024-06-01T14:00:00Z",
            "hermandad": self.hermandad.id,
        }

        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_evento(self):
        url = f"/api/v1/eventos/{self.evento.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


#TEST DE ETIQUETA

class EtiquetaModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.etiqueta = Etiqueta.objects.create(
            nombre="Etiqueta Test",
            descripcion="Descripción Test",
            hermandad=self.hermandad,
            color="#FF0000",
        )

    def test_etiqueta_creation(self):
        self.assertEqual(self.etiqueta.nombre, "Etiqueta Test")
        self.assertEqual(self.etiqueta.descripcion, "Descripción Test")
        self.assertEqual(self.etiqueta.hermandad, self.hermandad)
        self.assertEqual(self.etiqueta.color, "#FF0000")

    def test_etiqueta_str(self):
        self.assertEqual(str(self.etiqueta), "Etiqueta Test")


class EtiquetaSerializerTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "nombre": "Etiqueta de Prueba",
            "descripcion": "Descripción de la etiqueta",
            "hermandad": self.hermandad.id,
            "color": "#00FF00",
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/etiquetas/", data, format="json")
        request.user = self.user

        serializer = EtiquetaSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "nombre": "Etiqueta Otra Hermandad",
            "descripcion": "Descripción de etiqueta para otra hermandad",
            "hermandad": otra_hermandad.id,
            "color": "#FFFF00",
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/etiquetas/", data, format="json")
        request.user = self.user

        serializer = EtiquetaSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertFalse(is_valid)
        self.assertIn("hermandad", serializer.errors)


class EtiquetaViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.etiqueta = Etiqueta.objects.create(
            nombre="Etiqueta Test",
            descripcion="Descripción de la etiqueta",
            hermandad=self.hermandad,
            color="#FF0000",
        )

    def test_get_etiqueta_list(self):
        url = "/api/v1/etiquetas/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_etiqueta(self):
        data = {
            "nombre": "Nueva Etiqueta",
            "descripcion": "Descripción de la nueva etiqueta",
            "hermandad": self.hermandad.id,
            "color": "#00FF00",
        }
        url = "/api/v1/etiquetas/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Etiqueta.objects.count(), 2)

    def test_update_etiqueta(self):
        data = {
            "nombre": "Etiqueta Modificada",
            "descripcion": "Descripción modificada de la etiqueta",
            "hermandad": self.hermandad.id,
            "color": "#0000FF",
        }
        url = f"/api/v1/etiquetas/{self.etiqueta.id}/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.etiqueta.refresh_from_db()
        self.assertEqual(self.etiqueta.nombre, "Etiqueta Modificada")

    def test_delete_etiqueta(self):
        url = f"/api/v1/etiquetas/{self.etiqueta.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Etiqueta.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "nombre": "Etiqueta Otra Hermandad",
            "descripcion": "Descripción de etiqueta para otra hermandad",
            "hermandad": otra_hermandad.id,
            "color": "#FFFF00",
        }
        url = "/api/v1/etiquetas/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Etiqueta.objects.count(), 1)

#TEST DE DOCUMENTO

class DocumentoModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.etiqueta = Etiqueta.objects.create(
            nombre="Etiqueta Test",
            descripcion="Descripción Test",
            hermandad=self.hermandad,
            color="#FF0000",
        )
        self.archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo")
        self.documento = Documento.objects.create(
            nombre="Documento Test",
            archivo=self.archivo,
            mime_type="text/plain",
            hermandad=self.hermandad,
        )
        self.documento.etiquetas.add(self.etiqueta)

    def test_documento_creation(self):
        self.assertEqual(self.documento.nombre, "Documento Test")
        self.assertEqual(self.documento.mime_type, "text/plain")
        self.assertEqual(self.documento.hermandad, self.hermandad)
        self.assertIn(self.etiqueta, self.documento.etiquetas.all())

    def test_documento_str(self):
        self.assertEqual(str(self.documento), "Documento Test")

    def test_documento_delete(self):
        self.documento.delete()
        self.assertFalse(Documento.objects.filter(id=self.documento.id).exists())

class DocumentoSerializerTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.etiqueta = Etiqueta.objects.create(
            nombre="Etiqueta Test",
            descripcion="Descripción Test",
            hermandad=self.hermandad,
            color="#FF0000",
        )

    def test_valid_serializer_data(self):
        archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo")
        data = {
            "nombre": "Documento de Prueba",
            "archivo": archivo,
            "mime_type": "text/plain",
            "hermandad": self.hermandad.id,
            "etiquetas": [self.etiqueta.id],
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/documentos/", data, format="multipart")
        request.user = self.user

        serializer = DocumentoSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo")
        data = {
            "nombre": "Documento Otra Hermandad",
            "archivo": archivo,
            "mime_type": "text/plain",
            "hermandad": otra_hermandad.id,
            "etiquetas": [self.etiqueta.id],
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/documentos/", data, format="multipart")
        request.user = self.user

        serializer = DocumentoSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertFalse(is_valid)
        self.assertIn("hermandad", serializer.errors)


class DocumentoViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.etiqueta = Etiqueta.objects.create(
            nombre="Etiqueta Test",
            descripcion="Descripción Test",
            hermandad=self.hermandad,
            color="#FF0000",
        )

        self.archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo")
        self.documento = Documento.objects.create(
            nombre="Documento Test",
            archivo=self.archivo,
            mime_type="text/plain",
            hermandad=self.hermandad,
        )
        self.documento.etiquetas.add(self.etiqueta)

    def test_get_documento_list(self):
        url = "/api/v1/documentos/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_documento(self):
        archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo")
        data = {
            "nombre": "Nuevo Documento",
            "archivo": archivo,
            "mime_type": "text/plain",
            "hermandad": self.hermandad.id,
            "etiquetas": [self.etiqueta.id],
        }
        url = "/api/v1/documentos/"
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Documento.objects.count(), 2)

    def test_update_documento(self):
        archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo actualizado")
        data = {
            "nombre": "Documento Modificado",
            "archivo": archivo,
            "mime_type": "text/plain",
            "hermandad": self.hermandad.id,
            "etiquetas": [self.etiqueta.id],
        }
        url = f"/api/v1/documentos/{self.documento.id}/"
        response = self.client.put(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.documento.refresh_from_db()
        self.assertEqual(self.documento.nombre, "Documento Modificado")

    def test_delete_documento(self):
        url = f"/api/v1/documentos/{self.documento.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Documento.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        archivo = SimpleUploadedFile("archivo.txt", b"contenido del archivo")
        data = {
            "nombre": "Documento Otra Hermandad",
            "archivo": archivo,
            "mime_type": "text/plain",
            "hermandad": otra_hermandad.id,
            "etiquetas": [self.etiqueta.id],
        }
        url = "/api/v1/documentos/"
        response = self.client.post(url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Documento.objects.count(), 1)

#TEST DE PATRIMONIO

class PatrimonioModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.patrimonio = Patrimonio.objects.create(
            nombre="Patrimonio Test",
            descripcion="Descripción del patrimonio test",
            fecha_llegada=datetime.date(2024, 6, 1),
            fecha_realizacion=datetime.date(2024, 5, 1),
            hermandad=self.hermandad,
            valor=1000.00,
        )

    def test_patrimonio_creation(self):
        self.assertEqual(self.patrimonio.nombre, "Patrimonio Test")
        self.assertEqual(self.patrimonio.descripcion, "Descripción del patrimonio test")
        self.assertEqual(self.patrimonio.fecha_llegada, datetime.date(2024, 6, 1))
        self.assertEqual(self.patrimonio.fecha_realizacion, datetime.date(2024, 5, 1))
        self.assertEqual(self.patrimonio.hermandad, self.hermandad)
        self.assertEqual(self.patrimonio.valor, 1000.00)

    def test_patrimonio_str(self):
        self.assertEqual(str(self.patrimonio), "Patrimonio Test")

class PatrimonioSerializerTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "nombre": "Patrimonio de Prueba",
            "descripcion": "Descripción de prueba",
            "fecha_llegada": "2024-06-01",
            "fecha_realizacion": "2024-05-01",
            "hermandad": self.hermandad.id,
            "valor": "1000.00",
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/patrimonios/", data, format="json")
        request.user = self.user

        serializer = PatrimonioSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)


class PatrimonioViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.patrimonio = Patrimonio.objects.create(
            nombre="Patrimonio Test",
            descripcion="Descripción del patrimonio test",
            fecha_llegada="2024-06-01",
            fecha_realizacion="2024-05-01",
            hermandad=self.hermandad,
            valor=1000.00,
        )

    def test_get_patrimonio_list(self):
        url = "/api/v1/patrimonios/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_patrimonio(self):
        data = {
            "nombre": "Nuevo Patrimonio",
            "descripcion": "Descripción de nuevo patrimonio",
            "fecha_llegada": "2024-06-01",
            "fecha_realizacion": "2024-05-01",
            "hermandad": self.hermandad.id,
            "valor": "2000.00",
        }
        url = "/api/v1/patrimonios/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Patrimonio.objects.count(), 2)

    def test_update_patrimonio(self):
        data = {
            "nombre": "Patrimonio Modificado",
            "descripcion": "Descripción modificada",
            "fecha_llegada": "2024-06-01",
            "fecha_realizacion": "2024-05-01",
            "hermandad": self.hermandad.id,
            "valor": "3000.00",
        }
        url = f"/api/v1/patrimonios/{self.patrimonio.id}/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.patrimonio.refresh_from_db()
        self.assertEqual(self.patrimonio.nombre, "Patrimonio Modificado")
        self.assertEqual(self.patrimonio.valor, 3000.00)

    def test_delete_patrimonio(self):
        url = f"/api/v1/patrimonios/{self.patrimonio.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Patrimonio.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "nombre": "Patrimonio Otra Hermandad",
            "descripcion": "Descripción de otra hermandad",
            "fecha_llegada": "2024-06-01",
            "fecha_realizacion": "2024-05-01",
            "hermandad": otra_hermandad.id,
            "valor": "1000.00",
        }
        url = "/api/v1/patrimonios/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Patrimonio.objects.count(), 1)

#TEST DE INVENTARIO

class InventarioModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.inventario = Inventario.objects.create(
            nombre="Inventario Test",
            descripcion="Descripción del inventario test",
            ubicacion="Ubicación Test",
            hermandad=self.hermandad,
        )

    def test_inventario_creation(self):
        self.assertEqual(self.inventario.nombre, "Inventario Test")
        self.assertEqual(self.inventario.descripcion, "Descripción del inventario test")
        self.assertEqual(self.inventario.ubicacion, "Ubicación Test")
        self.assertEqual(self.inventario.hermandad, self.hermandad)

    def test_inventario_str(self):
        self.assertEqual(str(self.inventario), "Inventario Test")

class InventarioSerializerTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "nombre": "Inventario de Prueba",
            "descripcion": "Descripción de prueba",
            "ubicacion": "Ubicación de prueba",
            "hermandad": self.hermandad.id,
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/inventarios/", data, format="json")
        request.user = self.user

        serializer = InventarioSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)


class InventarioViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.inventario = Inventario.objects.create(
            nombre="Inventario Test",
            descripcion="Descripción del inventario test",
            ubicacion="Ubicación Test",
            hermandad=self.hermandad,
        )

    def test_get_inventario_list(self):
        url = "/api/v1/inventarios/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_inventario(self):
        data = {
            "nombre": "Nuevo Inventario",
            "descripcion": "Descripción de nuevo inventario",
            "ubicacion": "Nueva Ubicación",
            "hermandad": self.hermandad.id,
        }
        url = "/api/v1/inventarios/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Inventario.objects.count(), 2)

    def test_update_inventario(self):
        data = {
            "nombre": "Inventario Modificado",
            "descripcion": "Descripción modificada",
            "ubicacion": "Ubicación Modificada",
            "hermandad": self.hermandad.id,
        }
        url = f"/api/v1/inventarios/{self.inventario.id}/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.inventario.refresh_from_db()
        self.assertEqual(self.inventario.nombre, "Inventario Modificado")
        self.assertEqual(self.inventario.descripcion, "Descripción modificada")
        self.assertEqual(self.inventario.ubicacion, "Ubicación Modificada")

    def test_delete_inventario(self):
        url = f"/api/v1/inventarios/{self.inventario.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Inventario.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "nombre": "Inventario Otra Hermandad",
            "descripcion": "Descripción de otra hermandad",
            "ubicacion": "Ubicación de otra hermandad",
            "hermandad": otra_hermandad.id,
        }
        url = "/api/v1/inventarios/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Inventario.objects.count(), 1)

#TEST DE CARTA

class CartaModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        self.carta = Carta.objects.create(
            asunto="Asunto Test",
            cuerpo="Cuerpo de la carta test",
            fecha_envio=datetime.date(2024, 6, 1),
            hermandad=self.hermandad,
        )
        self.carta.destinatarios.add(self.hermano)

    def test_carta_creation(self):
        self.assertEqual(self.carta.asunto, "Asunto Test")
        self.assertEqual(self.carta.cuerpo, "Cuerpo de la carta test")
        self.assertEqual(self.carta.fecha_envio, datetime.date(2024, 6, 1))
        self.assertEqual(self.carta.hermandad, self.hermandad)
        self.assertIn(self.hermano, self.carta.destinatarios.all())

    def test_carta_str(self):
        self.assertEqual(str(self.carta), "Asunto Test")

class CartaSerializerTest(APITestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "asunto": "Asunto de Prueba",
            "cuerpo": "Cuerpo de prueba",
            "fecha_envio": "2024-06-01",
            "hermandad": self.hermandad.id,
            "destinatarios": [self.hermano.id],
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/cartas/", data, format="json")
        request.user = self.user

        serializer = CartaSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)

class CartaViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.carta = Carta.objects.create(
            asunto="Carta Test",
            cuerpo="Cuerpo de la carta test",
            fecha_envio="2024-06-01",
            hermandad=self.hermandad,
        )
        self.carta.destinatarios.add(self.hermano)

    def test_get_carta_list(self):
        url = "/api/v1/cartas/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_carta(self):
        data = {
            "asunto": "Nueva Carta",
            "cuerpo": "Cuerpo de la nueva carta",
            "fecha_envio": "2024-06-01",
            "hermandad": self.hermandad.id,
            "destinatarios": [self.hermano.id],
        }
        url = "/api/v1/cartas/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Carta.objects.count(), 2)

    def test_update_carta(self):
        data = {
            "asunto": "Carta Modificada",
            "cuerpo": "Cuerpo modificado",
            "fecha_envio": "2024-06-01",
            "hermandad": self.hermandad.id,
            "destinatarios": [self.hermano.id],
        }
        url = f"/api/v1/cartas/{self.carta.id}/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.carta.refresh_from_db()
        self.assertEqual(self.carta.asunto, "Carta Modificada")
        self.assertEqual(self.carta.cuerpo, "Cuerpo modificado")

    def test_delete_carta(self):
        url = f"/api/v1/cartas/{self.carta.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Carta.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "asunto": "Carta Otra Hermandad",
            "cuerpo": "Cuerpo de otra hermandad",
            "fecha_envio": "2024-06-01",
            "hermandad": otra_hermandad.id,
            "destinatarios": [self.hermano.id],
        }
        url = "/api/v1/cartas/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Carta.objects.count(), 1)

#TEST DE PAGO

class PagoModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        self.pago = Pago.objects.create(
            nombre="Pago Test",
            descripcion="Descripción del pago test",
            fecha=datetime.date(2024, 6, 1),
            valor=100.00,
            hermandad=self.hermandad,
        )
        self.pago.hermano.add(self.hermano)

    def test_pago_creation(self):
        self.assertEqual(self.pago.nombre, "Pago Test")
        self.assertEqual(self.pago.descripcion, "Descripción del pago test")
        self.assertEqual(self.pago.fecha, datetime.date(2024, 6, 1))
        self.assertEqual(self.pago.valor, 100.00)
        self.assertEqual(self.pago.hermandad, self.hermandad)
        self.assertIn(self.hermano, self.pago.hermano.all())

    def test_pago_str(self):
        self.assertEqual(str(self.pago), "Pago Test")


class PagoSerializerTest(APITestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "nombre": "Pago de Prueba",
            "descripcion": "Descripción de prueba",
            "fecha": "2024-06-01",
            "valor": 150.00,
            "hermandad": self.hermandad.id,
            "hermano": [self.hermano.id],
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/pagos/", data, format="json")
        request.user = self.user

        serializer = PagoSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)

class PagoViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )
        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.pago = Pago.objects.create(
            nombre="Pago Test",
            descripcion="Descripción del pago test",
            fecha="2024-06-01",
            valor=100.00,
            hermandad=self.hermandad,
        )
        self.pago.hermano.add(self.hermano)

    def test_get_pago_list(self):
        url = "/api/v1/pagos/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_pago(self):
        data = {
            "nombre": "Nuevo Pago",
            "descripcion": "Descripción de nuevo pago",
            "fecha": "2024-06-01",
            "valor": 150.00,
            "hermandad": self.hermandad.id,
            "hermano": [self.hermano.id],
        }
        url = "/api/v1/pagos/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pago.objects.count(), 2)

    def test_update_pago(self):
        data = {
            "nombre": "Pago Modificado",
            "descripcion": "Descripción modificada",
            "fecha": "2024-06-01",
            "valor": 200.00,
            "hermandad": self.hermandad.id,
            "hermano": [self.hermano.id],
        }
        url = f"/api/v1/pagos/{self.pago.id}/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.pago.refresh_from_db()
        self.assertEqual(self.pago.nombre, "Pago Modificado")
        self.assertEqual(self.pago.descripcion, "Descripción modificada")
        self.assertEqual(self.pago.valor, 200.00)

    def test_delete_pago(self):
        url = f"/api/v1/pagos/{self.pago.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Pago.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "nombre": "Pago Otra Hermandad",
            "descripcion": "Descripción de otra hermandad",
            "fecha": "2024-06-01",
            "valor": 250.00,
            "hermandad": otra_hermandad.id,
            "hermano": [self.hermano.id],
        }
        url = "/api/v1/pagos/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Pago.objects.count(), 1)

#TEST DE PAPELETA


class PapeletaSitioModelTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )

        self.papeleta = PapeletaSitio.objects.create(
            nombre_evento="Evento Test",
            ubicacion="Ubicación Test",
            puesto="Puesto Test",
            valor=100.00,
            fecha=datetime.date(2024, 6, 1),
            hora=datetime.time(18, 0),
            hermandad=self.hermandad,
        )
        self.papeleta.hermano.add(self.hermano)

    def test_papeleta_creation(self):
        self.assertEqual(self.papeleta.nombre_evento, "Evento Test")
        self.assertEqual(self.papeleta.ubicacion, "Ubicación Test")
        self.assertEqual(self.papeleta.puesto, "Puesto Test")
        self.assertEqual(self.papeleta.valor, 100.00)
        self.assertEqual(self.papeleta.fecha, datetime.date(2024, 6, 1))
        self.assertEqual(self.papeleta.hora, datetime.time(18, 0))
        self.assertEqual(self.papeleta.hermandad, self.hermandad)
        self.assertIn(self.hermano, self.papeleta.hermano.all())

    def test_papeleta_str(self):
        self.assertEqual(str(self.papeleta), "Evento Test")


class PapeletaSitioSerializerTest(TestCase):
    def setUp(self):
        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )

        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )

    def test_valid_serializer_data(self):
        data = {
            "nombre_evento": "Evento Test",
            "ubicacion": "Ubicación Test",
            "puesto": "Puesto Test",
            "valor": 100.00,
            "fecha": "2024-06-01",
            "hora": "18:00:00",
            "hermandad": self.hermandad.id,
            "hermano": [self.hermano.id],
        }

        factory = APIRequestFactory()
        request = factory.post("/api/v1/papeletasitios/", data, format="json")
        request.user = self.user

        serializer = PapeletaSitioSerializer(data=data, context={"request": request})
        is_valid = serializer.is_valid()
        self.assertTrue(is_valid)

class PapeletaSitioViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.hermandad = Hermandad.objects.create(
            nombre="Hermandad Test",
            descripcion="Descripción Test",
            poblacion="Población Test",
            cif="12345678A",
            email="test@hermandad.com",
            telefono="123456789",
        )

        self.hermano = Hermano.objects.create(
            nombre="Juan",
            apellidos="Pérez",
            dni="12345678Z",
            codigo_postal=28001,
            direccion="Calle Mayor, 1",
            email="juan@example.com",
            fecha_nacimiento=datetime.date(1990, 1, 1),
            fecha_alta=datetime.date.today(),
            forma_pago="Transferencia",
            hermandad=self.hermandad,
            iban="ES9121000418450200051332",
            localidad="Madrid",
            numero_hermano=1,
            provincia="Madrid",
            telefono="123456789",
            titular_cuenta_bancaria="Juan Pérez",
        )

        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password",
            rol=User.GESTOR,
            hermandad=self.hermandad,
        )
        self.client.force_authenticate(user=self.user)

        self.papeleta = PapeletaSitio.objects.create(
            nombre_evento="Evento Test",
            ubicacion="Ubicación Test",
            puesto="Puesto Test",
            valor=100.00,
            fecha="2024-06-01",
            hora="18:00:00",
            hermandad=self.hermandad,
        )
        self.papeleta.hermano.add(self.hermano)

    def test_get_papeleta_list(self):
        url = "/api/v1/papeletasitios/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_papeleta(self):
        data = {
            "nombre_evento": "Nuevo Evento",
            "ubicacion": "Nueva Ubicación",
            "puesto": "Nuevo Puesto",
            "valor": 150.00,
            "fecha": "2024-07-01",
            "hora": "19:00:00",
            "hermandad": self.hermandad.id,
            "hermano": [self.hermano.id],
        }
        url = "/api/v1/papeletasitios/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PapeletaSitio.objects.count(), 2)

    def test_update_papeleta(self):
        data = {
            "nombre_evento": "Evento Modificado",
            "ubicacion": "Ubicación Modificada",
            "puesto": "Puesto Modificado",
            "valor": 200.00,
            "fecha": "2024-08-01",
            "hora": "20:00:00",
            "hermandad": self.hermandad.id,
            "hermano": [self.hermano.id],
        }
        url = f"/api/v1/papeletasitios/{self.papeleta.id}/"
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.papeleta.refresh_from_db()
        self.assertEqual(self.papeleta.nombre_evento, "Evento Modificado")
        self.assertEqual(self.papeleta.ubicacion, "Ubicación Modificada")
        self.assertEqual(self.papeleta.puesto, "Puesto Modificado")
        self.assertEqual(self.papeleta.valor, 200.00)

    def test_delete_papeleta(self):
        url = f"/api/v1/papeletasitios/{self.papeleta.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PapeletaSitio.objects.count(), 0)

    def test_invalid_hermandad_permission(self):
        otra_hermandad = Hermandad.objects.create(
            nombre="Otra Hermandad",
            descripcion="Descripción de otra hermandad",
            poblacion="Población de otra hermandad",
            cif="87654321B",
            email="otra@hermandad.com",
            telefono="987654321",
        )
        data = {
            "nombre_evento": "Evento Otra Hermandad",
            "ubicacion": "Ubicación de otra hermandad",
            "puesto": "Puesto de otra hermandad",
            "valor": 250.00,
            "fecha": "2024-09-01",
            "hora": "21:00:00",
            "hermandad": otra_hermandad.id,
            "hermano": [self.hermano.id],
        }
        url = "/api/v1/papeletasitios/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(PapeletaSitio.objects.count(), 1)