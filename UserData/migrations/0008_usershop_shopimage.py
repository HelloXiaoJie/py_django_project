# Generated by Django 3.0.4 on 2020-11-16 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserData', '0007_auto_20201116_0014'),
    ]

    operations = [
        migrations.AddField(
            model_name='usershop',
            name='shopImage',
            field=models.ImageField(null=True, upload_to='shopImages'),
        ),
    ]
