
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
        numRating = $("#numRating")

    const checkNumber = (num, numName) => {
        if(typeof num === "string" && num.trim().length < 1) throw `Error: ${numName} wasn't given`
        num = Number(num)
        if(isNaN(num)) throw `Error: ${numName} is NaN`
        if(num % 1 !== 0) throw `Error: ${numName} isn't an integer`
        if(num < 0 || num > 10) throw `Error: ${numName} isn't between 0 or 10`

    }
    addThemeParkRating.on("click", () => {
        addThemeParkRating.hide();
        rating.show();
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
                    console.log(res);
                    const list = $(`<li>
                        <p>${res.userName}</p>
                        <p id="tpitem" data-id="${res._id}" hidden></p>
                        <p><strong>Staff Rating:</strong> ${res.staffRating}</p>
                        <p><strong>Cleanliness Rating:</strong> ${res.cleanlinessRating}</p>
                        <p><strong>Crowds Rating:</strong> ${res.crowdsRating}</p>
                        <p><strong>Diversity Rating:</strong> ${res.diversityRating}</p>
                        <p class="numtplikes"><strong>Number of Likes:</strong> 0 </p>
                        <p class="numtpdislikes"><strong>Number of Dislikes:</strong> 0 </p>
                        <button class="themeparkratinglikes" data-id="${res._id}">Like</button> 
                        <button class="themeparkratingdislikes" data-id="${res._id}">Dislike</button> 
                        </li>
                        `)
                    ratingsList.append(list)
                    numRating.text(`${res.averageRatings.numRatings}`)
                    avgStaff.text(`${res.averageRatings.avgStaffRating}`)
                    avgClean.text(`${res.averageRatings.avgCleanlinessRating}`)
                    avgCrowd.text(`${res.averageRatings.avgCrowdRating}`)
                    avgDiversity.text(`${res.averageRatings.avgDiversityRating}`)
                    
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
})(window.jQuery)