import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { comments, themeparks } from "../config/mongoCollections.js";

const createThemePark = async (
    name,
    streetaddress,
    city,
    country, 
    state
) => {
    name = helper.checkString(name)
    streetaddress = helper.checkString(streetaddress)
    city = helper.checkString(city)
    country = helper.checkString(country)
    state = helper.checkState(state)

    const themeParkCollections = await themeparks();
    const exist = await themeParkCollections.find().toArray()
    if(exist.some((themepark) => themepark.streetAddress.toLowerCase() === streetaddress.toLowerCase())) throw `Error: a theme park already has the same street address`
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
        comments: [],
        reports: []
    }

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

const getThemeParksByName = async (name) => {
    name = helper.checkString(name)
    const themeParkCollections = await themeparks();
    const allThemeParks = await themeParkCollections.find().toArray();
    const res = []
    allThemeParks.forEach((park) => {
        if(park.themeParkName.toLowerCase().includes(name.toLowerCase())) res.push(park)
    })
    return res
}

const getThemeParksByLocation = async (name) => {
    name = helper.checkString(name)
    const themeParkCollections = await themeparks();
    const allThemeParks = await themeParkCollections.find().toArray();
    const res = []
    allThemeParks.forEach((park) => {
        if(park.state.toLowerCase().includes(name.toLowerCase())) res.push(park)
    })
    return res
}

const getAllThemeParks = async () => {
    const themeParkCollections = await themeparks();
    const allThemeParks = await themeParkCollections.find().toArray();
    return allThemeParks;
}

export default {createThemePark, getThemeParkById, getThemeParksByName, getThemeParksByLocation, getAllThemeParks}
