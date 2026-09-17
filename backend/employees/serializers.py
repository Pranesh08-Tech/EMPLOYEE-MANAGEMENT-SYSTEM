from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id',
            'employee_id',
            'first_name',
            'last_name',
            'email',
            'phone',
            'department',
            'designation',
            'salary',
            'joining_date',
            'address',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_salary(self, value):
        if value <= 0:
            raise serializers.ValidationError("Salary must accept only valid positive values greater than 0.")
        return value

    def validate_phone(self, value):
        cleaned = value.strip()
        digits = [c for c in cleaned if c.isdigit()]
        if len(digits) < 7:
            raise serializers.ValidationError("Phone number must contain at least 7 numeric digits.")
        return cleaned

    def validate_employee_id(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Employee ID cannot be empty.")
        # Check uniqueness during update
        instance = self.instance
        if Employee.objects.filter(employee_id__iexact=cleaned).exclude(pk=instance.pk if instance else None).exists():
            raise serializers.ValidationError("An employee with this Employee ID already exists.")
        return cleaned

    def validate_email(self, value):
        cleaned = value.strip().lower()
        instance = self.instance
        if Employee.objects.filter(email__iexact=cleaned).exclude(pk=instance.pk if instance else None).exists():
            raise serializers.ValidationError("An employee with this email address already exists.")
        return cleaned
