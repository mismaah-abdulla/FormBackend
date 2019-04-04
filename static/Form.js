var users = [];
getUserData();
setTimeout(() => {
    for(var user in users){
        getRow(user);
    }
}, 1000);


function submitOrUpdateForm(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var date = document.getElementById("birthDate").value;
    var rowNumber = document.getElementById("rowNumberHidden").value

    var isValid =  doValidation(name, email, password, date);
    if (!isValid){
        return;
    }
    
    var inputDate = new Date(date);
    if (rowNumber === ""){
        submitForm(name, email, password, inputDate);
    } else {
        updateForm(rowNumber, name, email, password, inputDate);
    }
}

function submitForm(name, email, password, inputDate) {
    var user = new User (name, email, password, inputDate);
    users.push(user);
    postUserData(user);
    document.getElementById("tableRows").innerHTML += getRow(user);
    clearForm();
}

function postUserData(user){
    fetch("http://127.0.0.1:5000/api",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            'name': user.name,
            'email': user.email,
            'password': user.password,
            'dateOfBirth': user.dateOfBirth
        })
    })
}

function getUserData(){
    fetch("http://127.0.0.1:5000/api")
    .then(response => {
        return response.json()
    })
    .then(data => {
        users = data
    })
    .catch(err => {
        console.log('ERROR')
    })
}

function doValidation(name, email, password, date){
    var validation = new UserValidator(name, email, password, date);
    var errorMessage = validation.validate();
    if (errorMessage){
        document.getElementById("error").innerHTML = errorMessage;
        return false;
    }
    return true;
}   

function getRow(user){
    return `<tr id="row${user.id}">
            <td class="nameCell">${user.name}</td>
            <td class="emailCell">${user.email}</td>
            <td class="passwordCell">
                <span id="encodedPassword${user.id}">${user.encodedPassword}</span>
                <button style="float: right;" id="decodePass" onmousedown="decodePassword(${user.id})" onmouseup="encodePassword(${user.id})">Decode</button>
            </td>
            <td>${user.age}</td>
            <td class=buttonCell>${generateRowButtons(user.id)}</td>
            </tr>`;
}

function encodePassword(userId){
    var user = users.find(x => x.id === userId);
    document.getElementById(`encodedPassword${userId}`).innerHTML = user.encodedPassword;
}

function decodePassword(userId){
    var user = users.find(x => x.id === userId);
    document.getElementById(`encodedPassword${userId}`).innerHTML = user.password;
}

function clearForm(){
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("birthDate").value = "";
    document.getElementById("error").innerHTML = "&nbsp;";
    document.getElementById("rowNumberHidden").value = "";
}

function showPassword(){
    document.getElementById("password").type = "text";
}

function hidePassword(){
    document.getElementById("password").type = "password";
}

function deleteRow(rowNumber){
    var rowToBeDeleted = document.getElementById(`row${rowNumber}`);
    rowToBeDeleted.parentNode.removeChild(rowToBeDeleted);
    var user = users.findIndex(x => x.id === rowNumber);
    users.splice(user, 1);
}

function editRow(rowNumber){
    clearForm();
    returnRowContent(rowNumber);
    changeFormButtonsForEditing(rowNumber);
    disableRowButtons();
}

function returnRowContent(rowNumber){
    var user = users.find(x => x.id === rowNumber);
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("password").value = user.password;
    document.getElementById("birthDate").value = user.dateOfBirth;
    document.getElementById("rowNumberHidden").value = user.id;
}

function changeFormButtonsForEditing(rowNumber){
    document.getElementById("actionButtons").innerHTML = "Update"
    document.getElementById("updateButtons").style.display = "inline-block"
}

function disableRowButtons(){
    var allButtons = document.querySelectorAll(`.buttonCell`);
    for (var i = 0; i < allButtons.length; i++){
        allButtons[i].innerHTML = "";
    }
}

function enableRowButtons(){
    var allRows = document.getElementById("tableRows");
    var rows = allRows.childNodes;
    for (var x = 1; x < rows.length; x++){
        var rowId = rows[x].id.substring(3);
        var buttonCells = document.querySelector(`#row${rowId} .buttonCell`);
        buttonCells.innerHTML = generateRowButtons(rowId);
    }
}

function generateRowButtons(rowNumber){
    return `<button style="float:left;" onclick="deleteRow(${rowNumber})">Delete row</button> <button style="float:right;" onclick="editRow(${rowNumber})">Edit row</button>`
}

function updateForm(rowNumber, name, email, password, inputDate){
    var user = users.find(x => x.id === parseInt(rowNumber));
    user.name = name;
    user.email = email;
    user.password = password;
    user.birthDate = inputDate;
    document.getElementById(`row${rowNumber}`).innerHTML = getRow(user);
    cancelUpdateForm();
}

function cancelUpdateForm(){
    clearForm();
    document.getElementById("actionButtons").innerHTML = "Submit"
    document.getElementById("updateButtons").style.display = "none"
    enableRowButtons();
}