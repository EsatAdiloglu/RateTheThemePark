
(function ($) {
    let ratingsList = $("#ratingsList"),
        addRideRating = $("#addRideRating"),
        rating = $("#rating"),
        ratingForm = $("#ratingForm"),
        waitTime = $("#ride_waitime"),
        comfortability = $("#ride_comfortability"),
        enjoyment = $("#ride_enjoyment"),
        error = $(`#error`),
        submitButton = $(`button[type="submit"]`),
        avgWait = $('#avgWait'),
        avgComfort = $("#avgComfort"),
        avgEnjoyment = $("#avgEnjoyment"),
        numRating = $("#numRating"),
        cancelButton = $("#cancelRideRating")

    const checkNumber = (num, numName) => {
        if(typeof num === "string" && num.trim().length < 1) throw `Error: ${numName} wasn't given`
        if(typeof num === "string" && num.includes("e")) throw `Error: ${numName} has exponents`
        num = Number(num)
        if(isNaN(num)) throw `Error: ${numName} is NaN`
        if(num % 1 !== 0) throw `Error: ${numName} isn't an integer`
        if(num < 0 || num > 10) throw `Error: ${numName} isn't between 0 or 10`

    }
    function bindUpdate(li) {
        const updateButton = li.find(".updateRideRating")
        if(updateButton.length > 0){
            let updateRating = li.find(".updateRating"),
                updateForm = li.find("#updateForm"),
                updateWait = li.find("#updateWait"),
                updateComfort = li.find("#updateComfort"),
                updateEnjoyment = li.find("#updateEnjoyment"),
                cancelUpdate = li.find("#cancelUpdate"),
                currentWait = li.find(".rideWaitTimeRating"),
                currentComfort = li.find(".rideComfortabilityRating"),
                currentEnjoyment = li.find(".rideEnjoymentRating")
            
            updateButton.off("click").on("click", () => {
                updateButton.hide();
                updateRating.show();
            })
            cancelUpdate.off("click").on("click", () => {
                updateRating.hide();
                updateButton.show();
                updateWait.val("")
                updateComfort.val("")
                updateEnjoyment.val("")
            })
            
            updateForm.off("submit").submit((event) => {
                event.preventDefault()
                error.hide();
                error.empty();

                let updateWaitRating = updateWait.val(),
                    updateComfortRating = updateComfort.val(),
                    updateEnjoymentRating = updateEnjoyment.val()

                try{
                    checkNumber(updateWaitRating,"Ride Wait Time Rating")
                }
                catch(e){
                    updateWaitRating = Number(currentWait.text())
                }
                try{
                    checkNumber(updateComfortRating, "Ride Cleanliness Rating")
                }
                catch(e){
                    updateComfortRating = Number(currentComfort.text())
                }
                try{
                    checkNumber(updateEnjoymentRating,"Ride Enjoyment Rating")
                }
                catch(e){
                    updateEnjoymentRating = Number(currentEnjoyment.text())
                }

                let requestConfig = {
                    method: "PATCH",
                    url: "/api/addRideRating",
                    contentType: "application/json",
                    data: JSON.stringify({
                        ratingId: li.data("id"),
                        updateWait: updateWaitRating,
                        updateComfort: updateComfortRating,
                        updateEnjoyment: updateEnjoymentRating,
                    })
                }
                $.ajax(requestConfig).then((res) => {
                    if(res.Error) {
                        error.append(`<p>${res.Error}</p>`)
                        error.show();
                    }
                    else{
                        numRating.text(`${res.averageRatings.numRatings}`)
                        avgWait.text(`${res.averageRatings.avgWaitTimeRating}`)
                        avgComfort.text(`${res.averageRatings.avgComfortRating}`)
                        avgEnjoyment.text(`${res.averageRatings.avgEnjoymentRating}`)
                        currentWait.text(`${res.newWaitRating}`)
                        currentComfort.text(`${res.newComfortRating}`)
                        currentEnjoyment.text(`${res.newEnjoymentRating}`)
                    }
                })
                updateRating.hide();
                updateButton.show();
                updateWait.val("")
                updateComfort.val("")
                updateEnjoyment.val("")
            })
        }
    }
    addRideRating.on("click", () => {
        addRideRating.hide();
        rating.show();
    })
    cancelButton.on("click", () => {
        rating.hide()
        addRideRating.show();
        waitTime.val("")
        comfortability.val("")
        enjoyment.val("")
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
                                <li data-id="${res._id}">
                                    <p>${res.userName}</p>
                                    <p id="tpitem" data-id="${res._id}" hidden></p>
                                    <p><strong>Wait Time Rating:</strong> <span class="rideWaitTimeRating">${res.waitTimeRating}</span></p> 
                                    <p><strong>Comfortability Rating:</strong> <span class="rideComfortabilityRating">${res.comfortabilityRating}</span></p>
                                    <p><strong>Enjoyment and Experience Rating:</strong> <span class="rideEnjoymentRating">${res.enjoymentRating}</span></p>
                                    <p class = "ridenumlikes"><strong>Number of Likes:</strong> 0</p>
                                    <p class = "ridenumdislikes"><strong>Number of Dislikes:</strong> 0</p>
                                    <button class="updateRideRating">Update</button>
                                    <button class = "rideratinglikes" data-id =${res._id}>Like</button> 
                                    <button class = "rideratingdislikes" data-id =${res._id}>Dislike</button> 
                                    <div class="updateRating" hidden>
                                        <h3>Update Rating</h3>
                                        <form id = "updateForm">
                                            <label for="updateWait">Ride Wait Time Rating</label>
                                            <input type="number" name="updateWait" id="updateWait">
                                            <br>
                                            <label for="updateComfort">Ride Comfortability Rating</label>
                                            <input type="number" name="updateComfort" id="updateComfort">
                                            <br>
                                            <label for="updateEnjoyment">Ride Enjoyment and Experience Rating</label>
                                            <input type="number" name="updateEnjoyment" id="updateEnjoyment">
                                            <br>
                                            <button type="submit">Submit</button>
                                        </form>
                                        <button id="cancelUpdate">Cancel</button>
                                    </div>

                                </li>
                        `)
                    ratingsList.append(list)
                    numRating.text(`${res.averageRatings.numRatings}`)
                    avgWait.text(`${res.averageRatings.avgWaitTimeRating}`)
                    avgComfort.text(`${res.averageRatings.avgComfortRating}`)
                    avgEnjoyment.text(`${res.averageRatings.avgEnjoymentRating}`)
                    bindUpdate(list)
                }
            })

        }
        rating.hide();
        waitTime.val("")
        comfortability.val("")
        enjoyment.val("")
        addRideRating.show();
    })
    $("#ratingsList li").each((idx, li) => {
        bindUpdate($(li))
    })
})(window.jQuery)