from django.db import models
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import AbstractUser
from django.utils.deconstruct import deconstructible
import os


@deconstructible
class PathAndRename:
    def __init__(self, sub_path):
        self.sub_path = sub_path

    def __call__(self, instance, filename):
        path = os.path.join(self.sub_path, str(instance.hermandad.id))
        ext = filename.split(".")[-1]
        filename = "{}.{}".format(filename.split(".")[0], ext)
        return os.path.join(path, filename)


path_and_rename = PathAndRename("documentos")


class Hermandad(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=300)
    poblacion = models.CharField(max_length=100)
    cif = models.CharField(max_length=9)
    email = models.EmailField(max_length=254)
    telefono = models.CharField(max_length=12)  # Prefijo pais + Teléfono

    def __str__(self):
        return self.nombre


class User(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)
    # first_name = models.CharField(max_length=150, blank=False, null=False)
    # last_name = models.CharField(max_length=150, blank=False, null=False)
    hermandad = models.ForeignKey(
        Hermandad, on_delete=models.CASCADE, blank=True, null=True
    )

    def __str__(self):
        return self.username


User._meta.get_field("first_name").null = False
User._meta.get_field("first_name").blank = False
User._meta.get_field("last_name").null = False
User._meta.get_field("last_name").blank = False


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
    numero_hermano = models.PositiveIntegerField(validators=[MaxValueValidator(999999)], unique=True, blank=True, null=True)
    provincia = models.CharField(max_length=50)
    telefono = models.CharField(max_length=12)
    titular_cuenta_bancaria = models.CharField(max_length=150)
    tutor_legal = models.CharField(max_length=150, null=True, blank=True)

    def __str__(self):
        return self.nombre


@receiver(pre_save, sender=Hermano)
def asignar_numero_hermano(sender, instance, **kwargs):
    if instance.numero_hermano is None:
        max_numero = Hermano.objects.filter(hermandad=instance.hermandad).aggregate(
            models.Max("numero_hermano")
        )["numero_hermano__max"]
        instance.numero_hermano = (max_numero or 0) + 1


@receiver(post_delete, sender=Hermano)
def actualizar_numeros(sender, instance, **kwargs):
    hermanos_a_actualizar = Hermano.objects.filter(
        hermandad=instance.hermandad, numero_hermano__gt=instance.numero_hermano
    )
    for hermano in hermanos_a_actualizar:
        hermano.numero_hermano -= 1
        hermano.save()


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
    archivo = models.FileField(upload_to=path_and_rename)
    hermandad = models.ForeignKey(Hermandad, on_delete=models.CASCADE)
    etiquetas = models.ManyToManyField(Etiqueta, related_name="documentos", blank=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre
    
    def delete(self, *args, **kwargs):
        self.archivo.delete()
        super().delete(*args, **kwargs)


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
