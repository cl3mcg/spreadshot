const loginPanel = document.querySelector("#loginPanel")
const createPanel = document.querySelector("#createPanel")
const recoveryPanel = document.querySelector("#recoveryPanel")
const loginUsernameInput = document.querySelector("#loginUsernameInput")
const loginPasswordInput = document.querySelector("#loginPasswordInput")
const loginButton = document.querySelector("#loginButton")
const createAccountButton = document.querySelector("#createAccountButton")
const forgotButton = document.querySelector("#forgotButton")
const recoveryEmailInput = document.querySelector("#recoveryEmailInput")
const recoveryButton = document.querySelector("#recoveryButton")
const gotoLoginButton1 = document.querySelector("#gotoLoginButton1")
const gotoLoginButton2 = document.querySelector("#gotoLoginButton2")
const gotoCreateButton = document.querySelector("#gotoCreateButton")
const emojiHello = document.querySelector(".oma-waving-hand")

const navbar = document.querySelector("nav")
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-55px";
    }
    prevScrollpos = currentScrollPos;
}

const loadingDone = function () {
    emojiHello.classList.add("animate__shakeX")
    emojiHello.classList.add("animate__faster")
    emojiHello.classList.add("animate__animated")
    loginButton.disabled = false
    createAccountButton.disabled = false
    recoveryButton.disabled = false
}

let initialStatus = function () {
    this.classList.remove("animate__animated", "animate__shakeX", "animate__fadeInUp", "animate__fadeInDown", "animate__fadeInRight", "animate__fadeInLeft", "animate__fast", "animate__faster", "wrong", "correct")
}

let login = function () {
    if (!loginUsernameInput.value || !loginPasswordInput.value || !loginUsernameInput.validity.valid) {
        loginPanel.classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else {
        loginPanel.classList.add("correct")
        setTimeout(() => {
            loginPanel.classList.remove("correct")
        }, 300);
        setTimeout(() => {
            loginButton.form.submit()
        }, 600);
        loginButton.disabled = true
    }
}

let createAccount = function () {
    if (!createUsernameInput.value || !createEmailInput.value || !createEmailInput.validity.valid || !createConfirmEmailInput.value || !createPasswordInput.value) {
        createPanel.classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else if (createEmailInput.value != createConfirmEmailInput.value) {
        document.querySelector("#createEmailInput").classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
        document.querySelector("#createConfirmEmailInput").classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else {
        createPanel.classList.add("correct")
        setTimeout(() => {
            createPanel.classList.remove("correct")
            document.getElementById("modal_1").checked = true
        }, 300);
        setTimeout(() => {
            createAccountButton.form.submit()
        }, 3500);
        createAccountButton.disabled = true
    }
}

let recoverPassword = function () {
    if (!recoveryEmailInput.value || !recoveryEmailInput.validity.valid) {
        recoveryPanel.classList.add("animate__animated", "animate__shakeX", "animate__faster", "wrong")
    }
    else {
        recoveryPanel.classList.add("correct")
        setTimeout(() => {
            recoveryPanel.classList.remove("correct")
            document.getElementById("modal_2").checked = true
        }, 300);
        setTimeout(() => {
            recoveryButton.form.submit()
        }, 3500);
        recoveryButton.disabled = true
    }
}

const goToCreatePanel = function () {
    loginPanel.classList.add("hide")
    createPanel.classList.remove("hide")
    createPanel.classList.add("animate__animated", "animate__fadeInRight", "animate__faster")
}

const goToLoginPanel1 = function () {
    createPanel.classList.add("hide")
    loginPanel.classList.remove("hide")
    loginPanel.classList.add("animate__animated", "animate__fadeInLeft", "animate__faster")
}

const goToRecoveryPanel = function () {
    loginPanel.classList.add("hide")
    recoveryPanel.classList.remove("hide")
    recoveryPanel.classList.add("animate__animated", "animate__fadeInUp", "animate__faster")
}

const goToLoginPanel2 = function () {
    recoveryPanel.classList.add("hide")
    loginPanel.classList.remove("hide")
    loginPanel.classList.add("animate__animated", "animate__fadeInDown", "animate__faster")
}

loginButton.addEventListener("click", function (event) {
    event.preventDefault()
    login()
})
createAccountButton.addEventListener("click", function (event) {
    event.preventDefault()
    createAccount()
})
recoveryButton.addEventListener("click", function (event) {
    event.preventDefault()
    recoverPassword()
})
gotoCreateButton.addEventListener("click", goToCreatePanel)
gotoLoginButton1.addEventListener("click", goToLoginPanel1)
gotoLoginButton2.addEventListener("click", goToLoginPanel2)
forgotButton.addEventListener("click", goToRecoveryPanel)
loginPanel.addEventListener("animationend", initialStatus)
createPanel.addEventListener("animationend", initialStatus)
recoveryPanel.addEventListener("animationend", initialStatus)
document.querySelector("#createEmailInput").addEventListener("animationend", initialStatus)
document.querySelector("#createConfirmEmailInput").addEventListener("animationend", initialStatus)
window.addEventListener("DOMContentLoaded", loadingDone)

