let foodStallForm = document.getElementById('food');
let nameInput = document.getElementById('food_stall_name');

if (foodStallForm) {
    foodStallForm.addEventListener('submit', (event) => {
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