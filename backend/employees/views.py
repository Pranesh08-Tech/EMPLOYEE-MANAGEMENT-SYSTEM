from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from django.contrib.auth import authenticate, login, logout
from .models import Employee
from .serializers import EmployeeSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    CRUD ViewSet for Employee model:
    - GET    /api/employees/      (List employees, supports ?search=&department=&status=)
    - POST   /api/employees/      (Create employee)
    - GET    /api/employees/{id}/ (Retrieve employee details)
    - PUT    /api/employees/{id}/ (Update all employee fields)
    - PATCH  /api/employees/{id}/ (Partial update employee)
    - DELETE /api/employees/{id}/ (Delete employee)
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'status']
    search_fields = ['employee_id', 'first_name', 'last_name', 'email', 'phone', 'designation', 'department']
    ordering_fields = ['joining_date', 'salary', 'first_name', 'last_name', 'employee_id']
    ordering = ['-created_at']

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        emp_name = f"{instance.first_name} {instance.last_name}"
        emp_id = instance.employee_id
        self.perform_destroy(instance)
        return Response(
            {"message": f"Employee '{emp_name}' ({emp_id}) successfully deleted."},
            status=status.HTTP_200_OK
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_summary(request):
    """
    Returns high-level employee counts, active/inactive metrics,
    department distribution summary, and top 5 recent hires.
    """
    total = Employee.objects.count()
    active = Employee.objects.filter(status='Active').count()
    inactive = total - active

    # Department breakdown
    dept_qs = Employee.objects.values('department').annotate(count=Count('department'))
    department_summary = {item['department']: item['count'] for item in dept_qs}

    # 5 Most recent employees
    recent_qs = Employee.objects.order_by('-joining_date')[:5]
    recent = EmployeeSerializer(recent_qs, many=True).data

    return Response({
        'total': total,
        'active': active,
        'inactive': inactive,
        'departmentSummary': department_summary,
        'recent': recent
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    """
    Basic authentication endpoint for college demonstration
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Allow demo test user or standard django auth
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({
            'token': f'session-token-{user.id}',
            'user': {
                'id': user.id,
                'username': user.username,
                'name': user.get_full_name() or user.username,
                'role': 'SuperAdmin' if user.is_superuser else 'Staff',
                'email': user.email
            }
        })

    # Demo fallback for college viva
    if (username == 'admin' and password == 'admin123') or (username == 'manager' and password == 'password'):
        return Response({
            'token': 'demo-token-12345',
            'user': {
                'id': 1,
                'username': username,
                'name': 'System Administrator' if username == 'admin' else 'Department Manager',
                'role': 'SuperAdmin' if username == 'admin' else 'Manager',
                'email': f'{username}@ems-college.org'
            }
        })

    return Response(
        {'error': 'Invalid credentials. Hint: use admin / admin123'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
