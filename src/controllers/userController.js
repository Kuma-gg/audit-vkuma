var moment = require('moment');
var passwordValidator = require('password-validator');
module.exports = function () {
    this.verifyParametrizationsPassword = function verifyPassword(password, parametrization, user) {
        const errors = [];

        var schema = new passwordValidator();
        var minCha = 0;
        var maxChar = 0;
        var specialCharacters = false;
        var notAllowed = [];
        var stringMessage = " La contraseña debe tener ";

        for (const parameter of parametrization) {
            switch (parameter.code) {
                case 'minLetters':
                    minCha = parameter.value * 1;
                    stringMessage += " ,minimo " + parameter.value;
                    break;
                case 'maxLetters':
                    maxChar = parameter.value * 1;
                    stringMessage += " ,maximo " + parameter.value;
                    break;
                case 'specialCharacters':
                    if (parameter.value == "SI") {
                        specialCharacters = true;
                        stringMessage += " y debe contener mayusculas,minusculas,digitos,no tener espacios ";
                    }
                    break;
                case 'notAllowed':
                    if (parameter.value != "") {
                        notAllowed = parameter.value.replace(/^\[|\]$/g, "").split(",");;
                        stringMessage += " ,estas contraseñas no estan permitidas " + parameter.value;
                    }
                    break;
                default:
                    break;
            }
        }

        if (specialCharacters == true) {
            schema
                .is().min(minCha)                                    // Minimum length 8
                .is().max(maxChar)                                  // Maximum length 100
                .has().uppercase()                              // Must have uppercase letters
                .has().lowercase()                              // Must have lowercase letters
                .has().digits()                                 // Must have digits
                .has().not().spaces()                           // Should not have spaces
                .is().not().oneOf(notAllowed);

        } else {
            schema
                .is().min(minCha)
                .is().max(maxChar)
                .has().not().uppercase()                              // Must have uppercase letters
                .has().not().lowercase()                              // Must have lowercase letters
                .has().not().digits()                                 // Must have digits
                .has().spaces()   
                .is().not().oneOf(notAllowed);;
        }
        if (schema.validate(password) == false) {
            errors.push({ text: stringMessage });
        }
        return errors;

    },
        this.sumDays = function sumDays(numberdays, todayDate) {
            var a = moment(todayDate);
            var b = a.add(numberdays, "days");
            return b;
        }
        ,
        this.subtractDays = function subtractDays(lastChange, todayDate) {
            var a = moment(todayDate);
            var b = a.diff(lastChange, "days");
            return b;
        }

};

function getValues() {

}