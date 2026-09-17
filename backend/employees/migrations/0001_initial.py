import django.core.validators
from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_id', models.CharField(db_index=True, help_text='Unique organizational identifier for the employee', max_length=20, unique=True)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(db_index=True, help_text='Unique corporate email address', max_length=254, unique=True)),
                ('phone', models.CharField(max_length=25)),
                ('department', models.CharField(max_length=100)),
                ('designation', models.CharField(max_length=100)),
                ('salary', models.DecimalField(decimal_places=2, help_text='Positive annual base compensation', max_digits=12, validators=[django.core.validators.MinValueValidator(0.01)])),
                ('joining_date', models.DateField()),
                ('address', models.TextField(blank=True, default='')),
                ('status', models.CharField(choices=[('Active', 'Active'), ('Inactive', 'Inactive')], default='Active', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Employee',
                'verbose_name_plural': 'Employees',
                'ordering': ['-created_at'],
            },
        ),
    ]
