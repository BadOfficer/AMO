const first_algorithm = document.getElementById("first_algorithm");
const second_algorithm = document.getElementById("second_algorithm");
const third_algorithm = document.getElementById("third_algorithm");
const first_btn = document.getElementById("first-algorithm_btn");
const second_btn = document.getElementById("second-algorithm_btn");
const third_btn = document.getElementById("third-algorithm_btn");
const firstCalcBtn = document.getElementById("first_calc");
const secondCalcBtn = document.getElementById("second_calc");
const thirdCalcBtn = document.getElementById("third_calc");
const firstReadBtnA = document.getElementById("first_read_a");
const firstReadBtnZ = document.getElementById("first_read_z");
const secondReadBtnA = document.getElementById("second_read_a");
const secondReadBtnX = document.getElementById("second_read_x");
const thirdReadBtnA = document.getElementById("third_read_a");
const thirdReadBtnB = document.getElementById("third_read_b");
const clearFirst = document.getElementById("clear_first");
const clearSecond = document.getElementById("clear_second");
const clearThird = document.getElementById("clear_third");

window.onload = function () {
  toggleModal(false);
};

first_btn.addEventListener("click", function () {
  selectAlgorithm(first_algorithm, first_btn);
});
firstCalcBtn.addEventListener("click", function () {
  firstAlgorithm(firstCalcBtn);
});
clearFirst.addEventListener("click", function () {
  clearInput("first_res", "first_a", "first_z");
});

second_btn.addEventListener("click", function () {
  selectAlgorithm(second_algorithm, second_btn);
});
secondCalcBtn.addEventListener("click", function () {
  secondAlgorithm();
});
clearSecond.addEventListener("click", function () {
  clearInput("second_res", "second_a", "second_x");
});

third_btn.addEventListener("click", function () {
  selectAlgorithm(third_algorithm, third_btn);
});
thirdCalcBtn.addEventListener("click", function () {
  thirdAlgorithm();
});
clearThird.addEventListener("click", function () {
  clearInput("third_res", "third_a", "third_b");
});

firstReadBtnA.addEventListener("change", handleFirstReadA);
firstReadBtnZ.addEventListener("change", handleFirstReadZ);
secondReadBtnA.addEventListener("change", handleSecondReadA);
secondReadBtnX.addEventListener("change", handleSecondReadX);
thirdReadBtnA.addEventListener("change", handleThirdReadA);
thirdReadBtnB.addEventListener("change", handleThirdReadB);

function handleFirstReadA(e) {
  enterData(e.target, document.getElementById("first_a"));
}

function handleFirstReadZ(e) {
  enterData(e.target, document.getElementById("first_z"));
}

function handleSecondReadA(e) {
  enterData(e.target, document.getElementById("second_a"));
}

function handleSecondReadX(e) {
  enterData(e.target, document.getElementById("second_x"));
}

function handleThirdReadA(e) {
  enterData(e.target, document.getElementById("third_a"));
}

function handleThirdReadB(e) {
  enterData(e.target, document.getElementById("third_b"));
}

function selectAlgorithm(algorithm, button) {
  const btn = document.getElementsByClassName("side-menu_button");
  const tabConetnt = document.getElementsByClassName("main-content_card");
  const selectError = document.getElementById("select-error");
  const inputs = document.getElementsByClassName("entry_data");
  const res = document.getElementsByClassName("res");

  for (let i = 0; i < res.length; i++) {
    res[i].textContent = 0;
  }

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }

  for (let i = 0; i < tabConetnt.length; i++) {
    tabConetnt[i].style.display = "none";
  }

  for (let i = 0; i < btn.length; i++) {
    btn[i].disabled = false;
  }

  algorithm.style.display = "flex";
  button.disabled = true;
  selectError.style.display = "none";
}

function firstAlgorithm() {
  const a = Number(document.getElementById("first_a").value);
  const z = Number(document.getElementById("first_z").value);

  const res = document.getElementById("first_res");

  const Y1 = Math.ceil(a - z) + Math.ceil(a + z) / 6;

  res.textContent = Y1;
}

function secondAlgorithm() {
  const a = Number(document.getElementById("second_a").value);
  const x = Number(document.getElementById("second_x").value);
  const res = document.getElementById("second_res");
  let y;

  if (a > 10) {
    y = 2 * a ** 2 + x;
  } else {
    y = 2 * a ** 2 - x;
  }

  res.textContent = y;
}

function thirdAlgorithm() {
  const aInput = document.getElementById("third_a").value.trim();
  const bInput = document.getElementById("third_b").value.trim();
  const aList = aInput.split(/\s+/);
  const bList = bInput.split(/\s+/);
  const res = document.getElementById("third_res");
  let f = 1;
  const digitPattern = /^\d+(\s+\d+)*$/;

  if (!digitPattern.test(aInput) || !digitPattern.test(bInput)) {
    toggleModal(true, "Введіть лише числа, розділені пробілами");
    return;
  } else if (aList.length !== 5 || bList.length !== 5) {
    toggleModal(true, "Введіть лише 5 чисел");
    return;
  }

  for (let i = 0; i < 5; i++) {
    if (Number(aList[i]) === 0 || Number(bList[i]) === 0) {
      toggleModal(true, "Присутнє ділення на 0");
      return;
    } else {
      f *=
        (Number(aList[i]) ** 3 - Number(bList[i]) ** 2) /
        (Number(aList[i]) * Number(bList[i]));
      res.textContent = f;
    }
  }
}

function enterData(fileInput, el) {
  let file = fileInput.files[0];
  let reader = new FileReader();

  reader.onload = function (event) {
    let data = event.target.result;
    el.value = data;

    if (el.value === "") {
      toggleModal(true, "Неприпустимий формат даних");
      fileInput.value = "";
    }
  };

  reader.readAsText(file);
}

function clearInput(res, ...inp) {
  document.getElementById(res).textContent = 0;
  for (i = 0; i < inp.length; i++) {
    document.getElementById(inp[i]).value = "";
  }
}

function toggleModal(state, message) {
  const modal = document.getElementById("modal");
  const errorText = document.getElementById("modal-text");
  const btn = document.getElementById("modal-btn");

  let timer;

  btn.addEventListener("click", function () {
    modal.style.right = -window.innerWidth + "px";
    errorText.textContent = "";
    clearTimeout(timer);
  });

  if (!state) {
    modal.style.right = -window.innerWidth + "px";
    errorText.textContent = "";
  } else {
    modal.style.right = "15px";
    errorText.textContent = message;
    timer = setTimeout(function () {
      modal.style.right = -window.innerWidth + "px";
      errorText.textContent = "";
    }, 5000);
  }
}
