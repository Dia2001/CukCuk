// Handle Api get data, add edit delete data
$(document).ready(function() {
    // gán các sự kiện cho các element:
    initEvents();

    // Load dữ liệu:
    loadData();
})

var employeeId = null;
var formMode = "add";

/**
 * Thực hiện load dữ liệu lên table
 * Author: NVDIA (28/08/2022)
 */

// data employee
let dataEmployee=[];
// Trang hiển thị
let currentPage=1;
// Số giá trị trong 1 trang;
let perpage=10;
// Tống số trang
let totalpage=0;
let perdataEmployee=[];
function loadData(){
    $.ajax({
                type: "GET",
                async: false,
                url: "https://cukcuk.manhnv.net/api/v1/Employees",
                success: function(res) {
                    dataEmployee=res;
                    console.log(dataEmployee);
                    perdataEmployee=dataEmployee.slice(
                         (currentPage-1)*perpage,
                         (currentPage-1)*perpage+perpage,
                    );
                    $("table#tbEmployeeList tbody").empty();
                    // Xử lý dữ liệu từng đối tượng:
                    var sort = 1;
                    let ths = $("table#tbEmployeeList thead th");
                    for (const emp of perdataEmployee) {
                        // duyệt từng cột trong tiêu đề:
                        var trElement = $('<tr></tr>');
                        for (const th of ths) {
                            // Lấy ra propValue tương ứng với các cột:
                            const propValue = $(th).attr("propValue");
        
                            const format = $(th).attr("format");
                            // Lấy giá trị tương ứng với tên của propValue trong đối tượng:
                            let value = null;
                            if (propValue == "Sort")
                                value = sort
                            else
                                value = emp[propValue];
                            let classAlign = "";
                            switch (format) {
                                case "date":
                                    value = formatDate(value);
                                    classAlign = "text-align--center";
                                    break;
                                case "money":
                                    value = Math.round(Math.random(100) * 1000000);
                                    value = formatMoney(value);
                                    classAlign = "text-align--right";
                                    break;
                                default:
                                    break;
                            }
        
                            // Tạo thHTML:
                            let thHTML = `<td class='${classAlign}'>${value||""}</td>`;
        
                            // Đẩy vào trHMTL:
                            trElement.append(thHTML);
                        }
                        sort++;
                        $(trElement).data("id", emp.EmployeeId);
                        $(trElement).data("entity", emp);
                        $("table#tbEmployeeList tbody").append(trElement)
                    }
                    renderPgeNumber();
                },
                error: function(res) {
                    console.log(res);
                }
            });
}
function handlePageNumber(num){
    currentPage=num;
    console.log(currentPage);
    loadData();
    // nếu nhấn trang tiếp theo để phân trang thì màu trang đầu tiên sẽ mất
    if(num!=1){
        console.log("aaaaaaaaa");
        $(`#${1}`).removeClass("active");
    }
    // Thay đổi màu của trang chọn
    $(`#${num}`).addClass("active");
}
function renderPgeNumber(){
    $("#paging").empty();
    totalpage=dataEmployee.length/perpage;
    console.log(totalpage);
    if(totalpage%2!=0&&totalpage!=1){
        totalpage=Math.floor(totalpage)+1;
    }
    for(let i=1;i<=totalpage;i++){
        let pageNumberElement;
        if(i==1){
            pageNumberElement=`<a id="${i}" class="active" onclick="handlePageNumber(${i})">${i}</a>`;
        }else{
            pageNumberElement=`<a id="${i}" onclick="handlePageNumber(${i})">${i}</a>`;
        }
        $("#paging").append(pageNumberElement);
    }
}


/**
 * Định dạng hiển thị ngày tháng năm
 * @param {Date} date 
 * @returns 
 * Author: NVMANH (26/08/2022)
 */
 function formatDate(date) {
    try {
        if (date) {
            date = new Date(date);

            // Lấy ra ngày:
            dateValue = date.getDate();
            dateValue = dateValue < 10 ? `0${dateValue}` : dateValue;

            // lấy ra tháng:
            let month = date.getMonth() + 1;
            month = month < 10 ? `0${month}` : month;

            // lấy ra năm:
            let year = date.getFullYear();

            return `${dateValue}/${month}/${year}`;
        } else {
            return "";
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Định dạng hiển thị ngày tháng năm
 * @param {Date} date 
 * @returns 
 * Author: NVDIA (28/08/2022)
 */
 function formatDate(date) {
    try {
        if (date) {
            date = new Date(date);

            // Lấy ra ngày:
            dateValue = date.getDate();

            // lấy ra tháng:
            let month = date.getMonth() + 1;

            // lấy ra năm:
            let year = date.getFullYear();

            return `${dateValue}/${month}/${year}`;
        } else {
            return "";
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Định dạng hiển thị tiền VND
 * @param {Number} money 
 */
function formatMoney(money) {
    try {
        money = new Intl.NumberFormat('vn-VI', { style: 'currency', currency: 'VND' }).format(money);
        return money;
    } catch (error) {
        console.log(error);
    }
}

function initEvents(){

    // Xóa nhân viên
    $("#btnDelete").click(function() {
        console.log(employeeId);
        $("#form-1").hide();
        var result = confirm("Want to delete?");
        if (!result) {
            return;       
        }
        $.ajax({
            type: "DELETE",
            url: "https://cukcuk.manhnv.net/api/v1/employees/" + employeeId,
            success: function(response) {
                alert("Xóa thành công");
                // Load lại dữ liệu:
                loadData();
            },
            error: function(res) {
                console.log(res);
            }
        });
    });

    // Hiển thị form thêm và điền trước mã nhân viên nhờ vào API
    $("#btnAdd").click(function() {

        // Hiển thị form
        $("#form-1").show();

        // Focus vào ô nhập liệu đầu tiên:
        $('#form-1 input')[0].focus();
        formMode = "add";

        // Hiển thị form nhập thông tin chi tin chi tiết:
        $('input').val(null);
        $('select').val(null);
        // Lấy mã nhân viên mới thông qua Api 
        $.ajax({
            url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            method: "GET",
            success: function(newEmployeeCode) {
                console.log("Mã nhân viên"+newEmployeeCode);
                $("#EmployeeCode").val(newEmployeeCode);
                $("#EmployeeCode").focus();
            }
        });
    }) 

    // Dùng để gọi create or update
    $("#btnSave").click(saveData);

    // Ẩn form
    $("#btnClose").click(function() {
        $("#form-1").hide()
    });

    // Kích đúp chuột vào hàng hiển thị form chi tiết và có thể nhấn lưu để sửa
    $(document).on('dblclick', 'table#tbEmployeeList tbody tr', function() {
        formMode = "edit";
        // Hiển thị form:
        $("#form-1").show();

        // Focus vào ô input đầu tiên:
        $("#form-1 input")[0].focus();

        // Binding dữ liệu tương ứng với bản ghi vừa chọn:
        let data = $(this).data('entity');
        console.log(data);
        employeeId = $(this).data('id');

        // Duyệt tất cả các input:
        let inputs = $("#form-1 input,#form-1 select");
        for (const input of inputs) {
            // Đọc thông tin propValue:
            const propValue = $(input).attr("propValue");
            const format = $(input).attr("format");
            if (propValue) {
                let value="";
                if(propValue=='DateOfBirth'||propValue=="IdentityDate"||propValue=="JoinDate"){
                    if(data[propValue]){
                        value=moment(data[propValue], "YYYY-MM-DD").format('YYYY-MM-DD');             
                    }
                }
                else
                {
                    value = data[propValue];
                }
                input.value = value;
            }
        }
    });

    // In đậm dòng được chọn và xóa in đậm dòng đã chọn trước đó
    $(document).on('click', 'table#tbEmployeeList tbody tr', function() {
        // Xóa tất cả các trạng thái được chọn của các dòng dữ liệu khác:
        $(this).siblings().removeClass('row-selected');
        // In đậm dòng được chọn:
        this.classList.add("row-selected");
        employeeId = $(this).data('id');
    });

}

// Create and update 
function saveData() {
    // Thu thập dữ liệu:
    let inputs = $("#form-1 input,#form-1 select");
    var employee = {};
    console.log(employee);
    // build object:
    for (const input of inputs) {
        // Đọc thông tin propValue:
        const propValue = $(input).attr("propValue");
        // Lấy ra value:
        if (propValue) {
            let value = input.value;
            employee[propValue] = value;
        }
    }

    console.log(employee);
    // Gọi api thực hiện cất dữ liệu:
    if (formMode == "edit") {
        $.ajax({
            type: "PUT",
            url: "https://cukcuk.manhnv.net/api/v1/Employees/" + employeeId,
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                alert("Sửa dữ liệu thành công!");
                // load lại dữ liệu:
                loadData();
                // Ẩn form chi tiết:
                $("#form-1").hide();

            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "https://cukcuk.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function(response) {
                alert("Thêm mới dữ liệu thành công!");
                // load lại dữ liệu:
                loadData();
                // Ẩn form chi tiết:
                $("#form-1").hide();

            }
        });
    }


}