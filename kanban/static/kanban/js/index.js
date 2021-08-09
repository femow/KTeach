var curCardDragging = null
const modal = document.querySelector("#modal")
const formCreateCard = modal.querySelector("#form-editcard");
formCreateCard.querySelector("#form-cancel").addEventListener('click', cardAddCancel)

var lists = []

const cards = [
    {
        title: "Atividade 1",
        date: "12/06/2021",
        score: 4,
        status: "backlog",
        questions: [{
            question: "Question about something?",
            a: "Sim",
            b: "Não",
            c: "Sinom",
            d: "Yep."
        }]
    },
    {
        title: "Atividade 2",
        date: "14/06/2021",
        status: "todo",
        score: 4,
        questions: []
    }
]

document.addEventListener("DOMContentLoaded", e => {
    lists = document.querySelectorAll(".cards");
    lists.forEach(list => {
        generateList(list)
    })
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
}





function cardAdd() {
    modal.className = "modal";
}

function cardEdit() {
    modal.className = "modal";
}

function cardAddCancel(e) {
    e.preventDefault()
    modal.className = "none"
}

function createCard(e) {
    e.preventDefault()
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

    let _pdate =  document.createElement("p")
    _pdate.innerText =  "Entrega: " + data.date
    let _pscore = document.createElement("p")
    _pscore.innerText = "Score: " +  (data.score ? (data.score + "/10") : "-")
    _div2.append(_pdate)
    _div2.append(_pscore)

    let _div3 = document.createElement("div")
    _div3.className = "none"

    _divParent.append(_div1)
    _divParent.append(_div2)
    _divParent.append(_div3)

    _divParent.addEventListener('dragstart', cardDragStart)
    _divParent.addEventListener('dragend', cardDragEnd)
    _divParent.addEventListener('click', cardEdit)

    return _divParent
}