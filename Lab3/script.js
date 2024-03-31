const aInput = document.getElementById("a-value");
const bInput = document.getElementById("b-value");
const nInput = document.getElementById("n-value");
const xInput = document.getElementById("x-value");
const sectionButtons = document.querySelectorAll(".main__navbar-item button");
const sectionContents = document.querySelectorAll(".section");
const tabsButtons = document.querySelectorAll(".tabs__item");
const tabsContents = document.querySelectorAll(".tabs__content");
const clearBtn = document.getElementById("clear-btn");
const calculateBtn = document.getElementById("calculate-btn");
const graphicsBtn = document.getElementById("graphics-btn");
const sinBtn = document.getElementById("tab_sin");
const myBtn = document.getElementById("tab_my");
const table = document.getElementById("errors__table");
const errorsBtn = document.getElementById("errors-btn");
const xTable = document.getElementById("x-table");
const xTableColumns = document.querySelectorAll(".x-table-values");
const errorMesg = document.getElementById("error-message");
const errorClose = document.getElementById("close-error");
let x2Nodes;

let flag = true;
graphicsBtn.disabled = true;
errorsBtn.disabled = true;
let data1, data2, highlighNodes, highlighedX_1, highlighedX_2, tablesData, xTableData;

function task(flag, xNodes) {
    const yNodes = []
    if(flag) {
        xNodes.forEach(x => {
            yNodes.push(x * Math.cos(x + Math.log(1 + x)));
        });

        return yNodes;
    }
    xNodes.forEach(x => {
        yNodes.push(Math.sin(x));
    });

    return yNodes;
}

function xNodesGenerator(n, a, b) {
    const xNodes = [];

    hStep = (b - a) / (n - 1);
    for(let i = 0; i < n; i++) {
        xNodes.push(a + hStep * i);
    }
    return xNodes;
}

function increasedDegreeGenerator(n, a, b) {
    const xNodes = [];

    hStep = (b - a) / (n - 1);
    for(let i = 0; i <= n; i++) {
        xNodes.push(a + hStep * i);
    }
    return xNodes;
}


function xInterNodesGenerator(n, a, b) {
    const result = [];
    for (let i = 0; i < n; i++) {
        const randomValue = a + Math.random() * (b - a);
        result.push(randomValue);
    }
    return result;
    // const xNodes = [];
    // hStep = (b - a) / (n * 2)
    // for(let i = hStep; i <= n; i++) {
    //     xNodes.push(a + hStep * i);
    // }
    // return xNodes;
}

function xINodesGenerator(a, b, xNodes) {
    const xINodes = [];
    const step = 0.007;

    for(let i = a + step; i < b; i += step) {
        if(xNodes.map(item => item.toFixed(2)).includes(i.toFixed(2))) {
            continue
        }else{
            xINodes.push(i);
        }
    }
    return xINodes;
}
function lagrangeFormula(xNodes, yNodes, x) {
    let result = 0;
    for (let i = 0; i < xNodes.length; i++) {
        let temp = 1;
        for (let j = 0; j < i; j++) {
            temp *= (x - xNodes[j]) / (xNodes[i] - xNodes[j]);
        }
        for (let j = i + 1; j < xNodes.length; j++) {
            temp *= (x - xNodes[j]) / (xNodes[i] - xNodes[j]);
        }
        result += temp * yNodes[i];
    }
    return result;
}


function calculateData(flag, x2Nodes) {
    const xNodes = xNodesGenerator(Number(nInput.value), Number(aInput.value), Number(bInput.value));
    const xINodes = xINodesGenerator(Number(aInput.value),  Number(bInput.value), xNodes);
    const x3Nodes = increasedDegreeGenerator(Number(nInput.value), Number(aInput.value), Number(bInput.value));

    const yNodes = task(flag, xNodes);
    const y2Nodes = task(flag, x2Nodes);
    const y3Nodes = task(flag, x3Nodes);

    const yInterpolated = xINodes.map(x => lagrangeFormula(xNodes, yNodes, x));
    const y2Interpolated = x2Nodes.map(x => lagrangeFormula(xNodes, yNodes, x));
    const y3Interpolated = x2Nodes.map(x => lagrangeFormula(x3Nodes, y3Nodes, x));
 
    const yStatic = task(flag, xINodes);
    const staticY_X = {x: Number(xInput.value), y: parseFloat(task(flag, [Number(xInput.value)]))};
    const interpolatedY_X = {x: Number(xInput.value), y: lagrangeFormula(xNodes, yNodes, Number(xInput.value))};
    const yInterpolatedSpecial = {x: Number(xInput.value), y: lagrangeFormula(x3Nodes, y3Nodes, Number(xInput.value))}

    const staticValues = yNodes.map((y, i) => ({ x: xNodes[i], y }));
    const interpolatedValues = yInterpolated.map((y, i) => ({ x: xINodes[i], y }));
    const interpolatedValues2 = y2Interpolated.map((y, i) => ({ x: x2Nodes[i], y }));
    const interpolatedValues3 = y3Interpolated.map((y, i) => ({ x: x2Nodes[i], y }));

    const staticInterolatedValues = yStatic.map((y, i) => ({ x: xINodes[i], y }));
    const staticInterolatedValues2 = y2Nodes.map((y, i) => ({ x: x2Nodes[i], y }));

    const defferenceStaticInterpolatedY = interpolatedValues2.map((item, i) => {
        const y1 = item.y;
        const y2 = staticInterolatedValues2[i].y;

        return y1 - y2;
    });

    const secondDefference = interpolatedValues2.map((item, i) => {
        const y1 = item.y;
        const y2 = interpolatedValues3[i].y;
        
        return y1 - y2;  
    })

    const kValues = defferenceStaticInterpolatedY.map((item, i) => {
        const k1 = item;
        let k2 = secondDefference[i];
        if(k2 === 0) {
            k2 += 0.0001;
        }
        return 1 - k1 / k2;
    })
    const errorGraphicData = [];

    for(let i = 0; i < x2Nodes.length; i++) {
        errorGraphicData.push({x: x2Nodes[i], y: secondDefference[i]});
    }

    const tablesData = [secondDefference, defferenceStaticInterpolatedY, kValues];

    const mergedArray1 = [...interpolatedValues, ...staticValues, interpolatedY_X].sort((a, b) => a.x - b.x);
    const mergedArray2 = [...staticInterolatedValues, ...staticValues, staticY_X].sort((a, b) => a.x - b.x);

    const highlighIndexes = mergedArray1.reduce((acc, obj, index) => {
        if (xNodes.includes(obj.x)) {
            acc.push(index);
        }
        return acc;
    }, []);
    const highlighedX_1 = [{x: mergedArray1.find(item => item.x === Number(xInput.value)).x,
                        y: staticY_X.y
    }];
    const highlighedX_2 = [{x: mergedArray1.find(item => item.x === Number(xInput.value)).x,
        y: interpolatedY_X.y
    }];

    const highlightedData = highlighIndexes.map(index => ({
        x: mergedArray1[index].x,
        y: mergedArray1[index].y
    }));

    const xTableData = [];
    xTableData.push(interpolatedY_X.x);
    xTableData.push(interpolatedY_X.y);
    xTableData.push(interpolatedY_X.y - yInterpolatedSpecial.y);
    xTableData.push(interpolatedY_X.y - staticY_X.y);
    xTableData.push(1 - (interpolatedY_X.y - yInterpolatedSpecial.y) / (interpolatedY_X.y - staticY_X.y));

    return [mergedArray1, mergedArray2, highlightedData, highlighedX_1, highlighedX_2, tablesData, errorGraphicData.sort((a, b) => a.x - b.x), xTableData];
}

graphicsBtn.addEventListener("click", () => {
    showGraphic("graphic1", "graphic_1_container", data1, highlighNodes, highlighedX_2);
    showGraphic("graphic2", "graphic_2_container", data2, highlighNodes, highlighedX_1);
})

myBtn.addEventListener("click", () => {
    [data1, data2, highlighNodes, highlighedX_1, highlighedX_2, tablesData, errorGraphicData, xTableData] = calculateData(true, x2Nodes);
    showGraphic("graphic1", "graphic_1_container", data1, highlighNodes, highlighedX_2);
    showGraphic("graphic2", "graphic_2_container", data2, highlighNodes, highlighedX_1);
    showErrorGraphic("graphic3", "graphic_3_container", errorGraphicData)
})

sinBtn.addEventListener("click", () => {
    [data1, data2, highlighNodes, highlighedX_1, highlighedX_2, tablesData, errorGraphicData, xTableData] = calculateData(false, x2Nodes);
    showGraphic("graphic4", "graphic_4_container", data1, highlighNodes, highlighedX_2);
    showGraphic("graphic5", "graphic_5_container", data2, highlighNodes, highlighedX_1);
    showErrorGraphic("graphic6", "graphic_6_container", errorGraphicData)
})

sectionButtons.forEach((tab,index) => {
    tab.addEventListener("click", () => {
        tabs(sectionButtons, sectionContents, index);
    });
});

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

calculateBtn.addEventListener("click", () => {
    if(nInput.value !== "" && Number(aInput.value) > -0.99 && bInput.value !== "" && xInput.value !== "") {
        x2Nodes = xInterNodesGenerator(Number(nInput.value), Number(aInput.value), Number(bInput.value));
        [data1, data2, highlighNodes, highlighedX_1, highlighedX_2, tablesData, errorGraphicData, interpolatedY_X] = calculateData(true, x2Nodes);
        graphicsBtn.disabled = false;
        errorsBtn.disabled = false;
        showErrorGraphic("graphic3", "graphic_3_container", errorGraphicData)
    } else{
        showError("Перевірте введені дані!");
        graphicsBtn.disabled = true;
        errorsBtn.disabled = true;
    }
})

errorClose.addEventListener("click", () => {
    closeError();
})

clearBtn.addEventListener("click", () => {
    clearFields();
})

function clearFields() {
    aInput.value = "1"
    bInput.value = "5"
    nInput.value = ""
    xInput.value = ""
}

function showGraphic(el,container, data, highlighNodes, highlighedX) {
    if(document.getElementById(el)) {
        document.getElementById(el).remove();
      }
      const att = document.createAttribute("id");
      att.value = el;
      const newEl = document.createElement("canvas");
      newEl.setAttributeNode(att);
      document.getElementById(container).append(newEl)
    const ctx = document.getElementById(el).getContext('2d');

    const graphic = new Chart(ctx, {
        type: 'line', // Тип графіка
        data: {
          labels: data.map(xItems => xItems.x),
          datasets: [{
            label: "Highlighted X",
            data: highlighedX,
            pointRadius: 8,
            pointBackgroundColor: 'yellow',
            pointBorderColor: 'rgba(255, 0, 0, 0.5)',
            pointHoverRadius: 10,
            borderColor: "rgba(255, 0, 0, 0)",
        },{
            label: "Highlighted Points",
            data: highlighNodes,
            pointRadius: 8,
            pointBackgroundColor: 'red',
            pointBorderColor: 'rgba(255, 0, 0, 0.5)',
            pointHoverRadius: 10,
            borderColor: "rgba(255, 0, 0, 0)",
        }, {
            label: "y",
            data: data.map(yItems => yItems.y),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0, // Розмір точок
            pointBackgroundColor: 'rgb(75, 192, 192)', // Колір точок
            pointBorderColor: 'rgba(75, 192, 192, 0.5)', // Колір рамки точок
            pointHoverRadius: 8 // Розмір точок при наведенні
          }]
        },
        options: {
            responsive: true,
          scales: {
            x: {  
                title: {
                    display: true,
                    text: "x"
                  },
                ticks: {
                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                    callback: function(val, index) {
                        // Перевіряємо, чи є значення поля 'x' в об'єктах 'highlighted' в масиві 'val'
                        for (let i = 0; i < highlighNodes.length; i++) {
                            if (highlighNodes[i].x === val) {
                                return this.getLabelForValue(val); // Повертаємо значення, якщо знайдено
                            }
                        }
                        return ''; // Повертаємо пустий рядок, якщо значення не знайдено
                    }        
            },
            y: {
              title: {
                display: true,
                text: "y"
              },
              beginAtZero: true
            }
          },
        }
      }
    });
}

function showErrorGraphic(el,container, data) {
    if(document.getElementById(el)) {
        document.getElementById(el).remove();
      }
      const att = document.createAttribute("id");
      att.value = el;
      const newEl = document.createElement("canvas");
      newEl.setAttributeNode(att);
      document.getElementById(container).append(newEl)
    const ctx = document.getElementById(el).getContext('2d');

    const graphic = new Chart(ctx, {
        type: 'line', // Тип графіка
        data: {
          labels: data.map(xItems => xItems.x),
          datasets: [{
            label: "y",
            data: data.map(yItems => yItems.y),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0, // Розмір точок
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
                text: "x"
              }
            },
            y: {
              title: {
                display: true,
                text: "y"
              },
              beginAtZero: true
            }
          },
        }
      });
}

errorsBtn.addEventListener("click", () => {
    [data1, data2, highlighNodes, highlighedX_1, highlighedX_2, tablesData, errorGraphicData, xTableData] = calculateData(true, x2Nodes);
    createTable(Number(nInput.value), tablesData);
    addErrorXTable(xTableData)
})

function createTable(n, data) {
    const tableContent = document.getElementById("table__content");
    if(tableContent) {
        tableContent.remove();
    }
    const att = document.createAttribute("id");
      att.value = "table__content";
      const newEl = document.createElement("tbody");
      newEl.setAttributeNode(att);
      table.append(newEl)
    for (let i = 0; i < n; i++) {
        const row = document.createElement("tr");
        newEl.append(row);
        const column = document.createElement("td");
        column.textContent = i + 1;
        row.append(column)
        for(let j = 0; j < 3; j++) {
            const column = document.createElement("td");
            column.textContent = data[j][i];
            row.append(column);
        }
    }
}

function addErrorXTable(data) {
    for(let i = 0; i < data.length; i++) {
        xTableColumns[i].textContent = data[i];
    }
}

function showError(msg) {
    const errorP = document.getElementById("error-message-p");
    errorMesg.style.right = "5px";
    errorP.textContent = msg;
}

function closeError() {
    const errorP = document.getElementById("error-message-p");
    errorMesg.style.right = -window.innerWidth + "px";
    errorP.textContent = "";
} 