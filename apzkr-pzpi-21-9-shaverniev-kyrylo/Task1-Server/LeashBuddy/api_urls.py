from django.urls import path
from app.views import *

urlpatterns = [
    path('register/', UserRegister.as_view(), name='register'),
    path('login/', UserLogin.as_view(), name='login'),
    path('logout/', UserLogout.as_view(), name='logout'),
    path('user/', UserView.as_view(), name='user'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    
    path('diets/', DietListCreate.as_view(), name='diet-list-create'),
    path('diets/<int:pk>/', DietRetrieveUpdateDestroy.as_view(), name='diet-retrieve-update-destroy'),
    
    path('pets/', PetListCreate.as_view(), name='pet-list-create'),
    path('pets/<int:pk>/', PetRetrieveUpdateDestroy.as_view(), name='pet-retrieve-update-destroy'),
    
    path('exercises/', ExerciseListCreate.as_view(), name='exercise-list-create'),
    path('exercises/<int:pk>/', ExerciseRetrieveUpdateDestroy.as_view(), name='exercise-retrieve-update-destroy'),

    path('exercises/<int:pk>/details/', PetExerciseDetailView.as_view(), name='exercise-detail'),
    
    path('sensors/', SensorListCreate.as_view(), name='sensor-list-create'),
    path('sensors/<int:pk>/', SensorRetrieveUpdateDestroy.as_view(), name='sensor-retrieve-update-destroy'),
    
    

    path('pets/<int:pk>/', PetDetailView.as_view(), name='pet-detail'),
    path('pets/<int:pk>/care-data/', PetCareDataView.as_view(), name='pet-care-data'),

    path('pet-diets/', PetDietListCreate.as_view(), name='pet-diet-list-create'),
    path('pet-diets/<int:pk>/', PetDietRetrieveUpdateDestroy.as_view(), name='pet-diet-detail'),
    path('pets/<int:pk>/diets/', PetDietListView.as_view(), name='pet-diet-list'),
    path('pet-exercises/', PetExerciseListCreate.as_view(), name='pet-exercise-list-create'),
    path('pet-exercises/<int:pk>/', PetExerciseRetrieveUpdateDestroy.as_view(), name='pet-exercise-detail'),
    path('pets/<int:pk>/exercises/', PetExerciseListView.as_view(), name='pet-exercise-list'),

    path('pets/<int:pk>/average-diet/', PetDietAverageView.as_view(), name='pet-diet-average'),
    path('pets/<int:pk>/average-exercise/', PetExerciseAverageView.as_view(), name='pet-exercise-average'),
    path('pets-list/', PetListView.as_view(), name='pet-list'),

    path('pet-diets/by-diet/', PetDietByDietView.as_view(), name='pet-diet-by-diet'),
    path('pet-exercises/by-exercise/', PetExerciseListByExerciseView.as_view(), name='pet-exercise-list-by-exercise'),

    path('backup/', BackupDatabaseAPIView.as_view(), name='backup-database'),
]