const clearBtn = document.getElementById("clear-btn");
const matrixInputs = document.querySelectorAll(".r_c-input-entry");
const finalMatrixInputs = document.querySelectorAll(".r_c-input");
const matrixKofs = document.querySelectorAll(".kof_sys");
const matrixVilCh = document.querySelectorAll(".vil_ch");
const calcBtn = document.getElementById("calculate-btn");
const resultCont = document.getElementById("result");
const errorMesg = document.getElementById("error");
const closeBtn = document.getElementById("close-btn");
const entryMatrixBtn = document.getElementById("entry-matrix-btn");
const finalMatrixBtn = document.getElementById("final-matrix-btn");

finalMatrixBtn.disabled = true;
entryMatrixBtn.disabled = true;

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
    const flag = showData(readyMatrixVilCh);
    if(flag) {
        entryFinalMatrix(concateData(readyMatrixKofs, readyMatrixVilCh));
        finalMatrixBtn.disabled = false;
    }
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
    let kovMatrixCopy= [...kovMatrix];
    let vilChMatrixCopy = [...vilChMatrix];
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
            if(k === i) {
                for(let j = 0; j < kovMatrixCopy[i].length; j++) {
                    kovMatrixCopy[i][j] = kovMatrixCopy[i][j] / activeEl;
                }
                vilChMatrixCopy[i] = vilChMatrixCopy[i] / activeEl;
            }
        }
    
        let savedValue = 0;
        for(let i = 0; i < kovMatrixCopy.length; i++) {
            savedValue = kovMatrixCopy[i][k];
            if(k !== i) {
                for(let j = 0; j < kovMatrixCopy[i].length; j++) {
                   kovMatrixCopy[i][j] -= savedValue * kovMatrixCopy[k][j];
                }
                vilChMatrixCopy[i] = vilChMatrixCopy[i] - savedValue * vilChMatrixCopy[k];
            }
        }
    }
    console.log(kovMatrixCopy);
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
        if(isNaN(resultAr[i])) {
            pEl.textContent = "СЛАР не має розв'язків!";
            resultCont.appendChild(pEl);
            return
        }
        pEl.textContent = `X${i + 1} = ${resultAr[i].toFixed(3)};`
        resultCont.appendChild(pEl);
    }
    return true;
}

clearBtn.addEventListener('click', () => {
    clearInputs();
})

function clearInputs() {
    matrixInputs.forEach(element => {
        element.value = "";
    });
    finalMatrixBtn.disabled = true;
    entryMatrixBtn.disabled = true;
    calcBtn.disabled = false;
    showMatrix("entry-matrix");
    finalMatrixInputs.forEach(element => {
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


entryMatrixBtn.addEventListener("click", () => {
    showMatrix("entry-matrix");
    finalMatrixBtn.disabled = false;
    entryMatrixBtn.disabled = true;
    calcBtn.disabled = false;
})

finalMatrixBtn.addEventListener("click", () => {
    showMatrix("final-matrix");
    entryMatrixBtn.disabled = false;
    finalMatrixBtn.disabled = true;
    calcBtn.disabled = true;
})

function showMatrix(matrix) {
    const matrixAr = document.querySelectorAll(".matrix");
    const curr_matrix = document.getElementById(matrix);

    matrixAr.forEach(matrix_el => {
        matrix_el.style.display = "none";
    })

    curr_matrix.style.display = "flex";
}

function concateData(firArr, secArr) {
    let resultArray = [...firArr];
    for(let i = 0; i < firArr.length; i++) {
        resultArray[i].push(secArr[i]);
    }
    const flattenedArray = resultArray.reduce((acc, curr) => acc.concat(curr), []);

    console.log(flattenedArray);
    return flattenedArray;
}

function entryFinalMatrix(data) {
    for(let i = 0; i < finalMatrixInputs.length; i++) {
        finalMatrixInputs[i].disabled = true;
        if(data[i].toFixed(3) % 1 !== 0) {
            finalMatrixInputs[i].value = data[i].toFixed(3);
        } else {
            finalMatrixInputs[i].value = data[i];
        }
    }
}