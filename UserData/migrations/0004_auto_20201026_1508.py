# Generated by Django 3.0.4 on 2020-10-26 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserData', '0003_auto_20201022_1723'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userdatamodels',
            name='useremail',
            field=models.EmailField(max_length=254, null=True),
        ),
    ]
