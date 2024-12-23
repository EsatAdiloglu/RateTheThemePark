import {Router} from "express"
const router = Router();
import helper from "../helper.js";
import userData from "../data/user.js"
import themeParkRatingData from "../data/themeParkRating.js"
import rideRatingData from "../data/rideRating.js"
import foodStallRatingData from "../data/foodStallRating.js"
import commentsData from '../data/comment.js'
import xss from "xss";
import { foodstallratings, foodstalls, rideratings, rides, themeparkratings, themeparks, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

router.route("/addThemeParkRating")
.post(async (req, res) => {
    const themeParkRatingInfo = req.body
    try{
        themeParkRatingInfo.themeParkId = helper.checkId(themeParkRatingInfo.themeParkId, "Theme Park Id")
        helper.checkRating(themeParkRatingInfo.themeParkStaff)
        helper.checkRating(themeParkRatingInfo.themeParkCleanliness)
        helper.checkRating(themeParkRatingInfo.themeParkCrowds)
        helper.checkRating(themeParkRatingInfo.themeParkDiversity)

        themeParkRatingInfo.themeParkId = xss(themeParkRatingInfo.themeParkId)
        themeParkRatingInfo.themeParkStaff = xss(themeParkRatingInfo.themeParkStaff)
        themeParkRatingInfo.themeParkCleanliness = xss(themeParkRatingInfo.themeParkCleanliness)
        themeParkRatingInfo.themeParkCrowds = xss(themeParkRatingInfo.themeParkCrowds)
        themeParkRatingInfo.themeParkDiversity = xss(themeParkRatingInfo.themeParkDiversity)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const themeParkCollections = await themeparks();
        const exist = await themeParkCollections.findOne({_id: new ObjectId(themeParkRatingInfo.themeParkId)})
        if(!exist) throw `Error: there is no theme park with id ${themeParkRatingInfo.themeParkId}`

        const user = await userData.getUserByUsername(req.session.user.userName)
        const {themeParkStaff, themeParkCleanliness, themeParkCrowds, themeParkDiversity} = themeParkRatingInfo
        const rating = await themeParkRatingData.createThemeParkRating(user.userName, themeParkRatingInfo.themeParkId, themeParkStaff, themeParkCleanliness, themeParkCrowds, themeParkDiversity, "")
        const averages = await themeParkRatingData.getAverageThemeParkRatings(themeParkRatingInfo.themeParkId)
        return res.json({
            _id: rating._id.toString(),
            userName: user.userName, 
            staffRating: themeParkStaff,
            cleanlinessRating: themeParkCleanliness,
            crowdsRating: themeParkCrowds,
            diversityRating: themeParkDiversity,
            averageRatings: averages,
            
        })
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
})
.patch(async (req, res) => {
    const updateRatingInfo = req.body
    try{
        updateRatingInfo.ratingId = helper.checkId(updateRatingInfo.ratingId, "Rating Id")
        helper.checkRating(updateRatingInfo.updateStaff)
        helper.checkRating(updateRatingInfo.updateCleanliness)
        helper.checkRating(updateRatingInfo.updateCrowd)
        helper.checkRating(updateRatingInfo.updateDiversity)

        updateRatingInfo.ratingId = xss(updateRatingInfo.ratingId)
        updateRatingInfo.updateStaff = xss(updateRatingInfo.updateStaff)
        updateRatingInfo.updateCleanliness = xss(updateRatingInfo.updateCleanliness)
        updateRatingInfo.updateCrowd = xss(updateRatingInfo.updateCrowd)
        updateRatingInfo.updateDiversity = xss(updateRatingInfo.updateDiversity)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
    try{
        const themeParkRatingCollections = await themeparkratings();
        const themeParkCollections = await themeparks();
        const userCollections = await users();

        const ratingExist = await themeParkRatingCollections.findOne({_id: new ObjectId(updateRatingInfo.ratingId)})
        if(!ratingExist) throw `Error: there is no rating with id ${updateRatingInfo.ratingId}`

        const themeParkExist = await themeParkCollections.findOne({_id: new ObjectId(ratingExist.themeParkId)})
        if(!themeParkExist) throw `Error: there is no theme park with id ${ratingExist.themeParkId}`

        const userExist = await userCollections.findOne({userName: ratingExist.userName})
        if(!userExist) throw `Error: there is no user with user name ${ratingExist.userName}`

        const {ratingId, updateStaff, updateCleanliness, updateCrowd, updateDiversity} = updateRatingInfo
        const updatedRating = await themeParkRatingData.updateRating(ratingId, updateStaff, updateCleanliness, updateCrowd, updateDiversity)
        const averages = await themeParkRatingData.getAverageThemeParkRatings(updatedRating.themeParkId)
        return res.json({
            newStaffRating: updatedRating.staffRating,
            newCleanlinessRating: updatedRating.cleanlinessRating,
            newCrowdRating: updatedRating.crowdsRating,
            newDiversityRating: updatedRating.diversityRating,
            averageRatings: averages
        })
    }
    catch(e){
        console.log(e)
        return res.json({Error: `${e}`})
    }
})
.delete(async (req,res) => {
    const deleteRatingInfo = req.body
    try{
        deleteRatingInfo.ratingId = helper.checkId(deleteRatingInfo.ratingId, "Rating Id")

        deleteRatingInfo.ratingId = xss(deleteRatingInfo.ratingId)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const themeParkRatingCollections = await themeparkratings();
        const themeParkCollections = await themeparks();
        const userCollections = await users();

        const ratingExist = await themeParkRatingCollections.findOne({_id: new ObjectId(deleteRatingInfo.ratingId)})
        if(!ratingExist) throw `Error: there is no rating with id ${deleteRatingInfo.ratingId}`

        const themeParkExist = await themeParkCollections.findOne({_id: new ObjectId(ratingExist.themeParkId)})
        if(!themeParkExist) throw `Error: there is no theme park with id ${ratingExist.themeParkId}`

        const userExist = await userCollections.findOne({userName: ratingExist.userName})
        if(!userExist) throw `Error: there is no user with user name ${ratingExist.userName}`


        const {ratingId} = deleteRatingInfo
        const themePark = await themeParkRatingData.deleteRating(ratingId)
        const averages = await themeParkRatingData.getAverageThemeParkRatings(themePark._id.toString())

        return res.json({deleted: true, averageRatings: averages})
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
})

router.route("/addRideRating").post(async (req, res) => {
    const rideRatingInfo = req.body
    try{
        rideRatingInfo.rideId = helper.checkId(rideRatingInfo.rideId, "Ride Id")
        helper.checkRating(rideRatingInfo.waitTime)
        helper.checkRating(rideRatingInfo.comfortability)
        helper.checkRating(rideRatingInfo.enjoyment)

        rideRatingInfo.rideId = xss(rideRatingInfo.rideId)
        rideRatingInfo.waitTime = xss(rideRatingInfo.waitTime)
        rideRatingInfo.comfortability = xss(rideRatingInfo.comfortability)
        rideRatingInfo.enjoyment = xss(rideRatingInfo.enjoyment)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const rideCollections = await rides();
        const exist = await rideCollections.findOne({_id: new ObjectId(rideRatingInfo.rideId)})
        if(!exist) throw `Error: there is no ride with id ${rideRatingInfo.rideId}`

        const user = await userData.getUserByUsername(req.session.user.userName)
        const {waitTime, comfortability, enjoyment} = rideRatingInfo
        const rating = await rideRatingData.createRideRating(user.userName, rideRatingInfo.rideId, waitTime, comfortability, enjoyment,"")
        const averages = await rideRatingData.getAverageRideRatings(rideRatingInfo.rideId)
        return res.json({
            _id: rating._id.toString(),
            userName: user.userName,
            waitTimeRating: waitTime,
            comfortabilityRating: comfortability,
            enjoymentRating: enjoyment,
            averageRatings: averages
        })
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
})
.patch(async (req,res) => {
    const updateRatingInfo = req.body
    try{
        updateRatingInfo.ratingId = helper.checkId(updateRatingInfo.ratingId, "Rating Id")
        helper.checkRating(updateRatingInfo.updateWait)
        helper.checkRating(updateRatingInfo.updateComfort)
        helper.checkRating(updateRatingInfo.updateEnjoyment)

        updateRatingInfo.ratingId = xss(updateRatingInfo.ratingId)
        updateRatingInfo.updateWait = xss(updateRatingInfo.updateWait)
        updateRatingInfo.updateComfort = xss(updateRatingInfo.updateComfort)
        updateRatingInfo.updateEnjoyment = xss(updateRatingInfo.updateEnjoyment)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
    try{
        const rideRatingCollections = await rideratings();
        const rideCollections = await rides();
        const userCollections = await users();

        const ratingExist = await rideRatingCollections.findOne({_id: new ObjectId(updateRatingInfo.ratingId)})
        if(!ratingExist) throw `Error: there is no rating with id ${updateRatingInfo.ratingId}`

        const rideExist = await rideCollections.findOne({_id: new ObjectId(ratingExist.rideId)})
        if(!rideExist) throw `Error: there is no ride with id ${ratingExist.rideId}`

        const userExist = await userCollections.findOne({userName: ratingExist.userName})
        if(!userExist) throw `Error: there is no user with user name ${ratingExist.userName}`

        const {ratingId, updateWait, updateComfort, updateEnjoyment} = updateRatingInfo
        const updatedRating = await rideRatingData.updateRating(ratingId, updateWait, updateComfort, updateEnjoyment)
        const averages = await rideRatingData.getAverageRideRatings(updatedRating.rideId)
        return res.json({
            newWaitRating: updatedRating.waitTimeRating,
            newComfortRating: updatedRating.comfortabilityRating,
            newEnjoymentRating: updatedRating.enjoymentRating,
            averageRatings: averages
        })
    }
    catch(e){
        console.log(e)
        return res.json({Error: `${e}`})
    }
})
.delete(async (req,res) => {
    const deleteRatingInfo = req.body
    try{
        deleteRatingInfo.ratingId = helper.checkId(deleteRatingInfo.ratingId, "Rating Id")

        deleteRatingInfo.ratingId = xss(deleteRatingInfo.ratingId)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const rideRatingCollections = await rideratings();
        const rideCollections = await rides();
        const userCollections = await users();

        const ratingExist = await rideRatingCollections.findOne({_id: new ObjectId(deleteRatingInfo.ratingId)})
        if(!ratingExist) throw `Error: there is no rating with id ${deleteRatingInfo.ratingId}`

        const rideExist = await rideCollections.findOne({_id: new ObjectId(ratingExist.rideId)})
        if(!rideExist) throw `Error: there is no ride with id ${ratingExist.rideId}`

        const userExist = await userCollections.findOne({userName: ratingExist.userName})
        if(!userExist) throw `Error: there is no user with user name ${ratingExist.userName}`
        
        const {ratingId} = deleteRatingInfo
        const ride = await rideRatingData.deleteRating(ratingId)
        const averages = await rideRatingData.getAverageRideRatings(ride._id.toString())

        return res.json({deleted: true, averageRatings: averages})
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
})

router.route("/addFoodStallRating").post(async (req, res) => {
    const foodStallRatingInfo = req.body
    try{
        foodStallRatingInfo.foodStallId = helper.checkId(foodStallRatingInfo.foodStallId, "Food Stall Id")
        helper.checkRating(foodStallRatingInfo.quality)
        helper.checkRating(foodStallRatingInfo.waitTime)

        foodStallRatingInfo.foodStallId = xss(foodStallRatingInfo.foodStallId)
        foodStallRatingInfo.quality = xss(foodStallRatingInfo.quality)
        foodStallRatingInfo.waitTime = xss(foodStallRatingInfo.waitTime)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const foodStallCollections = await foodstalls();
        const exist = await foodStallCollections.findOne({_id: new ObjectId(foodStallRatingInfo.foodStallId)})
        if(!exist) throw `Error: there is no food stall with id ${foodStallRatingInfo.foodStallId}`

        const user = await userData.getUserByUsername(req.session.user.userName)
        const {quality, waitTime} = foodStallRatingInfo
        const rating = await foodStallRatingData.createFoodStallRating(user.userName, foodStallRatingInfo.foodStallId, quality, waitTime,"rating")
        const averages = await foodStallRatingData.getAverageFoodStallRatings(foodStallRatingInfo.foodStallId)
        return res.json({
            _id: rating._id.toString(),
            userName: user.userName,
            foodQualityRating: quality,
            waitTimeRating: waitTime,
            averageRatings: averages
        })
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
})
.patch(async (req,res) => {
    const updateRatingInfo = req.body
    try{
        updateRatingInfo.ratingId = helper.checkId(updateRatingInfo.ratingId, "Rating Id")
        helper.checkRating(updateRatingInfo.updateQuality)
        helper.checkRating(updateRatingInfo.updateWait)

        updateRatingInfo.ratingId = xss(updateRatingInfo.ratingId)
        updateRatingInfo.updateQuality = xss(updateRatingInfo.updateQuality)
        updateRatingInfo.updateWait = xss(updateRatingInfo.updateWait)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
    try{
        const foodStallRatingCollections = await foodstallratings();
        const foodStallCollections = await foodstalls();
        const userCollections = await users();

        const ratingExist = await foodStallRatingCollections.findOne({_id: new ObjectId(updateRatingInfo.ratingId)})
        if(!ratingExist) throw `Error: there is no rating with id ${updateRatingInfo.ratingId}`

        const foodStallExist = await foodStallCollections.findOne({_id: new ObjectId(ratingExist.foodStallId)})
        if(!foodStallExist) throw `Error: there is no food stall with id ${ratingExist.foodStallId}`

        const userExist = await userCollections.findOne({userName: ratingExist.userName})
        if(!userExist) throw `Error: there is no user with user name ${ratingExist.userName}`

        const {ratingId, updateQuality, updateWait} = updateRatingInfo
        const updatedRating = await foodStallRatingData.updateRating(ratingId, updateQuality, updateWait) 
        const averages = await foodStallRatingData.getAverageFoodStallRatings(updatedRating.foodStallId)
        return res.json({
            newQualityRating: updatedRating.foodQualityRating,
            newWaitRating: updatedRating.waitTimeRating,
            averageRatings: averages
        })
    }
    catch(e){
        console.log(e)
        return res.json({Error: `${e}`})
    }
})
.delete(async (req,res) => {
    const deleteRatingInfo = req.body
    try{
        deleteRatingInfo.ratingId = helper.checkId(deleteRatingInfo.ratingId, "Rating Id")

        deleteRatingInfo.ratingId = xss(deleteRatingInfo.ratingId)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const foodStallRatingCollections = await foodstallratings();
        const foodStallCollections = await foodstalls();
        const userCollections = await users();

        const ratingExist = await foodStallRatingCollections.findOne({_id: new ObjectId(deleteRatingInfo.ratingId)})
        if(!ratingExist) throw `Error: there is no rating with id ${deleteRatingInfo.ratingId}`

        const foodStallExist = await foodStallCollections.findOne({_id: new ObjectId(ratingExist.foodStallId)})
        if(!foodStallExist) throw `Error: there is no food stall with id ${ratingExist.foodStallId}`

        const userExist = await userCollections.findOne({userName: ratingExist.userName})
        if(!userExist) throw `Error: there is no user with user name ${ratingExist.userName}`
        
        const {ratingId} = deleteRatingInfo
        const foodStall = await foodStallRatingData.deleteRating(ratingId)
        const averages = await foodStallRatingData.getAverageFoodStallRatings(foodStall._id.toString())

        return res.json({deleted: true, averageRatings: averages})
    }
    catch(e){
        return res.json({Error: `${e}`})
    }
})

router.route("/addComment").post(async (req,res) => {
    const commentInfo = req.body
    
    try{
        let str = ""
        switch(commentInfo.option) {
            case 0:
                str = "Theme Park Id"
                break;
            case 1:
                str = "Ride Id"
                break;
            case 2:
                str = "Food Stall Id"
                break;
            default:
                throw "Error: option is out of bounds"
                break;

        }
        commentInfo.thingId= helper.checkId(commentInfo.thingId, str)
        commentInfo.commentBody = helper.checkString(commentInfo.commentBody)

        commentInfo.thingId = xss(commentInfo.thingId)
        commentInfo.commentBody = xss(commentInfo.commentBody)
    }
    catch(e){
        return res.json({Error: `${e}`})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {thingId, commentBody, option} = commentInfo
        const comment = await commentsData.createComment(user.userName, thingId, commentBody, option)
        return res.json({
            userName: user.userName,
            commentBody: commentBody,
            commentId: comment
        })
    }
    catch(e){
        console.log(e)
        return res.json({Error: `${e}`})
    }
})

router.route("/addChildComment").post(async (req,res) => {
    const childComment = req.body
    
    try{
        childComment.commentId = helper.checkId(childComment.commentId, "Comment Id")
        childComment.childCommentBody = helper.checkString(childComment.childCommentBody)

        childComment.themeParkName = xss(childComment.themeParkName)
        childComment.childCommentBody = xss(childComment.childCommentBody)
    }
    catch(e){
        return res.status(400).json({Error: `${e}`})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {childCommentBody} = childComment
        const comment = await commentsData.createComment(user.userName, childComment.commentId, childCommentBody, 3)
        return res.json({
            userName: user.userName,
            commentBody: childCommentBody,
            commentId: comment
        })
    }
    catch(e){

        return res.status(404).json({Error: `${e}`})
    }
})
export default router;