import {ObjectId} from "mongodb";
import helper from "./helper.js"
import { comments, themeparkratings, themeparks, users } from "../config/mongoCollections.js";

const createThemeParkRating = async (
    userId,
    themeParkId,
    staffRating,
    cleanlinessRating,
    crowdsRating,
    diversityRating,
    review
) => {
    userId = helper.checkString(userId)
    if(!ObjectId.isValid(userId)) throw "Error: id isn't an object id"
    userId = new ObjectId(userId)
    const userCollections = await users();
    const user = await userCollections.findOne({_id: userId})
    if (user === null) throw `Error: there is no user with id ${id}`

    themeParkId = helper.checkString(themeParkId)
    if(!ObjectId.isValid(themeParkId)) throw "Error: id isn't an object id"
    themeParkId = new ObjectId(themeParkId)
    const themeParkCollections = await themeparks();
    const themePark = await themeParkCollections.findOne({_id: themeParkId})
    if (themePark === null) throw `Error: there is no theme park with id ${id}`

    helper.checkRating(staffRating)
    helper.checkRating(cleanlinessRating)
    helper.checkRating(crowdsRating)
    helper.checkRating(diversityRating)
    review = helper.checkString(review)

    const newThemeParkRating = {
        userId: userId,
        themeParkId: themeParkId,
        staffRating: staffRating,
        cleanlinessRating: cleanlinessRating,
        crowdsRating: crowdsRating,
        diversityRating: diversityRating,
        review: review,
        comments: [],
        reports: []
    }

    const themeParkRatingCollections = await themeparkratings();
    const themeParkRatingInfo = await themeParkRatingCollections.insertOne(newThemeParkRating);
    if(!themeParkRatingInfo.acknowledged || !themeParkRatingInfo.insertedId) throw "Error: could not add a new theme park"
    
    const ratingID = themeParkRatingInfo.insertedId.toString()

    const updateThemeRating = {ratings: [...themePark.ratings, ratingID]}
    const updateThemeResult = await themeParkCollections.findOneAndUpdate({_id: themeParkId},{$set: updateThemeRating})
    if(!updateThemeResult) throw "Error: could not add ride to themepark"

    const updateUserRating = {themeParkRatings: [...user.themeParkRatings, ratingID]}
    const updateUserResult = await userCollections.findOneAndUpdate({_id: userId},{$set: updateUserRating})
    if(!updateUserResult) throw "Error: could not add ride to themepark"
    
    return await getThemeParkRatingById(themeParkInfo.insertedId.toString());
}
const getThemeParkRatingById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const themeParkRatingsCollections = await themeparkratings();
    const themeParkRating = await themeParkRatingsCollections.findOne({_id: id})
    if (themeParkRating === null) throw `Error: a theme park doesn't have an id ${id}`
    themeParkRating._id = themeParkRating._id.toString()
    return themeParkRating
}

export default {createThemeParkRating, getThemeParkRatingById}