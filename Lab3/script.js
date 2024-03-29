const tabsMenuItems = document.querySelectorAll(".tabs__item");
const menuButtons = document.querySelectorAll(".main__navbar-item button");
const sectionContentItems = document.querySelectorAll(".section");
const tabsContentItems = document.getElementsByClassName("tabs__content"); 

tabsMenuItems.forEach((tab,index) => {
    tab.addEventListener("click", () => tabs(tabsMenuItems, tabsContentItems, index));
});

menuButtons.forEach((tab,index) => {
    tab.addEventListener("click", () => tabs(menuButtons, sectionContentItems, index));
});

function tabs(menuElements, contentElements, activeIndex) {
    for (let index = 0; index < menuElements.length; index++) {
        contentElements[index].style.display = "none";
        menuElements[index].classList.remove("active");
    }

    menuElements[activeIndex].classList.add("active");
    contentElements[activeIndex].style.display = "flex";
}