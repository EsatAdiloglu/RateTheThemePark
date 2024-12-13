import {Router} from "express"
const router = Router();
import themeParkData from "../data/themePark.js"; 
import commentsData from '../data/comment.js';
import themeParkRatingData from "../data/themeParkRating.js"
import userData from "../data/user.js"
import rideData from "../data/ride.js"
import rideRatingData from "../data/rideRating.js"
import foodStallData from "../data/foodStall.js"
import foodStallRatingData from "../data/foodStallRating.js"
import helper from "../helper.js";
import { ObjectId } from "mongodb";
import { foodstalls } from "../config/mongoCollections.js";

// ------------------------- WORKS
router.route('/')
.get(async (req, res)  => {
    return res.render('homePage', {title: "Rate My Theme Park"})
});

// ------------------------- WORKS
router.route('/addthemepark')
.get(async (req, res) => {
    res.render('addThemeParkPage')
})
.post(async (req, res) => {
    const newThemeParkInfo = req.body;

    if (!newThemeParkInfo || Object.keys(newThemeParkInfo).length === 0) {
        return res.status(400).json({error:"The request body is empty"});
    }

    try {
        newThemeParkInfo.theme_park_name = helper.checkString(newThemeParkInfo.theme_park_name);
        newThemeParkInfo.theme_park_street = helper.checkString(newThemeParkInfo.theme_park_street);
        newThemeParkInfo.theme_park_city = helper.checkString(newThemeParkInfo.theme_park_city);
        newThemeParkInfo.theme_park_state = helper.checkState(newThemeParkInfo.theme_park_state);

        const result = await themeParkData.createThemePark(
            newThemeParkInfo.theme_park_name,
            newThemeParkInfo.theme_park_street,
            newThemeParkInfo.theme_park_city,
            'United States of America',
            newThemeParkInfo.theme_park_state
        );
        return res.status(200).render('addThemeParkPage') // returned as a json so far
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

// ------------------------- WORKS
router.route('/listofthemeparks')
.post(async (req, res) => {
    try {
         const themeParkInput = req.body.themeParkInput;
        //  console.log(themeParkInput);

        const newThemePark = await themeParkData.getThemeParksByName(themeParkInput);
        return res.status(200).render("listOfThemeParks", {parks: newThemePark})

    } catch (e) {
        return res.status(400).json({error: e});
    }
});

// ------------------------- WORKS
router.route('/:id')
.get(async (req, res) => {
    // get the themepark by id function
    const themePark = req.params.id;

    try{
        const themeParkIDCheck = helper.checkId(themePark,"id");
        req.params.id = themeParkIDCheck; 
    } catch(e){
        return res.status(400).json({error: e})
    }
    
    try{ 
        const themePark = await themeParkData.getThemeParkById(req.params.id)
        return res.status(200).render('themeParkPage', {themepark: themePark})
    }
    catch(e){
        return res.status(404).json({error:e})
    }
    
})

// ------------------------- WORKS
router.route('/:id/ratings')
.get(async (req, res) => {
    const themePark2 = req.params.id;
        try {
            const themeParkRating = helper.checkId(themePark2,"id");
            req.params.id = themeParkRating;
        } catch (e) {
            return res.status(400).json({error: e});
        }
    
        // Fetch theme park and render ratings page
        try {
            const themePark = await themeParkData.getThemeParkById(req.params.id);
            console.log('Theme Park:', themePark);
            const ratingsData = await themeParkRatingData.getThemeParkRatings(req.params.id);

            return res.status(200).render('themeParkRatingPage', {
                themeparkname: themePark.themeParkName,
                themepark: themePark2,
                ratings: ratingsData.ratings
            });
        } catch (e) {
            console.log(e)
            return res.status(404).json({error: e});
        }
})

// ------------------------- WORKS
router.route('/:id/ratings/addThemeParkRating')
.get(async (req, res) => {
    // renders the THEME PARK ADD RATING PAGE 
    res.render('addThemeParkRatingPage', {_id: req.params.id})
})
.post(async(req, res) => {
    // TODO:
    // add the rating to the theme park ratings
    const newthemeParkRatingInfo = req.body
    if(!newthemeParkRatingInfo || Object.keys(newthemeParkRatingInfo).length < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkId(req.params.id,"id")

        helper.checkRating(newthemeParkRatingInfo.theme_park_staff)
        helper.checkRating(newthemeParkRatingInfo.theme_park_cleanliness)
        helper.checkRating(newthemeParkRatingInfo.theme_park_crowds)
        helper.checkRating(newthemeParkRatingInfo.theme_park_diversity)

        // newthemeParkRatingInfo.theme_park_review = helper.checkString(newthemeParkRatingInfo.theme_park_review)
    }
    catch(e){
        return res.status(400).json({error:e})
    }
    
    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {theme_park_staff, theme_park_cleanliness, theme_park_crowds, theme_park_diversity, theme_park_review} = newthemeParkRatingInfo
        await themeParkRatingData.createThemeParkRating(user.userName, req.params.id, theme_park_staff, theme_park_cleanliness, theme_park_crowds, theme_park_diversity, theme_park_review)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/ratings`)
    }
    catch(e){
        console.log(e)
        return res.status(404).json({error: e})
    }
})

// ------------------------- Works
router.route('/:id/comments')
.get(async (req, res) => {
    // get the themepark by id function and then render the comments
    const themeParkId = req.params.id;
    console.log('Here');

    try {
        const validatedId = helper.checkId(themeParkId, 'id');
        const themePark = await themeParkData.getThemeParkById(validatedId);
        const themeParkComments = (await commentsData.getComments(validatedId)).comments;
        return res.status(200).render('themeParkCommentPage', {
            _id: req.params.id,
            themepark: themePark,
            comments: themeParkComments,
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({error: e});
    }
})
// ------------------------- Works
router.route('/:id/comments/addThemeParkComment')
.get(async (req, res) => {
    res.render('addThemeParkCommentPage', {_id: req.params.id})
})
.post(async(req, res) => {
    const newThemeParkCommentInfo = req.body;
    if (!newThemeParkCommentInfo || Object.keys(newThemeParkCommentInfo).length < 1) {
        return res.status(400).json({error: "The request body is empty"});
    }

    const {theme_park_comment} = newThemeParkCommentInfo;
    const userName = req.session.user.userName;
    console.log(theme_park_comment);
    console.log(userName);

    try {
        // Validate the theme park ID and input fields
        req.params.id = helper.checkId(req.params.id, "id");
        helper.checkString(userName)
        helper.checkString(theme_park_comment);
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: e});
    }

    try {
        const user = await userData.getUserByUsername(req.session.user.userName);
        await commentsData.createComment(userName, req.params.id, theme_park_comment, 0);
        return res.status(200).redirect(`/themepark/${req.params.id}/comments`);
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: e});
    }
})

// ------------------------- Works
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
        //const themePark = themeParkData.getThemeParkById(req.params.id)
        const ridesarray = (await rideData.getRidesByThemePark(req.params.id)).rides;
        console.log(req.params.id, ridesarray);
        return res.status(200).render('themeParkRidesPage', {tpid: req.params.id, rides: ridesarray})
    }
    catch(e){
        console.log(e);
        return res.status(404).json({error:e})
    }
})

// render the get addRidePage and send the themepark id as well
router.route('/:id/rides/addRide')
.get(async(req, res) => {
    // get the themeparkid for the route
    res.render('addRidePage', {_id: req.params.id})
})

// get the themepark id, craete a a ride as a docuement and add array RidesArray which is a collection of arrays and we are trying to push it in there
.post(async (req, res) => {
    //adds a ride
    const newRideInfo = req.body
    if(!newRideInfo || Object.keys(newRideInfo) < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkString(req.params.id)
        newRideInfo.ride_name = helper.checkString(newRideInfo.ride_name)
    }
    catch(e){
        return res.status(400).json({error: e})
    }
    try{
        await rideData.createRide(req.params.id, newRideInfo.ride_name)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/rides`)
    }
    catch(e){
        console.log(e);
        return res.status(404).json({error:e})
    }
})

// NESTED stuff, render the ridePage for the get, get the themepark by id, get the indivdiual ride of themepark (ride id req.params.id and return specific ride object ) for the ride page 
// validate that rideid is in theme park
// access ride collections to get the speific ride  `
// COMPLETED FOR NOW
router.route('/:id/rides/:rideid')
.get(async(req, res) => {
    // res.render('ridePage')
    try {
        const themeParkId = helper.checkId(req.params.id, "Theme Park ID");
        const rideId = helper.checkId(req.params.rideid, "Ride ID");

        const ride = await rideData.getRideById(rideId);

        // if (ride.themeParkId.toString() !== themeParkId) {
        //     throw `Ride with ID ${rideId} does not belong to Theme Park with ID ${themeParkId}`;
        // }
        
        res.render('ridePage', {tpid: req.params.id, ride: ride});
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e});
    }
})

// get the themepark id, get the rides id indivudial ride idea, return the array of ratings for the specific rides 
// validate thaat ride is in themepark
// access riderating collections, and get the ratings that have the same rideid
router.route('/:id/rides/:rideid/ratings')
.get(async(req, res) => {
    try {
        const themeParkId = helper.checkId(req.params.id, "theme park ID");
        const rideId = helper.checkId(req.params.rideid, "ride ID");
        
        const themePark = await themeParkData.getThemeParkById(themeParkId);
        const ride = themePark.rides.find((ride) => ride.toString() === rideId);
        
        if (!ride) {
            return res.status(404).json({error: "Ride not found in the theme park"});
        }

        const ridesratings = (await rideRatingData.getRideRatingsByRide(req.params.rideid)).ratings;
        console.log(ridesratings)
        return res.render('rideRatingPage', {tpid: req.params.id, rpid: req.params.rideid, ratings: ridesratings});
    } catch (e) {
        console.log(e);
        return res.status(400).json({error:e});
    }
})

// render the addriderating page
router.route('/:id/rides/:rideid/addRating')
.get(async(req, res) => {
    res.render('addRideRatingPage', {tpid: req.params.id, rpid: req.params.rideid})
})
// create a new riderating document, add it to that specific ride (kinda like nesting it )
.post(async(req, res) => {
    //adds a ride rating
    const newRideRatingInfo = req.body
    if(!newRideRatingInfo || Object.keys(newRideRatingInfo).length < 1) return res.status(400).json({error: "The request body is empty"})
    
    try {
        console.log("kekw", req.params.rideid);
        req.params.rideid = helper.checkId(req.params.rideid,"rideId")
        console.log(req.params.rideid);
        helper.checkRating(newRideRatingInfo.ride_waitime)
        helper.checkRating(newRideRatingInfo.ride_comfortability)
        helper.checkRating(newRideRatingInfo.ride_enjoyment)

        //newRideRatingInfo.ride_review = helper.checkString(newRideRatingInfo.ride_review)
    }
    catch(e){
        console.log("Here1" + " " +  e);
        return res.status(400).json({error: e})
    }

    try {
        const user = await userData.getUserByUsername(req.session.user.userName)
        console.log(user.userName)
        const {ride_waitime, ride_comfortability, ride_enjoyment} = newRideRatingInfo
        await rideRatingData.createRideRating(user.userName, req.params.rideid, ride_waitime, ride_comfortability, ride_enjoyment)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/rides/${req.params.rideid}/ratings`)
    }
    catch(e){
        console.log("Here2" + " " +  e);
        return res.status(404).json({error: e})
    }
})

// render the rideComment page, and return the commens of the specific ride 
router.route('/:id/rides/:rideid/comments').get(async(req, res) => {
    res.render('rideCommentPage')
})

// render the ride comment page, just get the id of theme park id ride id, get the userId, push the ID do the {} thing 
router.route('/:id/rides/:rideid/addComment')
.get(async(req, res) => {})
// create a comment document, add speicfic ride by id, check valididations for ids, 
.post(async(req, res) => {})


// -------------------------------------- FOOD STALLS --------------------------------------
// ----------------------------------------- WORKS
router.route('/:id/foodstalls')
.get(async (req, res) => {
    // get the themepark by id function and render the foodstall page
    try {
        req.params.id = helper.checkId(req.params.id,"id");
    } catch (e) {
        return res.status(400).json({error:e});
    }

    try {
        const foodstallarray = (await foodStallData.getFoodStallsByThemePark(req.params.id)).foodStalls;
        console.log(req.params.id, foodstallarray);
        return res.status(200).render('themeParkFoodStallsPage', {tpid: req.params.id, foodStalls: foodstallarray});
    } catch (e) {
        console.log(e);
        return res.status(404).json({error:e});
    }
});

// CURRENTLY ON THIS
router.route('/:id/foodstalls/addfoodstall')
.get(async(req, res) => {
    return res.render('addFoodStallPage', {_id: req.params.id})
})
.post(async (req, res) => {
    const newFoodStallInfo = req.body
    if(!newFoodStallInfo || Object.keys(newFoodStallInfo) < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkString(req.params.id);
        newFoodStallInfo.food_stall_name = helper.checkString(newFoodStallInfo.food_stall_name)
    }
    catch(e){
        return res.status(400).json({error:e})
    }

    try{
        await foodStallData.createFoodStall(req.params.id, newFoodStallInfo.food_stall_name)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/foodstalls`)  
    }
    catch(e){
        console.log(e);
        return res.status(404).json({error:e})
    }
})


router.route('/:id/foodstalls/:foodstallid')
.get(async(req, res) => {
    try {
        const themeParkId = helper.checkId(req.params.id,"Theme Park ID");
        const foodstallId = helper.checkId(req.params.foodstallid, "Food Stall ID");

        const foodstall = await foodStallData.getFoodStallById(foodstallId);

        return res.render('foodStallPage', {tpid: req.params.id, foodstall: foodstall});
    } catch (e) {
        console.log(e);
        return res.status(400).json({error:e});
    }
})

router.route('/:id/foodstalls/:foodstallid/ratings')
.get(async(req, res) => {
    try {
        const themeParkId = helper.checkId(req.params.id, "Theme Park ID");
        const foodstallId = helper.checkId(req.params.foodstallid, "Food Stall ID");
        
        const themePark = await themeParkData.getThemeParkById(themeParkId);
        console.log("Theme Park:", themePark);
        const foodstall = themePark.foodStalls.find((stall) => stall.toString() === foodstallId);
        
        if (!foodstall) {
            return res.status(404).json({error: "Food stall not fond in the theme park"});
        }
        
        const foodstallsratings = (await foodStallRatingData.getFoodStallRatings(req.params.foodstallid)).ratings;
        console.log(foodstallsratings);
        return res.render('foodStallRatingPage', {tpid: req.params.id, fpid: req.params.foodstallid, ratings: foodstallsratings});
    } catch (e) {
        console.log(e);
        return res.status(400).json({error:e});
    } 
})

router.route('/:id/foodstalls/:foodstallid/addRating')
.get(async(req, res) => {
    return res.render("addFoodStallRatingPage", {tpid: req.params.id, fpid: req.params.foodstallid});
})
.post(async(req, res) => {
    const newFoodStallRatingInfo = req.body
    if(!newFoodStallRatingInfo || Object.keys(newFoodStallRatingInfo).length < 1) return res.status(400).json({error: "The request body is empty"})

    try{
        console.log("foodstallid before check:", req.params.foodstallid);
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodStallId");
        console.log(req.params.foodstallid);
        helper.checkRating(newFoodStallRatingInfo.food_quality)
        helper.checkRating(newFoodStallRatingInfo.food_wait_time)

        // newFoodStallRatingInfo.food_stall_review = helper.checkString(newFoodStallRatingInfo.food_stall_review)
    }
    catch(e){
        console.log("Here1" + " " +  e);
        return res.status(400).json({error: e})
    }

    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {food_quality, food_wait_time} = newFoodStallRatingInfo
        await foodStallRatingData.createFoodStallRating(user.userName, req.params.foodstallid, food_quality, food_wait_time)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/foodstalls/${req.params.foodstallid}/ratings`); 
    }
    catch(e){
        return res.status(404).json({error:e})
    }
})

router.route('/:id/foodstalls/:foodstallid/comments')
.get(async(req, res) => {
    try{
        req.params.id = helper.checkId(req.params.id, "theme park id");
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodstall id");
    } catch (e) {
        return res.send(400).json({error: e});
    }
        
    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id) 
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid)
        if (!themepark.foodstalls.some((f) => f === foodstall._id.toString())) throw `Error: the foodstall ${foodstall.foodStallName} doesn't exist in theme park ${themepark.themeParkName}`
        const foodstallComments = (await commentsData.getComments(foodstall._id.toString())).comments
        return res.status(200).render('foodStallCommentPage', {_id: themepark._id.toString(), _foodstallId: foodstall._id.toString(), comments: foodstallComments})
    } catch (e) {
        return res.send(404).json({error:e})
    } 
})

router.route('/:id/foodstalls/:foodstallid/addComment')
.get(async(req, res) => {
    // get the addComment page
	try { 
        req.params.id = helper.checkId(req.params.id, "theme park id");
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodstall id");
    } catch (e) {
        return res.send(400).json({error:e});
    }
    
    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid);
        if (!themepark.foodstalls.some((f) => f === foodstall._id.toString())) throw `Error: the foodstall ${foodstall.foodStallName} doesn't exist in theme park ${themepark.themeParkName}`;
        return res.render('addFoodStallCommentPage', {themeId: themepark._id.toString(), foodstallId: req.params.foodstallid}) 
    } catch (e) {
        return res.send(404).json({error:e});
    }
})
.post(async(req, res) => {
    // add the comment to the specific food stall
    const newFoodStallCommentInfo = req.body;
    if(!newFoodStallRatingInfo || Object.keys(newFoodStallRatingInfo) < 1) return res.status(400).json({error: "The request body is empty"});

    let userName = undefined;
    let foodstallComment = undefined;
    try {
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodstall id");
        req.params.id = helper.checkId(req.params.id, "theme park id");
        userName = helper.checkString(req.session.user.userName);
        foodstallComment = helper.checkString(newFoodStallCommentInfo.foodstall_comment);
    } catch (e) {
        return res.status(400).json({error:e});
    }

    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid);
        if (!themepark.foodstalls.some((f) => f === foodstall._id.toString())) throw `Error: the foodstall ${foodstall.foodStallName} doesn't exist in theme park ${themepark.themeParkName}`;

        await commentsData.createComment(userName, foodstall._id.toString(), foodstallComment, 1); 
        return res.status(200).redirect(`/themepark/${themepark._id.toString()}/foodstalls/${foodstall._id.toString()}/comments`);
    } catch (e) {
        return res.status(404).json({error:e});
    }
})

// -------------------------------------E OF FOOD STALL---------------------------------------------

export default router;