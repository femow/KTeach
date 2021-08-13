from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("dashboard", views.dashboard, name="dashboard"),
    path("findcourse", views.findcourse, name="findcourse"),
    path("createcourse", views.createcourse, name="createcourse"),
    path("courses/<str:course>", views.courses, name="courses"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("api/getcourse/<str:course>", views.get_course_content, name="getcourse"),
    path("api/courses", views.get_courses, name="getcourses"),
    path("api/allcourses", views.get_all_courses, name="allcourses"),
    path("api/joincourse", views.join_course, name="joincourse"),
    path("api/updatecard", views.update_card, name="updatecard"),
    path("api/createcard", views.create_card, name="createcard"),
    path("api/deletecard", views.delete_card, name="deletecard"),
    path("api/updatecourseprogress", views.update_course_progress, name="updatecourseprogress"),
    path("api/getstudentcards", views.get_student_cards, name="getstudentcards")
]