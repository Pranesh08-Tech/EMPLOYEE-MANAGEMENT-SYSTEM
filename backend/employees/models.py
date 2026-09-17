from django.db import models
from django.core.validators import MinValueValidator, RegexValidator

class Employee(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Inactive', 'Inactive'),
    ]

    phone_validator = RegexValidator(
        regex=r'^\+?1?\d{7,15}$',
        message="Phone number must be entered in format: '+999999999'. Up to 15 digits allowed."
    )

    employee_id = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text="Unique organizational identifier for the employee"
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(
        unique=True,
        db_index=True,
        help_text="Unique corporate email address"
    )
    phone = models.CharField(max_length=25)
    department = models.CharField(max_length=100)
    designation = models.CharField(max_length=100)
    salary = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Positive annual base compensation"
    )
    joining_date = models.DateField()
    address = models.TextField(blank=True, default='')
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='Active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"
