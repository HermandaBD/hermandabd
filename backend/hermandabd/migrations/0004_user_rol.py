# Generated by Django 5.0.2 on 2024-06-11 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hermandabd', '0003_alter_hermano_numero_hermano'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='rol',
            field=models.CharField(blank=True, choices=[('GS', 'Gestor'), ('SE', 'Secretario'), ('MA', 'Mayordomo')], max_length=2, null=True),
        ),
    ]
