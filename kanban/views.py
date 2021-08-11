import json
from django.contrib.auth import authenticate, get_user, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import IntegrityError
from django.http.response import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .models import *

def index(request):
    if request.user.is_authenticated:
        return render(request, "kanban/dashboard.html", {
        })
    return HttpResponseRedirect(reverse("login"))

def dashboard(request):
    return render(request, "kanban/dashboard.html", {
    })

def findcourse(request):
    return render(request, "kanban/findcourse.html")

def createcourse(request):
    if request.method == "POST":
        title = request.POST["title"]
        key = request.POST["accesskey"]
        print(title)
        if title == "":
            return render(request, "kanban/createcourse.html", {
                "message": "*Invalid title."
            })
        elif key == "":
            return render(request, "kanban/createcourse.html", {
                "message": "*Invalid key."
            })
        else:
            try: 
                course = Course(
                    teacher = request.user,
                    title = title,
                    key = key,
                    progress = 0
                )
                course.save()
            except:
                return render(request, "kanban/createcourse.html", {
                    "message": "*This course name is alredy in use."
                })
            return HttpResponseRedirect(reverse('courses', kwargs={"course":title} ))

    return render(request, "kanban/createcourse.html")

def courses(request, course):
    return render(request, "kanban/course.html", {
        "course": course,
    })

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))
    
def login_view(request):
    if request.user.is_authenticated:
        return render(request, "kanban/dashboard.html")
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "kanban/login.html", {
                "message": "*Invalid username and/or password."
            })
    else:
        return render(request, "kanban/login.html")

def register(request):
    if request.user.is_authenticated:
        return render(request, "kanban/dashboard.html", {
        })
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "kanban/register.html", {
                "message": "*Passwords must match."
            })
        elif username == "":
            return render(request, "kanban/register.html", {
                "message": "*Invalid username."
            })
        elif password == "":
            return render(request, "kanban/register.html", {
                "message": "*Invalid password."
            })
        elif email == "":
            return render(request, "kanban/register.html", {
                "message": "*Invalid Email."
            })
        # Attempt to create new user
        try:
            _user = User.objects.create_user(username, email, password)
            _user.save()
        except IntegrityError:
            return render(request, "kanban/register.html", {
                "message": "*Username already taken."
            })
        login(request, _user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "kanban/register.html")

def get_courses(request):
    _user = get_user(request)
    if request.method == "GET" and _user.is_authenticated:
        _classes = [cur.serialize() for cur in _user.classes.all()]
        _courses = [cur.serialize() for cur in _user.courses.all()]
        return JsonResponse({ "classes": _classes, "courses": _courses }, safe=False, status = 200)
    
    return JsonResponse({"error": "Something went wrong."}, status = 500)

def get_all_courses(request):
    if request.method == "GET":
        _courses = [cur.serialize() for cur in Course.objects.all().order_by('title')]
        return JsonResponse({ "courses": _courses }, safe=False, status = 200)
    return JsonResponse({"error": "Something went wrong."}, status = 500)

def get_course_content(request, course):
    _user = get_user(request)
    if request.method == "GET" and _user.is_authenticated:
        _course = Course.objects.get(title = course)
        _cards = [q.serialize() for q in _course.cards.all()]
        return JsonResponse({ "amiteacher": _user.username == _course.teacher.username, "course": _course.serialize(), "cards": _cards }, safe=False, status = 200)
    return JsonResponse({"error": "Something went wrong."}, status = 500)

@csrf_exempt
def join_course(request):
    if request.method == "POST":
        accesskey = request.POST["accesskey"]
        courseid = request.POST['courseid']
        user = request.user
        course = Course.objects.get(pk=courseid)
        if accesskey == course.key:
            course.students.add(user)
            return HttpResponseRedirect(reverse('courses', kwargs={"course": course.title} ))

    return render(request, "kanban/findcourse.html", {
        "message": "*Invalid key"
    })

def update_card(request):
    if request.method == "POST":
        
        return JsonResponse({ }, safe=False, status = 200)

    return JsonResponse({"error": "Something went wrong."}, status = 500)

def create_card(request):
    if request.method == "POST":
        data = request.POST.get('data')
        data = json.loads(data)
        _course = Course.objects.get(id=data.courseid)
        _card = Card(
            course =_course,
            user = request.user,
            status = data.status,
            title = data.title,
            grade = 0
        )
        _card.save()
        for q in data.questions:
            _q = Question(
                card = _card,
                question = q.question,
                correct = q.correct,
                answer1 = q.answer1,
                answer2 = q.answer2,
                answer3 = q.answer3,
                answer4 = q.answer4,
                answer5 = q.answer5
            )
            _q.save()


        # loop questions
            # loop anwers
            # register question
        # create card(course, studdenttask, status, title, date, grade)

def add_question(request, cardid):
    if request.method == "POST":
        data = request.POST.get('data')
        data = json.loads(data)

        # get Card.objects(key=cardid)
        # create question(card, question, correct, answer1, answer5)
        # question.save()