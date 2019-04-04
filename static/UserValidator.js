const NAME_MAX = 30;
const NAME_MIN = 1;
const VALID_EMAIL = /\S+@\S+\.\S+/;

class UserValidator {
    constructor (name, email, password, date){
        this.name = name;
        this.email = email;
        this.password = password;
        this.date = date;
    }

    validate () {
        if (this.areAnyFieldsEmpty()) {
            return "Please fill all fields.";
        }

        if (!this.isValidName()){
            return `Name should be between ${NAME_MIN} and ${NAME_MAX} characters.`;
        }

        if (!this.isValidEmail()){
            return "Must be a valid email.";
        }
        return null;
    }

    areAnyFieldsEmpty (){
        return this.isEmpty(this.name) ||
            this.isEmpty(this.email) || 
            this.isEmpty(this.password) || 
            this.isEmpty(this.date);
    }

    isEmpty (field){
        return field.trim() === "";
    }

    isValidName(){
        return this.name.length < NAME_MAX && this.name.length > NAME_MIN;
    }

    isValidEmail(){
        return VALID_EMAIL.test(this.email.toLowerCase());
    }
}