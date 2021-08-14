
document.addEventListener("DOMContentLoaded", () => {
    let myperfil_inputs = document.querySelectorAll(".myperfil-inputs")
    let myPerfilInputsF = myperfil_inputs[0]
    let myPerfilInputsFEdit =  myperfil_inputs[1]
    let myPerfilInputsL =  myperfil_inputs[2]
    let myPerfilInputsLEdit =  myperfil_inputs[3]

    myPerfilInputsF.className = "none"
    myPerfilInputsL.className = "none"

    document.querySelector("form").onsubmit = (e) => {
        myPerfilInputsFEdit.className = "myperfil-inputs"
        myPerfilInputsF.className = "none"

        myPerfilInputsLEdit.className = "myperfil-inputs"
        myPerfilInputsL.className = "none"
        
    }

    myPerfilInputsF.querySelectorAll("button")[1].onclick = () => {
        myPerfilInputsFEdit.className = "myperfil-inputs"
        myPerfilInputsF.className = "none"
    }

    myPerfilInputsFEdit.querySelector("button").onclick = () => {
        myPerfilInputsFEdit.className = "none"
        myPerfilInputsF.className = "myperfil-inputs"
    }

    myPerfilInputsL.querySelectorAll("button")[1].onclick = () => {
        myPerfilInputsLEdit.className = "myperfil-inputs"
        myPerfilInputsL.className = "none"
    }

    myPerfilInputsLEdit.querySelector("button").onclick = () => {
        myPerfilInputsLEdit.className = "none"
        myPerfilInputsL.className = "myperfil-inputs"
    }
})

