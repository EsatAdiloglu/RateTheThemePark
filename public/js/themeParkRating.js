
(function ($) {
    let ratingsList = $("#ratingsList"),
        addThemeParkRating = $("#addThemeParkRating"),
        rating = $("#rating"),
        ratingForm = $("#ratingForm"),
        staff = $("#theme_park_staff"),
        cleanliness = $("#theme_park_cleanliness"),
        crowds = $("#theme_park_crowds"),
        diversity = $("#theme_park_diversity"),
        error = $(`#error`),
        submitButton = $(`button[type="submit"]`),
        //likeButton = $(`button[type="click"]`),
        //dislikeButton = $(`button[type="click"]`),
        avgStaff = $("#avgStaff"),
        avgClean = $("#avgClean"),
        avgCrowd = $("#avgCrowd"),
        avgDiversity = $("#avgDiversity"),
        numRating = $("#numRating"),
        cancelButton = $("#cancelThemeParkRating")

    const checkNumber = (num, numName) => {
        if(typeof num === "string" && num.trim().length < 1) throw `Error: ${numName} wasn't given`
        if(typeof num === "string" && num.includes("e")) throw `Error: ${numName} has exponents`
        num = Number(num)
        if(isNaN(num)) throw `Error: ${numName} is NaN`
        if(num % 1 !== 0) throw `Error: ${numName} isn't an integer`
        if(num < 0 || num > 10) throw `Error: ${numName} isn't between 0 or 10`

    }
    function bindUpdate(li) {
        const updateButton = li.find("#updateThemeParkRating")
        if(updateButton.length > 0){
            let updateRating = li.find(".updateRating"),
                updateForm = li.find("#updateForm"),
                updateStaff = li.find("#updateStaff"),
                updateCleanliness = li.find("#updateCleanliness"),
                updateCrowd = li.find("#updateCrowd"),
                updateDiversity = li.find("#updateDiversity"),
                cancelUpdate = li.find("#cancelUpdate"),
                currentStaff = li.find(".themeParkStaffRating"),
                currentCleanliness = li.find(".themeParkCleanlinessRating"),
                currentCrowd = li.find(".themeParkCrowdsRating"),
                currentDiversity = li.find(".themeParkDiversityRating")
            
            updateButton.off("click").on("click", () => {
                updateButton.hide();
                updateRating.show();
            })
            cancelUpdate.off("click").on("click", () => {
                updateRating.hide();
                updateButton.show();
                updateStaff.val("")
                updateCleanliness.val("")
                updateCrowd.val("")
                updateDiversity.val("")
            })
            
            updateForm.off("submit").submit((event) => {
                event.preventDefault()
                error.hide();
                error.empty();

                let updateStaffRating = updateStaff.val(),
                    updateCleanlinessRating = updateCleanliness.val(),
                    updateCrowdRating = updateCrowd.val(),
                    updateDiversityRating = updateDiversity.val()

                try{
                    checkNumber(updateStaffRating,"Theme Park Staff Rating")
                }
                catch(e){
                    updateStaffRating = Number(currentStaff.text())
                }
                try{
                    checkNumber(updateCleanlinessRating, "Theme Park Stuff Cleanliness")
                }
                catch(e){
                    updateCleanlinessRating = Number(currentCleanliness.text())
                }
                try{
                    checkNumber(updateCrowdRating,"Theme Park Crowds Rating")
                }
                catch(e){
                    updateCrowdRating = Number(currentCrowd.text())
                }
        
                try{
                    checkNumber(updateDiversityRating, "Theme Park Diversity Rating")
                }
                catch(e){
                    updateDiversityRating = Number(currentDiversity.text())
                }
                let requestConfig = {
                    method: "PATCH",
                    url: "/api/addThemeParkRating",
                    contentType: "application/json",
                    data: JSON.stringify({
                        ratingId: li.data("id"),
                        updateStaff: updateStaffRating,
                        updateCleanliness: updateCleanlinessRating,
                        updateCrowd: updateCrowdRating,
                        updateDiversity: updateDiversityRating
                    })
                }
                $.ajax(requestConfig).then((res) => {
                    if(res.Error) {
                        error.append(`<p>${res.Error}</p>`)
                        error.show();
                    }
                    else{
                        numRating.text(`${res.averageRatings.numRatings}`)
                        avgStaff.text(`${res.averageRatings.avgStaffRating}`)
                        avgClean.text(`${res.averageRatings.avgCleanlinessRating}`)
                        avgCrowd.text(`${res.averageRatings.avgCrowdRating}`)
                        avgDiversity.text(`${res.averageRatings.avgDiversityRating}`)
                        currentStaff.text(`${res.newStaffRating}`)
                        currentCleanliness.text(`${res.newCleanlinessRating}`)
                        currentCrowd.text(`${res.newCrowdRating}`)
                        currentDiversity.text(`${res.newDiversityRating}`)
                    }
                })
                updateRating.hide();
                updateButton.show();
                updateStaff.val("")
                updateCleanliness.val("")
                updateCrowd.val("")
                updateDiversity.val("")
            })
        }
    }
    function bindDelete(li) {
        const deleteButton = li.find("#deleteThemeParkRating")
        if(deleteButton.length > 0) {
            deleteButton.off("click").on("click", () => {
                error.hide();
                error.empty();

                let requestConfig = {
                    method: "DELETE",
                    url: "/api/addThemeParkRating",
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
                        avgStaff.text(`${res.averageRatings.avgStaffRating}`)
                        avgClean.text(`${res.averageRatings.avgCleanlinessRating}`)
                        avgCrowd.text(`${res.averageRatings.avgCrowdRating}`)
                        avgDiversity.text(`${res.averageRatings.avgDiversityRating}`)
                    }
                })
            })
        }
    }
    addThemeParkRating.on("click", () => {
        addThemeParkRating.hide();
        rating.show();
    })
    cancelButton.on("click", () => {
        rating.hide()
        addThemeParkRating.show();
        staff.val("")
        cleanliness.val("")
        crowds.val("")
        diversity.val("")
    })
    ratingForm.submit((event) => {
        event.preventDefault();
        error.hide();
        error.empty();
        const errors = []
        const staffRating = staff.val()
        const cleanlinessRating = cleanliness.val()
        const crowdsRating = crowds.val()
        const diversityRating = diversity.val()

        try{
            checkNumber(staffRating,"Theme Park Staff Rating")
        }
        catch(e){
            errors.push(e)
        }
        try{
            checkNumber(cleanlinessRating, "Theme Park Stuff Cleanliness")
        }
        catch(e){
            errors.push(e)
        }
        try{
            checkNumber(crowdsRating,"Theme Park Crowds Rating")
        }
        catch(e){
            errors.push(e)
        }

        try{
            checkNumber(diversityRating, "Theme Park Diversity Rating")
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
            let requestConfig = {
                method: "POST",
                url: '/api/addThemeParkRating',
                contentType: "application/json",
                data: JSON.stringify({
                    themeParkId: submitButton.data("id"),
                    themeParkStaff: staffRating,
                    themeParkCleanliness: cleanlinessRating,
                    themeParkCrowds: crowdsRating,
                    themeParkDiversity: diversityRating
                })
            }
            $.ajax(requestConfig).then((res) => {
                if(res.Error) {
                    error.append(`<p>${res.Error}</p>`)
                    error.show();
                }
                else{
                    const list = $(`<li data-id="${res._id}">
                        <p>${res.userName}</p>
                        <p id="tpitem" data-id="${res._id}" hidden></p>
                        <p><strong>Staff Rating:</strong> <span id="themeParkStaffRating">${res.staffRating}</span></p>
                        <p><strong>Cleanliness Rating:</strong> <span id="themeParkCleanlinessRating">${res.cleanlinessRating}</span></p>
                        <p><strong>Crowds Rating:</strong> <span id="themeParkCrowdsRating">${res.crowdsRating}</span></p>
                        <p><strong>Diversity Rating:</strong> <span id="themeParkDiversityRating">${res.diversityRating}</span></p>
                        <p class="numtplikes"><strong>Number of Likes:</strong> 0 </p>
                        <p class="numtpdislikes"><strong>Number of Dislikes:</strong> 0 </p>
                        <button id="updateThemeParkRating">Update Rating</button>
                        <button id="deleteThemeParkRating">Delete Rating</button>
                        <br>
                        <button class="themeparkratinglikes" data-id="${res._id}">Like</button> 
                        <button class="themeparkratingdislikes" data-id="${res._id}">Dislike</button> 
                        <div class="updateRating" hidden>
                            <h3>Update Rating</h3>
                            <form id = "updateForm">
                                <label for="updateStaff">Staff Rating</label>
                                <input type="number" name="updateStaff" id="updateStaff">
                                <br>
                                <label for="updateCleanliness">Cleanliness Rating</label>
                                <input type="number" name="updateCleanliness" id="updateCleanliness">
                                <br>
                                <label for="updateCrowd">Crowds Rating</label>
                                <input type="number" name="updateCrowd" id="updateCrowd">
                                <br>
                                <label for="updateDiversity">Diversity Rating</label>
                                <input type="number" name="updateDiversity" id="updateDiversity">
                                <br>
                                <button type="submit">Submit</button>
                            </form>
                            <button id="cancelUpdate">Cancel</button>
                        </div>
                        </li>
                        `)
                    ratingsList.append(list)
                    numRating.text(`${res.averageRatings.numRatings}`)
                    avgStaff.text(`${res.averageRatings.avgStaffRating}`)
                    avgClean.text(`${res.averageRatings.avgCleanlinessRating}`)
                    avgCrowd.text(`${res.averageRatings.avgCrowdRating}`)
                    avgDiversity.text(`${res.averageRatings.avgDiversityRating}`)
                    bindUpdate(list)
                    bindDelete(list)
                    
                }
            })

        }
        rating.hide();
        staff.val("")
        cleanliness.val("")
        crowds.val("")
        diversity.val("")
        addThemeParkRating.show();
    }
    )
    $("#ratingsList li").each((idx, li) => {
        bindUpdate($(li))
        bindDelete($(li))
    })

})(window.jQuery)