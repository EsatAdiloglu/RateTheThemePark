let parkForm = document.getElementById('theme_park');
let nameInput = document.getElementById('theme_park_name');
let streetInput = document.getElementById('theme_park_street');
let cityInput = document.getElementById('theme_park_city');
let stateInput = document.getElementById('theme_park_state');


if (rideForm) {
    rideForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nameInput.value.trim() && streetInput.value.trim() && cityInput.value.trim() && stateInput.value.trim()) {
        nameInput.classList.remove('inputClass');
        streetInput.classList.remove('inputClass');
        cityInput.classList.remove('inputClass');
        stateInput.classList.remove('inputClass');
        console.log("clicked");
    } else {
        nameInput.focus();
        nameInput.className = 'inputClass';
        streetInput.className = 'inputClass';
        cityInput.className = 'inputClass';S
        cityInput.className = 'inputClass';
    }
  });
}