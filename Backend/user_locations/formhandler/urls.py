from django.urls import path
from . import views

urlpatterns = [
    path('', views.frontend_home, name='home'),
    path('submit-data/', views.submit_data, name='submit_data'),
]
