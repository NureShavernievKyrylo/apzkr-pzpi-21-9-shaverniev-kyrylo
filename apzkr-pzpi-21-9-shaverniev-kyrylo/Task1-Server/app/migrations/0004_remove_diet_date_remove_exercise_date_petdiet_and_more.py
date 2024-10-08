# Generated by Django 5.0.4 on 2024-08-10 19:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_alter_care_care_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='diet',
            name='date',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='date',
        ),
        migrations.CreateModel(
            name='PetDiet',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('diet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.diet')),
                ('pet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.pet')),
            ],
        ),
        migrations.CreateModel(
            name='PetExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.exercise')),
                ('pet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.pet')),
            ],
        ),
    ]
