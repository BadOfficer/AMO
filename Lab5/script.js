const clearBtn = document.getElementById("clear-btn");
const matrixInputs = document.querySelectorAll(".r_c-input");

clearBtn.addEventListener('click', () => {
    clearInputs();
})

function clearInputs() {
    matrixInputs.forEach(element => {
        element.value = "";
    });
}