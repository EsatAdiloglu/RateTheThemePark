
(function ($) {
    let ratingsList = $("#ratingsList"),
        addRideRating = $("#addRideRating"),
        rating = $("#rating"),
        ratingForm = $("#ratingForm"),
        waitTime = $("#ride_waitime"),
        comfortability = $("#ride_comfortability"),
        enjoyment = $("#ride_enjoyment"),
        error = $(`#error`),
        submitButton = $(`button[type="submit"]`)

    const checkNumber = (num, numName) => {
        if(typeof num === "string" && num.trim() < 1) throw `Error: ${numName} wasn't given`
        num = Number(num)
        if(isNaN(num)) throw `Error: ${numName} is NaN`
        if(num % 1 !== 0) throw `Error: ${numName} isn't an integer`
        if(num < 0 || num > 10) throw `Error: ${numName} isn't between 0 or 10`

    }
    addRideRating.on("click", () => {
        addRideRating.hide();
        rating.show();
    })

    ratingForm.submit((event) => {
        event.preventDefault();
        error.hide();
        error.empty();
        const errors = []
        const waitTimeRating = waitTime.val()
        const comfortabilityRating = comfortability.val()
        const enjoymentRating = enjoyment.val()

        try{
            checkNumber(waitTimeRating,"Wait Time Rating")
        }
        catch(e){
            errors.push(e)
        }
        try{
            checkNumber(comfortabilityRating,"Comfortability Rating")
        }
        catch(e){
            errors.push(e)
        }

        try{
            checkNumber(enjoymentRating, "Enjoyment Rating")
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
                url: '/api/addRideRating',
                contentType: "application/json",
                data: JSON.stringify({
                    rideId: submitButton.data("id"),
                    waitTime: waitTimeRating,
                    comfortability: comfortabilityRating,
                    enjoyment: enjoymentRating,
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
                                    <p><strong>Wait Time Rating:</strong> ${res.waitTimeRating}</p> 
                                    <p><strong>Comfortability Rating:</strong> ${res.comfortabilityRating}</p>
                                    <p><strong>Enjoyment and Experience Rating:</strong> ${res.enjoymentRating}</p>
                                </li>
                        `)
                    ratingsList.append(list)
                }
            })

        }
        rating.hide();
        waitTime.val("")
        comfortability.val("")
        enjoyment.val("")
        addRideRating.show();
    })
})(window.jQuery)