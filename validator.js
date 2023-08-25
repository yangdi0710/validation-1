// Doi tuong Validator
function Validator(options){

    function getParent (element, selector){
        while (element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {};

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage
        
        // Lay qua cac rule cua selector
        var rules = selectorRules[rule.selector]
        
        // Lap qua tung rule va kiem tra
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; i++){
            switch (inputElement.type){

                case 'radio':
                case '':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;

                default: 
                    errorMessage = rules[i](inputElement.value)
            }
            if(errorMessage) break
        }

        if(errorMessage){
            errorElement.innerText = errorMessage
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = ''
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
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
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector(`input[name="${input.name}"]:checked`).value
                                break
                                
                            case 'checkbox':
                                if(!input.matches(':checked')){
                                    values[input.name] = ''
                                    return values;
                                };

                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break;

                            case 'file':
                                values[input.name] = input.files
                                break;
                            default:
                                values[input.name] = input.value
                        }
                        return values
                    }, {})

                    options.onSubmit(formValues)
                }
            // Truong hop Submit voi hanh vi mac dinh 
            } else {
                // formElement.submit()
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
            

            var inputElements = formElement.querySelectorAll(rule.selector)

            Array.from(inputElements).forEach(function(inputElement){
                //Xu ly truong hop blur khoi input
                inputElement.onblur = function (){
                    validate(inputElement, rule)
                }

                //Xu ly truong hop khi nguoi dung nhap vao input
                inputElement.oninput = function (){
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })
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
            return value ? undefined : message || 'Vui long nhap truong nay'
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