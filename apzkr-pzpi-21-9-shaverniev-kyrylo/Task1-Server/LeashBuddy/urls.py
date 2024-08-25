from django.urls import path
from django.urls import path, include
from app.views import get_csrf_token
from app.views import UserListView

urlpatterns = [
    
   path('api/', include('LeashBuddy.api_urls')),
   path('api/users/', UserListView.as_view(), name='user-list'),
   path('api/csrf-token/', get_csrf_token),
   
]
