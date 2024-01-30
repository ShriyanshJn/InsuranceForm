var existingUser = 0
var currentUserId = 0

let allUsersList = []

function getAllUsers() {
    $.ajax({
        url: 'https://localhost:44366/api/InsuranceForm',
        type: 'GET',
        // contentType: 'application/json',
        // data: JSON.stringify(getAllFieldValues()),
        success: function (data) {
            allUsersList = data
            console.log(allUsersList)
            fillTable(data);
        },
        error: function () {
            alert('error');
        }
    });
}


async function fillTable(data) {
    for (let item of data) {
        let incomeTaxAssesseeString = 'Yes'
        if (item.incomeTaxAssessee == 0) {
            incomeTaxAssesseeString = 'No'
        }
        document.getElementById("tbody").innerHTML += `<tr id = del${item.userID}>

                    <td>${item.firstName}</td>
                    <td>${item.address}</td>
                    <td>${item.email}</td>
                    <td>${item.phoneNumber}</td>
                    <td>${item.dateOfBirthUser}</td>
                    <td>${item.countryName}</td>
                    <td>${item.stateName}</td>
                    <td>${item.cityName}</td>
                    <td>${item.sourceofIncome}</td>
                    <td>${incomeTaxAssesseeString}</td>
                    <td>
                        <button id="updatebtn" onclick="updateUserData(${item.userID})">Update</button>
                        <button id="deletebtn" onclick="deleteUserData(${item.userID})">Delete</button>
                    </td>
                </tr>`
    }
}

async function getUserDetails(userID) {
    return $.ajax({
        url: `https://localhost:44366/api/InsuranceForm/${userID}`,
        type: 'GET',
        success: function (data) {
            // alert(data)
            console.log('success')
        },
        error: function (error) {
            alert(error);
        }
    });
}

async function populateUserDetails(userID) {
    const obj = await getUserDetails(userID)
    let firstname = obj['firstName']
    if (firstname == null) {
        alert('User does not exist!')
        return false
    }
    let middlename = ''
    if (obj['middleName']) {
        middlename = obj['middleName']
    }
    // let countryName = obj['countryName']
    // let stateName = obj['stateName']
    // let cityName = obj['cityName']
    let lastname = obj['lastName']
    let address = obj['address']
    let email = obj['email']
    let countryid = obj['countryID']
    let stateid = obj['stateID']
    let cityid = obj['cityID']
    if (countryid == 392) {
        const stateDropDown = document.getElementById('ddlState')
        const cityDropDown = document.getElementById('ddlCity')
        await fetch('https://ipru.policybazaar.com/MaxLifeAPIs/MasterApi/api/Master/GetAllStates?productPlanId=1')
            .then(res => {
                return res.json();
            }).then(data => {
                data["stateList"].forEach(state => {
                    let el = document.createElement('option')
                    el.innerHTML = state.stateName
                    el.value = state.stateId
                    stateDropDown.appendChild(el)
                })
            })
        await fetch(`https://ipru.policybazaar.com/MaxLifeAPIs/MasterApi/api/Master/GetAllCities?productPlanId=1&stateId=${stateid}`)
            .then(res => {
                return res.json()
            }).then(data => {
                data["cityList"].forEach(city => {
                    let el = document.createElement('option')
                    el.innerHTML = city.cityName
                    el.value = city.cityId
                    cityDropDown.appendChild(el)
                })
            })
        document.getElementById('ddlState').disabled = false
        document.getElementById('ddlCity').disabled = false
    }
    let DOB = obj['dateofBirth']
    let DOBL1 = DOB.split("T")
    let DOBL2 = DOBL1[0].split("-")

    let tdate = DOBL2[0]
    let tmonth = DOBL2[1]
    let tyear = DOBL2[2]
    let dateofbirth = ''
    // if (tdate < 10) {
    //     tdate = "0" + tdate
    // }
    // if (tmonth < 10) {
    //     tmonth = "0" + tmonth
    // }
    dateofbirth = tdate + "-" + tmonth + "-" + tyear
    // dateofbirth = tdate + "-" + tmonth + "-" + tyear
    let phonenumber = obj['phoneNumber']
    let sourceofincome = obj['sourceofIncome']
    let soiarr = sourceofincome.split(",")
    soiarr.forEach(soi => {
        let id = ''
        if (soi == 'Business') {
            id = 'soi1'
        } else if (soi == 'Employment') {
            id = 'soi2'
        } else {
            id = 'soi3'
        }
        document.getElementById(id).checked = true
    })
    let incometaxassessee = obj['incomeTaxAssessee']
    if (incometaxassessee == 1) {
        document.getElementById('itay').checked = true
    } else {
        document.getElementById('itan').checked = true
    }

    // populating all field values
    document.getElementById('firstname').value = firstname
    document.getElementById('middlename').value = middlename
    document.getElementById('lastname').value = lastname
    document.getElementById('address').value = address
    document.getElementById('email').value = email
    document.getElementById('phoneno').value = phonenumber
    document.getElementById('date').value = dateofbirth
    document.getElementById('ddlCountry').value = countryid
    document.getElementById('ddlState').value = stateid
    document.getElementById('ddlCity').value = cityid

    // document.getElementById('updatebtndiv').style = "display : none"
    document.getElementById('form1').style = "display : block"


}

function returnToUsersDashboard() {
    document.getElementById('usersdashboarddiv').style.display = "block"
    document.getElementById('insuranceformdiv').style.display = "none"
}

function addNewUser() {
    document.getElementById('insuranceformdiv').style.display = "block"
    document.getElementById('usersdashboarddiv').style.display = "none"
    existingUser = 0
}

function updateUserData(userID) {
    document.getElementById('insuranceformdiv').style.display = "block"
    document.getElementById('usersdashboarddiv').style.display = "none"
    populateUserDetails(userID)
    existingUser = 1
    currentUserId = userID
}

async function deleteUserData(userID) {
    if (confirm("Are you sure about deleting the User?") == true) {
        // const obj = await getUserDetails(userID)
        // let firstname = obj['firstName']
        // if (firstname == null) {
        //     alert('User does not exist!')
        //     return false
        // }
        $.ajax({
            url: `https://localhost:44366/api/InsuranceForm/${userID}`,
            type: 'DELETE',
            success: function (data) {
                console.log('success')
            },
            error: function (error) {
                alert(error);
            }
        });
        document.getElementById(`del${userID}`).remove();
    }
}

function navigateToNewForm() {
    window.location.href = "http://127.0.0.1:5500/newform.html"
    existingUser = 0
}

function applySorting() {
    if (sortColumn !== '' && sortOrder !== '') {
        var rows = $('#tbody').find('tr').get();
        rows.sort(function (a, b) {
            var A = $(a).children('td').eq(sortColumn).text().toUpperCase()
            var B = $(b).children('td').eq(sortColumn).text().toUpperCase()
            if (A < B) {
                return (sortOrder === 'asc') ? -1 : 1
            }
            if (A > B) {
                return (sortOrder === 'asc') ? 1 : -1
            }
            return 0;
        });
        $('#tbody').empty();
        $.each(rows, function (index, row) {
            $('#tbody').append(row);
        });
    }
}

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
    let date = document.getElementById('date').value.trim()
    document.getElementById('finaldate').innerHTML = date
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
        dateofbirth: date,
        countryID: country,
        stateID: state,
        cityID: city,
        sourceofincome: incomesource,
        incometaxassessee: incometaxassessee
    }

}


function postUserData() {

    let userEmail = document.getElementById('email').value
    let userPhoneNo = document.getElementById('phoneno').value
    if (existingUser) {
        let userAlreadyExistFlag = false
        for (let i = 0; i < allUsersList.length; ++i) {
            if (allUsersList[i].userID != currentUserId && (allUsersList[i].email == userEmail || allUsersList[i].phoneNumber == userPhoneNo)) {
                alert("User already exist!")
                userAlreadyExistFlag = true
            }
        }
        if (userAlreadyExistFlag == false) {
            $.ajax({
                url: `https://localhost:44366/api/InsuranceForm/${currentUserId}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(getAllFieldValues()),
                success: function (data) {
                    // alert(data)
                    console.log('success')
                },
                error: function (error) {
                    alert(error);
                }
                
            });
            document.getElementById('insuranceformdiv').style.display = 'none'
            document.getElementById('usersdashboarddiv').style.display = 'block'
        }
    }
    else {
        let userAlreadyExistFlag = false
        for (let i = 0; i < allUsersList.length; ++i) {
            if (allUsersList[i].email == userEmail || allUsersList[i].phoneNumber == userPhoneNo) {
                alert("User already exist!")
                userAlreadyExistFlag = true
            }
        }
        if (userAlreadyExistFlag == false) {
            $.ajax({
                url: 'https://localhost:44366/api/InsuranceForm',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(getAllFieldValues()),
                success: async function () {
                    // var user = await getUserDetails(currentUserId)
                    // let incometaxassessee = user.incomeTaxAssessee
                    // let incomeTaxAssesseeString = 'Yes'
                    // if (incometaxassessee == 0) {
                    //     incomeTaxAssesseeString = 'No'
                    // }
                    // document.getElementById('tbody').innerHTML += `<tr id = del${user.userID}>
                    //     <td>${user.firstName}</td>
                    //     <td>${user.address}</td>
                    //     <td>${user.email}</td>
                    //     <td>${user.phoneNumber}</td>
                    //     <td>${user.dateOfBirthUser}</td>
                    //     <td>${user.countryName}</td>
                    //     <td>${user.stateName}</td>
                    //     <td>${user.cityName}</td>
                    //     <td>${user.sourceofIncome}</td>
                    //     <td>${incomeTaxAssesseeString}</td>
                    //     <td>
                    //         <button id="updatebtn" onclick="updateUserData(${user.userID})">Update</button>
                    //         <button id="deletebtn" onclick="deleteUserData(${user.userID})">Delete</button>
                    //     </td>
                    // </tr>`
                    console.log('success');
                },
                error: function () {
                    alert('error');
                }
            });
            document.getElementById('insuranceformdiv').style.display = 'none'
            document.getElementById('usersdashboarddiv').style.display = 'block'
        }
    }
}

function validateForm1() {
    let isValid = validateFirstName() && validateLastName() && validateMiddleName() && validateAddress() && validateEmail() && validatePhoneNo();
    if (isValid) {
        let form1 = document.getElementById('form1')
        let form2 = document.getElementById('form2')
        form1.style = "display:none"
        form2.style = "display:block"
        return true
    }
    return false
}

function validateForm2(button) {
    let isValid = validateDoB() && validateCountry() && validateState() && validateCity() && validateCheckBox() && validateRadioButton() && declarationCheckBox();
    if (isValid) {
        let form2 = document.getElementById('form2')
        let form3 = document.getElementById('form3')
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

// module.exports = {
//     myFunction : postUserData,
// };
// export { currentUserId, existingUser, allUsersList }