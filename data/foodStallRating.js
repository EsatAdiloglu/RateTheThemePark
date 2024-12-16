import { ObjectId, ReturnDocument } from "mongodb";
import helper from "../helper.js";
import { foodstallratings, foodstalls, users } from "../config/mongoCollections.js";


const createFoodStallRating = async (
    userName,
    foodStallId,
    foodQualityRating,
    waitTimeRating,
    review
) => {
    userName = helper.checkString(userName)

    const userCollections = await users();
    const user = await userCollections.findOne({userName: userName})
    if (user === null) throw `Error: there is no user with username ${userName}`

    foodStallId = helper.checkString(foodStallId)
    if(!ObjectId.isValid(foodStallId)) throw `Error: id isn't an object id`
    const fodoStallObjectId = new ObjectId(foodStallId)
    const foodStallCollections = await foodstalls();
    const foodStall = await foodStallCollections.findOne({_id: fodoStallObjectId})
    if (foodStall === null) throw `Error: there is no food stall with id ${foodStallId}`

    const foodStallRatingCollections = await foodstallratings();

    const alreadyRated = await foodStallRatingCollections.findOne({foodStallId: foodStallId, userName: userName});
    if(alreadyRated !== null) throw `Error: You have already rated ${foodStall.foodStallName}`

    helper.checkRating(foodQualityRating)
    helper.checkRating(waitTimeRating)
    review = helper.checkString(review)

    const newFoodStallRating = {
        userName: userName,
        foodStallId: foodStallId,
        foodQualityRating: foodQualityRating,
        waitTimeRating: waitTimeRating,
        review: review,
        usersLiked: [],
        usersDisliked: [],
        numUsersLiked: 0,
        numUsersDisliked: 0,
        comments: [],
        reports: []
    }

    
    const foodStallRatingRatingInfo = await foodStallRatingCollections.insertOne(newFoodStallRating)
    if(!foodStallRatingRatingInfo.acknowledged || !foodStallRatingRatingInfo.insertedId) throw "Error: could not add a new food stall rating"

    const ratingId = foodStallRatingRatingInfo.insertedId.toString()

    const updateFoodStallRating = {ratings: [...foodStall.ratings, ratingId]}
    const updateFoodStallResult = await foodStallCollections.findOneAndUpdate({_id: fodoStallObjectId}, {$set: updateFoodStallRating})
    if(!updateFoodStallResult) throw "Error: could not add rating to food stall"

    const updateUserRating = {foodStallRatings: [...user.foodStallRatings, ratingId]}
    const updateUserResult = await userCollections.findOneAndUpdate({userName: userName}, {$set: updateUserRating})
    if(!updateUserResult) throw "Error: could not add rating to user"
    return await getFoodStallRatingById(ratingId)
}

const getFoodStallRatingById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const foodStallRatingCollections = await foodstallratings();
    const foodStallRating = await foodStallRatingCollections.findOne({_id: new ObjectId(id)})
    if (foodStallRating === null) throw `Error: a food stall rating doesn't have an id of ${id}`
    foodStallRating._id = foodStallRating._id.toString()
    return foodStallRating
}

const getFoodStallRatings = async (id, user) => {
    if (!ObjectId.isValid(id)) throw "Invalid Food Stall ID";

    const foodStallRatingCollection = await foodstallratings();
    const ratings = await foodStallRatingCollection.find({foodStallId: id}).toArray();

    if (ratings.length === 0) {
        return {
            foodStallId: id,
            ratings: []
        };
    }
    const formattedFoodStallRatings = ratings.map(rating => {
        const formatRating = {
            _id: rating._id.toString(),
            userName: rating.userName.toString(),
            foodQualityRating: rating.foodQualityRating,
            waitTimeRating: rating.waitTimeRating,
            review: rating.review,
            numUsersLiked: rating.numUsersLiked,
            numUsersDisliked: rating.numUsersDisliked,
            comments: rating.comments, //rating.comments.map(commentId => commentId.toString()),
            reports: rating.reports //rating.reports.map(reportId => reportId.toString())
        }

        if(rating.userName === user) formatRating.edit = true
        else formatRating.edit = false
        return formatRating
    });

    return {
        foodStallId: id,
        ratings: formattedFoodStallRatings
    }; 
}

const getAverageFoodStallRatings = async(id) => {
    const ratings = (await getFoodStallRatings(id)).ratings
    let avgFood = 0
    let avgWait = 0

    ratings.forEach((rating) => {
        avgFood += parseInt(rating.foodQualityRating)
        avgWait += parseInt(rating.waitTimeRating)
    })
    const ratingLength = ratings.length > 0 ? ratings.length : 1

    avgFood /= ratingLength
    avgWait /= ratingLength
    return{
        avgFoodQualityRating: avgFood.toFixed(2),
        avgWaitTimeRating: avgWait.toFixed(2),
        numRatings: ratings.length
    }
}

const updateRating = async (
    id,
    foodQualityRating,
    waitTimeRating
) => {
    id = helper.checkId(id, "Rating Id")

    helper.checkRating(foodQualityRating)
    helper.checkRating(waitTimeRating)

    const updatedRating = {
        foodQualityRating: foodQualityRating,
        waitTimeRating: waitTimeRating
    }
    const foodStallRatingCollections = await foodstallratings();
    const updatedResults = await foodStallRatingCollections.findOneAndUpdate({_id: new ObjectId(id)}, {$set: updatedRating}, {returnDocument: "after"})
    if(!updatedResults) throw "Error: Could not update rating"
    return updatedResults
}

const deleteRating = async (id) => {
    id = helper.checkId(id, "Rating Id")

    const foodStallRatingCollections = await foodstallratings();
    const foodStallCollections = await foodstalls();
    const userCollections = await users();

    const exist = await foodStallRatingCollections.findOne({_id: new ObjectId(id)})
    if(!exist) throw `Error: a rating doesn't exist with id ${id}`

    const foodStall = await foodStallCollections.findOne({ratings: id})
    if(!foodStall) throw `Error: no food stall has the rating with id ${id}`

    const user = await userCollections.findOne({foodStallRatings: id})
    if(!user) throw `Error: no user has the rating with id ${id}`

    const deletedRating = await foodStallRatingCollections.findOneAndDelete({_id: new ObjectId(id)})
    if(!deletedRating) throw "Error: could not delete rating"

    const updatedUserRatings = {foodStallRatings: user.foodStallRatings.filter((rating) => rating !== id)}
    const deletedUserRating = await userCollections.findOneAndUpdate({_id: user._id}, {$set: updatedUserRatings})
    if(!deletedUserRating) throw "Error: could not delete rating from user"

    const updatedFoodStallRatings = {ratings: foodStall.ratings.filter((rating) => rating !== id)} 
    const deletedFoodStallRating = await foodStallCollections.findOneAndUpdate({_id: foodStall._id}, {$set: updatedFoodStallRatings}, {returnDocument: "after"})
    if(!deletedFoodStallRating) throw "Error: could not delete rating from theme park"

    return deletedFoodStallRating

}

export default {createFoodStallRating, getFoodStallRatingById, getFoodStallRatings, getAverageFoodStallRatings, updateRating, deleteRating}