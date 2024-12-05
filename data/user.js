import {ObjectId} from "mongodb";
import helper from "./helper.js"
import { namefunc, usernamefunc, passwordfunc } from "../userhelper.js";
import { themeparks, rides, users } from "../config/mongoCollections.js";
import bcrypt from 'bcrypt';

export const signUpUser = async (name, username, password) => {
    // name = helper.checkString(name);
    // userName = helper.checkString(userName);
    // password = helper.checkString(password);
    name = name.trim();
    username = username.trim().toLowerCase();
    password = password.trim();

    try{
        namefunc(name)
    }
    catch(e){
        throw e
    }
    try {
        usernamefunc(username)
    } catch (e) {
        throw e
    }
    try{
        passwordfunc(password)
    }
    catch(e){
        throw e
    }

    const userCollections = await users();
    const existingUser = await userCollections.findOne({userName: username.toLowerCase()});   
    if (existingUser) {
        throw "The user already exists."
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
        _id: new ObjectId(),
        name: name,
        userName: username,
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
    // return { _id: userInfo.insertedId.toString(), name: newUser.name, userName: newUser.userName};
    return {registrationCompleted: true};
}

export const signInUser = async(username, password) => {
    username = username.trim().toLowerCase();
    password = password.trim();

    try {
        usernamefunc(username)
    } catch (e) {
        throw e
    }
    try {
        passwordfunc(password)
    } catch (e) {
        throw e
    }

    const userCollections = await users();
    const user = await userCollections.findOne({userName: username.toLowerCase()}); 
    if (!user){
        throw "Either username or password is invalid"
    }
    let comp = false;
    comp = await bcrypt.compare(password, user.password);
    if (comp)
    {
      return {name: user.name, 
              userName: user.userName, 
              themeParkRatings: user.themeParkRatings,
              rideRatings: user.rideRatings,
              foodStallRatings: user.foodStallRatings,
              comments: user.comments, 
              reports: user.reports
            };
    }
    else{
      throw "Either the userId or password is invalid"
    }

}
const getUserByUsername = async (userName) => {
    userName = helper.checkString(userName);
    const userCollection = await users(); 
    const user = await userCollection.findOne({ username: userName.toLowerCase() }); 
    if (!user) throw `Error: User with username '${userName}' not found.`;
    user._id = user._id.toString(); 
    return user;
};

//export default {createUser, getUserByUsername};
