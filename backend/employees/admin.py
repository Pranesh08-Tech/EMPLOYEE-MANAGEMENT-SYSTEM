from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'department',
        'designation',
        'salary',
        'status',
        'joining_date',
        'created_at'
    )
    search_fields = (
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'department',
        'designation'
    )
    list_filter = (
        'department',
        'status',
        'joining_date'
    )
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
