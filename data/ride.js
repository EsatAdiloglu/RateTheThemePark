import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { themeparks, rides, rideratings } from "../config/mongoCollections.js";

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

    const rideCollections = await rides();
    const exist = await rideCollections.find({parkRideIsLocatedIn: themeParkId}).toArray()
    if(exist.some((ride) => ride.rideName.toLowerCase() === rideName.toLowerCase())) throw "Error: a ride with that name already exists"    
    const newRide = {
        rideName: rideName, 
        parkRideIsLocatedIn: themeParkId,
        waitTimeRating: 0,
        comfortabilityRating: 0,
        enjoymentAndExperienceRating: 0,
        ratings: [],
        reports: []
    }

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
        
    if (!ObjectId.isValid(id)) throw "Invalid Theme Park ID";

    const rideCollection = await rides();
    const ridesarray = await rideCollection.find({parkRideIsLocatedIn: new ObjectId(id)}).toArray();

    if (ridesarray.length === 0) {
        return {
            themeParkId: id,
            rides: []
        };
    }
    const formattedRides = ridesarray.map(ride => ({
        _id: ride._id.toString(),
        rideName: ride.rideName,
        parkRideIsLocatedIn: ride.parkRideIsLocatedIn, // might need a toString() 
        waitTimeRating: ride.waitTimeRating,
        comfortabilityRating: ride.comfortabilityRating,
        enjoymentAndExperienceRating: ride.enjoymentAndExperienceRating,
        ratings: ride.ratings, //ride.ratings.map(ratingId => ratingId.toString())
        reports: ride.reports //ride.reports.map(reportId => reportId.toString())
    }));

    return {
        themeParkId: id,
        rides: formattedRides
    };
}
export default {createRide, getRideById, getRidesByThemePark}