function validRating(num) {
    if (num >= 1 && num <=5) {
        return true;
    }
    return false;
  }


let parkRatingForm = document.getElementById('theme_park_rating');
let staffInput = document.getElementById('theme_park_staff');
let cleanlinessInput = document.getElementById('theme_park_cleanliness');
let crowdsInput = document.getElementById('theme_park_crowds');
let diversityInput = document.getElementById('theme_park_diversity');
let reviewInput = document.getElementById('theme_park_review');
let errorDiv = document.getElementById('error');

if (parkRatingForm) {
    parkRatingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (staffInput.value.trim() && cleanlinessInput.value.trim() && crowdsInput.value.trim()
        && diversityInput.value.trim() && reviewInput.value.trim()) {
        staffInput.classList.remove('inputClass');
        cleanlinessInput.classList.remove('inputClass');
        crowdsInput.classList.remove('inputClass');
        diversityInput.classList.remove('inputClass');
        reviewInput.classList.remove('inputClass');
        errorDiv.hidden = true;
        if (validRating(staffInput.value) && validRating(cleanlinessInput.value) 
        && validRating(crowdsInput.value) && validRating(diversityInput.value)) {
            window.location.href = "/home"
        } else {
            parkRatingForm.reset();
            staffInput.focus();
            cleanlinessInput.className = 'inputClass';
            crowdsInput.className = 'inputClass';
            diversityInput.className = 'inputClass';
            reviewInput.className = 'inputClass';

            errorDiv.hidden = false;
            errorDiv.innerHTML = 'Ratings must be between 1-5';
        }
    } else {
        //myForm.reset();
        staffInput.focus();
        cleanlinessInput.className = 'inputClass';
        crowdsInput.className = 'inputClass';
        diversityInput.className = 'inputClass';
        reviewInput.className = 'inputClass';

        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Input required';
    }
  });
}