import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { themeparks, rides } from "../config/mongoCollections.js";

const createRide = async (
    themeParkId,
    rideName
) => {
    rideName = helper.checkString(rideName)
    themeParkId = helper.checkString(themeParkId)
    if(!ObjectId.isValid(themeParkId)) throw "Error: id isn't an object id"
    themeParkId = new ObjectId(themeParkId)
    const themeParkCollections = await themeparks();
    const themePark = await themeParkCollections.findOne({_id: themeParkId})
    if (themePark === null) throw `Error: there is no theme park with id ${id}`

    const newRide = {
        rideName: rideName, 
        parkRideIsLocatedIn: themeParkId,
        waitTimeRating: 0,
        comfortabilityRating: 0,
        enjoymentAndExperienceRating: 0,
        ratings: [],
        reports: []
    }
    const rideCollections = await rides();
    const rideInfo = await rideCollections.insertOne(newRide);
    if(!rideInfo.acknowledged || !rideInfo.insertedId) throw "Error: could not add a new ride"
    const rideId = rideInfo.insertedId.toString()
    const updateRides = {rides: [...themePark.rides, rideId]}
    const updateResult = await themeParkCollections.findOneAndUpdate({_id: themeParkId},{$set: updateRides})
    if(!updateResult) throw "Error: could not add ride to themepark"
    return await getRideById(rideId);
}

const getRideById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const rideCollections = await rides();
    const ride = await rideCollections.findOne({_id: id})
    if (ride === null) throw `Error: a theme park doesn't have an id ${id}`
    ride._id = ride._id.toString()
    return ride
}

const getRidesByThemePark = async (id) => {
    pass
}
export default {createRide, getRideById}