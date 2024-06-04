from django.db import models
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User


User._meta.get_field("email")._unique = True
User._meta.get_field("email").blank = False
User._meta.get_field("email").null = False


class Hermandad(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=300)
    poblacion = models.CharField(max_length=100)
    cif = models.CharField(max_length=9)
    email = models.EmailField(max_length=254)
    telefono = models.CharField(max_length=12)  # Prefijo pais + Teléfono

    def __str__(self):
        return self.nombre


class Hermano(models.Model):
    nombre = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=100)
    dni = models.CharField(max_length=9)
    codigo_postal = models.PositiveIntegerField(validators=[MaxValueValidator(53000)])
    direccion = models.CharField(max_length=100)
    email = models.EmailField(max_length=254)
    fecha_nacimiento = models.DateField()
    fecha_alta = models.DateField()
    fecha_baja = models.DateField(null=True, blank=True)
    forma_pago = models.CharField(max_length=50)
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    iban = models.CharField(max_length=24)
    localidad = models.CharField(max_length=50)
    numero_hermano = models.PositiveIntegerField(validators=[MaxValueValidator(999999)])
    provincia = models.CharField(max_length=50)
    telefono = models.CharField(max_length=12)
    titular_cuenta_bancaria = models.CharField(max_length=150)
    tutor_legal = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.nombre


class Evento(models.Model):
    descripcion = models.CharField(max_length=100)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)

    def __str__(self):
        return self.descripcion


class Etiqueta(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200)
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


class Documento(models.Model):
    nombre = models.CharField(max_length=200)
    ruta = models.CharField(max_length=400)
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    etiquetas = models.ManyToManyField(Etiqueta)

    def __str__(self):
        return self.nombre


class Patrimonio(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    fecha_llegada = models.DateField()
    fecha_realizacion = models.DateField()
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nombre


class Inventario(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    ubicacion = models.CharField(max_length=200)
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)

    def __str__(self):
        return self.nombre


class PapeletaSitio(models.Model):
    nombre_evento = models.CharField(max_length=100)
    ubicacion = models.CharField(max_length=200)
    puesto = models.CharField(max_length=100)
    valor = models.DecimalField(max_digits=5, decimal_places=2)
    fecha = models.DateField()
    hora = models.TimeField()
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    hermano = models.ManyToManyField(Hermano)

    def __str__(self):
        return self.nombre_evento


class Carta(models.Model):
    asunto = models.CharField(max_length=100)
    cuerpo = models.CharField(max_length=1000)
    fecha_envio = models.DateField()
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    destinatarios = models.ManyToManyField(Hermano)

    def __str__(self):
        return self.asunto


class Pago(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    fecha = models.DateField()
    valor = models.DecimalField(max_digits=6, decimal_places=2)
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    hermano = models.ManyToManyField(Hermano)

    def __str__(self):
        return self.nombre
