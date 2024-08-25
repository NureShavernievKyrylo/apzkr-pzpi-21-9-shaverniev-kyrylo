from datetime import datetime
from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from rest_framework.views import APIView
from rest_framework import status, permissions, viewsets, generics
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from rest_framework.exceptions import ValidationError
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from django.db.models import Avg, DurationField, ExpressionWrapper, F
from .serializers import *
from .database_backup import backup_database


# ====================
# CSRF Token Handling
# ====================

# View to ensure the CSRF token is included in the cookies
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'csrfToken': request.COOKIES['csrftoken']})


# ====================
# User Authentication Views
# ====================

# View to handle user registration
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to handle user login
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            user_data = UserSerializer(user).data
            print("User login successful. User data:", user_data)
            return Response({'user': user_data}, status=status.HTTP_200_OK)
        print("User login failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View to handle user logout
class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

# View to retrieve the current user's details
class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
# View to list all users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

# View to retrieve detailed information about a user and their pets
class UserDetailView(RetrieveAPIView):
    queryset = User.objects.prefetch_related('pet_set').all()
    serializer_class = UserDetailSerializer

# Custom permission to allow access only to the owner of the pet or an admin
class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow access to admin users or the owner of the diet record
        return request.user.role == 'admin' or obj.pet.user == request.user


# ====================
# CRUD Operations for Diet
# ====================

# View to list and create Diet records
class DietListCreate(generics.ListCreateAPIView):
    queryset = Diet.objects.all()
    serializer_class = DietSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except ValidationError as e:
            print(f'Validation Error: {e}')
            raise

# View to retrieve, update, and delete Diet records
class DietRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Diet.objects.all()
    serializer_class = DietSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        try:
            print("Received data for update:", self.request.data)
            serializer.save()
        except serializers.ValidationError as e:
            print(f'Validation Error: {e}')
            raise

    def perform_destroy(self, instance):
        instance.delete()
        

# ====================
# CRUD Operations for Pets
# ====================

# View to list and create Pet records
class PetListCreate(generics.ListCreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# View to retrieve, update, and delete Pet records
class PetRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

# View to retrieve detailed information about a pet and its related care data
class PetDetailView(generics.RetrieveAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetDetailSerializer
    permission_classes = [IsAuthenticated]

# View to list pets based on user role
class PetListView(generics.ListAPIView):
    serializer_class = PetListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'user':
            return Pet.objects.filter(user=user)
        return Pet.objects.all()


# ====================
# CRUD Operations for Exercises
# ====================

# View to list and create Exercise records
class ExerciseListCreate(generics.ListCreateAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# View to retrieve, update, and delete Exercise records
class ExerciseRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()        

# ====================
# CRUD Operations for Sensors
# ====================

# View to list and create Sensor records
class SensorListCreate(generics.ListCreateAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# View to retrieve, update, and delete Sensor records
class SensorRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

# ==========================
# Pet-Diet Relationship Views
# ==========================

# View to list and create PetDiet records
class PetDietListCreate(generics.ListCreateAPIView):
    queryset = PetDiet.objects.all()
    serializer_class = PetDietSerializer
    #permission_classes = [permissions.IsAuthenticated]

# View to retrieve, update, and delete PetDiet records
class PetDietRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = PetDiet.objects.all()
    serializer_class = PetDietSerializer
    #permission_classes = [permissions.IsAuthenticated]

# View to list PetDiet records filtered by Pet ID
class PetDietListView(generics.ListAPIView):
    serializer_class = PetDietSerializer

    def get_queryset(self):
        pet_id = self.kwargs['pk']
        return PetDiet.objects.filter(pet_id=pet_id).order_by('date')

# View to calculate the average diet quantity for a specific pet
class PetDietAverageView(APIView):
    def get(self, request, pk):
        try:
            average_diet = PetDiet.objects.filter(pet_id=pk).aggregate(Avg('quantity'))
            if average_diet['quantity__avg'] is None:
                return Response({'average_diet': 0}, status=status.HTTP_200_OK)  # Default to 0 if no records
            return Response({'average_diet': average_diet['quantity__avg']}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View to list PetDiet records filtered by Diet ID
class PetDietByDietView(generics.ListAPIView):
    serializer_class = PetDietSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        diet_id = self.request.query_params.get('diet', None)
        if diet_id:
            return PetDiet.objects.filter(diet_id=diet_id).order_by('date')
        return PetDiet.objects.none()  # Return an empty queryset if diet_id is not provided
    

# ============================
# Pet-Exercise Relationship Views
# ============================

# View to list and create PetExercise records
class PetExerciseListCreate(generics.ListCreateAPIView):
    queryset = PetExercise.objects.all()
    serializer_class = PetExerciseSerializer
    #permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# View to retrieve, update, and delete PetExercise records
class PetExerciseRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = PetExercise.objects.all()
    serializer_class = PetExerciseSerializer
    #permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

# View to list PetExercise records filtered by Pet ID
class PetExerciseListView(generics.ListAPIView):
    serializer_class = PetExerciseSerializer

    def get_queryset(self):
        pet_id = self.kwargs['pk']
        return PetExercise.objects.filter(pet_id=pet_id).order_by('date')

# View to calculate the average exercise duration for a specific pet
class PetExerciseAverageView(APIView):
    def get(self, request, pk):
        average_exercise = PetExercise.objects.filter(pet_id=pk).aggregate(
            avg_duration=Avg(ExpressionWrapper(F('exercise__duration'), output_field=DurationField()))
        )
        return Response({'average_exercise': average_exercise['avg_duration'].total_seconds() / 60 if average_exercise['avg_duration'] else None})

# View to list PetExercise records filtered by Exercise ID
class PetExerciseListByExerciseView(generics.ListAPIView):
    serializer_class = PetExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        exercise_id = self.request.query_params.get('exercise', None)
        if exercise_id:
            return PetExercise.objects.filter(exercise_id=exercise_id).order_by('date')
        return PetExercise.objects.none()  # Return an empty queryset if no exercise ID is provided
    
# View to retrieve detailed information about a specific PetExercise record
class PetExerciseDetailView(generics.RetrieveAPIView):
    queryset = PetExercise.objects.all()
    serializer_class = PetExerciseDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


# ====================
# Database Backup View
# ====================

# View to handle the backup of the database
class BackupDatabaseAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Assuming you don't want role-based restrictions at the moment, so no check for admin role
        password = request.data.get('password')
        if not password:
            return Response({'message': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            backup_file = backup_database(
                host='localhost',
                port='5432',
                database='LeashBuddy',  # Replace with your actual database name
                user='postgres',      # Replace with your actual database user
                password=password
            )
            return Response({'message': 'Backup process initiated successfully.', 'backup_file': backup_file}, status=status.HTTP_200_OK)
        except RuntimeError as e:
            return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)