import {ObjectId} from "mongodb";
import helper from "./helper.js"
<<<<<<< HEAD
import { themeparks } from "../config/mongoCollections.js";
=======
import { comments, themeparkratings, themeparks, users } from "../config/mongoCollections.js";
>>>>>>> d490dfdd427957419b0f4054863fcca6233be587

const createThemeParkRating = async (
    userId,
    themeParkId,
    staffRating,
    cleanlinessRating,
    crowdsRating,
    diversityRating,
    review
) => {
<<<<<<< HEAD
    name = helper.checkString(name)
    streetaddress = helper.checkString(streetaddress)
    city = helper.checkString(city)
    country = helper.checkString(country)
    state = helper.checkState(state)

    const newThemePark = {
        themeParkName: name,
        streetAddress: streetaddress,
        city: city,
        state: state,
        country: country,
        staffRating: 0,
        cleanlinessRating: 0,
        crowdsRating: 0,
        diversityRating: 0,
        rides: [],
        foodStalls: [],
        ratings: [],
        reports: []
    }
    const themeParkCollections = await themeparks();
    const themeParkInfo = await themeParkCollections.insertOne(newThemePark);
    if(!themeParkInfo.acknowledged || !themeParkInfo.insertedId) throw "Error: could not add a new theme park"
    return await getThemeParkById(themeParkInfo.insertedId.toString());
}
const getThemeParkById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const themeParkCollections = await themeparks();
    const themePark = await themeParkCollections.findOne({_id: id})
    if (themePark === null) throw `Error: a theme park doesn't have an id ${id}`
    themePark._id = themePark._id.toString()
    return themePark
}
=======
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
>>>>>>> d490dfdd427957419b0f4054863fcca6233be587
