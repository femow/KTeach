var curCardDragging = null
var course = null;
var amiteacher = false;
var courseTitle = null;
var cards = []
var cardsStudent = []
var currentCard = null;
var changeCards = []
var lists;

const modal = document.querySelector("#modal")
const formEditCard = modal.querySelector("#form-editcard");
formEditCard.addEventListener("submit", cardConfirm)
formEditCard.querySelector("#form-cancel").addEventListener('click', cardAddCancel)
const divTeacherModal = formEditCard.querySelector("#form-editcard-teacher")
const divStudentModal = formEditCard.querySelector("#form-editcard-student");

document.addEventListener("DOMContentLoaded", e => {
    lists = document.querySelectorAll(".cards")

    courseTitle = document.querySelector("#course-courseid").innerText
    fetch(`/api/getcourse/${courseTitle}`, {
        method: "GET",
    })
    .then(resp => resp.json())
    .then(data => {
        course = data.course;
        cards = data.cardsTeacher;
        cardsStudent = data.cardsStudent;
        amiteacher = data.amiteacher;
        if(amiteacher) {
            generateList(lists[0], 0)
            generateList(lists[1], 1)
            generateList(lists[2], 2)
            formEditCard.querySelector("#card-add-question").className = "card-add-button"
            cards.forEach(card => {
                let _div = generateCard(card)
                let _list = null;
                switch(card.status) {
                case "backlog":
                    _list = lists[0]
                    break;
                case "todo":
                    _list = lists[1]
                    break;
                case "done":
                    _list = lists[2]
                    break;
                }
                _list.append(_div)
                _list.insertBefore(_div, _div.previousElementSibling)
                card.div = _div;
                card.isCreate = false;
            })
            course.students.forEach(st => {
                let _div = generateCardStudentTeacher(st.username)
                let _lowercaseflatter = st.username.toLowerCase().charCodeAt(0)
                if(_lowercaseflatter < 105) {
                    lists[3].append(_div)
                }
                else if(_lowercaseflatter < 114) {
                    lists[4].append(_div)
                }
                else {
                    lists[5].append(_div)
                }
            })
        }
        else {
            document.querySelector("#student-teacher-cards").className = "none"
            formEditCard.querySelector("#card-add-question").className = "none"
            lists[0].className = "none"
            cards.forEach(card => {
                if(card.status != "backlog") {
                    let _studentcard = cardsStudent.filter(c => c.title == card.title)[0]
                    let _div;
                    if(_studentcard) {
                        _studentcard.done = true;
                        _studentcard.questions.forEach((q, index) => {
                            q.correctTeacher = card.questions[index].correct
                        })
                        _div = generateCard(_studentcard)
                        lists[2].append(_div)
                        card.div = _div;
                        card.isCreate = false;
                    }
                    else if(card.status == "todo") {
                        _div = generateCard(card)
                        lists[1].append(_div)
                        card.div = _div;
                        card.isCreate = false;
                    }
                }
            })
        }

    })
})

function cardDragStart() {
    this.className = "card card-dragging"
    curCardDragging = this;
    setTimeout(() => {
        this.querySelector(".none").className = "card-shadow"
    }, 0);
}

function cardDragEnd() {
    this.className = "card"
    if(curCardDragging) {
        curCardDragging.querySelector(".card-shadow").className = "none"
        curCardDragging = null;
    }
}

function cardDragEnter(e) {

    e.preventDefault()
    if(curCardDragging) {
        curCardDragging.className = "card"
        this.append(curCardDragging)
        this.insertBefore(curCardDragging, curCardDragging.previousElementSibling)
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            if(child.className == "card") {
                if(child.offsetTop + 60 > e.clientY) {
                    this.insertBefore(curCardDragging, child)
                    return
                }
            }
        }
    }
}

function cardDragLeave() {

}

const cardDragOver = (e) => e.preventDefault()

function cardDragDrop() {
    // NOTIFY CHANGE ON BACKEND

    _card = cards.filter(c => c.div == curCardDragging)[0]
    console.log(_card);
    if(_card) {
        switch(curCardDragging.parentNode.id) {
            case "cards-backlog":
                _card.status = "backlog";
                break;
            case "cards-todo":
                _card.status = "todo";
                break;
            case "cards-done":
                _card.status = "done";
                break;
        }
        fetch("/api/updatecard", {
            method: "POST",
            body: JSON.stringify({
                card: {
                    grade: _card.grade,
                    id: _card.id,
                    questions: _card.questions,
                    status: _card.status,
                    title: _card.title
                },
                courseTitle: courseTitle,
            })
        })
        .then(resp => {
            fetch("/api/updatecourseprogress", {
                method: "POST",
                body: JSON.stringify({
                    courseTitle: courseTitle
                })
            })
        })
    }

    curCardDragging.querySelector(".card-shadow").className = "none"
    curCardDragging = null
    // procurar nos cards -> card.div
}

function cardAdd(index) {
    let _card = {
        grade: 0,
        questions: [{
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            answer5: "",
            correct: 0,
            question: "",
            creationIndex: 0,
        }],
        status: index == 0 ? "backlog" : index == 1 ? "todo" : "done",
        title: ""
    }

    let _div = generateCard(_card)
    lists[index].append(_div)
    lists[index].insertBefore(_div, _div.previousElementSibling)
    _card.div = _div;
    _card.isCreate = true;

    cardEdit(_card);
}

function cardEdit(data) {
    formEditCard.querySelector("input[type='submit']").className = ""
    formEditCard.querySelector("#form-cancel").innerHTML = "Cancel"
    if(amiteacher && data.status == "backlog") {
        formEditCard.querySelector("#card-add-question").className = "card-add-button"
        openModalTeacher(data);
    }
    else {
        formEditCard.querySelector("#card-add-question").className = "none"
        openModalStudent(data);
    }
    modal.className = "modal";
}

function cardAddCancel(e) {
    if(currentCard) {
        if(currentCard.isCreate) {
            currentCard.div.remove();
        }
        currentCard = null
        changeCards = []
    }
    modal.className = "none"
}

function cardDel() {
    currentCard.div.remove();
    fetch("/api/deletecard", {
        method: "POST",
        body: JSON.stringify({
            cardid: currentCard.id
        })
    })
    .then(resp => {
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i]
            if(element.id == currentCard.id) {
                element.div.remove();
                cards.slice(i);
                currentCard = null;
                changeCards = []
                modal.className = "none"
                break;
            }
        }
    })

}

function cardConfirm(e) {
    e.preventDefault()
    currentCard.questions = changeCards

    if(currentCard.isCreate) {
        cards.push(currentCard);
    }

    fetch("/api/" + ((currentCard.isCreate || !amiteacher) ? "createcard" : "updatecard"), {
        method: "POST",
        body: JSON.stringify({
            card: {
                grade: currentCard.grade,
                id: currentCard.id,
                questions: currentCard.questions,
                status: currentCard.status,
                title: currentCard.title
            },
            courseTitle: courseTitle,
        })
    })
    .then(resp => resp.json())
    .then(data => {
        if(!data.error) {
            location.reload()
        }
        else {
            if(currentCard.isCreate) {
                cards.pop(currentCard);
            }
        }
    })
}

function removeQuestion(data) {
    let _ol = formEditCard.querySelector("ol");
    let _indexQuestion = changeCards.indexOf(data)
    _ol.children[_indexQuestion].remove();
    changeCards.splice(_indexQuestion, 1);
    currentCard.questions = changeCards;
}

const openModalTeacher = (data) => {
    divTeacherModal.className = "";
    divStudentModal.className = "none";
    let _data = cards.filter(el => el.id == data.id)[0]
    if (_data) data = _data;
    currentCard = {... data};
    changeCards = [];
    currentCard.questions.forEach(crd => changeCards.push({... crd}))

    let _card_title = divTeacherModal.querySelector('#card-title')
    _card_title.value = currentCard.title;
    _card_title.onchange = e => currentCard.title = e.target.value;

    let _ol = formEditCard.querySelector("ol");
    _ol.innerHTML = "";
    changeCards.forEach((q, index) => {
        _ol.append(amiteacher ? generateQuestionEdit(q, index + 1) : generateQuestion(q, index + 1))
    })

    
    if(currentCard.isCreate) {
        divTeacherModal.querySelectorAll("h1")[0].innerText = "New Card"
        divTeacherModal.querySelector("#form-delete").onclick = cardAddCancel
    }
    else {
        divTeacherModal.querySelectorAll("h1")[0].innerText =  currentCard.title
        divTeacherModal.querySelector("#form-delete").onclick = cardDel
    }

    formEditCard.querySelector("#card-add-question").onclick = () => {
        let __obj = {
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            answer5: "",
            correct: 0,
            question: "",
            creationIndex: changeCards.length
        }
        changeCards.push(__obj)
        _ol.append(amiteacher ? generateQuestionEdit(__obj, changeCards.length) : generateQuestion(q, index + 1))
    }
}

const openModalStudent = (data) => {
    divTeacherModal.className = "none";
    divStudentModal.className = "";
    let _data = cards.filter(el => el.id == data.id)[0]
    if (_data) data = _data;
    currentCard = {... data};
    changeCards = [];
    currentCard.questions.forEach(crd => changeCards.push({... crd}))

    divStudentModal.querySelector('h1').innerHTML = currentCard.title
    divStudentModal.querySelector('span').className = ""
    divStudentModal.querySelector('span').innerHTML = "<strong>Score: </strong>" + data.questions.filter(sc => sc.correct == sc.correctTeacher).length + "/" + data.questions.length

    if(data.done || (amiteacher && data.status !== "backlog")) {
        formEditCard.querySelector("input[type='submit']").className = "none"
        formEditCard.querySelector("#form-cancel").innerHTML = "Ok"
    }
    else {
        formEditCard.querySelector("input[type='submit']").className = ""
        formEditCard.querySelector("#form-cancel").innerHTML = "Cancel"
    }
    

    let _ol = formEditCard.querySelector("ol");
    _ol.innerHTML = "";
    changeCards.forEach((q, index) => {
        let __notonbacklogteacher = amiteacher && data.status != "backlog";
        if(__notonbacklogteacher) {
            q.correctTeacher = q.correct;
        }
        _ol.append((amiteacher && data.status == "backlog") ? generateQuestionEdit(q, index + 1) : generateQuestion(q, index + 1, (data.done || __notonbacklogteacher)))
    })

    formEditCard.querySelector("#card-add-question").onclick = () => {
        let __obj = {
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            answer5: "",
            correct: 0,
            question: "",
            creationIndex: changeCards.length
        }
        changeCards.push(__obj)
        _ol.append(generateQuestionEdit(__obj, changeCards.length))
    }
}

const openModalStudentTeacher = (username) => {
    formEditCard.querySelector("#card-add-question").className = "none"
    divTeacherModal.className = "none";
    divStudentModal.className = "";

    divStudentModal.querySelector('h1').innerHTML = username
    divStudentModal.querySelector('span').className = "none";

    formEditCard.querySelector("input[type='submit']").className = "none"
    formEditCard.querySelector("#form-cancel").innerHTML = "Ok"

    fetch(`/api/getstudentcards?username=${username}&courseTitle=${courseTitle}`, {
        method: "GET"
    })
    .then(resp => resp.json())
    .then(data => {
        if(!data.error) {
            let _ol = formEditCard.querySelector("ol");
            _ol.innerHTML = "";
            data.cards.forEach(card => {
                let filterCard = cards.filter(c => c.title == card.title)[0]
                if(filterCard) {
                    let _h2 = document.createElement("h2");
                    _ol.append(_h2);
                    
                    let _div = document.createElement("ol")
                    _div.style = "margin-bottom: 20px"
                    card.questions.forEach((q, index) => {
                        q.correctTeacher = filterCard.questions[index].correct
                        _div.append(generateQuestion(q, index + 1, true))
                    })
                    let _hr = document.createElement("div");
                    _hr.className = "hr"
                    _div.append(_hr)
                    _ol.append(_div)
                    
                    let _totalRights = _div.querySelectorAll(".radio-disabled-true").length;
                    _h2.innerHTML = `${card.title} (${_totalRights}/${card.questions.length})`;
                }
            })
            modal.className = "modal";
        }
    })


}

const generateList = (_divParent, index) => {
    let _divAddCard = document.createElement("div")
    _divAddCard.className = "card-add"
    let _btnAddCard = document.createElement("button")
    _btnAddCard.className = "card-add-button"
    _btnAddCard.innerText = "+ Add a card"
    _btnAddCard.onclick = () => cardAdd(index)
    _divAddCard.append(_btnAddCard)
    _divParent.append(_divAddCard)

    _divParent.addEventListener('dragover', cardDragOver)
    _divParent.addEventListener('dragenter', cardDragEnter)
    _divParent.addEventListener('dragleave', cardDragLeave)
    _divParent.addEventListener('drop', cardDragDrop)
}

const generateCardStudentTeacher = (data) => {
    let _divParent = document.createElement("div")
    _divParent.className = "card"
    
    let _div1 = document.createElement("div")
    _div1.className = "card-title"
    let _ptitle = document.createElement("p")
    _ptitle.innerText = data
    _div1.append(_ptitle)
    
    let _div2 = document.createElement("div")
    _div2.className = "card-content"
    
    let _pscore = document.createElement("p")
    _pscore.innerText = "-"
    _div2.append(_pscore)
    
    _divParent.append(_div1);
    _divParent.append(_div2);
    _divParent.addEventListener('click', () => openModalStudentTeacher(data));

    return _divParent
}

const generateCard = (data) => {
    let _divParent = document.createElement("div")
    _divParent.className = "card"
    
    let _div1 = document.createElement("div")
    _div1.className = "card-title" + (data.done ? " card-title-done" : "")
    let _ptitle = document.createElement("p")
    _ptitle.innerText = data.title
    _div1.append(_ptitle)
    
    let _div2 = document.createElement("div")
    _div2.className = "card-content"
    
    let _pscore = document.createElement("p")
    if(data.done) {
        _pscore.innerText = "Grade: " + data.questions.filter(sc => sc.correct == sc.correctTeacher).length + "/" + data.questions.length
    }
    else {
        _pscore.innerText = "Grade: -/" + data.questions.length
    }
    _div2.append(_pscore)
    
    let _div3 = document.createElement("div")
    _div3.className = "none"
    
    _divParent.append(_div1);
    _divParent.append(_div2);
    _divParent.append(_div3);
    
    if(amiteacher) {
        _divParent.draggable = true
        _divParent.addEventListener('dragstart', cardDragStart);
        _divParent.addEventListener('dragend', cardDragEnd);
    }
    _divParent.addEventListener('click', () => cardEdit(data));

    return _divParent
}

const generateQuestion = (data, index, done) => {
    let _li = document.createElement("li")
    let _div = document.createElement("div")

    let _span = document.createElement("span")
    _span.innerHTML = `<strong>${data.question}</strong>`
    _div.append(_span)
    
    let _br = document.createElement("br")
    _div.append(_br)
    
    const _answers = ["a", "b", "c", "d", "e"]
    for (let i = 0; i < 5; i++) {
        if(data[`answer${i + 1}`] == "") break;
        let _rq = document.createElement("input")
        _rq.type = "radio"
        _rq.name = `radio${index}`
        _rq.id = `radio${index}${_answers[i]}`
        if(done) {
            _rq.disabled = true;
        }
        if(data.correct == i) {
            if(done) {
                _rq.checked = true;
                if(data.correct == data.correctTeacher) {
                    _rq.className = "radio-disabled-true";
                }
                else {
                    _rq.className = "radio-disabled-false";
                }
            }
        }
        _rq.onchange = e => {
            if (e.target.checked) {
                if(data.creationIndex) {
                    changeCards.filter(el => el.creationIndex == data.creationIndex)[0].correct = i
                }
                else {
                    changeCards.filter(el => el.id == data.id)[0].correct = i
                }
            }
        }
        
        let _q = document.createElement("label")
        _q.name = `answer${index}`
        _q.innerHTML = data[`answer${i + 1}`]
        //_q.for = `answer${index}${_answers[i]}`

        let _br2 = document.createElement("br")
        
        _div.append(_rq)
        _div.append(_q)
        _div.append(_br2)
        _li.append(_div)
    }
    return _li
}

const generateQuestionEdit = (data, index) => {
    let _li = document.createElement("li")
    let _div = document.createElement("div")

    let _inputQuestion = document.createElement("input")
    _inputQuestion.type = "text"
    _inputQuestion.placeholder = `Question`
    _inputQuestion.value = data.question;
    _inputQuestion.name = `question${index}`
    _inputQuestion.onchange = e => {
        if(data.creationIndex) {
            changeCards.filter(el => el.creationIndex == data.creationIndex)[0].question = e.target.value
        }
        else {
            changeCards.filter(el => el.id == data.id)[0].question = e.target.value
        }
    }

    let _btnDel = document.createElement("button")
    _btnDel.className = "button-icon"
    _btnDel.innerHTML = "<i class='bi bi-trash-fill'>"
    _btnDel.type = "button"
    _btnDel.onclick = () => removeQuestion(data);

    let _br = document.createElement("br")

    _div.append(_inputQuestion)
    _div.append(_btnDel)
    _div.append(_br)

    const _answers = ["a", "b", "c", "d", "e"]
    for (let i = 0; i < 5; i++) {
        let _rq = document.createElement("input")
        _rq.type = "radio"
        _rq.name = `radio${index}`
        _rq.value = i;
        if(i == data.correct) _rq.checked = true;
        _rq.onchange = e => {
            if (e.target.checked) {
                if(data.creationIndex) {
                    changeCards.filter(el => el.creationIndex == data.creationIndex)[0].correct = i
                }
                else {
                    changeCards.filter(el => el.id == data.id)[0].correct = i
                }
            }
        }

        let _q = document.createElement("input")
        _q.type = "text"
        _q.name = `answer${index}${_answers[i]}`
        _q.id = `answer${index}${_answers[i]}`
        _q.value = data[`answer${i + 1}`]
        _q.onchange = e => {
            data[`answer${i + 1}`] = e.target.value
        }

        let _br2 = document.createElement("br")
        _div.append(_rq)
        _div.append(_q)
        _div.append(_br2)
    }

    _li.append(_div)
    return _li
}