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
        comments: [],
        reports: []
    }

    const themeParkRatingCollections = await themeparkratings();
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

const getThemeParkRatings = async (id) => {
    if (!ObjectId.isValid(id)) throw "Invalid Theme Park ID";

    const themeParkRatingCollection = await themeparkratings();
    const ratings = await themeParkRatingCollection.find({themeParkId: id}).toArray();

    if (ratings.length === 0) {
        return {
            themeParkID: id,
            ratings: []
        };
    }

    const formattedThemeRatings = ratings.map(rating => ({
        _id: rating._id.toString(),
        userName: rating.userName,
        staffRating: rating.staffRating,
        cleanlinessRating: rating.cleanlinessRating,
        crowdsRating: rating.crowdsRating,
        diversityRating: rating.diversityRating,
        comments: rating.comments, //rating.comments.map(commentId => commentId.toString()),
        reports: rating.reports //rating.reports.map(reportId => reportId.toString())
    }));

    return {
        themeParkID: id,
        ratings: formattedThemeRatings
    };
}

export default {createThemeParkRating, getThemeParkRatingById, getThemeParkRatings}