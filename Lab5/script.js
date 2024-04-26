const clearBtn = document.getElementById("clear-btn");
const matrixInputs = document.querySelectorAll(".r_c-input");
const matrixKofs = document.querySelectorAll(".kof_sys");
const matrixVilCh = document.querySelectorAll(".vil_ch");
const calcBtn = document.getElementById("calculate-btn");
const resultCont = document.getElementById("result");
const errorMesg = document.getElementById("error");
const closeBtn = document.getElementById("close-btn");

closeBtn.addEventListener("click", () => {
    closeError();
})

calcBtn.addEventListener("click", () => {
    const inputsArray = [];
    matrixInputs.forEach(input => inputsArray.push(input));
    if (!inputsArray.every(el => el.value !== "")) {
        showError("Введіть всі дані!");
        return;
    }
    const [matrixKofs, matrixVilCh] = formationMatrix();
    const [readyMatrixKofs, readyMatrixVilCh] = GausOdKof(matrixKofs, matrixVilCh);
    showData(readyMatrixVilCh);
})

function formationMatrix() {
    const readyMatrixKofs = [];
    const readyMatrixVilCh = [];
    let index = 0;

    for(let i = 0; i < 3; i++) {
        const row = [];
        for(let j = 0; j < 3; j++) {
            row.push(+matrixKofs[index].value);
            index++;
        }
        readyMatrixKofs.push(row);
    }

    for(let i = 0; i < 3; i++) {
        readyMatrixVilCh.push(+matrixVilCh[i].value);
    }

    return [readyMatrixKofs, readyMatrixVilCh];
}

function GausOdKof(kovMatrix, vilChMatrix) {
    let [kovMatrixCopy, vilChMatrixCopy] = [kovMatrix.slice(), vilChMatrix.slice()];
    let maxRowIndex = 0;
    let maxEl = kovMatrix[0][0];

    for(let i = 0; i < kovMatrix.length; i++) {
        if(kovMatrix[i][0] > maxEl) {
            [maxRowIndex, maxEl] = [i, kovMatrix[i][0]];
        }
    }

    [kovMatrixCopy[0], kovMatrixCopy[maxRowIndex]] = [kovMatrixCopy[maxRowIndex], kovMatrixCopy[0]];
    [vilChMatrixCopy[0], vilChMatrixCopy[maxRowIndex]] = [vilChMatrixCopy[maxRowIndex], vilChMatrixCopy[0]];

    for(let k = 0; k < kovMatrixCopy.length; k++) {
        activeEl = kovMatrixCopy[k][k];
        for(let i = 0; i < kovMatrixCopy.length; i++) {
            for(let j = 0; j < kovMatrixCopy[i].length; j++) {
                if(k === i) {
                    kovMatrixCopy[i][j] = kovMatrixCopy[i][j] / activeEl;
                }
            }
            if(k === i) {
                vilChMatrixCopy[i] = vilChMatrixCopy[i] / activeEl;
            }
        }
    
        let savedValue = 0;
        for(let i = 0; i < kovMatrixCopy.length; i++) {
            savedValue = kovMatrixCopy[i][k];
            for(let j = 0; j < kovMatrixCopy[i].length; j++) {
                if(k !== i) {
                   kovMatrixCopy[i][j] -= savedValue * kovMatrixCopy[k][j];
                }
            }
            if(k !== i) {
                vilChMatrixCopy[i] = vilChMatrixCopy[i] - savedValue * vilChMatrixCopy[k];
            }
        }
    }
    return [kovMatrixCopy, vilChMatrixCopy];
}

function showData(resultAr) {
    if(document.querySelectorAll(".result_p")) {
        document.querySelectorAll(".result_p").forEach(el => {
            el.remove();
        })
    }
    for(let i = 0; i < resultAr.length; i++) {
        const att = document.createAttribute("class");
        att.value = "result_p";
        const pEl = document.createElement("p");
        pEl.setAttributeNode(att);
        pEl.textContent = `X${i + 1} = ${Math.floor(resultAr[i])};`
        resultCont.appendChild(pEl);
    }
}

clearBtn.addEventListener('click', () => {
    clearInputs();
})

function clearInputs() {
    matrixInputs.forEach(element => {
        element.value = "";
    });
    if(document.querySelectorAll(".result_p")) {
        document.querySelectorAll(".result_p").forEach(el => {
            el.remove();
        })
    }
}

function showError(msg) {
    const errorP = document.getElementById("error-modal__text");
    errorMesg.style.right = "10px";
    errorP.textContent = msg;
}

function closeError() {
    const errorP = document.getElementById("error-modal__text");
    errorMesg.style.right = -window.innerWidth + "px";
    errorP.textContent = "";
} 