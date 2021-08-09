from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    def serialize(self):

        return {
            "username": self.username,
        }

class Course(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="classes")
    student = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="courses")
    title = models.CharField(max_length=20, unique=True)
    key = models.CharField(max_length=20)
    progress = models.IntegerField(default=0)
    def serialize(self):
        _students = []
        if(self.student != None):
            _students = [st.student for st in self.student.all()]

        return {
            "id": self.id,
            "teacher": self.teacher.serialize(),
            "students": _students,
            "title": self.title,
            "progress": self.progress
        }

class Card(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="cards")
    studenttask = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    status = models.CharField(max_length=20)
    title = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=False)
    grade = models.SmallIntegerField()

class Question(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="questions")
    question = models.CharField(max_length=200)
    correct = models.SmallIntegerField()
    answer1 = models.CharField(max_length=200)
    answer2 = models.CharField(max_length=200)
    answer3 = models.CharField(max_length=200, null=True, blank=True)
    answer4 = models.CharField(max_length=200, null=True, blank=True)
    answer5 = models.CharField(max_length=200, null=True, blank=True)