from django.urls import path
from . import views

app_name = 'anime'

urlpatterns = [
    path('', views.home, name='home'),
    path('get_anime/<str:name>', views.get_anime, name='get_anime'),
    path('getdata/', views.get_data, name='get_data'),
    path('search', views.search, name='search')
]