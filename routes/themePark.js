import {Router} from "express"
const router = Router();
import themeParkData from "../data/themePark.js"; 
import themeParkRatingData from "../data/themeParkRating.js"
import userData from "../data/user.js"
import rideData from "../data/ride.js"
import rideRatingData from "../data/rideRating.js"
import foodStallData from "../data/foodStall.js"
import foodStallRatingData from "../data/foodStallRating.js"
import helper from "../helper.js";
import { ObjectId } from "mongodb";


//.get 
router.route('/')
.get(async (req, res)  => {
    return res.render('homePage', {title: "Rate My Theme Park"})
});


router.route('/addthemepark')
.get(async (req, res) => {
    res.render('addThemeParkPage')
})
.post(async (req, res) => {
    //add theme park
    const newThemeParkInfo = req.body
    if(!newThemeParkInfo || Object.keys(newThemeParkInfo).length < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        newThemeParkInfo.theme_park_name = helper.checkString(newThemeParkInfo.theme_park_name)
        newThemeParkInfo.theme_park_street = helper.checkString(newThemeParkInfo.theme_park_street)
        newThemeParkInfo.theme_park_city = helper.checkString(newThemeParkInfo.theme_park_city)
        newThemeParkInfo.theme_park_state = helper.checkState(newThemeParkInfo.theme_park_state)
    }
    catch(e){
        return res.status(400).json({error:e})
    }
    try{
        const {theme_park_name, theme_park_street, theme_park_city, theme_park_state} = newThemeParkInfo
        await themeParkData.createThemePark(theme_park_name,theme_park_street,theme_park_city,"United States of America",theme_park_state)


    }
    catch(e){
        return res.status(404).json({error:e})
    }
})

//post request
//.post
router.route('/listofthemeparks')
.post(async (req, res) => {
    try {
         const themeParkInput = req.body.themeParkInput;
         console.log(themeParkInput);

        const newThemePark = await themeParkData.getThemeParksByName(themeParkInput);
        res.render("listOfThemeParks", { parks: newThemePark })

    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.route('/:id')
.get(async (req, res) => {
    // get the themepark by id function
    try{
        req.params.id = helper.checkId(req.params.id,"id")

    }
    catch(e){
        return res.status(400).json({error: e})
    }
    try{
        const themePark = themeParkData.getThemeParkById(req.params.id)
        return res.status(200).render('themeParkPage', {themepark: themePark})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
    
})

router.route('/:id/ratings')
.get(async (req, res) => {
    // get the themepark by id function, and then render the ratings page
    try{
        req.params.id = helper.checkId(req.params.id,"id")
    }
    catch(e){
        return res.status(400).json({error: e})
    }
    try{
        const themePark = themeParkData.getThemeParkById(req.params.id)
        return res.status(200).render('themeParkRatingPage', {themepark: themePark})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})
router.route('/:id/ratings/addThemeParkRating')
.get(async (req, res) => {
    // renders the THEME PARK ADD RATING PAGE 
    res.render('addThemeParkRatingPage')
})
.post(async(req, res) => {
    // TODO:
    // add the rating to the theme park ratings
    const newthemeParkRatingInfo = req.body
    if(!newthemeParkRatingInfo || Object.keys(newthemeParkRatingInfo).length < 1) 
    try{
        req.params.id = helper.checkId(req.params.id,"id")

        helper.checkRating(newthemeParkRatingInfo.theme_park_staff)
        helper.checkRating(newthemeParkRatingInfo.theme_park_cleanliness)
        helper.checkRating(newthemeParkRatingInfo.theme_park_crowds)
        helper.checkRating(newthemeParkRatingInfo.theme_park_diversity)

        newthemeParkRatingInfo.theme_park_review = helper.checkString(newthemeParkRatingInfo.theme_park_review)
    }
    catch(e){
        return res.status(400).json({error:e})
    }
    
    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {theme_park_staff, theme_park_cleanliness, theme_park_crowds, theme_park_diversity, theme_park_review} = newthemeParkRatingInfo
        await themeParkRatingData.createThemeParkRating(user._id, req.params.id, theme_park_staff, theme_park_cleanliness, theme_park_crowds, theme_park_diversity, theme_park_review)

        //replace this with where you want to render to
        return res.status(200).json({message: "Success"})
    }
    catch(e){
        return res.status(404).json({error: e})
    }
})

router.route('/:id/comments')
.get(async (req, res) => {
    // get the themepark by id function and then render the comments
})
router.route('/:id/comments/addThemeParkComment')
.get(async (req, res) => {
    res.render('addThemeParkCommentPage')
})
.post(async(req, res) => {
    // add the comment to the the theme park comments
})

router.route('/:id/rides')
.get(async (req, res) => {
    // get the themepark by id function and render the ride page
    try{
        req.params.id = helper.checkId(req.params.id,"id")
    }
    catch(e){
        return res.status(400).json({error: e})
    }
    try{
        const themePark = themeParkData.getThemeParkById(req.params.id)
        return res.status(200).render('themeParkRidesPage', {themepark: themePark})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})

router.route('/:id/rides/addRide')
.get(async(req, res) => {
    res.render('addRidePage')
})
.post(async (req, res) => {
    //adds a ride
    const newRideInfo = req.body
    if(!newRideInfo || Object.keys(newRideInfo) < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkString(req.params.id)
        newRideInfo.ride_name = helper.checkString(ride_name)
    }
    catch(e){
        return res.status(400).json({error: e})
    }
    try{
        await rideData.createRide(req.params.id, newRideInfo.ride_name)

        //replace this with where you want to render to
        return res.status(200).json({message: "Success"})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})
router.route('/:id/rides/:rideid')
.get(async(req, res) => {
    res.render('ridePage')
})

router.route('/:id/rides/:rideid/ratings')
.get(async(req, res) => {
    res.render('rideRatingPage')
})

router.route('/:id/rides/:rideid/addRating')
.get(async(req, res) => {
    res.render('addRideRatingPage')
})
.post(async(req, res) => {
    //adds a ride rating
    const newRideRatingInfo = req.body
    if(!newRideRatingInfo || Object.keys(newRideRatingInfo).length < 1) return res.status(400).json({error: "The request body is empty"})
    
    try {
        req.params.rideid = helper.checkId(req.params.rideid,"rideId")

        helper.checkRating(newRideRatingInfo.ride_waittime)
        helper.checkRating(newRideRatingInfo.ride_comfortability)
        helper.checkRating(newRideRatingInfo.ride_enjoyment)

        newRideRatingInfo.ride_review = helper.checkString(newRideRatingInfo.ride_review)
    }
    catch(e){
        return res.status(400).json({error: e})
    }

    try {
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {ride_waittime, ride_comfortability, ride_enjoyment, ride_review} = newRideRatingInfo
        await rideRatingData.createRideRating(user._id, req.params.rideid, ride_waittime, ride_comfortability, ride_enjoyment, ride_review)

        //replace this with where you want to render to
        return res.status(200).json({message: "Success"})
    }
    catch(e){
        return res.status(404).json({error: e})
    }
})

router.route('/:id/rides/:rideid/comments').get(async(req, res) => {
    res.render('rideCommentPage')
})

router.route('/:id/rides/:rideid/addComment')
.get(async(req, res) => {})
.post(async(req, res) => {})

router.route('/:id/foodstalls')
.get(async (req, res) => {
    // get the themepark by id function and render the foodstall page
    try{
        req.params.id = helper.checkId(req.params.id,"id")
    }
    catch(e){
        return res.status(400).json({error: e})
    }
    try{
        const themePark = themeParkData.getThemeParkById(req.params.id)
        return res.status(200).render('themeParkRidesPage', {themepark: themePark})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})

router.route('/:id/foodstalls/addfoodstall')
.get(async(req, res) => {
    return res.render('addFoodStallPage')
})
.post(async (req, res) => {
    const newFoodStallInfo = req.body
    if(!newFoodStallInfo || Object.keys(newFoodStallInfo) < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkId(req.params.id,"id")
        newFoodStallInfo.food_stall_name = helper.checkString(newFoodStallInfo.food_stall_name)
    }
    catch(e){
        return res.status(400).json({error:e})
    }

    try{
        await foodStallData.createFoodStall(req.params.id, newFoodStallInfo.food_stall_name)

        //replace this with where you want to render to
        return res.status(200).json({message: "Success"})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})

router.route('/:id/foodstalls/:foodstallid')
.get(async(req, res) => {
    return res.render('foodStallPage')
})

router.route('/:id/foodstalls/:foodstallid/ratings')
.get(async(req, res) => {
    return res.render('foodStallRatingPage')
})

router.route('/:id/foodstalls/:foodstallid/addRating')
.get(async(req, res) => {
    return res.render("addFoodStallRatingPage")
})
.post(async(req, res) => {
    const newFoodStallRatingInfo = req.body
    if(!newFoodStallRatingInfo || Object.keys(newFoodStallRatingInfo) < 1) return res.status(400).json({error: "The request body is empty"})

    try{
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodStallId")

        helper.checkRating(newFoodStallRatingInfo.food_quality)
        helper.checkRating(newFoodStallRatingInfo.food_wait_time)

        newFoodStallRatingInfo.food_stall_review = helper.checkString(newFoodStallRatingInfo.food_stall_review)
    }
    catch(e){
        return res.status(400).json({error: e})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {food_quality, food_wait_time, food_stall_review} = newFoodStallRatingInfo
        await foodStallRatingData.createFoodStallRating(user._id, req.params.foodstallid, food_quality, food_wait_time, food_stall_review)

        //replace this with where you want to render to
        return res.status(200).json({message: "Success"})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})

router.route('/:id/foodstalls/:foodstallid/comments').get(async(req, res) => {})

router.route('/:id/foodstalls/:foodstallid/addComment')
.get(async(req, res) => {})
.post(async(req, res) => {})

export default router;