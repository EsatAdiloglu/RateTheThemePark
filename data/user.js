import {ObjectId} from "mongodb";
import helper from "./helper.js"
import { themeparks, rides, users } from "../config/mongoCollections.js";
import bcrypt from 'bcrypt';

const createUser = async (
    name, 
    userName, 
    password
) => {
    name = helper.checkString(name);
    userName = helper.checkString(userName);
    password = helper.checkString(password);

    const userCollections = await users();
    const existingUser = await userCollections.findOne({userName: userName.toLowerCase()});   
    
    if (existingUser) {
        throw "The user already exists."
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        _id: new ObjectId(),
        name: name,
        userName: userName,
        password: hashedPassword,
        themeParkRatings: [],
        rideRatings: [],
        foodStallRatings: [],
        comments: [],
        reports: []
    }
    const userInfo = await userCollections.insertOne(newUser);
    if (!userInfo.acknowledged || !userInfo.insertedId) {
        throw "Error: Could not create user.";
    }
    return { _id: userInfo.insertedId.toString(), name: newUser.name, userName: newUser.userName};
}

const getUserByUsername = async (userName) => {
    userName = helper.checkString(userName);
    const userCollection = await users(); 
    const user = await userCollection.findOne({ username: userName.toLowerCase() }); 
    if (!user) throw `Error: User with username '${userName}' not found.`;
    user._id = user._id.toString(); 
    return user;
};

export default {createUser, getUserByUsername};
