var curCardDragging = null
var course = null;
var amiteacher = false;
var courseTitle = null;
var cards = []
var currentCard = null;
var changeCards = []

const modal = document.querySelector("#modal")
const formEditCard = modal.querySelector("#form-editcard");
formEditCard.addEventListener("submit", cardConfirm)
formEditCard.querySelector("#form-cancel").addEventListener('click', cardAddCancel)
const divTeacherModal = formEditCard.querySelector("#form-editcard-teacher")
const divStudentModal = formEditCard.querySelector("#form-editcard-student");

document.addEventListener("DOMContentLoaded", e => {
    lists = document.querySelectorAll(".cards");
    lists.forEach(list => {
        generateList(list)
    })

    courseTitle = document.querySelector("#course-courseid").innerText
    fetch(`/api/getcourse/${courseTitle}`, {
        method: "GET",
    })
    .then(resp => resp.json())
    .then(data => {
        course = data.course;
        cards = data.cards;
        amiteacher = data.amiteacher;
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
    curCardDragging.querySelector(".card-shadow").className = "none"
    curCardDragging = null
    // procurar nos cards -> card.div
}





function cardAdd() {
    modal.className = "modal";
}

function cardEdit(data) {
    if(amiteacher) {
        openModalTeacher(data);
    }
    modal.className = "modal";
}

function cardAddCancel(e) {
    changeCards = []
    modal.className = "none"
}

function createCard() {

}

function cardConfirm(e) {
    e.preventDefault()
    console.log(cards);
    changeCards = []

}

const openModalTeacher = (data) => {
    divTeacherModal.className = "";
    divStudentModal.className = "none";
    divTeacherModal.querySelector('#card-title').innerHTML = data.title;
    divTeacherModal.querySelector('#card-description').innerHTML = data.descrption;

    changeCards = data.questions;
    currentCard = data;
    let _ol = formEditCard.querySelector("ol");
    _ol.innerHTML = "";
    data.questions.forEach((q, index) => {
        _ol.append(generateQuestionEdit(q, index + 1))
    })

    formEditCard.querySelector("#card-add-question").addEventListener("click", () => {
        let __obj = {
            id: null,
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            answer5: "",
            correct: 0,
            question: ""
        }
        changeCards.push(__obj)
        _ol.append(generateQuestionEdit(__obj, changeCards.length))
    })
}

const generateList = (_divParent) => {
    let _divAddCard = document.createElement("div")
    _divAddCard.className = "card-add"
    let _btnAddCard = document.createElement("button")
    _btnAddCard.className = "card-add-button"
    _btnAddCard.innerText = "+ Add a card"
    _btnAddCard.addEventListener('click', cardAdd)
    _divAddCard.append(_btnAddCard)
    _divParent.append(_divAddCard)

    _divParent.addEventListener('dragover', cardDragOver)
    _divParent.addEventListener('dragenter', cardDragEnter)
    _divParent.addEventListener('dragleave', cardDragLeave)
    _divParent.addEventListener('drop', cardDragDrop)
}

const generateCard = (data) => {
    let _divParent = document.createElement("div")
    _divParent.className = "card"
    _divParent.draggable = true
    
    let _div1 = document.createElement("div")
    _div1.className = "card-title"
    let _ptitle = document.createElement("p")
    _ptitle.innerText = data.title
    _div1.append(_ptitle)

    let _div2 = document.createElement("div")
    _div2.className = "card-content"

    let _pscore = document.createElement("p")
    console.log(data.grade);
    _pscore.innerText = "Grade: " + data.grade + "/" + data.questions.length
    _div2.append(_pscore)

    let _div3 = document.createElement("div")
    _div3.className = "none"

    _divParent.append(_div1);
    _divParent.append(_div2);
    _divParent.append(_div3);

    _divParent.addEventListener('dragstart', cardDragStart);
    _divParent.addEventListener('dragend', cardDragEnd);
    _divParent.addEventListener('click', () => cardEdit(data));

    return _divParent
}

const generateQuestion = (data) => {
    let _div = document.createElement("div")

    let _span = document.createElement("span")
    _span.innerHTML = data.question
    _div.append(_span)
    
    let _br = document.createElement("br")
    _div.append(_br)
    
    const _answers = ["a", "b", "c", "d", "e"]
    for (let i = 0; i < 5; i++) {
        if(data[`answer${i + 1}`] == null) break;
        let _rq = document.createElement("input")
        _rq.type = "radio"
        _rq.name = `radio${data.questionNum}${_answers[i]}`
        _rq.id = `radio${questionNum}${_answers[i]}`
        
        let _q = document.createElement("label")
        _q.for = `answer${questionNum}${_answers[i]}`
        _q.innerHTML = data.questions[i][_answers[i]]
        let _br2 = document.createElement("br")
        
        _div.append(_rq)
        _div.append(_q)
        _div.append(_br2)
    }
    return _div
}

const generateQuestionEdit = (data, index) => {
    let _li = document.createElement("li")
    let _div = document.createElement("div")

    let _inputQuestion = document.createElement("input")
    _inputQuestion.type = "text"
    _inputQuestion.placeholder = `Question ${index}`
    _inputQuestion.name = `question${index}`

    let _btnDel = document.createElement("button")
    _btnDel.className = "button-icon"
    _btnDel.innerHTML = "<i class='bi bi-trash-fill'>"

    let _br = document.createElement("br")

    _div.append(_inputQuestion)
    _div.append(_btnDel)
    _div.append(_br)

    const _answers = ["a", "b", "c", "d", "e"]
    for (let i = 0; i < 5; i++) {
        let _rq = document.createElement("input")
        _rq.type = "radio"
        _rq.name = `radio${index}${_answers[i]}`
        _rq.id = `radio${index}${_answers[i]}`
        _rq.value = i;

        let _q = document.createElement("input")
        _q.type = "text"
        _q.name = `answer${index}${_answers[i]}`
        _q.id = `answer${index}${_answers[i]}`
        _q.value = data[`answer${i + 1}`]

        let _br2 = document.createElement("br")
        _div.append(_rq)
        _div.append(_q)
        _div.append(_br2)
    }

    _li.append(_div)
    return _li
}