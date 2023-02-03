const changeUsernameCard = document.querySelector("#changeUsernameCard")
const changeEmailCard = document.querySelector("#changeEmailCard")
const changePasswordCard = document.querySelector("#changePasswordCard")
const changeUsernameButton = document.querySelector("#changeUsernameButton")
const changeEmailButton = document.querySelector("#changeEmailButton")
const changePasswordButton = document.querySelector("#changePasswordButton")
const changeUsernameField1 = document.querySelector("#changeUsernameField1")
const changeUsernameField2 = document.querySelector("#changeUsernameField2")
const changeEmailField1 = document.querySelector("#changeEmailField1")
const changeEmailField2 = document.querySelector("#changeEmailField2")
const currentPasswordField = document.querySelector("#currentPasswordField")
const changePasswordField1 = document.querySelector("#changePasswordField1")
const changePasswordField2 = document.querySelector("#changePasswordField2")

const loadingDone = function () {
    let allButtons = document.querySelectorAll("button")
    for (let button of allButtons) {
        button.disabled = false
    }
}

let initialStatus = function () {
    this.classList.remove("animate__animated", "animate__shakeX", "animate__fadeInUp", "animate__fadeInDown", "animate__fadeInRight", "animate__fadeInLeft", "animate__fast", "animate__faster", "wrong", "correct")
}

let changeUsername = function () {
    if (!changeUsernameField1.value || !changeUsernameField2.value || !changeUsernameField1.validity.valid || !changeUsernameField2.validity.valid || changeUsernameField1.value !== changeUsernameField2.value) {
        changeUsernameCard.classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else {
        changeUsernameCard.classList.add("correct")
        setTimeout(() => {
            changeUsernameCard.classList.remove("correct")
        }, 300);
        setTimeout(() => {
            changeUsernameButton.form.submit()
        }, 600);
        changeUsernameButton.disabled = true
    }
}

let changeEmail = function () {
    if (!changeEmailField1.value || !changeEmailField2.value || !changeEmailField1.validity.valid || !changeEmailField2.validity.valid || changeEmailField1.value !== changeEmailField2.value) {
        changeEmailCard.classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else {
        changeEmailCard.classList.add("correct")
        setTimeout(() => {
            changeEmailCard.classList.remove("correct")
        }, 300);
        setTimeout(() => {
            changeEmailButton.form.submit()
        }, 600);
        changeEmailButton.disabled = true
    }
}

let changePassword = function () {
    if (!currentPasswordField.value || !currentPasswordField.validity.valid || !changePasswordField1.value || !changePasswordField2.value || !changePasswordField1.validity.valid || !changePasswordField2.validity.valid || changePasswordField1.value !== changePasswordField2.value) {
        changePasswordCard.classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else {
        changePasswordCard.classList.add("correct")
        setTimeout(() => {
            changePasswordCard.classList.remove("correct")
        }, 300);
        setTimeout(() => {
            changePasswordButton.form.submit()
        }, 600);
        changePasswordButton.disabled = true
    }
}

changeUsernameButton.addEventListener("click", function (event) {
    event.preventDefault()
    changeUsername()
})
changeEmailButton.addEventListener("click", function (event) {
    event.preventDefault()
    changeEmail()
})
changePasswordButton.addEventListener("click", function (event) {
    event.preventDefault()
    changePassword()
})

changeUsernameCard.addEventListener("animationend", initialStatus)
changeEmailCard.addEventListener("animationend", initialStatus)
changePasswordCard.addEventListener("animationend", initialStatus)
changeUsernameField1.addEventListener("animationend", initialStatus)
changeUsernameField2.addEventListener("animationend", initialStatus)
changeEmailField1.addEventListener("animationend", initialStatus)
changeEmailField2.addEventListener("animationend", initialStatus)
changePasswordField1.addEventListener("animationend", initialStatus)
changePasswordField2.addEventListener("animationend", initialStatus)

window.addEventListener("DOMContentLoaded", loadingDone)