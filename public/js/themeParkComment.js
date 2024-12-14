(function ($) {
    let commentList = $("#commentList"),
        addThemeParkComment = $("#addThemeParkComment"),
        comment = $("#comment"),
        error = $("#error"),
        commentForm = $("#commentForm"),
        themeParkComment = $("#theme_park_comment"),
        submitButton = $(`button[type="submit"]`),
        cancelButton = $("#cancelButton")


    const checkString = (str) => {
        if(typeof str !== "string") throw `Error: comment isn't of type string`
        str = str.trim();
        if(str.length < 1) throw `Error: invalid comment`
        return str

    }

    function bindButton(div) {
        let btn = $(div).find(".childCommentBtn"),
            childComment = $(div).find("div")

        let childCommentContent = childComment.find(".childCommentBody")

        btn.on("click", function(){
            btn.hide();
            childComment.show()

            childComment.find(".cancelChildButton").on("click", () => {
                childComment.hide();
                btn.show();
                childCommentContent.val("")
            })
            
            childComment.find(".childCommentForm").submit((event) => {
                event.preventDefault();
                childComment.hide();
                btn.show();
                
                error.hide();
                error.empty();


                let childCommentError = ""
                let childCommentBody = childCommentContent.val()
                console.log(childCommentBody)
                
                try{
                    childCommentBody = checkString(childCommentBody)
                }
                catch(e){
                    childCommentError = e
                }

                if(childCommentError.length > 0){
                    error.text(`${childCommentError}`)
                    error.show();
                }
                
                else {
                    let requestConfig = {
                        method: "POST",
                        url: "/api/addChildComment",
                        contentType: "application/json",
                        data: JSON.stringify({
                            commentId: $(div).data("id"),
                            childCommentBody: childCommentBody
                        })
                    }

                    $.ajax(requestConfig).then((res) => {
                        if(res.Error){
                            error.text(`There was something wrong was trying to replaying to a comment. Please try again`)
                            error.show();
                        }
                        else{
                            const newComment = $(`
                                <div data-id=${res.commentId} >
                                    User: ${res.userName} Comment: ${res.commentBody}
                                    <button class="childComment">Add a comment</button>
                                    <div hidden>
                                        <p>Reply</p>
                                        <form>
                                        <label for="childCommentForm"></label>
                                        <br>
                                        <textarea name="childCommentBody" class="childCommentBody"></textarea>
                                        <br>
                                        <button type="submit">Submit Reply</button>
                                        </form>
                                        <button class="cancelButton">Cancel</button>
                                    </div>
                                    <br>
                                </div>`)
                            $(div).append(newComment)
                            bindButton(newComment)
                        }
                    })
                }
                childCommentContent.val("")
            })
        })
    }

    addThemeParkComment.on("click", () => {
        addThemeParkComment.hide();
        comment.show();
    })

    cancelButton.on("click", () => {
        comment.hide();
        addThemeParkComment.show();
        themeParkComment.val("")
    })

    commentForm.submit((event) => {
        event.preventDefault();
        error.hide();
        error.empty();

        let commentError = ""
        let commentContent = themeParkComment.val()

        try{
            commentContent = checkString(commentContent) 
        }
        catch(e){
            commentError = e
        }

        if(commentError.length > 0) {
            error.text(`${commentError}`);
            error.show();
        }
        else{
            let requestConfig = {
                method: "POST",
                url: "/api/addThemeParkComment",
                contentType: "application/json",
                data: JSON.stringify({
                    themeParkId: submitButton.data("id"),
                    commentBody: commentContent
                })
            }

            $.ajax(requestConfig).then((res) => {
                if(res.Error) {
                    error.text(`There was something wrong was trying to add a comment. Please try again`)
                    error.show();
                }
                else {
                    const newComment = $(`
                        <div data-id=${res.commentId} >
                            User: ${res.userName} Comment: ${res.commentBody}
                            <button class="childComment">Add a comment</button>
                            <div hidden>
                                <p>Reply</p>
                                <form>
                                <label for="childCommentForm"></label>
                                <br>
                                <textarea name="childCommentBody" class="childCommentBody"></textarea>
                                <br>
                                <button type="submit">Submit Reply</button>
                                </form>
                                <button class="cancelButton">Cancel</button>
                            </div>
                            <br>
                        </div>`)
                    commentList.append(newComment)
                    bindButton(newComment)
                }
            })
        }
        comment.hide();
        themeParkComment.val("");
        addThemeParkComment.show();
    })

    $("#commentList div").each((idx, div) => {
        bindButton(div)
    })

})(window.jQuery)