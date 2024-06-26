const aField = document.getElementById("a");
const bField = document.getElementById("b");
const eField = document.getElementById("e");
const calcBtn = document.getElementById("calculate-btn");
const xNab = document.getElementById("result");
const xNabSegment = document.getElementById("result-segment");
const tabsButtons = document.querySelectorAll(".menu__buttons-item");
const tabsContents = document.querySelectorAll(".main__tab-content");
const table = document.getElementById("data-table");
const tableBtn = document.getElementById("table-btn");
const graphicBtn = document.getElementById("graphic-btn");
const clearBtn = document.getElementById("clear-btn");

function myFunc(x) {
    return x ** 3 + 2 * x - 4;
}

tableBtn.disabled = true;
graphicBtn.disabled = true;

let n = 1;
let ranges = [];
let graphicData = [];

calcBtn.addEventListener("click", () => {
    tableBtn.disabled = false;
    graphicBtn.disabled = false;
    calculateData();
})

function myMethod(a, b, e) {
    const c = (b + a) / 2;

    ranges.push([n, a, c, b, myFunc(a), myFunc(c), myFunc(b)]);

    if(Math.abs(b - a) <= e) {
        return [c, n];
    }
    if(myFunc(c) === 0) {
        return [c, n];
    }
    if(myFunc(a) * myFunc(c) < 0) {
        n += 1;
        return myMethod(a, c, e);
    }

    n += 1;
    return myMethod(c, b, e);
}

function calculateData() {
    n = 1; 
    ranges = [];
    graphicData = [];
    console.log(myFunc(Number(aField.value)) * myFunc(Number(bField.value)));

    if((myFunc(Number(aField.value)) * myFunc(Number(bField.value))) >= 0) {
        alert("Змініть дані!");
        return
    }

    const [xN, nK] = myMethod(Number(aField.value), Number(bField.value), +eField.value);
    xNab.textContent = xN;
    xNabSegment.textContent = `[${ranges[ranges.length - 1][1]}; ${ranges[ranges.length - 1][3]}]`;

    for(let i = Number(aField.value); i < Number(bField.value); i += 0.1) {
        if(i.toFixed(1) === xN.toFixed(1)) {
            continue
        }
        graphicData.push({x: i.toFixed(2), y: myFunc(i)})
    }
    graphicData.push({x: xN, y: myFunc(xN)});
    graphicData.sort((a, b) => a.x - b.x);
    console.log(ranges);
    createTable(ranges);
    console.log(xN);
    const markedData = {x: xN, y: myFunc(xN)}
    showGraphic("graphic", "graphic-container", graphicData, markedData);
}
tabsButtons.forEach((tab,index) => {
    tab.addEventListener("click", () => tabs(tabsButtons, tabsContents, index));
});

function tabs(menuElements, contentElements, activeIndex) {
    for (let index = 0; index < menuElements.length; index++) {
        contentElements[index].style.display = "none";
        menuElements[index].classList.remove("active");
    }
    
    menuElements[activeIndex].classList.add("active");
    contentElements[activeIndex].style.display = "flex";
}

function createTable(data) {
    const tableContent = document.getElementById("table__content");
    if(tableContent) {
        tableContent.remove();
    }
    const att = document.createAttribute("id");
      att.value = "table__content";
      const newEl = document.createElement("tbody");
      newEl.setAttributeNode(att);
      table.append(newEl)
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement("tr");
        newEl.append(row);
        for(let j = 0; j < data[i].length; j++) {
            const column = document.createElement("td");
            column.textContent = data[i][j];
            row.append(column);
        }
    }
}

function showGraphic(el, container, data, markedData) {
    if(document.getElementById(el)) {
        document.getElementById(el).remove();
      }
      const att = document.createAttribute("id");
      att.value = el;
      const newEl = document.createElement("canvas");
      newEl.setAttributeNode(att);
      document.getElementById(container).append(newEl)
    const ctx = document.getElementById(el).getContext('2d');
      console.log(markedData);
    const graphic = new Chart(ctx, {
        type: 'line', // Тип графіка
        data: {
          labels: data.map(xItems => xItems.x),
          datasets: [{
            label: "y",
            data: data.map(yItems => yItems.y),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            pointRadius: 1, // Розмір точок
            pointBackgroundColor: 'rgb(75, 192, 192)', // Колір точок
            pointBorderColor: 'rgba(75, 192, 192, 0.5)', // Колір рамки точок
            pointHoverRadius: 8 // Розмір точок при наведенні
          }, {
            label: "Highlighted X",
            data: [markedData],
            pointRadius: 8,
            pointBackgroundColor: 'yellow',
            pointBorderColor: 'rgba(255, 0, 0, 0.5)',
            pointHoverRadius: 10,
            borderColor: "rgba(255, 0, 0, 0)",
        }]
        },
        options: {
          scales: {
            x: {  
                title: {
                    display: true,
                    text: "x"
                  },
                },
            y: {
              title: {
                display: true,
                text: "y"
              },
              beginAtZero: true
            }
        }
      }
    });
}

function clearData() {
    tableBtn.disabled = true;
    graphicBtn.disabled = true;
    aField.value = "";
    bField.value = "";
    eField.value = "";
    xNab.textContent = "";
    xNabSegment.textContent = "";
}

clearBtn.addEventListener("click", () => {
    clearData();
})