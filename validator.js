// Doi tuong Validator
function Validator(options){

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value)
        if(errorMessage){
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
    }

    // Lay element cua form can validate 
    var formElement = document.querySelector(options.form)
    if(formElement){
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selectors)
            
            if(inputElement){
                //Xu ly truong hop blur khoi input
                inputElement.onblur = function (){
                    validate(inputElement, rule)
                }

                //Xu ly truong hop khi nguoi dung nhap vao input
                inputElement.oninput = function (){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }
}

// Dinh nghia cac rules
// Nguyen tac cua cac rule: 
// => Khi co loi => tra ra message loi
// => Khi hop le => Khong tra ra gi (undefined)
Validator.isRequired = function(selectors){
    return {
        selectors: selectors,
        test: function (value){
            return value.trim() ? undefined : 'Vui long nhap truong nay'
        }
    }
}

Validator.isEmail = function(selectors){
    return {
        selectors: selectors,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Truong nay phai la email'
        }
    }
}

Validator.minLength = function(selectors, min){
    return {
        selectors: selectors,
        test: function (value){
            return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ky tu`
        }
    }
}