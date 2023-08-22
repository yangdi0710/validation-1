// Doi tuong Validator
function Validator(options){

    var selectorRules = {};

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage
        
        // Lay qua cac rule cua selector
        var rules = selectorRules[rule.selector]
        
        // Lap qua tung rule va kiem tra
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; i++){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break
        }

        if(errorMessage){
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage;
    }

    // Lay element cua form can validate 
    var formElement = document.querySelector(options.form)

    if(formElement){
        
        // Khi submit form
        formElement.onsubmit = function (e){
            e.preventDefault();

            var isFormValid = true;


            // Lap qua tung rule va validate
            options.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)

                if(!isValid){
                    isFormValid = false
                }
            })
            

            if(isFormValid){
                // Truong hop Submit voi JS
                if(typeof options.onSubmit === 'function'){

                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        return (values[input.name] = input.value) && values
                    }, {})

                    options.onSubmit(formValues)
                }
            // Truong hop Submit voi hanh vi mac dinh 
            } else {
                formElement.submit()
            }
        }
        
        // Lap qua moi rule va xu ly (lang nghe su kien blur, input,...)
        options.rules.forEach(function(rule) {
            
            // Luu lai cac rule cho moi input
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
            

            var inputElement = formElement.querySelector(rule.selector)
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
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: function (value){
            return value.trim() ? undefined : message || 'Vui long nhap truong nay'
        }
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Truong nay phai la email'
        }
    }
}

Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function (value){
            return value.length >= min ? undefined : message || `Vui long nhap toi thieu ${min} ky tu`
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : message || 'Gia tri nhap vao khong chinh xac'
        }
    }
}