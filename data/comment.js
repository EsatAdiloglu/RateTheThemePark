//testing other way of commit
import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { themeparks, comments, rides, foodstalls, users } from "../config/mongoCollections.js";

const createComment = async (
    userName,
    thingId,
    commentBody,
    option
) => {
    userName = helper.checkString(userName)
    thingId = helper.checkId(thingId)
    commentBody = helper.checkString(commentBody)

    if(typeof option !== 'number') throw "Error: option isn't of type number"
    const commentCollections =  await comments();
    let collection = undefined
    let name = undefined
    switch(option){
        case 0:
            collection = await themeparks();
            name = "theme park"
            break;
        case 1:
            collection = await rides();
            name = "ride"
            break;
        case 2:
            collection = await foodstalls();
            name = "food stall"
            break;
        case 3:
            //being added to comment
            collection = commentCollections;
            name = "comment"
            break;
        default:
            throw "Error: option out of bounds"
    }
    const thing = await collection.findOne({_id: new ObjectId(thingId)})
    if (thing === null) throw `Error: the ${name} that is being commented on doesn't have the id of ${thingId}`

    const userCollections = await users();
    const user = await userCollections.findOne({userName: userName.toLowerCase()})
    if(user === null) throw `Error: the usr ${userName} doesn't exist`

    const newComment = {
        userName: userName,
        thingId: thingId,
        commentBody: commentBody,
        comments: []
    }
    const commentInfo = await commentCollections.insertOne(newComment)
    if(!commentInfo.acknowledged || !commentInfo.insertedId) throw `Error: could not add a new comment to the ${name}`

    const commentId = commentInfo.insertedId.toString()

    
    const updatedThingComments = {comments: [...thing.comments, commentId]}
    const updatedThingCommentsResult = await collection.findOneAndUpdate({_id: new ObjectId(thingId)}, {$set: updatedThingComments})
    if(!updatedThingCommentsResult) throw `Error: could not add comment to the ${name}`

    const updatedUserComments = {comments: [...user.comments, commentId]}
    const updatedUserCommentsResult = await userCollections.findOneAndUpdate({userName: userName.toLowerCase()}, {$set: updatedUserComments})
    if(!updatedUserCommentsResult) throw `Erorr: could not add comment for ${userName}`

    return commentId
}

const getComments = async (id, user) => {
    id = helper.checkId(id)


    const commentCollections = await comments();
    const commentArray = await commentCollections.find({thingId: id}).toArray();

    const formattedComments = commentArray.map((comment) => {
        const formatComment = { 
            _id: comment._id.toString(),
            userName: comment.userName,
            thingId: comment.thingId,
            commentBody: comment.commentBody,
            comments: comment.comments
        }
        if(comment.userName === user) formatComment.edit = true
        else formatComment.edit = false

        return formatComment
    })
    for(let i = 0; i < formattedComments.length; i++){
        const comment = formattedComments[i]
        const childCommentArray = await commentCollections.find({thingId: comment._id}).toArray();

        comment.comments = childCommentArray.map((child) => ({
            _id: child._id.toString(),
            userName: child.userName,
            thingId: child.thingId,
            commentBody: child.commentBody,
            comments: child.comments
        }))

        formattedComments[i] = comment

    }

    return {
        thingId: id,
        comments: formattedComments
    }
}


export default {createComment, getComments}