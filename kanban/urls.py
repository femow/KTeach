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

    path("api/courses", views.get_courses, name="getcourses"),
    path("api/allcourses", views.get_all_courses, name="allcourses")
]