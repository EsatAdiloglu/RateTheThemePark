import {Router} from "express"
const router = Router();
import helper from "../helper.js";
import userData from "../data/user.js"
import themeParkRatingData from "../data/themeParkRating.js"
import rideRatingData from "../data/rideRating.js"
import foodStallRatingData from "../data/foodStallRating.js"
import commentsData from '../data/comment.js'
import xss from "xss";

router.route("/addThemeParkRating").post(async (req, res) => {
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
        return res.status(400).json({Error: `${e}`})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {themeParkStaff, themeParkCleanliness, themeParkCrowds, themeParkDiversity} = themeParkRatingInfo
        await themeParkRatingData.createThemeParkRating(user.userName, themeParkRatingInfo.themeParkId, themeParkStaff, themeParkCleanliness, themeParkCrowds, themeParkDiversity, "")
        const averages = await themeParkRatingData.getAverageThemeParkRatings(themeParkRatingInfo.themeParkId)
        return res.json({
            userName: user.userName, 
            staffRating: themeParkStaff,
            cleanlinessRating: themeParkCleanliness,
            crowdsRating: themeParkCrowds,
            diversityRating: themeParkDiversity,
            averageRatings: averages
        })
    }
    catch(e){
        return res.status(404).json({Error: `${e}`})
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
        return res.status(400).json({Error: `${e}`})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {waitTime, comfortability, enjoyment} = rideRatingInfo
        await rideRatingData.createRideRating(user.userName, rideRatingInfo.rideId, waitTime, comfortability, enjoyment,"")
        const averages = await rideRatingData.getAverageRideRatings(rideRatingInfo.rideId)
        return res.json({
            userName: user.userName,
            waitTimeRating: waitTime,
            comfortabilityRating: comfortability,
            enjoymentRating: enjoyment,
            averageRatings: averages
        })
    }
    catch(e){
        return res.status(404).json({Error: `${e}`})
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
        return res.status(400).json({Error: `${e}`})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {quality, waitTime} = foodStallRatingInfo
        await foodStallRatingData.createFoodStallRating(user.userName, foodStallRatingInfo.foodStallId, quality, waitTime,"rating")
        const averages = await foodStallRatingData.getAverageFoodStallRatings(foodStallRatingInfo.foodStallId)
        return res.json({
            userName: user.userName,
            foodQualityRating: quality,
            waitTimeRating: waitTime,
            averageRatings: averages
        })
    }
    catch(e){
        return res.status(404).json({Error: `${e}`})
    }
})

router.route("/addThemeParkComment").post(async (req,res) => {
    const themeParkComment = req.body
    
    try{
        themeParkComment.themeParkId = helper.checkId(themeParkComment.themeParkId, "Theme Park Id")
        themeParkComment.commentBody = helper.checkString(themeParkComment.commentBody)

        themeParkComment.themeParkName = xss(themeParkComment.themeParkName)
        themeParkComment.commentBody = xss(themeParkComment.commentBody)
    }
    catch(e){
        return res.status(400).json({Error: `${e}`})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {commentBody} = themeParkComment
        const comment = await commentsData.createComment(user.userName, themeParkComment.themeParkId, commentBody, 0)
        return res.json({
            userName: user.userName,
            commentBody: commentBody,
            commentId: comment
        })
    }
    catch(e){

        return res.status(404).json({Error: `${e}`})
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