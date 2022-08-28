const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let isActiveMenuBar = false;

function switchMode() {
  setTimeout(() => {

    $("body").classList.toggle("dark-mode");
  }, 200)
}

$('.menu-btn').addEventListener('click', menuBtnClick)
$('.menu-bar').addEventListener('mouseover', menuHover)
$('.menu-bar').addEventListener('mouseout', menuHover)

var listMenuItem = $$('.menu-bar-item')
for (item of listMenuItem) {
  item.addEventListener('click', menuItemToggle)
}

function menuBtnClick(e) {
  if (!isActiveMenuBar) {
    $('.header').classList.add('header-active')
    $('.container').classList.add('container-active')
    $('.menu-bar').classList.add('menu-bar-active')
    $('.menu-bar-top').classList.add('menu-bar-top-active')
    isActiveMenuBar = true;
  } else {
    $('.header').classList.remove('header-active')
    $('.container').classList.remove('container-active')
    $('.menu-bar').classList.remove('menu-bar-active')
    $('.menu-bar-top').classList.remove('menu-bar-top-active')
    isActiveMenuBar = false;
  }
}

function menuHover(e) {
  if (isActiveMenuBar) return
  $('.menu-bar').classList.toggle('menu-bar-active')
  $('.menu-bar-top').classList.toggle('menu-bar-top-active')
}

function menuItemToggle(e) {
  console.log(e)
  console.log([e.target])
}

function openListEmployee() {
  document.getElementById("contentPageCurrent").innerHTML = '<object type="text/html" data="../pages/list-employee.html" width=100% height=100%></object>';
}