let rideForm = document.getElementById('ride');
let nameInput = document.getElementById('ride_name');

if (rideForm) {
    rideForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (nameInput.value.trim()) {
        nameInput.classList.remove('inputClass');
        console.log("clicked");
    } else {
        nameInput.focus();
        nameInput.className = 'inputClass';
    }
  });
}