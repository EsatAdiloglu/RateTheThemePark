import { ObjectId } from "mongodb";
import helper from "../helper.js";
import { rideratings, rides, users } from "../config/mongoCollections.js";


const createRideRating = async (
    userId,
    rideId,
    waitTimeRating,
    comfortabilityRating,
    enjoymentRating,
    review
) => {
    userId = helper.checkString(userId)
    if(!ObjectId.isValid(userId)) throw "Error: id isn't an object id"
    userId = new ObjectId(userId)
    const userCollections = await users();
    const user = await userCollections.findOne({_id: userId})
    if (user === null) throw `Error: there is no user with id ${id}`

    rideId = helper.checkString(rideId)
    if(!ObjectId.isValid(rideId)) throw `Error: id isn't an object id`
    const rideCollections = await rides();
    const ride = await rideCollections.findOne({_id: rideId})
    if (ride === null) throw `Error: there is no ride with id ${rideId}`

    helper.checkRating(waitTimeRating)
    helper.checkRating(comfortabilityRating)
    helper.checkRating(enjoymentRating)
    review = helper.checkString(review)

    const newRideRating = {
        userId: userId,
        rideId: rideId,
        waitTimeRating: waitTimeRating,
        comfortabilityRating: comfortabilityRating,
        enjoymentRating: enjoymentRating,
        review: review,
        likes: [],
        dislikes: [],
        comments: [],
        reports: []
    }

    const rideRatingCollections = await rideratings();
    const rideRatingInfo = await rideRatingCollections.insertOne(newRideRating)
    if(!rideRatingInfo.acknowledged || !rideRatingInfo.insertedId) throw "Error: could not add a new ride rating"

    const ratingId = rideRatingInfo.insertedId.toString()

    const updateRideRating = {ratings: [...ride.ratings, ratingId]}
    const updateRideResult = await rideRatingCollections.findOneAndUpdate({_id: rideId}, {$set: updateRideRating})
    if(!updateRideResult) throw "Error: could not add rating to ride"

    const updateUserRating = {rideRatings: [...user.rideRatings, ratingId]}
    const updateUserResult = await userCollections.findOneAndUpdate({_id: userId}, {$set: updateUserRating})
    if(!updateUserResult) throw "Error: could not add rating to user"

    return await getRideRatingById(ratingId)
}

const getRideRatingById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const rideRatingCollections = await rideratings();
    const rideRating = await rideRatingCollections.findOne({_id: id})
    if (rideRating === null) throw `Error: a ride rating doesn't have an id of ${id}`
    rideRating._id = rideRating._id.toString()
    return rideRating
}

const getRideRatingsByRide = async (id) => {
    if (!ObjectId.isValid(id)) throw "Invalid Ride ID";

    const rideRatingCollection = await rideratings();
    const ratings = await rideRatingCollection.find({rideID: new ObjectId(id)}).toArray();

    if (ratings.length === 0) {
        return {
            rideID: id,
            ratings: []
        };
    }

    const formattedRideRatings = ratings.map(rating => ({
        _id: rating._id.toString(),
        userID: rating.userID.toString(),
        waitTimeRating: rating.waitTimeRating,
        comfortabilityRating: rating.comfortabilityRating,
        enjoymentAndExperienceRating: rating.enjoymentAndExperienceRating,
        review: rating.review,
        comments: rating.comments, //rating.comments.map(commentId => commentId.toString()),
        reports: rating.reports //rating.reports.map(reportId => reportId.toString())
    }));

    return {
        rideID: id,
        ratings: formattedRideRatings
    };
}
export default {createRideRating, getRideRatingById}