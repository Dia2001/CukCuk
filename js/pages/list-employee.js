const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

$('.header>.m-button').addEventListener('click', addBtnClickEmployee)
$('.add-employee-header>img').addEventListener('click', deleteBtnClickOutForm)

function addBtnClickEmployee(e) {
    $('.container-add-employee').classList.toggle('active')
     //document.getElementById('EmployeeCode').focus()
}
function deleteBtnClickOutForm(e) {
    $('.container-add-employee').classList.remove('active')
}

// Handle Api get data, add edit delete data