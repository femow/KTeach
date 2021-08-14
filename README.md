# CS50 Harvard - Project Final

<img src="exemple.PNG" alt="Demo">

# KTeach

Este projeto foi feito com intuito de facilitar os professores com relação às atividades no estilo questionário com a ajudo do modelo kanban. 

# Distinctiveness and Complexity

O projeto buscou colocar tudo que foi ensinado no curso e feito tudo de forma natural, sem o auxilio de nenhuma ferramenta externa. O projeto tomou proporções tão grande que tive que separar alguns arquivos de js e css separados para poder organizar o projeto. A maior complexidade ficou na parte dos cards, tanto na criação como na manipulação deles, exigindo um trabalho complexo tanto na parte de lógica(código) quanto na parte visual(HTML, CSS). O backend trabalhou bastante a parte de tratar as consultas de forma a aceitar apenas campos válidos e no geral acredito que o projeto seja ma

## Back end

- Este projeto aplicou todas as lições ensinadas neste curso e acredito que foi um pouco além pois algumas algumas requisições utilizaram uma grau maior de complixidade em relação aos filtros no banco de dados da aplicação e também pela quantidade grande de diferentes requisições.

## Front end

- O projeto atendeu ao requisito de ser responsivo.
- Animações nos botões e nos cartões feitas de forma manual sem auxilio de um framework.
- Tratamento de mudança de interface via código implmenetado pelo JavaScript e mudança nas funçoes das tags HTML.
- Utilização de formulário para requests no backend
- Utilização do "fetch" para consultas na API

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
