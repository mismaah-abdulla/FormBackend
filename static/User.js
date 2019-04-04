class User {
    constructor (name, email, password, birthDate) {
        User.count++;
        this.id = User.count;
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
    }

    get age(){
        var currentDate = new Date();
        var age = currentDate.getFullYear() - this.birthDate.getFullYear();
        return age;
    }

    get dateOfBirth(){
        return this.birthDate.toISOString().split('T')[0];
    }

    get encodedPassword(){
        var encodedPassword = window.btoa(this.password);
        return encodedPassword;
    }

    static get COUNT() {
        return User.count;
    }

}

User.count = 0;