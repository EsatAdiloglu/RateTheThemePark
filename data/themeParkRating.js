import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { themeparks, users, themeparkratings } from "../config/mongoCollections.js";

const createThemeParkRating = async (
    userName,
    themeParkId,
    staffRating,
    cleanlinessRating,
    crowdsRating,
    diversityRating,
    review
) => {
    userName = helper.checkString(userName)
    const userCollections = await users();
    const user = await userCollections.findOne({userName: userName})
    if (user === null) throw `Error: there is no user with userName ${userName}`

    themeParkId = helper.checkString(themeParkId)
    if(!ObjectId.isValid(themeParkId)) throw "Error: id isn't an object id"
    const themeParkObjectId = new ObjectId(themeParkId)
    const themeParkCollections = await themeparks();
    const themePark = await themeParkCollections.findOne({_id: themeParkObjectId})
    if (themePark === null) throw `Error: there is no theme park with id ${themeParkId}`

    const themeParkRatingCollections = await themeparkratings();

    const alreadyRated = await themeParkRatingCollections.findOne({themeParkId: themeParkId, userName: userName});
    if(alreadyRated !== null) throw `Error: You have already rated ${themePark.themeParkName}`

    helper.checkRating(staffRating)
    helper.checkRating(cleanlinessRating)
    helper.checkRating(crowdsRating)
    helper.checkRating(diversityRating)

    const newThemeParkRating = {
        userName: userName,
        themeParkId: themeParkId,
        staffRating: staffRating,
        cleanlinessRating: cleanlinessRating,
        crowdsRating: crowdsRating,
        diversityRating: diversityRating,
        review: review,
        usersLiked: [],
        usersDisliked: [],
        numUsersLiked: 0,
        numUsersDisliked: 0,
        comments: [],
        reports: []
    }


    const themeParkRatingInfo = await themeParkRatingCollections.insertOne(newThemeParkRating);
    if(!themeParkRatingInfo.acknowledged || !themeParkRatingInfo.insertedId) throw "Error: could not add a new theme park rating"
    
    const ratingID = themeParkRatingInfo.insertedId.toString()

    const updateThemeRating = {ratings: [...themePark.ratings, ratingID]}
    const updateThemeResult = await themeParkCollections.findOneAndUpdate({_id: themeParkObjectId},{$set: updateThemeRating})
    if(!updateThemeResult) throw "Error: could not add rating to themepark"

    const updateUserRating = {themeParkRatings: [...user.themeParkRatings, ratingID]}
    const updateUserResult = await userCollections.findOneAndUpdate({userName: userName},{$set: updateUserRating})
    if(!updateUserResult) throw "Error: could not add rating to user"
    
    return await getThemeParkRatingById(ratingID);


}
const getThemeParkRatingById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const themeParkRatingsCollections = await themeparkratings();
    const themeParkRating = await themeParkRatingsCollections.findOne({_id: id})
    if (themeParkRating === null) throw `Error: a theme park rating doesn't have an id of ${id}`
    themeParkRating._id = themeParkRating._id.toString()
    return themeParkRating
}

const getThemeParkRatings = async (id, user) => {
    if (!ObjectId.isValid(id)) throw "Invalid Theme Park ID";

    const themeParkRatingCollection = await themeparkratings();
    const ratings = await themeParkRatingCollection.find({themeParkId: id}).toArray();

    if (ratings.length === 0) {
        return {
            themeParkID: id,
            ratings: []
        };
    }
    const formattedThemeRatings = ratings.map(rating => {
        const formatRating = {
            _id: rating._id.toString(),
            userName: rating.userName,
            staffRating: rating.staffRating,
            cleanlinessRating: rating.cleanlinessRating,
            crowdsRating: rating.crowdsRating,
            diversityRating: rating.diversityRating,
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
        themeParkID: id,
        ratings: formattedThemeRatings
    };
}

const getAverageThemeParkRatings = async(id) => {
    const ratings = (await getThemeParkRatings(id)).ratings
    let avgStaff = 0
    let avgCleanliness = 0
    let avgCrowds = 0
    let avgDiversity = 0
    
    ratings.forEach((rating) => {
        avgStaff += parseInt(rating.staffRating)
        avgCleanliness += parseInt(rating.cleanlinessRating)
        avgCrowds += parseInt(rating.crowdsRating)
        avgDiversity += parseInt(rating.diversityRating)
    })
    const ratingLength = ratings.length > 0 ? ratings.length : 1

    avgStaff /= ratingLength
    avgCleanliness /= ratingLength
    avgCrowds /= ratingLength
    avgDiversity /= ratingLength
    return {
        avgStaffRating: avgStaff.toFixed(2),
        avgCleanlinessRating: avgCleanliness.toFixed(2),
        avgCrowdRating: avgCrowds.toFixed(2),
        avgDiversityRating: avgDiversity.toFixed(2),
        numRatings: ratings.length
    }


}

const updateRating = async (
    id,
    staffRating,
    cleanlinessRating,
    crowdsRating,
    diversityRating
) => {
    id = helper.checkId(id)

    helper.checkRating(staffRating)
    helper.checkRating(cleanlinessRating)
    helper.checkRating(crowdsRating)
    helper.checkRating(diversityRating)

    const updatedRating = {
        staffRating: staffRating,
        cleanlinessRating: cleanlinessRating,
        crowdsRating: crowdsRating,
        diversityRating: diversityRating
    }

    const themeParkRatingCollections = await themeparkratings();
    const updatedResults = await themeParkRatingCollections.findOneAndUpdate({_id: new ObjectId(id)}, {$set: updatedRating}, {returnDocument: "after"})
    if(!updatedResults) throw "Error: Could not update rating"
    return updatedResults

}
export default {createThemeParkRating, getThemeParkRatingById, getThemeParkRatings, getAverageThemeParkRatings, updateRating}