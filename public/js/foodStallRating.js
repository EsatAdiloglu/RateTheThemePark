
(function ($) {
    let ratingsList = $("#ratingsList"),
        addFoodStallRating = $("#addFoodStallRating"),
        rating = $("#rating"),
        ratingForm = $("#ratingForm"),
        quality = $("#food_quality"),
        waitTime = $("#food_wait_time"),
        error = $(`#error`),
        submitButton = $(`button[type="submit"]`),
        avgFoodQuality = $("#avgFoodQuality"),
        avgWait = $("#avgWait"),
        numRating = $("#numRating")

    const checkNumber = (num, numName) => {
        if(typeof num === "string" && num.trim().length < 1) throw `Error: ${numName} wasn't given`
        num = Number(num)
        if(isNaN(num)) throw `Error: ${numName} is NaN`
        if(num % 1 !== 0) throw `Error: ${numName} isn't an integer`
        if(num < 0 || num > 10) throw `Error: ${numName} isn't between 0 or 10`

    }
    addFoodStallRating.on("click", () => {
        addFoodStallRating.hide();
        rating.show();
    })

    ratingForm.submit((event) => {
        event.preventDefault();
        error.hide();
        error.empty();
        const errors = []
        const foodQualityRating = quality.val()
        const waitTimeRating = waitTime.val()

        try{
            checkNumber(foodQualityRating,"Food Quality Rating")
        }
        catch(e){
            errors.push(e)
        }

        try{
            checkNumber(waitTimeRating,"Wait Time Rating")
        }
        catch(e){
            errors.push(e)
        }

        if(errors.length > 0){
            errors.forEach((err) => {
                error.append(`<p>${err}</p>`)
            })
            error.show();
        }
        else{
            error.hide();
            error.empty();
            let requestConfig = {
                method: "POST",
                url: '/api/addFoodStallRating',
                contentType: "application/json",
                data: JSON.stringify({
                    foodStallId: submitButton.data("id"),
                    quality: foodQualityRating,
                    waitTime: waitTimeRating,
                })
            }
            $.ajax(requestConfig).then((res) => {
                if(res.Error) {
                    error.append(`<p>${res.Error}</p>`)
                    error.show();
                }
                else{
                    const list = $(`
                                <li>
                                    <p>${res.userName}</p>
                                    <p><strong>Food Quality Rating:</strong> ${res.foodQualityRating}</p>
                                    <p><strong>Wait Time Rating:</strong> ${res.waitTimeRating}</p> 
                                    <p><strong>Number of Likes:</strong> 0</p>
                                    <p><strong>Number of Disikes:</strong> 0</p>
                                    <button id = 'foodstallratinglikes'>Like</button> 
                                    <button id = 'foodstallratingdislikes'>Dislike</button> 
                                </li>
                        `)
                    ratingsList.append(list)
                    numRating.text(`${res.averageRatings.numRatings}`)
                    avgFoodQuality.text(`${res.averageRatings.avgFoodQualityRating}`)
                    avgWait.text(`${res.averageRatings.avgWaitTimeRating}`)
                }
            })

        }
        rating.hide();
        quality.val("");
        waitTime.val("");
        addFoodStallRating.show();
    })
})(window.jQuery)