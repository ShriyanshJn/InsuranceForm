// import { currentUserId, existingUser, allUsersList, postUserData } from './index.js'

function getAllFieldValues() {
    // first name
    let firstname = document.getElementById('firstname').value.trim()
    document.getElementById('finalfirstname').innerHTML = firstname
    // middle name
    let middlename = document.getElementById('middlename').value.trim()
    if (middlename != null || middlename != undefined || middlename != '') {
        document.getElementById('finalmiddlename').innerHTML = middlename
    }
    // last name
    let lastname = document.getElementById('lastname').value.trim()
    document.getElementById('finallastname').innerHTML = lastname
    // address
    let address = document.getElementById('address').value.trim()
    document.getElementById('finaladdress').innerHTML = address
    // email
    let email = document.getElementById('email').value.trim()
    document.getElementById('finalemail').innerHTML = email
    // phone no
    let phoneno = document.getElementById('phoneno').value.trim()
    document.getElementById('finalphoneno').innerHTML = phoneno
    // DoB
    // var currentDate = new Date();
    // var hours = currentDate.getHours() % 12
    // if (hours == 0) hours = 12
    // var minutes = currentDate.getMinutes()
    // var ampm = hours > 0 ? 'PM' : 'AM'
    // var formattedTime = hours + ':' + (minutes < 10 ? '0' : '') + minutes + ' ' + ampm
    // let date = document.getElementById('date').value.trim() + ' ' + formattedTime
    let dateofBirth = document.getElementById('date').value.trim()
    document.getElementById('finaldate').innerHTML = dateofBirth
    // country
    let country = document.getElementById('ddlCountry').selectedOptions[0].value
    document.getElementById('finalcountry').innerHTML = document.getElementById('ddlCountry').selectedOptions[0].text
    // state
    let state = -1
    if (country == 392) {
        state = document.getElementById('ddlState').selectedOptions[0].value
        document.getElementById('finalstate').innerHTML = document.getElementById('ddlState').selectedOptions[0].text
    }
    // city
    let city = -1
    if (country == 392) {
        city = document.getElementById('ddlCity').selectedOptions[0].value
        document.getElementById('finalcity').innerHTML = document.getElementById('ddlCity').selectedOptions[0].text
    }
    // source of income
    let incomesourceelement = document.querySelectorAll('.chkbox input[type="checkbox"]:checked')
    let incomesourcearray = Array.from(incomesourceelement)
    let incomesource = incomesourcearray.map(isrc => isrc.value).join(', ')
    document.getElementById('finalincomesource').innerHTML = incomesource
    // income tax assessee
    let incometaxassessee = document.querySelector('input[type="radio"]:checked').value
    if (incometaxassessee == "yes") {
        incometaxassessee = 1;
    } else {
        incometaxassessee = 0;
    }
    let ita = document.querySelector('input[type="radio"]:checked').value
    if (ita == "yes") {
        document.getElementById('finalincometaxassessee').innerHTML = 'Yes'
    } else {
        document.getElementById('finalincometaxassessee').innerHTML = 'No'
    }
    // document.getElementById('finalincometaxassessee').innerHTML = document.querySelector('input[type="radio"]:checked').text


    return {
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        address: address,
        email: email,
        phonenumber: phoneno,
        dateofbirth: dateofBirth,
        countryID: country,
        stateID: state,
        cityID: city,
        sourceofincome: incomesource,
        incometaxassessee: incometaxassessee
    }
}

// function postUserData() {
//     $.ajax({
//         url: 'https://localhost:44366/api/InsuranceForm',
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify(getAllFieldValues()),
//         success: function () {
//             alert('success');
//         },
//         error: function (err) {
//             alert(err);
//         }
//     });
// }

function validateForm1() {
    let isValid = validateFirstName() && validateLastName() && validateMiddleName() && validateAddress() && validateEmail() && validatePhoneNo();
    if (isValid) {
        let form1 = document.getElementById('form1')
        let form2 = document.getElementById('form2')
        // let form3 = document.getElementById('form3')
        form1.style = "display:none"
        form2.style = "display:block"
        // form3.style = "display:none"
        return true
    }
    return false
}

function validateForm2(button) {
    let isValid = validateDoB() && validateCountry() && validateState() && validateCity() && validateCheckBox() && validateRadioButton() && declarationCheckBox();
    if (isValid) {
        // let form1 = document.getElementById('form1')
        let form2 = document.getElementById('form2')
        let form3 = document.getElementById('form3')
        // form1.style = "display:none"
        form2.style = "display:none"
        form3.style = "display:block"
        if (button == 'submit') {
            getAllFieldValues();
        }
        return true
    }
    return false
}

function returnToForm1() {
    let form2 = document.getElementById('form2')
    let form1 = document.getElementById('form1')
    let form3 = document.getElementById('form3')
    form2.style = "display:none"
    form3.style = "display:none"
    form1.style = "display:block"
}

function nameregextest(name, num) {
    let regex = /^[a-zA-Z]+$/;
    if (!regex.test(name)) {
        if (num == 1) {
            document.getElementById('firstnameerror').innerHTML = 'Name must contain alphabets only!'
            document.getElementById('firstname').scrollIntoView()
        } else if (num == 2) {
            document.getElementById('middlenameerror').innerHTML = 'Name must contain alphabets only!'
            document.getElementById('middlename').scrollIntoView()
        } else {
            document.getElementById('lastnameerror').innerHTML = 'Name must contain alphabets only!'
            document.getElementById('lastname').scrollIntoView()
        }
        return false;
    }
    return true
}

function validateFirstName() {
    let firstname = document.getElementById('firstname').value.trim();
    if (firstname == null || firstname == undefined || firstname == '') {
        document.getElementById('firstnameerror').innerHTML = 'Please enter a valid First Name.'
        document.getElementById('firstname').scrollIntoView()
        return false;
    }
    if (firstname.length < 3 || firstname.length > 15) {
        document.getElementById('firstnameerror').innerHTML = 'First Name must contain 3-15 letters!'
        document.getElementById('firstname').scrollIntoView()
        return false;
    }
    if (!nameregextest(firstname, 1)) {
        return false
    }
    document.getElementById('firstnameerror').innerHTML = ''
    return true
}

function validateLastName() {
    // var name2 = $('#lastname'); jQuery
    let lastname = document.getElementById('lastname').value.trim();
    firstname = "something";
    if (lastname == null || lastname == undefined || lastname == '') {
        document.getElementById('lastnameerror').innerHTML = 'Please enter a valid Last Name.'
        document.getElementById('lastname').scrollIntoView()
        return false;
    }
    if (lastname.length < 3 || lastname.length > 15) {
        document.getElementById('lastnameerror').innerHTML = 'Last Name must contain 3-15 letters!'
        document.getElementById('lastname').scrollIntoView()
        return false;
    }
    if (!nameregextest(lastname, 3)) {
        return false
    }
    document.getElementById('lastnameerror').innerHTML = ''
    return true;
}

function validateMiddleName() {
    let middlename = document.getElementById('middlename').value.trim();
    if (middlename == null || middlename == undefined || middlename == '') {
        return true;
    }
    if (middlename.length < 3 || middlename.length > 15) {
        document.getElementById('middlenameerror').innerHTML = 'Middle Name must contain 3-15 letters!'
        document.getElementById('middlename').scrollIntoView()
        return false;
    }
    if (!nameregextest(middlename, 2)) {
        return false
    }
    document.getElementById('middlenameerror').innerHTML = ''
    return true;
}

function validateAddress() {
    let address = document.getElementById('address').value.trim()
    if (address == null || address == undefined || address == '') {
        document.getElementById('addresserror').innerHTML = 'Please enter your address.'
        document.getElementById('address').scrollIntoView()
        return false
    }
    if (!isNaN(address)) {
        document.getElementById('addresserror').innerHTML = 'Please provide a valid address.'
        document.getElementById('address').scrollIntoView()
        return false
    }
    if (address.length > 75) {
        document.getElementById('addresserror').innerHTML = 'Length of address can be max. 75 characters long!'
        document.getElementById('address').scrollIntoView()
        return false
    }
    document.getElementById('addresserror').innerHTML = ''
    return true
}

function validateEmail() {
    let email = document.getElementById('email').value.trim()
    if (email == null || email == undefined || email == '') {
        document.getElementById('emailerror').innerHTML = 'Please enter your email address.'
        document.getElementById('email').scrollIntoView()
        return false
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (!emailRegex.test(email)) {
        document.getElementById('emailerror').innerHTML = 'Please enter a valid email address.'
        document.getElementById('email').scrollIntoView()
        return false
    }
    document.getElementById('emailerror').innerHTML = ''
    return true
}

function validatePhoneNo() {
    let phoneno = document.getElementById('phoneno').value.trim()
    if (phoneno == null || phoneno == undefined || phoneno == '') {
        document.getElementById('phonenoerror').innerHTML = 'Please enter your phone number.'
        document.getElementById('phoneno').scrollIntoView()
        return false
    }
    const phoneNoRegex = /^[6-9]\d{9}$/
    if (!phoneNoRegex.test(phoneno)) {
        document.getElementById('phonenoerror').innerHTML = 'Please enter a valid phone number.'
        document.getElementById('phoneno').scrollIntoView()
        return false
    }
    document.getElementById('phonenoerror').innerHTML = ''
    return true
}

function validateDoB() {
    let DoBElement = document.getElementById('date')
    if (DoBElement.value == '') {
        document.getElementById('dateerror').innerHTML = 'Please enter a date.'
        document.getElementById('date').scrollIntoView()
        return false
    }
    let DoB = new Date(DoBElement.value)
    let currDate = new Date()
    let age = currDate.getFullYear() - DoB.getFullYear()
    if (age < 0) {
        document.getElementById('dateerror').innerHTML = 'Please enter a valid date.'
        document.getElementById('date').scrollIntoView()
        return false;
    }
    if (currDate.getMonth() < DoB.getMonth() || (currDate.getMonth() == DoB.getMonth() && currDate.getDate() < DoB.getDate())) {
        age--
    }
    if (age < 18) {
        document.getElementById('dateerror').innerHTML = "You're not eligible, minimum age required is 18."
        document.getElementById('date').scrollIntoView()
        return false;
    }
    if (age > 80) {
        document.getElementById('dateerror').innerHTML = "You're not eligible, maximum age limit is 80."
        document.getElementById('date').scrollIntoView()
        return false;
    }
    document.getElementById('dateerror').innerHTML = ''
    return true;
}

function validateCountry() {
    let country = document.getElementById('ddlCountry').value.trim()
    if (country == '' || country == null || country == undefined) {
        document.getElementById('selectcountryerror').innerHTML = 'Please select your Country.'
        document.getElementById('ddlCountry').scrollIntoView()
        return false
    }
    document.getElementById('selectcountryerror').innerHTML = ''
    return true
}

function validateState() {
    let country = document.getElementById('ddlCountry').value.trim()
    if (country != '' || country != null || country != undefined || country != 'INDIA') {
        document.getElementById('selectstateerror').innerHTML = ''
        return true
    }
    let state = document.getElementById('ddlState').value.trim()
    if (state == '' || state == null || state == undefined) {
        document.getElementById('selectstateerror').innerHTML = 'Please select your State.'
        document.getElementById('ddlState').scrollIntoView()
        return false
    }
    document.getElementById('selectstateerror').innerHTML = ''
    return true
}

function validateCity() {
    let country = document.getElementById('ddlCountry').value.trim()
    if (country != '' || country != null || country != undefined || country != 'INDIA') {
        document.getElementById('selectcityerror').innerHTML = ''
        return true
    }
    let city = document.getElementById('ddlCity').value.trim()
    if (city == '' || city == null || city == undefined) {
        document.getElementById('selectcityerror').innerHTML = 'Please select your City.'
        document.getElementById('ddlCity').scrollIntoView()
        return false
    }
    document.getElementById('selectcityerror').innerHTML = ''
    return true
}

function validateCheckBox() {
    // Here, querySelectorAll gives us all html elements with class = "chkbox" and tag[attribute] i.e input[type="checkbox"] which is checked
    let checkedboxes = document.querySelectorAll('.chkbox input[type="checkbox"]:checked')
    let len = checkedboxes.length
    if (len < 1) {
        document.getElementById('soichkboxerror').innerHTML = "Please select atleast one income source."
        document.getElementById('soi1').scrollIntoView()
        return false;
    }
    document.getElementById('soichkboxerror').innerHTML = ''
    return true;
}

function validateRadioButton() {
    let checkedbuttons = document.querySelectorAll('.rdbtn input[type="radio"]:checked')
    let len = checkedbuttons.length
    if (len != 1) {
        document.getElementById('itarberror').innerHTML = "Please specify if you're an income tax assessee."
        document.getElementById('itan').scrollIntoView()
        return false
    }
    document.getElementById('itarberror').innerHTML = ''
    return true;
}

function declarationCheckBox() {
    let checkedbox = document.querySelectorAll('.declarationchkbox input[type="checkbox"]:checked')
    let len = checkedbox.length
    if (len != 1) {
        document.getElementById('decchkboxerror').innerHTML = "Please take responsibility of your provided information."
        document.getElementById('declaration').scrollIntoView()
        return false;
    }
    document.getElementById('decchkboxerror').innerHTML = ''
    return true;
}