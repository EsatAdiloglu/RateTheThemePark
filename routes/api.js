import {Router} from "express"
const router = Router();
import helper from "../helper.js";
import userData from "../data/user.js"
import themeParkRatingData from "../data/themeParkRating.js"
import rideRatingData from "../data/rideRating.js"

router.route("/addThemeParkRating").post(async (req, res) => {
    const themeParkRatingInfo = req.body
    try{
        themeParkRatingInfo.themeParkId = helper.checkId(themeParkRatingInfo.themeParkId, "Theme Park Id")
        helper.checkRating(themeParkRatingInfo.themeParkStaff)
        helper.checkRating(themeParkRatingInfo.themeParkCleanliness)
        helper.checkRating(themeParkRatingInfo.themeParkCrowds)
        helper.checkRating(themeParkRatingInfo.themeParkDiversity)
    }
    catch(e){
        return res.status(400).json({Error: e})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {themeParkStaff, themeParkCleanliness, themeParkCrowds, themeParkDiversity} = themeParkRatingInfo
        await themeParkRatingData.createThemeParkRating(user.userName, themeParkRatingInfo.themeParkId, themeParkStaff, themeParkCleanliness, themeParkCrowds, themeParkDiversity, "")
        return res.json({
            userName: user.userName, 
            staffRating: themeParkStaff,
            cleanlinessRating: themeParkCleanliness,
            crowdsRating: themeParkCrowds,
            diversityRating: themeParkDiversity
        })
    }
    catch(e){
        return res.status(404).json({Error: e})
    }
})

router.route("/addRideRating").post(async (req, res) => {
    console.log(req.body)
    const rideRatingInfo = req.body
    try{
        rideRatingInfo.rideId = helper.checkId(rideRatingInfo.rideId, "Ride Id")
        helper.checkRating(rideRatingInfo.waitTime)
        helper.checkRating(rideRatingInfo.comfortability)
        helper.checkRating(rideRatingInfo.enjoyment)
    }
    catch(e){
        return res.status(400).json({Error: e})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {waitTime, comfortability, enjoyment} = rideRatingInfo
        await rideRatingData.createRideRating(user.userName, rideRatingInfo.rideId, waitTime, comfortability, enjoyment,"")
        return res.json({
            userName: user.userName,
            waitTimeRating: waitTime,
            comfortabilityRating: comfortability,
            enjoymentRating: enjoyment
        })
    }
    catch(e){
        return res.status(404).json({Error: e})
    }
})
export default router;