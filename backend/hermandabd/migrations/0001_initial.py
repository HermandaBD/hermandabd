# Generated by Django 5.0.2 on 2024-05-13 18:06

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hermandad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(max_length=300)),
                ('poblacion', models.CharField(max_length=100)),
                ('cif', models.CharField(max_length=9)),
                ('email', models.EmailField(max_length=254)),
                ('telefono', models.CharField(max_length=12)),
            ],
        ),
        migrations.CreateModel(
            name='Evento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=100)),
                ('fecha_inicio', models.DateTimeField()),
                ('fecha_fin', models.DateTimeField()),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
        migrations.CreateModel(
            name='Etiqueta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(max_length=200)),
                ('Hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
        migrations.CreateModel(
            name='Documento',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('ruta', models.CharField(max_length=400)),
                ('etiquetas', models.ManyToManyField(to='hermandabd.etiqueta')),
                ('Hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
        migrations.CreateModel(
            name='Carta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('asunto', models.CharField(max_length=100)),
                ('cuerpo', models.CharField(max_length=1000)),
                ('fecha_envio', models.DateField()),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
        migrations.CreateModel(
            name='Hermano',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
                ('apellidos', models.CharField(max_length=100)),
                ('dni', models.CharField(max_length=9)),
                ('codigo_postal', models.PositiveIntegerField(validators=[django.core.validators.MaxValueValidator(53000)])),
                ('direccion', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('fecha_nacimiento', models.DateField()),
                ('fecha_alta', models.DateField()),
                ('fecha_baja', models.DateField(null=True)),
                ('forma_pago', models.CharField(max_length=50)),
                ('iban', models.CharField(max_length=24)),
                ('localidad', models.CharField(max_length=50)),
                ('numero_hermano', models.PositiveIntegerField(validators=[django.core.validators.MaxValueValidator(999999)])),
                ('provincia', models.CharField(max_length=50)),
                ('telefono', models.CharField(max_length=12)),
                ('titular_cuenta_bancaria', models.CharField(max_length=150)),
                ('tutor_legal', models.CharField(max_length=150, null=True)),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
        migrations.CreateModel(
            name='Inventario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(max_length=500)),
                ('ubicacion', models.CharField(max_length=200)),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
        migrations.CreateModel(
            name='Pago',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(max_length=500)),
                ('fecha', models.DateField()),
                ('valor', models.DecimalField(decimal_places=2, max_digits=6)),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
                ('hermano', models.ManyToManyField(to='hermandabd.hermano')),
            ],
        ),
        migrations.CreateModel(
            name='PapeletaSitio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_evento', models.CharField(max_length=100)),
                ('ubicacion', models.CharField(max_length=200)),
                ('valor', models.DecimalField(decimal_places=2, max_digits=5)),
                ('fecha', models.DateField()),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
                ('hermano', models.ManyToManyField(to='hermandabd.hermano')),
            ],
        ),
        migrations.CreateModel(
            name='Patrimonio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.CharField(max_length=500)),
                ('fecha_llegada', models.DateField()),
                ('fecha_realizacion', models.DateField()),
                ('valor', models.DecimalField(decimal_places=2, max_digits=10)),
                ('hermandad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hermandabd.hermandad')),
            ],
        ),
    ]
