from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
import logging
from rest_framework.views import APIView, View
from rest_framework import status, permissions, viewsets, generics
from rest_framework.response import Response

# =======================
# User-related Serializers
# =======================

# Serializer for User model to handle standard fields
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'second_name', 'phone', 'address', 'role']

# Serializer for user registration, includes password handling
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'second_name', 'phone', 'address', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Override create method to handle password hashing
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            second_name=validated_data.get('second_name', ''),
            phone=validated_data.get('phone', ''),
            address=validated_data.get('address', ''),
            role=validated_data.get('role', 'user'),
        )
        return user

# Serializer for user login, validating email and password
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            # Use the authenticate method, and ensure email is used as username
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if user is None:
                raise serializers.ValidationError('Invalid email or password.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')

        data['user'] = user
        return data


# ====================
# Pet-related Serializers
# ====================

# Serializer for the Pet model with related user
class PetSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Pet
        fields = ['id', 'name', 'breed', 'age', 'gender', 'weight', 'user']
        

# Serializer to display user details along with their pets
class UserDetailSerializer(serializers.ModelSerializer):
    pets = PetSerializer(many=True, read_only=True, source='pet_set')  # Try using pet_set as the source

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'second_name', 'phone', 'address', 'role', 'pets']

# Serializer to handle a list of pets with basic fields
class PetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['id', 'name', 'breed', 'age', 'gender', 'weight']

# Serializer to handle detailed pet care information
class PetDetailSerializer(serializers.ModelSerializer):
    care_date = serializers.DateField()
    feeding_quantity = serializers.FloatField(source='diet.quantity', required=False)
    exercise_duration = serializers.DurationField(source='exercise.duration', required=False)

    class Meta:
        model = Care
        fields = ['care_date', 'feeding_quantity', 'exercise_duration']

# ====================
# Diet-related Serializers
# ====================

# Serializer for the Diet model with related pet
class DietSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)

    class Meta:
        model = Diet
        fields = ['id',  'food_type', 'quantity', 'notes', 'pet']

# Serializer to represent the relationship between a pet and its diet
class PetDietSerializer(serializers.ModelSerializer):
    quantity = serializers.SerializerMethodField()
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    diet_food_type = serializers.CharField(source='diet.food_type', read_only=True)

    class Meta:
        model = PetDiet
        fields = ['id', 'pet', 'diet', 'date', 'quantity', 'pet_name', 'diet_food_type']

    def get_quantity(self, obj):
        return obj.diet.quantity

# View to list pet diet records filtered by diet ID
class PetDietListView(generics.ListAPIView):
    serializer_class = PetDietSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        diet_id = self.request.query_params.get('diet', None)
        if diet_id:
            return PetDiet.objects.filter(diet_id=diet_id).order_by('date')
        return PetDiet.objects.none()  # Return an empty queryset if diet_id is not provided

# =======================
# Exercise-related Serializers
# =======================

# Serializer for the Exercise model with related pet
class ExerciseSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)

    class Meta:
        model = Exercise
        fields = ['id',  'exercise_type', 'duration', 'pet']

# Serializer to represent the relationship between a pet and its exercise
class PetExerciseSerializer(serializers.ModelSerializer):
    exercise_type = serializers.CharField(source='exercise.exercise_type')
    duration = serializers.DurationField(source='exercise.duration')
    
    class Meta:
        model = PetExercise
        fields = ['id', 'pet', 'exercise', 'exercise_type', 'duration', 'date']

# Serializer to display detailed pet exercise information
class PetExerciseDetailSerializer(serializers.ModelSerializer):
    pet_name = serializers.CharField(source='pet.name', read_only=True)
    exercise_type = serializers.CharField(source='exercise.exercise_type', read_only=True)

    class Meta:
        model = PetExercise
        fields = ['id', 'pet_name', 'exercise_type', 'date', 'duration']

# =========================
# Sensor-related Serializers
# =========================

# Serializer for the Sensor model with related pet
class SensorSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)

    class Meta:
        model = Sensor
        fields = ['id', 'pet', 'temperature', 'timestamp']

# =========================
# Care-related Serializers
# =========================

# Serializer for the Care model with nested serializers for related models
class CareSerializer(serializers.ModelSerializer):
    pet = serializers.PrimaryKeyRelatedField(queryset=Pet.objects.all())
    diet = serializers.PrimaryKeyRelatedField(queryset=Diet.objects.all(), allow_null=True, required=False)
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all(), allow_null=True, required=False)
    sensor = serializers.PrimaryKeyRelatedField(queryset=Sensor.objects.all(), allow_null=True, required=False)
    care_date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Care
        fields = ['id', 'pet', 'diet', 'exercise', 'sensor', 'care_date']

# Serializer to display detailed care information with nested details for diet, exercise, and sensor
class CareDetailSerializer(serializers.ModelSerializer):
    pet = PetSerializer()  # Use nested serializer for full details
    diet = DietSerializer(allow_null=True, required=False)
    exercise = ExerciseSerializer(allow_null=True, required=False)
    sensor = SensorSerializer(allow_null=True, required=False)
    care_date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Care
        fields = ['id', 'pet', 'diet', 'exercise', 'sensor', 'care_date']

# API view to get pet care data, including diet quantity and exercise duration over time
class PetCareDataView(APIView):
    def get(self, request, pk):
        care_records = Care.objects.filter(pet_id=pk).order_by('care_date')
        data = [
            {
                'date': care.care_date,
                'diet_quantity': care.diet.quantity if care.diet else None,
                'exercise_duration': care.exercise.duration if care.exercise else None,
            }
            for care in care_records
        ]
        return Response(data)

# =============================
# Notification-related Serializers
# =============================

# Serializer for the Notification model with related user
class NotificationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'user', 'text', 'time']