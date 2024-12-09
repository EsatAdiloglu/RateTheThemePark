//testing other way of commit
import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { themeparks, comments, themeparkratings, rideratings, foodstallratings } from "../config/mongoCollections.js";

const createComment = async (
    userName,
    thingId,
    commentBody,
    option
) => {
    userName = helper.checkString(userName)
    thingId = helper.checkId(thingId)
    commentBody = helper.checkString(commentBody)

    if(typeof option != number) throw "Error: option isn't of type number"
    const commentCollections =  await comments();
    let collection = undefined
    switch(option){
        case 0:
            collection = await themeparkratings();
            break;
        case 1:
            collection = await rideratings();
            break;
        case 2:
            collection = await foodstallratings();
            break;
        case 3:
            //being added to comment
            collection = commentCollections;
            break;
        default:
            throw "Error: option out of bounds"
    }
    const thing = await collection.findOne({_id: new ObjectId(thingId)})
    if (thing === null) throw `Error: the thing that is being commented on doesn't have the id of ${thingId}`

    const newComment = {
        userName: userName,
        thingId: thingId,
        commentBody: commentBody,
        comments: []
    }
    const commentInfo = await commentCollections.insertOne(newComment)
    if(!commentInfo.acknowledged || !commentInfo.insertedId) throw "Error: could not add a new food stall rating"

    const commentId = commentInfo.insertedId.toString()

    const updatedComments = {comments: [...thing.comments, commentId]}
    const updatedCommentsResult = await collection.findOneAndUpdate({_id: new ObjectId(thingId)}, {$set: updatedComments})
    if(!updatedCommentsResult) throw "Error: could not add comment to the thing"
}

const getComments = async (id) => {
    id = helper.checkId(id)

    let collection = undefined

    const commentCollections = await comments();
    const comments = await commentCollections.find({placeId: new ObjectId(id)}).toArray();

    const formattedComments = comments.map((comment) => ({
        _id: comment._id.toString(),
        userName: comment.userName,
        thingId: comment.thingId,
        commentBody: comment.commentBody,
        comments: comment.comments
    }))

    return {
        thingId: id,
        comments: formattedComments
    }
} 

export default {createComment, getComments}