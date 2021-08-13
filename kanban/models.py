from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    def serialize(self):

        return {
            "username": self.username,
            "firstname": self.first_name,
            "lastname": self.last_name
        }

class Course(models.Model):
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="classes")
    students = models.ManyToManyField(User, related_name="courses")
    title = models.CharField(max_length=20, unique=True)
    key = models.CharField(max_length=20)
    progress = models.IntegerField(default=0)
    def serialize(self):

        _students = []
        if self.students:
            _students = [st.serialize() for st in self.students.all()]
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
    grade = models.SmallIntegerField()

    def serialize(self):
        return {
            "id": self.id,
            "questions": [q.serialize() for q in self.questions.all()],
            "status": self.status,
            "title": self.title,
            "grade": self.grade
        }

class Question(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="questions")
    question = models.CharField(max_length=200)
    correct = models.SmallIntegerField()
    answer1 = models.CharField(max_length=200)
    answer2 = models.CharField(max_length=200)
    answer3 = models.CharField(max_length=200, null=True, blank=True)
    answer4 = models.CharField(max_length=200, null=True, blank=True)
    answer5 = models.CharField(max_length=200, null=True, blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "question": self.question,
            "correct": self.correct,
            "answer1": self.answer1,
            "answer2": self.answer2,
            "answer3": self.answer3,
            "answer4": self.answer4,
            "answer5": self.answer5
        }