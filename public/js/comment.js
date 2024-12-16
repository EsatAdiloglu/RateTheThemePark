(function ($) {
    let commentList = $("#commentList"),
        addComment = $("#addComment"),
        comment = $("#comment"),
        error = $("#error"),
        commentForm = $("#commentForm"),
        commentBody = $("#commentBody"),
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
            childComment = $(div).find("div").first();

        let childCommentContent = childComment.find("textarea").first()
        btn.on("click", function(){
            btn.hide();
            childComment.show()

            childComment.find(".cancelChildButton").off("click").on("click", () => {
                childComment.hide();
                btn.show();
                childCommentContent.val("")
            })
            
            childComment.find(".childCommentForm").off("submit").submit((event) => {
                event.preventDefault();
                childComment.hide();
                btn.show();
                
                error.hide();
                error.empty();


                let childCommentError = ""
                let childCommentBody = childCommentContent.val()
                
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
                            // const newComment = $(`
                            //     <div data-id=${res.commentId} >
                            //         User: ${res.userName} Comment: ${res.commentBody}
                            //         <button class="childCommentBtn">Add a comment</button>
                            //         <div hidden>
                            //             <p>Reply</p>
                            //             <form class="childCommentForm">
                            //             <label for="childCommentBody"></label>
                            //             <br>
                            //             <textarea name="childCommentBody" class="childCommentBody"></textarea>
                            //             <br>
                            //             <button type="submit">Submit Reply</button>
                            //             </form>
                            //             <button class="cancelChildButton">Cancel</button>
                            //         </div>
                            //         <br>
                            //     </div>`)
                            const newComment = $(`<p>&emsp;&emsp;User: ${res.userName} Comment: ${res.commentBody}</p>`)
                            $(div).append(newComment)
                            //bindButton(newComment)
                        }
                    })
                }
                childCommentContent.val("")
            })
        })
    }

    addComment.on("click", () => {
        addComment.hide();
        comment.show();
    })

    cancelButton.on("click", () => {
        comment.hide();
        addComment.show();
        commentBody.val("")
    })

    commentForm.submit((event) => {
        event.preventDefault();
        error.hide();
        error.empty();

        let commentError = ""
        let commentContent = commentBody.val()

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
                url: "/api/addComment",
                contentType: "application/json",
                data: JSON.stringify({
                    thingId: submitButton.data("id"),
                    commentBody: commentContent,
                    option: submitButton.data("index-number")
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
                            <button class="childCommentBtn">Add a comment</button>
                            <div hidden>
                                <p>Reply</p>
                                <form class="childCommentForm">
                                <label for="${res.commentId}-child"></label>
                                <br>
                                <textarea name="childCommentBody" id="${res.commentId}-child" class="childCommentBody"></textarea>
                                <br>
                                <button type="submit">Submit Reply</button>
                                </form>
                                <button class="cancelChildButton">Cancel</button>
                            </div>
                            <br>
                        </div>`)
                    commentList.append(newComment)
                    bindButton(newComment)
                }
            })
        }
        comment.hide();
        commentBody.val("");
        addComment.show();
    })
    $("#commentList div").each((idx, div) => {
        bindButton(div)
    })

})(window.jQuery)