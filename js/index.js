const firstname = document.querySelector('input#firstname');
const genderSelect = document.querySelectorAll('input[name="gender"]');
const form = document.querySelector('form.center');
const clearButton = document.querySelector('button.clear-button');
const saveButton = document.querySelector('button.save-button');
const genderPredicted = document.querySelector('div.gender-predicted');
const accuracyPredicted = document.querySelector('div.accuracy-predicted');
const savedGender = document.querySelector('div.saved-gender');
const notification = document.querySelector('div.notifications');



// send GET request to the api
// show error notification and throw error if the return code is not 200
// cast results to json
// show the results in the prediction box (gender and accuracy)
// show saved gender in the local storage
async function submitForm(name) {
    showNotification("Loading...");
    const result = await fetch(`https://api.genderize.io/?name=${name}`);
    if (result.status != 200) {
        showNotification("Response with error code " + result.status);
    }
    const json_result = await result.json();
    hideNotification();

    genderPredicted.innerText = json_result.gender || 'Not Specified';
    accuracyPredicted.innerText = json_result.probability;
    getSavedGender();
}

// add event listener to the submit button ( call submitFrom function )
// prevent default browser action(reload of page and use submitForm)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitForm(firstname.value);
});

// save the name and gender provided in the text input and radio buttons and save in local storage
async function saveGender() {
    const name = firstname.value;
    const gender = genderSelect[0].checked ? 'female' : 'male';
    localStorage.setItem(name, gender);
    showNotification("Saved");
    setTimeout(hideNotification, 2000);
}

// add event listener to the save button ( call saveGender function )
// prevent default browser action(reload of page and use submitForm)
saveButton.addEventListener('click', (e) => {
    e.preventDefault();
    saveGender();
});


// get the gender saved in the local storage and show the gender in text
function getSavedGender() {
    const name = firstname.value;
    const gender = localStorage.getItem(name) || 'Nothing in storage';
    savedGender.innerText = gender;
}


// clear the gender saved for the specified name in the local storage
function clearSavedGender() {
    const name = firstname.value;
    localStorage.removeItem(name);
    savedGender.innerText = "Nothing in storage";
    showNotification('gender for ' + name + " cleared");
    setTimeout(hideNotification, 2000);
}

// add event listener to the clear button ( call clearSavedGender function )
// prevent default browser action(reload of page and use submitForm)
clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    clearSavedGender();
});


// hides notification by setting text to null
function hideNotification() {
    notification.classList = 'notifications';
    notification.innerText = '';
}

// show notification by seting opacity to 1
function showNotification(msg) {
    notification.innerText = msg;
    notification.classList.add('show');

}


// check input name with regex(so it only includes alphabet letters)
// and the length is more than 0
// if the input is not valid throw notification
function checkInput() {
    const name = firstname.value;
    const regex = /^[a-zA-Z ]*$/;
    if (name.match(regex) && name.length > 0) {
        firstname.classList.remove('invalid');
        return true;
    } else {
        firstname.classList.add('invalid');
        showNotification('Name should only include alphabet and space');
        setTimeout(hideNotification, 2000);
        return false;

    }
}

// add event listener to input box ()
firstname.addEventListener('input', checkInput);