let loginForm = document.getElementById('loginForm');
let usernameTextInput = document.getElementById('check_username');
let passwordTextInput = document.getElementById('check_password');
let errorDiv = document.getElementById('error');

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (usernameTextInput.value.trim() && passwordTextInput.value.trim()) {
        usernameTextInput.classList.remove('inputClass');
        passwordTextInput.classList.remove('inputClass');
        errorDiv.hidden = true;
        if (usernameTextInput.value === "a" && passwordTextInput.value === "b") {
            window.location.href = "/home"
        } else {
            loginForm.reset();
            usernameTextInput.focus();
            usernameTextInput.className = 'inputClass';
            passwordTextInput.className = 'inputClass';

            errorDiv.hidden = false;
            errorDiv.innerHTML = 'Username or password is invalid';
        }
    } else {
        //myForm.reset();
        usernameTextInput.focus();
        usernameTextInput.className = 'inputClass';
        passwordTextInput.className = 'inputClass';

        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Username and password are required';
    }
  });
}