// Đối tượng `Validator`
function Validator(options){
  
    function getParent(element,selector){
      while(element.parentElement){
        if(element.parentElement.matches(selector)){
            return element.parentElement;
        }
        element=element.parentElement;
      }
    }

   var selectorRules={};

   // Hàm thực hiện validate
   function validate(inputElement,rule){
        console.log(inputElement);
        var errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;
        // Lấy ra các rules của selector
        var rules=selectorRules[rule.selector];

        // Lặp qua từng rule & kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for(var i=0;i<rules.length; ++i){
           errorMessage=rules[i](inputElement.value);
           if(errorMessage){
                break;
           }
        }

        if(errorMessage){
            errorElement.innerText=errorMessage;
            inputElement.classList.add('invalid-input');
            errorElement.classList.add('invalid-mesage');
        }else{
            errorElement.innerText='';
            inputElement.classList.remove('invalid-input');
            errorElement.classList.remove('invalid-mesage');
        }
        
        // !! sẽ thành true và false
        return !errorMessage;
   }

    // Lấy element của form cần validate 
    var formElement=document.querySelector(options.form);
    if(formElement){
        // Khi submit form
        formElement.onsubmit=function(e){
            e.preventDefault();

            var isFormVlaid=true;


            // Lặp qua từng rules và validate
            options.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selector);
                var isValid=validate(inputElement,rule);
                if(!isValid){
                    isFormVlaid=false;
                }
            });
           
            if(isFormVlaid){
               // Trường hợp submit với javascript
               if(typeof options.onSubmit==='function'){
                    //[name]:not([disabled])
                    var enableInputs=formElement.querySelectorAll('[name]');
                    var formValues=Array.from(enableInputs).reduce(function(values,input){
                        //gán và return
                        //return (values[input.name]=input.value)&&values;
                        values[input.name]=input.value;
                        return values;
                    },{})
                    options.onSubmit(formValues);
               }
               //Trường hợp submit với hành vi mặc định
               else{
                    formElement.submit();
               }
            }
        }

        // Lặp qua mỗi rule và xử lý(lắng nghe sự kiện blur, input, ...)
        options.rules.forEach(function(rule){

             // Lưu lại các rules cho mỗi input

             if(Array.isArray(selectorRules[rule.selector])){
                     selectorRules[rule.selector].push(rule.test);
             }else{
                selectorRules[rule.selector]=[rule.test];
             }

             //selectorRules[rule.selector]=rule.test;
             
             var inputElement=formElement.querySelector(rule.selector);
            
             if(inputElement){
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur=function(){
                    validate(inputElement,rule);
                }

                // Xử lý mỗi khi người dùng  vào ô input
                inputElement.oninput=function(){
                    var errorElement=getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText="";
                    inputElement.classList.remove('invalid-input');
                    errorElement.classList.remove('invalid-mesage');
                }
             }
        });

    }
}

// Định nghĩa các rules(điều luật)
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra messae lỗi
// 2. Khi hợp lệ => Không trả ra cái gì cả (undefined)

//Trường giá trị không được null
Validator.isRequired=function(selector,message){
     return{
         selector:selector,
         test:function(value){
            return value.trim() ? undefined :message|| 'Vui lòng nhập trường này'
         }
     };
}

// Email nhập vào phải hợp lệ
Validator.isEmail=function(selector){
      return {
           selector: selector,
           test: function(value){
                //https://www.w3resource.com/javascript/form/email-validation.php
                var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return regex.test(value)?undefined:'Trường này phải là email';
           }
      };
}

// CMND thì có 9 sô còn CCCD thì có 12 số vậy nếu người dùng nhập khác 9 hoặc 12 ký tự thì thông báo 
Validator.isCmndMinLength=function(selector,cmndLength,cccdLength){
    return {
         selector: selector,
         test: function(value){
            return value.length==cmndLength||value.length==cccdLength? undefined : `Vui lòng nhập ${cmndLength} số nếu số CMND và ${cccdLength} số nếu số CCCD`; 
         }
    };
}

// Ràng buộc ngày nhập vào phải bé hơn hoặc bằng ngày hiện tại cả hệ thống
Validator.isDatevalid=function(selector){
    debugger;
    return {
         selector: selector,
         test: function(value){
            var datePresent=new Date();
            var dateValid=new Date(value);
            var dPresentgetTime=datePresent.getTime();
            var dValidgetTime=dateValid.getTime();
            console.log(dPresentgetTime);
            console.log(dValidgetTime);
            var checkdate=dValidgetTime<=dPresentgetTime;
            var check;
            console.log(checkdate);
            if(checkdate==true){
                check=true;
            }else{
                check='';
            }
            console.log(check);
            return check? undefined : 'Ngày phải nhỏ hơn hoặc bằng ngày hiện tại'; 
         }
    };
}