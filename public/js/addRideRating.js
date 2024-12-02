function validRating(num) {
    if (num >= 1 && num <=5) {
        return true;
    }
    return false;
  }


let rideRatingForm = document.getElementById('ride_rating');
let waitTimeInput = document.getElementById('ride_wait_time');
let comfortabilityInput = document.getElementById('ride_comfortability');
let enjoymentInput = document.getElementById('ride_enjoyment');
let reviewInput = document.getElementById('ride_review');
let errorDiv = document.getElementById('error');

if (rideRatingForm) {
    rideRatingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (waitTimeInput.value.trim() && comfortabilityInput.value.trim() && enjoymentInput.value.trim()
        && reviewInput.value.trim()) {
        waitTimeInput.classList.remove('inputClass');
        comfortabilityInput.classList.remove('inputClass');
        enjoymentInput.classList.remove('inputClass');
        reviewInput.classList.remove('inputClass');
        errorDiv.hidden = true;
        if (validRating(waitTimeInput.value) && validRating(comfortabilityInput.value) 
        && validRating(enjoymentInput.value)) {
            console.log(good)
        } else {
            rideRatingForm.reset();
            waitTimeInput.focus();
            comfortabilityInput.className = 'inputClass';
            enjoymentInput.className = 'inputClass';
            reviewInput.className = 'inputClass';

            errorDiv.hidden = false;
            errorDiv.innerHTML = 'Ratings must be between 1-5';
        }
    } else {
        waitTimeInput.focus();
        comfortabilityInput.className = 'inputClass';
        enjoymentInput.className = 'inputClass';
        reviewInput.className = 'inputClass';

        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Input required';
    }
  });
}