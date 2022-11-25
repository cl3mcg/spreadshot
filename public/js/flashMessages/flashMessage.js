let allCloseButtons = document.querySelectorAll(".toast-close")

let closeFlashMessage = function () {
    this.parentElement.parentElement.classList.add("animate__animated", "animate__fadeOut", "animate__faster")
    if (document.querySelector(".toast-container").childElementCount === 1) {
        setTimeout(() => {
            document.querySelector(".toast-container").remove()
        }, 300);
    } else {
        setTimeout(() => {
            this.parentElement.parentElement.remove()
        }, 300);
    }
}

for (let button of allCloseButtons) {
    button.addEventListener("click", closeFlashMessage)
}