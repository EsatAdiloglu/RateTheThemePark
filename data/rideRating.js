import { ObjectId } from "mongodb";
import helper from "../helper.js";
import { rideratings, rides, users } from "../config/mongoCollections.js";


const createRideRating = async (
    userName,
    rideId,
    waitTimeRating,
    comfortabilityRating,
    enjoymentRating,
    review
) => {
    userName = helper.checkString(userName)
    const userCollections = await users();
    const user = await userCollections.findOne({userName: userName})
    if (user === null) throw `Error: there is no user with username ${userName}`

    rideId = helper.checkString(rideId)
    if(!ObjectId.isValid(rideId)) throw `Error: id isn't an object id`
    const rideObjectId = new ObjectId(rideId)
    const rideCollections = await rides();
    const ride = await rideCollections.findOne({_id: rideObjectId})
    if (ride === null) throw `Error: there is no ride with id ${rideId}`

    const rideRatingCollections = await rideratings();

    const alreadyRated = await rideRatingCollections.findOne({rideId: rideId, userName: userName});
    if(alreadyRated !== null) throw `Error: You have already rated ${ride.rideName}`

    helper.checkRating(waitTimeRating)
    helper.checkRating(comfortabilityRating)
    helper.checkRating(enjoymentRating)
    // review = helper.checkString(review)

    const newRideRating = {
        userName: userName,
        rideId: rideId,
        waitTimeRating: waitTimeRating,
        comfortabilityRating: comfortabilityRating,
        enjoymentRating: enjoymentRating,
        review: "review",
        usersLiked: [],
        usersDisliked: [],
        numUsersLiked: 0,
        numUsersDisliked: 0,
        comments: [],
        reports: []
    }

    const rideRatingInfo = await rideRatingCollections.insertOne(newRideRating)
    if(!rideRatingInfo.acknowledged || !rideRatingInfo.insertedId) throw "Error: could not add a new ride rating"

    const ratingId = rideRatingInfo.insertedId.toString()
    const updateRideRating = {ratings: [...ride.ratings, ratingId]}
    const updateRideResult = await rideCollections.findOneAndUpdate({_id: rideObjectId}, {$set: updateRideRating})
    if(!updateRideResult) throw "Error: could not add rating to ride"

    const updateUserRating = {rideRatings: [...user.rideRatings, ratingId]}
    const updateUserResult = await userCollections.findOneAndUpdate({userName: userName}, {$set: updateUserRating})
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
    const ratings = await rideRatingCollection.find({rideId: id}).toArray();

    if (ratings.length === 0) {
        return {
            rideId: id,
            ratings: []
        };
    }

    const formattedRideRatings = ratings.map(rating => ({
        _id: rating._id.toString(),
        userName: rating.userName,
        waitTimeRating: rating.waitTimeRating,
        comfortabilityRating: rating.comfortabilityRating,
        enjoymentRating: rating.enjoymentRating,
        //review: rating.review,
        numUsersLiked: rating.numUsersLiked,
        numUsersDisliked: rating.numUsersDisliked,
        comments: rating.comments, //rating.comments.map(commentId => commentId.toString()),
        reports: rating.reports //rating.reports.map(reportId => reportId.toString())
    }));

    return {
        rideId: id,
        ratings: formattedRideRatings
    };
}

const getAverageRideRatings = async(id) => {
    const ratings = (await getRideRatingsByRide(id)).ratings
    let avgWait = 0
    let avgComfort = 0
    let avgEnjoyment = 0
    
    ratings.forEach((rating) => {
        avgWait += parseInt(rating.waitTimeRating)
        avgComfort += parseInt(rating.comfortabilityRating)
        avgEnjoyment += parseInt(rating.enjoymentRating)
    })
    const ratingLength = ratings.length > 0 ? ratings.length : 1

    avgWait /= ratingLength
    avgComfort /= ratingLength
    avgEnjoyment /= ratingLength

    return {
        avgWaitTimeRating: avgWait.toFixed(2),
        avgComfortRating: avgComfort.toFixed(2),
        avgEnjoymentRating: avgEnjoyment.toFixed(2),
        numRatings: ratings.length
    }


}
export default {createRideRating, getRideRatingById, getRideRatingsByRide, getAverageRideRatings}