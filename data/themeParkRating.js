import {ObjectId} from "mongodb";
import helper from "./helper.js"
import { themeparks } from "../config/mongoCollections.js";

const createThemeParkRating = async (
    userId,
    themeParkId,
    staffRating,
    cleanlinessRating,
    crowdsRating,
    diversityRating,
    review
) => {
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