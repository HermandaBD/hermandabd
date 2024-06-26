from django.contrib.auth import authenticate, get_user_model
from djoser.conf import settings
from djoser.serializers import (
    TokenCreateSerializer,
    UserSerializer,
    UserCreateSerializer,
)
from rest_framework import serializers
from .models import *
import re

User = get_user_model()


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "hermandad",
            "rol",
            "is_staff",
            "is_superuser",
        )

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad and value is not None:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un usuario a esta hermandad."
            )
        return value


class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "username",
            "password",
            "email",
            "rol",
            "first_name",
            "last_name",
            "hermandad",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = super().create(validated_data)
        return user


class CustomTokenCreateSerializer(TokenCreateSerializer):

    def validate(self, attrs):
        password = attrs.get("password")
        params = {settings.LOGIN_FIELD: attrs.get(settings.LOGIN_FIELD)}
        self.user = authenticate(
            request=self.context.get("request"), **params, password=password
        )
        if not self.user:
            self.user = User.objects.filter(**params).first()
            if self.user and not self.user.check_password(password):
                self.fail("invalid_credentials")
        if self.user:  # and self.user.is_active:
            return attrs
        self.fail("invalid_credentials")


class HermandadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hermandad
        fields = "__all__"


class HermanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hermano
        fields = "__all__"

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un hermano a esta hermandad."
            )
        return value

    def validate_dni(self, value):
        REGEXP = r"^\d{8}[A-Z]$"
        DIGITO_CONTROL = "TRWAGMYFPDXBNJZSQVHLCKE"
        INVALIDOS = {"00000000T", "00000001R", "99999999R"}

        if value in INVALIDOS:
            raise serializers.ValidationError("El DNI insertado es inválido.")

        if not re.match(REGEXP, value):
            raise serializers.ValidationError("El formato del DNI no es correcto.")

        numero = int(value[:8])
        letra = value[8]
        if letra != DIGITO_CONTROL[numero % 23]:
            raise serializers.ValidationError("La letra del DNI no coincide.")

        return value


class EventoSerializer(serializers.ModelSerializer):
    start = serializers.DateTimeField(source='fecha_inicio')
    end = serializers.DateTimeField(source='fecha_fin')
    title = serializers.CharField(source='descripcion')
    class Meta:
        model = Evento
        fields = ['id', 'title', 'start', 'end', 'hermandad']

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un envento a esta hermandad."
            )
        return value
    
"""     def validate_fechas(self, data):
        
        Verifica que fecha_fin no sea anterior a fecha_inicio.
        
        fecha_inicio = data.start
        fecha_fin = data.end

        if fecha_fin < fecha_inicio:
            raise serializers.ValidationError(
                "La fecha de fin no puede ser anterior a la fecha de inicio."
            )

        return data """


class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = "__all__"

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar una etiqueta a esta hermandad."
            )
        return value


class DocumentoSerializer(serializers.ModelSerializer):
    hermandad = serializers.PrimaryKeyRelatedField(queryset=Hermandad.objects.all())
    etiquetas = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Etiqueta.objects.all(), required=False
    )

    class Meta:
        model = Documento
        fields = [
            "id",
            "nombre",
            "archivo",
            "mime_type",
            "hermandad",
            "etiquetas",
            "fecha_subida",
        ]

    def get_archivo_url(self, obj):
        request = self.context.get("request")
        archivo_url = obj.archivo.url
        return request.build_absolute_url(archivo_url)

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un documento a esta hermandad."
            )
        return value


class PatrimonioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patrimonio
        fields = "__all__"

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un patrimonio a esta hermandad."
            )
        return value


class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = "__all__"

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un inventario a esta hermandad."
            )
        return value


class PapeletaSitioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PapeletaSitio
        fields = "__all__"

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar una papeleta a esta hermandad."
            )
        return value


class CartaSerializer(serializers.ModelSerializer):
    """ destinatarios = HermanoSerializer(many=True) """

    class Meta:
        model = Carta
        fields = ["id", "asunto", "cuerpo", "fecha_envio", "hermandad", "destinatarios"]

    """ def create(self, validated_data):
        destinatarios_data = validated_data.pop("destinatarios")
        carta = Carta.objects.create(**validated_data)
        for hermano_data in destinatarios_data:
            hermano = Hermano.objects.get(id=hermano_data["id"])
            carta.destinatarios.add(hermano)
        return carta """

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar una carta a esta hermandad."
            )
        return value


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = "__all__"

    def validate_hermandad(self, value):
        user = self.context["request"].user
        if not user.is_superuser and value != user.hermandad:
            raise serializers.ValidationError(
                "No tiene permiso para agregar un pago a esta hermandad."
            )
        return value
