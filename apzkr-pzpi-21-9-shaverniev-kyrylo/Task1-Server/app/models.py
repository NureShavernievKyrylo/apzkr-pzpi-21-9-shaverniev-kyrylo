from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone

# Custom manager for the User model
class UserManager(BaseUserManager):
    # Method to create a regular user
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # Method to create a superuser
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# Custom User model extending AbstractBaseUser
class User(AbstractBaseUser):
    # Role choices for the User model
    ROLE_CHOICES = [
        ('user', 'User'),
        ('wor', 'Worker'),
        ('admin', 'Admin'),
    ]

    # User model fields
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    second_name = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='user')

    # Fields for user status
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Use the custom manager for user creation
    objects = UserManager()

    # Specify the field used for authentication
    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

# Model to represent a pet
class Pet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    weight = models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.breed})"

# Model to represent a diet for a pet
class Diet(models.Model):
    food_type = models.CharField(max_length=100)
    quantity = models.FloatField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.food_type} ({self.quantity}g)"

# Model to represent an exercise activity for a pet
class Exercise(models.Model):
    exercise_type = models.CharField(max_length=100)
    duration = models.DurationField()

    def __str__(self):
        return f"{self.exercise_type} ({self.duration})"

# Model to represent a sensor associated with a pet
class Sensor(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, blank=True, null=True)
    temperature = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sensor for {self.pet.name if self.pet else 'No Pet'} at {self.timestamp}"

# Model to represent the relationship between a pet and its diet
class PetDiet(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    diet = models.ForeignKey(Diet, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"{self.pet.name} diet on {self.date}"

# Model to represent the relationship between a pet and its exercise
class PetExercise(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self):
        return f"{self.pet.name} exercise on {self.date}"

# Model to represent the overall care for a pet, including diet, exercise, and sensor data
class Care(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    diet = models.ForeignKey(Diet, on_delete=models.CASCADE, blank=True, null=True)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, blank=True, null=True)
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, blank=True, null=True)
    care_date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"Care record for {self.pet.name} on {self.care_date}"

# Model to represent notifications sent to users
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.email} at {self.time}"