import { ObjectId } from "mongodb";
import helper from "../helper.js";
import { foodstallratings, foodstalls, users } from "../config/mongoCollections.js";


const createFoodStallRating = async (
    userId,
    foodStallId,
    foodQualityRating,
    waitTimeRating,
    review
) => {
    userId = helper.checkString(userId)
    if(!ObjectId.isValid(userId)) throw "Error: id isn't an object id"
    userId = new ObjectId(userId)
    const userCollections = await users();
    const user = await userCollections.findOne({_id: userId})
    if (user === null) throw `Error: there is no user with id ${id}`

    foodStallId = helper.checkString(foodStallId)
    if(!ObjectId.isValid(foodStallId)) throw `Error: id isn't an object id`
    const foodStallCollections = await foodstalls();
    const foodStall = await foodStallCollections.findOne({_id: foodStallId})
    if (foodStall === null) throw `Error: there is no food stall with id ${foodStallId}`

    helper.checkRating(foodQualityRating)
    helper.checkRating(waitTimeRating)
    review = helper.checkString(review)

    const newFoodStallRating = {
        userId: userId,
        foodStallId: foodStallId,
        foodQualityRating: foodQualityRating,
        waitTimeRating: waitTimeRating,
        review: review,
        comments: [],
        reports: []
    }

    const foodStallRatingCollections = await foodstallratings();
    const foodStallRatingRatingInfo = await foodStallRatingCollections.insertOne(newFoodStallRating)
    if(!foodStallRatingRatingInfo.acknowledged || !foodStallRatingRatingInfo.insertedId) throw "Error: could not add a new food stall rating"

    const ratingId = foodStallRatingRatingInfo.insertedId.toString()

    const updateFoodStallRating = {ratings: [...foodStall.ratings, ratingId]}
    const updateFoodStallResult = await rideRatingCollections.findOneAndUpdate({_id: rideId}, {$set: updateFoodStallRating})
    if(!updateFoodStallResult) throw "Error: could not add rating to food stall"

    const updateUserRating = {foodStallRatings: [...user.foodStallRatings, ratingId]}
    const updateUserResult = await userCollections.findOneAndUpdate({_id: userId}, {$set: updateUserRating})
    if(!updateUserResult) throw "Error: could not add rating to user"

    return await getFoodStallRatingById(ratingId)
}

const getFoodStallRatingById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const foodStallRatingCollections = await rideratings();
    const foodStallRating = await foodStallRatingCollections.findOne({_id: id})
    if (foodStallRating === null) throw `Error: a food stall rating doesn't have an id of ${id}`
    foodStallRating._id = foodStallRating._id.toString()
    return foodStallRating
}

export default {createFoodStallRating, getFoodStallRatingById}