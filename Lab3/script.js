const tabsMenuItems = document.querySelectorAll(".tabs__item");
const menuButtons = document.querySelectorAll(".main__navbar-item button");
const sectionContentItems = document.querySelectorAll(".section");
const tabsContentItems = document.getElementsByClassName("tabs__content");
const calculateBtn = document.getElementById("calculate");
const aValue = document.getElementById("a-value");
const bValue = document.getElementById("b-value");
const nValue = document.getElementById("n-value");
const graphicsBtn = document.getElementById("graphics-btn");
const sinBtn = document.getElementById("tab_sin");
const myBtn = document.getElementById("tab_my");
let data1, data2, data3, data4, xNodes, x_0_Nodes;

calculateBtn.addEventListener("click", () => {
    [xNodes, x_0_Nodes] = generateXNodes(aValue.value, bValue.value, nValue.value);
})

sinBtn.addEventListener("click", () => {
    firstGroupGraphics()
})

function firstGroupGraphics() {
    data1 = []
    data2 = []
    const yNodes = examplaFunc(xNodes);
    const yNodes_1 = examplaFunc(x_0_Nodes);
    for(let i = 0; i < x_0_Nodes.length; i++) {
        const result = lagrangeFormula(xNodes, yNodes, x_0_Nodes[i]);
        data1.push({x: x_0_Nodes[i], y: result});
    }
    for(let i = 0; i < x_0_Nodes.length; i++) {
        data2.push({x: x_0_Nodes[i], y: yNodes_1[i]});
    }
    console.log(data1);
    console.log(data2);
    showGraphic("graphic_3_container", "graphic3", data1);
    showGraphic("graphic_4_container", "graphic4", data2);
}

myBtn.addEventListener("click", () => {
    secondGroupGraphics();
})

function secondGroupGraphics() {
    data3 = []
    data4 = []
    const yNodes = taskFunc(xNodes);
    const yNodes_1 = taskFunc(x_0_Nodes);
    for(let i = 0; i < x_0_Nodes.length; i++) {
        const result = lagrangeFormula(xNodes, yNodes, x_0_Nodes[i]);
        data3.push({x: x_0_Nodes[i], y: result});
    }
    for(let i = 0; i < x_0_Nodes.length; i++) {
        data4.push({x: x_0_Nodes[i], y: yNodes_1[i]});
    }
    showGraphic("graphic_1_container", "graphic1", data3);
    showGraphic("graphic_2_container", "graphic2", data4);
}

tabsMenuItems.forEach((tab,index) => {
    tab.addEventListener("click", () => tabs(tabsMenuItems, tabsContentItems, index));
});
graphicsBtn.addEventListener("click", () => {
    secondGroupGraphics();
})

menuButtons.forEach((tab,index) => {
    tab.addEventListener("click", () => {
        tabs(menuButtons, sectionContentItems, index);
        tabs(tabsMenuItems, tabsContentItems, 0);
    });
});

function tabs(menuElements, contentElements, activeIndex) {
    for (let index = 0; index < menuElements.length; index++) {
        contentElements[index].style.display = "none";
        menuElements[index].classList.remove("active");
    }
    
    menuElements[activeIndex].classList.add("active");
    contentElements[activeIndex].style.display = "flex";
}

function taskFunc(xNodes) {
    const yNodes = [];

    xNodes.forEach(x => {
        yNodes.push(x * Math.cos(x + Math.log(1 + x)));
    });

    return yNodes;
}

function examplaFunc(xNodes) {
    const yNodes = [];

    xNodes.forEach(x => {
        yNodes.push(Math.sin(x));
    });

    return yNodes;
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

function generateXNodes(A, B, N) {
    const xNodes = [];
    const x_0_Nodes = [];
    const a = Number(A);
    const b = Number(B);
    const n = Number(N);
    const hStep = (b - a) / 10;
    for(let i = 0; i <= 10; i++) {
        xNodes.push(a + hStep * i);
    }

    const hStep_0 = (b - a) / (n - 1);
    for(let i = 0; i < n; i++) {
        x_0_Nodes.push(a + hStep_0 * i);
    }
    return [xNodes, x_0_Nodes];
}

function showGraphic(idEl, idEl2, data) {
    if(document.getElementById(idEl2)) {
        document.getElementById(idEl2).remove();
      }
      const att = document.createAttribute("id");
      att.value = idEl2;
      const newEl = document.createElement("canvas");
      newEl.setAttributeNode(att);
      document.getElementById(idEl).append(newEl)
      const ctx = document.getElementById(idEl2).getContext('2d');

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