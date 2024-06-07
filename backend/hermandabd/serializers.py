from django.contrib.auth import authenticate, get_user_model
from djoser.conf import settings
from djoser.serializers import TokenCreateSerializer, UserSerializer
from rest_framework import serializers
from .models import *


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
        )


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


class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = "__all__"


class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = "__all__"


class DocumentoSerializer(serializers.ModelSerializer):
    hermandad = serializers.PrimaryKeyRelatedField(queryset=Hermandad.objects.all())
    etiquetas = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Etiqueta.objects.all(), required=False
    )

    class Meta:
        model = Documento
        fields = ["id", "nombre", "archivo", "hermandad", "etiquetas", "fecha_subida"]


class PatrimonioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patrimonio
        fields = "__all__"


class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = "__all__"


class PapeletaSitioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PapeletaSitio
        fields = "__all__"


class CartaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carta
        fields = "__all__"


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = "__all__"
