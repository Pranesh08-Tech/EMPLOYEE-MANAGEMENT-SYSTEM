from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, dashboard_summary, api_login, api_logout

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/summary/', dashboard_summary, name='dashboard-summary'),
    path('auth/login/', api_login, name='api-login'),
    path('auth/logout/', api_logout, name='api-logout'),
]
