const modal = document.getElementById("entry-modal");
const modal2 = document.getElementById("info-modal");
const tabs = document.querySelectorAll('.modal__tabs-item');
const tabContents = document.querySelectorAll('.modal__tab-content');
const modalInputs = document.querySelectorAll(".modal__input");
const modalSecondInputs = document.querySelectorAll(".modal__second-input");
const closeButton = document.getElementsByClassName("modal__close");
const entryBtn = document.getElementById("entry-data-btn");
const infoBtn = document.getElementById("info-btn");
const saveBtn = document.getElementById("save-arrays");
const clearBtn = document.getElementById("clear-arrays");
const allInputs = document.getElementById("all-arrays-length");
const firstGraphic = document.getElementById("first-graphic");
const readBtn = document.getElementById("read-btn");
const errorMsg = document.getElementById("error-message");
const errorP = document.getElementById("error-message__text");
const errorCloseBtn = document.getElementById("error-message__close");
const check = document.getElementById("check");
const theoryGraphic = document.getElementById("theorty_graphic");

let lengthOfArrays;
let checked;
let marker;
let counter = 0;

readBtn.addEventListener("change", (e) => readData(e.target));

entryBtn.addEventListener("click", () => {
  toggleModal(modal);
  switchTab(0);
});
closeButton[0].addEventListener("click", () => {
  toggleModal(modal);
  clearInputs();
});
infoBtn.addEventListener("click", () => toggleModal(modal2));
closeButton[1].addEventListener("click", () => toggleModal(modal2));

saveBtn.addEventListener("click", () => saveArrays());
clearBtn.addEventListener("click", () => clearInputs());

firstGraphic.addEventListener("click", () => generateArrays());
theoryGraphic.addEventListener("click", () => showGraphic("graphic1", generateGraphicData(), "x", "y"))

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => switchTab(index));
  closeError();
});

function toggleModal(modalElement) {
  modalElement.style.display = modalElement.style.display === "block" ? "none" : "block";
  closeError();
}

function clearInputs() {
  [modalInputs, modalSecondInputs].forEach(inputs => {
    inputs.forEach(input => input.value = "");
  });
  check.checked = false;
  closeError();
}

function saveArrays() {
  let validInput = true;
  check.checked ? checked = true : checked = false;
  if (marker) {
    lengthOfArrays = Number(allInputs.value);
    if (lengthOfArrays < 3 || isNaN(lengthOfArrays)) {
      validInput = false;
    }
  } else {
    lengthOfArrays = Array.from(modalSecondInputs, input => Number(input.value));
    if (lengthOfArrays.some(value => value < 3 || isNaN(value))) {
      validInput = false;
    }
  }

  if (!validInput) {
    showError("Перевірте правильність введених даних");
    lengthOfArrays = null;
    return;
  }

  toggleModal(modal);
  clearInputs();
}

function switchTab(tabIndex) {
  tabContents.forEach(content => content.style.display = 'none');
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents[tabIndex].style.display = 'flex';
  tabs[tabIndex].classList.add('active');
  clearInputs();
  marker = (tabIndex === 0);
}

function generateEasyArray(arrayLength) {
  const newArray = Array.from({ length: arrayLength }, (_, i) => i + 1);
  console.log(newArray);
  return newArray;
}

function generateHardArray(arrayLength) {
  const newArray = Array.from({ length: arrayLength }, (_, i) => arrayLength - i);
  console.log(newArray);
  return newArray;
}

function generateAllArrays(arrayLengths, numOfArrays) {
  const arrays = Array.from({ length: numOfArrays }, () =>
    Array.from({ length: arrayLengths }, () => Math.floor(Math.random() * 100))
  );
  console.log(arrays);
  return arrays;
}
function generateAllArraysRandom(numOfArrays, arrayLengths, start) {
  const array = [];
  if(start === 0) {
    for(let i = start; i < numOfArrays; i++) {
      const newArray = [];
      for(let j = 0; j < arrayLengths[i]; j++) {
        newArray.push(Math.floor(Math.random() * 100));
      }
      array.push(newArray);
    }
    console.log(array);
  }else {
    for(let i = start; i <= numOfArrays; i++) {
      const newArray = [];
      for(let j = 0; j < arrayLengths[i]; j++) {
        newArray.push(Math.floor(Math.random() * 100));
      }
      array.push(newArray);
    }
    console.log(array);
  }
  return array;
}

function generateArrays() {
  if (!lengthOfArrays) {
    showError("Введіть дані");
    return;
  }

  let arrToSort;
  if (marker) {
    if(checked) {
      const firstArr = generateHardArray(lengthOfArrays);
      const secondArr = generateAllArrays(lengthOfArrays, 8);
      const thirdArr = generateEasyArray(lengthOfArrays);
      arrToSort = [firstArr, ...secondArr, thirdArr];
    }
    else{
      arrToSort = generateAllArrays(lengthOfArrays, 10);
    }
  } else {
    if(checked) {
      console.log(checked);
      const firstArr = generateHardArray(lengthOfArrays[0]);
      const secondArr = generateAllArraysRandom(8, lengthOfArrays, 1);
      const thirdArr = generateEasyArray(lengthOfArrays[lengthOfArrays.length - 1]);
      arrToSort = [firstArr, ...secondArr, thirdArr];
      console.log(arrToSort);
    }
    else{
      arrToSort = generateAllArraysRandom(10, lengthOfArrays, 0);
    }
  }

  const [sortedArr, times] = insertionSort(arrToSort);
  const data = objFromArr(sortedArr, times);
  showGraphic("graphic1", data, "Кількість елементів", "Час виконання");
}

function readData(fileInput) {
  let file = fileInput.files[0];
  let reader = new FileReader();

  reader.onload = function (event) {
    let data = event.target.result;
    writeData(data)
    fileInput.value = "";
  };

  reader.readAsText(file);
}

function writeData(data) {
  if(marker) {
    allInputs.value = data;
  }else{
    modalSecondInputs.forEach((input, index) => {
      input.value = data.split(" ")[index];
    })
  }
}

function insertionSort(ar) {
  const times = [];
  ar.forEach(element => {
    const start = Date.now();
    for (let j = 1; j < element.length; j++) {
        let key = element[j];
        let i = j - 1;
        while (i >= 0 && element[i] > key) {
            element[i + 1] = element[i];
            i = i - 1;
        }
        element[i + 1] = key;
    }
    const end = Date.now() - start;
    times.push(end);
  });
  return [ar, times];
}

function showError(message) {
  errorMsg.style.right = "10px";
  errorP.textContent = message;
}
function closeError() {
  errorMsg.style.right = -window.innerWidth + "px";
  errorP.textContent = "";
}

errorCloseBtn.addEventListener("click", function () {
  closeError();
});

function concateArr(first, second, third){
  const result = [];

  result.push(first);
  second.forEach(element => {
    result.push(element);
  });
  result.push(third);

  return result;
}

function objFromArr(arr, times) {
  const data = times.map((time, index) => ({
    time,
    lengthArr: arr[index].length
  }));

  return data;
}

function showGraphic(el, data, x_label, y_label) {
  if(document.getElementById(el)) {
    document.getElementById(el).remove();
  }
  const att = document.createAttribute("id");
  att.value = el;
  const newEl = document.createElement("canvas");
  newEl.setAttributeNode(att);
  document.getElementById("graphic").append(newEl)
  console.log(data);
  const ctx = document.getElementById(el).getContext('2d');

      const graphic = new Chart(ctx, {
        type: 'line', // Тип графіка
        data: {
          labels: data.map(entry => entry.lengthArr),
          datasets: [{
            label: y_label,
            data: data.map(entry => entry.time),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 5, // Розмір точок
            pointBackgroundColor: 'rgb(75, 192, 192)', // Колір точок
            pointBorderColor: 'rgba(75, 192, 192, 0.5)', // Колір рамки точок
            pointHoverRadius: 8 // Розмір точок при наведенні
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: x_label
              }
            },
            y: {
              title: {
                display: true,
                text: y_label
              },
              beginAtZero: true
            }
          }
        }
      });
}

function generateGraphicData() {
  const data = [];
  for (let i = 0; i < 20000; i += 1000) {
    data.push({
      time: i ** 2,
      lengthArr: i,
    });
  }
  console.log(data);
  return data;
}