function validRating(num) {
    if (num >= 1 && num <=5) {
        return true;
    }
    return false;
  }


let foodRatingForm = document.getElementById('food_rating');
let foodQualityInput = document.getElementById('food_quality');
let waitTimeInput = document.getElementById('food_wait_time');
let reviewInput = document.getElementById('ride_review');
let errorDiv = document.getElementById('error');

if (foodRatingForm) {
    foodRatingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (waitTimeInput.value.trim() && foodQualityInput.value.trim() && reviewInput.value.trim()) {
        waitTimeInput.classList.remove('inputClass');
        foodQualityInput.classList.remove('inputClass');
        reviewInput.classList.remove('inputClass');
        errorDiv.hidden = true;
        if (validRating(waitTimeInput.value) && validRating(foodQualityInput.value)) {
            //console.log(good)
        } else {
            foodRatingForm.reset();
            foodQualityInput.className = 'inputClass';
            waitTimeInput.className = 'inputClass';
            reviewInput.className = 'inputClass';

            errorDiv.hidden = false;
            errorDiv.innerHTML = 'Ratings must be between 1-5';
        }
    } else {
        waitTimeInput.focus();
        foodQualityInput.className = 'inputClass';
        enjoymentInput.className = 'inputClass';
        reviewInput.className = 'inputClass';

        errorDiv.hidden = false;
        errorDiv.innerHTML = 'Input required';
    }
  });
}