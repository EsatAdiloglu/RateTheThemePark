(function ($) {
    let commentList = $("#commentList"),
        addThemeParkComment = $("#addThemeParkComment"),
        comment = $("#comment"),
        error = $("#error"),
        commentForm = $("#commentForm"),
        themeParkComment = $("#theme_park_comment"),
        submitButton = $(`button[type="submit"]`)


    const checkString = (str) => {
        if(typeof str !== "string") throw `Error: comment isn't of type string`
        str = str.trim();
        if(str.length < 1) throw `Error: invalid comment`
        return str

    }
    function bindButton(li) {
        const btn = $(li).find(".childComment")
        const childComment = $(li).find("div")
        btn.on("click", function(){
            btn.hide();
            childComment.show()

            childComment.find(".cancelButton").on("click", () => {
                childComment.hide();
                btn.show();
            })
        })
    }

    addThemeParkComment.on("click", () => {
        addThemeParkComment.hide();
        comment.show();
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
                    error.text(`${res.Error}`)
                    error.show();
                }
                else {
                    const newComment = $(`
                        <li>
                            User: ${res.userName} Comment: ${res.commentBody}
                            <button class="childComment">Add a comment</button>
                        </li>`)
                    commentList.append(newComment)
                    bindButton(newComment)
                }
            })
        }
        comment.hide();
        themeParkComment.val("");
        addThemeParkComment.show();
    })

    $("#commentList li").each((idx, li) => {
        bindButton(li)
    })
})(window.jQuery)