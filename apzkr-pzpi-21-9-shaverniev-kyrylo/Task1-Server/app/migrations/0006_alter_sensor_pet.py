# Generated by Django 5.0.4 on 2024-08-13 14:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_remove_sensor_location_sensor_pet'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sensor',
            name='pet',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.pet'),
        ),
    ]
