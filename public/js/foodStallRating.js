
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
        numRating = $("#numRating"),
        cancelButton = $("#cancelFoodStallRating")

    const checkNumber = (num, numName) => {
        if(typeof num === "string" && num.trim().length < 1) throw `Error: ${numName} wasn't given`
        if(typeof num === "string" && num.includes("e")) throw `Error: ${numName} has exponents`
        num = Number(num)
        if(isNaN(num)) throw `Error: ${numName} is NaN`
        if(num % 1 !== 0) throw `Error: ${numName} isn't an integer`
        if(num < 0 || num > 10) throw `Error: ${numName} isn't between 0 or 10`

    }
    function bindUpdate(li) {
        const updateButton = li.find("#updateFoodStallRating")
        if(updateButton.length > 0){
            let updateRating = li.find(".updateRating"),
                updateForm = li.find("#updateForm"),
                updateQuality = li.find("#updateQuality"),
                updateWait = li.find("#updateWait"),
                cancelUpdate = li.find("#cancelUpdate"),
                currentQuality = li.find(".foodStallQualityRating"),
                currentWait = li.find(".foodStallWaitTimeRating")
            
            updateButton.off("click").on("click", () => {
                updateButton.hide();
                updateRating.show();
            })
            cancelUpdate.off("click").on("click", () => {
                updateRating.hide();
                updateButton.show();
                updateQuality.val("")
                updateWait.val("")

            })
            
            updateForm.off("submit").submit((event) => {
                event.preventDefault()
                error.hide();
                error.empty();

                const errors = []
                let updateQualityRating = updateQuality.val(),
                    updateWaitRating = updateWait.val()

                try{
                    checkNumber(updateQualityRating, "Food Stall Food Quality Rating")
                }
                catch(e){

                    if(typeof updateQualityRating === "string" && updateQualityRating.trim().length < 1) updateQualityRating = Number(currentQuality.text())
                    else errors.push(e)
                    
                }

                try{
                    checkNumber(updateWaitRating,"Food Stall Wait Time Rating")
                }
                catch(e){
                    if(typeof updateWaitRating === "string" && updateWaitRating.trim().length < 1) updateWaitRating = Number(currentWait.text())
                    else errors.push(e)
                }

                if(errors.length > 0){
                    errors.forEach((err) => {
                        error.append(`<p>${err}</p>`)
                    })
                    error.show();
                }
                else{
                    let requestConfig = {
                        method: "PATCH",
                        url: "/api/addFoodStallRating",
                        contentType: "application/json",
                        data: JSON.stringify({
                            ratingId: li.data("id"),
                            updateQuality: updateQualityRating,
                            updateWait: updateWaitRating
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
                            avgFoodQuality.text(`${res.averageRatings.avgFoodQualityRating}`)
                            currentQuality.text(`${res.newQualityRating}`)
                            currentWait.text(`${res.newWaitRating}`)
                        }
                    })

                }
                updateRating.hide();
                updateButton.show();
                updateQuality.val("")
                updateWait.val("")
        })
        }
    }
    function bindDelete(li) {
        const deleteButton = li.find("#deleteFoodStallRating")
        if(deleteButton.length > 0) {
            deleteButton.off("click").on("click", () => {
                error.hide();
                error.empty();

                let requestConfig = {
                    method: "DELETE",
                    url: "/api/addFoodStallRating",
                    contentType: "application/json",
                    data: JSON.stringify({
                        ratingId: li.data("id")
                    })
                }

                $.ajax(requestConfig).then((res) => {
                    if(res.Error) {
                        error.append(`<p>${res.Error}</p>`)
                        error.show();
                    }
                    else{
                        li.remove();
                        numRating.text(`${res.averageRatings.numRatings}`)
                        avgFoodQuality.text(`${res.averageRatings.avgFoodQualityRating}`)
                        avgWait.text(`${res.averageRatings.avgWaitTimeRating}`)
                    }
                })
            })
        }
    }
    addFoodStallRating.on("click", () => {
        addFoodStallRating.hide();
        rating.show();
    })
    cancelButton.on("click", () => { 
        rating.hide();
        addFoodStallRating.show();
        quality.val("");
        waitTime.val("");
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
                                <li data-id="${res._id}">
                                    <p>${res.userName}</p>
                                    <p><strong>Food Quality Rating:</strong> <span class="foodStallQualityRating">${res.foodQualityRating}</span></p>
                                    <p><strong>Wait Time Rating:</strong> <span class="foodStallWaitTimeRating">${res.waitTimeRating}</span></p> 
                                    <p class = "fsnumlikes"><strong>Number of Likes:</strong> 0 </p>
                                    <p class = "fsnumdislikes"><strong>Number of Dislikes:</strong> 0 </p>
                                    <button id="updateFoodStallRating">Update Rating</button>
                                    <button id="deleteFoodStallRating">Delete Rating</button>
                                    <br>
                                    <button class = "foodstallratinglikes" data-id =${res._id}>Like</button> 
                                    <button class = "foodstallratingdislikes" data-id =${res._id}>Dislike</button>
                                    <div class="updateRating" hidden>
                                        <h3>Update Rating</h3>
                                        <form id = "updateForm">
                                            <label for="updateQuality">Food Quality Rating</label>
                                            <input type="number" name="updateQuality" id="updateQuality">
                                            <br>
                                            <label for="updateWait">Wait Time Rating</label>
                                            <input type="number" name="updateWait" id="updateWait">
                                            <br>
                                            <button type="submit">Submit</button>
                                        </form>
                                        <button id="cancelUpdate">Cancel</button>
                                    </div> 
                                </li>
                        `)
                    ratingsList.append(list)
                    numRating.text(`${res.averageRatings.numRatings}`)
                    avgFoodQuality.text(`${res.averageRatings.avgFoodQualityRating}`)
                    avgWait.text(`${res.averageRatings.avgWaitTimeRating}`)
                    bindUpdate(list)
                    bindDelete(list)
                }
            })

        }
        rating.hide();
        quality.val("");
        waitTime.val("");
        addFoodStallRating.show();
    })
    $("#ratingsList li").each((idx, li) => {
        bindUpdate($(li))
        bindDelete($(li))
    })
})(window.jQuery)