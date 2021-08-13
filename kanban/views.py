import json
from django.contrib.auth import authenticate, get_user, login, logout
from django.contrib.auth.decorators import login_required
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
        _cardsTeacher = [q.serialize() for q in _course.cards.filter(studenttask = _course.teacher)]
        _cardsStudent = [q.serialize() for q in _course.cards.filter(studenttask = _user)]
        return JsonResponse({
            "amiteacher": _user.username == _course.teacher.username,
            "course": _course.serialize(),
            "cardsTeacher": _cardsTeacher,
            "cardsStudent": _cardsStudent,
            }, safe=False, status = 200)
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

@csrf_exempt
def delete_card(request):
    if request.method == "POST":
        data = request.body
        data = json.loads(data)
        try:
            print(data['cardid'])
            card = Card.objects.get(id = data['cardid'])
            print(card)
            card.delete()
            return JsonResponse({"Status": "Ok"}, status = 200)
        except:
            return JsonResponse({"error": "Something went wrong."}, status = 500)
    return JsonResponse({"error": "Something went wrong."}, status = 500)

@csrf_exempt
def update_card(request):
    if request.method == "POST":
        data = request.body
        data = json.loads(data)
        dataCourse = data['card']
        _card = Card.objects.get(id = dataCourse['id'])
        if request.user == None:
            return JsonResponse({"error": "No User."}, status = 500)
        elif dataCourse['title'] == None or dataCourse['title'] == "":
            return JsonResponse({"error": "No Title."}, status = 500)
        elif dataCourse['questions'] == None or len(dataCourse['questions']) == 0:
            return JsonResponse({"error": "No Question."}, status = 500)
        for q in dataCourse['questions']:
            if q['question'] == None:
                return JsonResponse({"error": "No Question."}, status = 500)
            elif q['answer1'] == None or q['answer1'] == "":
                return JsonResponse({"error": "No Answer 1."}, status = 500)
            elif q['answer2'] == None or q['answer2'] == "":
                return JsonResponse({"error": "No Answer 2."}, status = 500)
            elif q['correct'] == None:
                return JsonResponse({"error": "No Correct."}, status = 500)

        _card.title = dataCourse['title']
        _card.status = dataCourse['status']
        _card.save()
        for q in dataCourse['questions']:
            _q = None
            if 'id' in q.keys():
                _q = Question.objects.get(id = q['id'])
                _q.question = q['question']
                _q.correct = q['correct']
                _q.answer1 = q['answer1']
                _q.answer2 = q['answer2']
                _q.answer3 = q['answer3']
                _q.answer4 = q['answer4']
                _q.answer5 = q['answer5']
            else:
                _q = Question(
                    card = _card,
                    question = q['question'],
                    correct = q['correct'],
                    answer1 = q['answer1'],
                    answer2 = q['answer2'],
                    answer3 = q['answer3'],
                    answer4 = q['answer4'],
                    answer5 = q['answer5']
                )
            _q.save()
        for cq in _card.questions.all():
            try:
                if cq.id not in [_cq['id'] for _cq in dataCourse['questions']]:
                    cq.delete()
            except:
                pass
        
        return JsonResponse({"card": _card.serialize()}, status = 200)

    return JsonResponse({"error": "Something went wrong."}, status = 500)

def create_card(request):
    if request.method == "POST":
        data = request.body
        data = json.loads(data)
        dataCourse = data['card']
        _course = Course.objects.get(title = data['courseTitle'])
        if _course == None:
            return JsonResponse({"error": "No Course."}, status = 500)
        elif request.user == None:
            return JsonResponse({"error": "No User."}, status = 500)
        elif dataCourse['title'] == None or dataCourse['title'] == "":
            return JsonResponse({"error": "No Title."}, status = 500)
        elif dataCourse['questions'] == None or len(dataCourse['questions']) == 0:
            return JsonResponse({"error": "No Question."}, status = 500)
        for q in dataCourse['questions']:
            if q['correct'] == None:
                return JsonResponse({"error": "No Question."}, status = 500)

        _card = Card(
            course =_course,
            studenttask = request.user,
            status = dataCourse['status'],
            title = dataCourse['title'],
            grade = 0
        )
        _card.save()
        for q in dataCourse['questions']:
            _q = Question(
                card = _card,
                question = q['question'],
                correct = q['correct'],
                answer1 = q['answer1'],
                answer2 = q['answer2'],
                answer3 = q['answer3'],
                answer4 = q['answer4'],
                answer5 = q['answer5']
            )
            _q.save()
        return JsonResponse({"card": _card.serialize()}, status = 200)

    return JsonResponse({"error": "Something went wrong."}, status = 500)
