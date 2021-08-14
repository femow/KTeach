# CS50 Harvard - Project Final

<img src="exemple.PNG" alt="Demo">

# KTeach

This project was made with the objective of facilitating teachers in relation to questionnaire-type activities with the help of the Kanban model.

# Distinctiveness and Complexity

The project sought to include everything that was taught in the course and done naturally, without the aid of any external tools. The project took on such large proportions that I had to separate the js and css files to organize it. The greatest complexity was in the part of the cards, both in the creation and in the manipulation of them, demanding a complex work both in the logical part (JavaScript) and in the visual part (HTML, CSS). The backend worked a lot in handling the applied fields and filters.

## Back end

This project applied all the lessons taught in this course and I believe it went a little further because some requests used a greater degree of complexity in relation to the application's database filters and also because of the large number of different requests.

## Front end

The project met the requirement to be a responsive web site.

Animations on buttons and cards made manually without the help of a framework.

Handling of interface changes via code implemented by JavaScript and changing the functions of HTML tags.

Use of form for backend requests

Using "fetch" for API queries

# What’s contained in each file you created

## views.py

Contains all the backend logic, including redirect, get and post requests.

## urls.py

Contains all the paths for backend.

## models.py

Coins all the models used in this project, like User, Course, Card and Question models.

## register.html and login.html

Contains inputs to register/log a user.

## myperfil.html

Contains information about the current user and inputs to change its properties.

## layout.html

Contains the left side bar and the top bar with the logo of the project.

## findcourse.html

Contains a form to find a course and shows all the courses created.

## dashboard.html

Contains the courses that the user have assigned/created.

## createcourse.html

Contains a form with 2 inputs to register new course.

## course.html

Contains different content depend if the user created this course or not. If the user created this course this file will show 6 columns, 3 for the cards status and 3 for all students assigned to the course. Otherwise if the user didn't create the course, the file will show only 2 columns for the card status.

## course.js

Contains all the logic behind for each card and contains the connection to the back end using fetch async method to get the course information necessary to fill the HTML interface content using only javascript.

## dashboard.js

Contains the connection to the backend using fetch async method to get the courses for the current user.

## findcourse.js

Contains the connection to the backend using fetch async method to get all the courses created and to register the user to a course.

## myperfil.js

Contains the logic to change the edit button.

# Stacks

## Front end

<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green" /> <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" /> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white" />

## Back end

<img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green" /> <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />

[⬆ Voltar ao topo](#cs50-project-2)<br>
