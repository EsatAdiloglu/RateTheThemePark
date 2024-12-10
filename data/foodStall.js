import {ObjectId} from "mongodb";
import helper from "../helper.js"
import { themeparks, foodstalls, reports } from "../config/mongoCollections.js";

const createFoodStall = async (
    themeParkId,
    foodStallName
) => {
    foodStallName = helper.checkString(foodStallName);
    themeParkId = helper.checkString(themeParkId);
     if(!ObjectId.isValid(themeParkId)) throw "Error: id isn't an object id"
    themeParkId = new ObjectId(themeParkId);
    const themeParkCollections = await themeparks();
    const themePark = await themeParkCollections.findOne({_id: themeParkId});
    if (themePark === null) throw `Error: there is no theme park with id ${id}`
    
    const newFoodStall = {
        _id: new ObjectId(),
        foodStallName: foodStallName,
        parkFoodStallIsLocatedIn: themeParkId,
        foodQualityRating: 0,
        waitTimeRating: 0,
        ratings: [],
        comments: [],
        reports: []
    }
    const foodStallCollections = await foodstalls();
    const foodStallInfo = await foodStallCollections.insertOne(newFoodStall);
    if(!foodStallInfo.acknowledged || !foodStallInfo.insertedId) throw "Error: could not add a new food stall park"
    const foodStallId = foodStallInfo.insertedId.toString();
    const updateFoodStalls = {foodStalls: [...themePark.foodStalls, foodStallId]};
    const updateResult = await themeParkCollections.findOneAndUpdate({_id: themeParkId},{$set: updateFoodStalls})
    if(!updateResult) throw "Error: could not add foodstall to themepark"
    return await getFoodStallById(foodStallId);
}

const getFoodStallById = async (id) => {
    id = helper.checkString(id)
    if(!ObjectId.isValid(id)) throw "Error: id isn't an object id"
    id = new ObjectId(id)
    const foodStallCollections = await foodstalls();
    const foodstall = await foodStallCollections.findOne({_id: id})
    if (foodstall === null) throw `Error: a theme park doesn't have an id ${id}`
    foodstall._id = foodstall._id.toString()
    return foodstall
}

const getFoodStallsByThemePark = async (id) => {
    if (!ObjectId.isValid(id)) throw "Invalid Theme Park ID";

    const foodStallsCollection = await foodstalls();
    const foodstallarray = await foodStallsCollection.find({parkFoodStallIsLocatedIn: new ObjectId(id)}).toArray();

    if (foodstallarray.length === 0) {
        return {
            themeParkId: id,
            foodStalls: []
        };
    }

    const formattedStalls = foodstallarray.map(stall => ({
        _id: stall._id.toString(),
        foodStallName: stall.foodStallName,
        parkFoodStallIsLocatedIn: stall.parkFoodStallIsLocatedIn, // might need a toString()
        foodQualityRating: stall.foodQualityRating,
        waitTimeRating: stall.waitTimeRating,
        ratings: stall.ratings, //  stall.ratings.map(ratingId => ratingId.toString()),
        reports: stall.reports // stall.reports.map(reportId => reportId.toString())
    }));

    return {
        themeParkId: id,
        foodStalls: formattedStalls
    };
}
export default {createFoodStall, getFoodStallById}
