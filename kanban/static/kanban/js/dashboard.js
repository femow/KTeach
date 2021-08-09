document.addEventListener("DOMContentLoaded", e => {
    let _dashboardcardsClasses = document.querySelector("#dashboard-my-classes")
    let _dashboardcardsCourses = document.querySelector("#dashboard-my-courses")
    fetch("/api/courses", {
        method: "GET"
    })
    .then(resp => resp.json())
    .then(data => {
        data.classes.forEach(el => {
            _dashboardcardsClasses.append(generateCoursedCard(el))
        });
        data.courses.forEach(el => {
            _dashboardcardsCourses.append(generateCoursedCard(el))
        })
    })
})

function generateCoursedCard(course) {
    let _parent = document.createElement("a")
    _parent.className = "course-card"
    _parent.href = `/courses/${course.title}`
    
    let _h2 = document.createElement("h2")
    _h2.innerHTML = course.title
    
    let _div = document.createElement("div")
    let _p1 = document.createElement("p")
    _p1.innerHTML = `<strong>Teacher:</strong> ${course.teacher.username}`
    let _p2 = document.createElement("p")
    _p2.innerHTML = `<strong>Studentes:</strong> ${course.students.length}`
    let _p3 = document.createElement("p")
    _p3.innerHTML = `<strong>Progress:</strong> ${course.progress}%`
    let _divprogress = document.createElement("div")
    _divprogress.className = "course-card-progress"
    let _divprogressbar = document.createElement("div")
    _divprogressbar.style = `width: ${course.progress}%;`
    let _divprogressbaranim = document.createElement("div")
    _divprogressbaranim.style = `animation: animProgressBar ${course.progress/100}s`
    _divprogressbar.append(_divprogressbaranim)
    _divprogress.append(_divprogressbar)
    _div.append(_p1)
    _div.append(_p2)
    _div.append(_p3)
    _div.append(_divprogress)
    _parent.append(_h2)
    _parent.append(_div)
    return _parent
}