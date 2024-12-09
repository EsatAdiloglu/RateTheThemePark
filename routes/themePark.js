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

//WHENEVER SOMEONE IS ADDING A RATING TO ANYTHING THEMEPARKS RIDES OR FOODSTALLS COMMENTS, 

//.get 
// homepage view, so far it WORKS
router.route('/')
.get(async (req, res)  => {
    return res.render('homePage', {title: "Rate My Theme Park"})
});

// adding a themepark, rendering the theme park, post: check all the fields, push the themepark into the themepark collection 
// WORKS
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
        return res.status(200).json(result); // returned as a json so far
    } catch (e) {
        return res.status(404).json({error: e});
    }
});

//post request
//.post
// get the input the user typed and send back an array of all the parks WORKS
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

// renders the specific individal theme parks page, validity of the id, get the themeparkbyid function and send the object data back WORKS
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

// get the themeparkbyid validity check if its there, send back an array of ratings and the themepark id {themeparkid: id, rating: []} NEED TO WORK ON THIS
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
                themepark: themePark,
                ratings: ratingsData.ratings
            });
        } catch (e) {
            return res.status(404).json({error: e});
        }
})

// render that specific page of the themepark with the themepark, send back the themepark id as well 
router.route('/:id/ratings/addThemeParkRating')
.get(async (req, res) => {
    // renders the THEME PARK ADD RATING PAGE 
    res.render('addThemeParkRatingPage')
})
// creating a rating document and push into the rating documeent into the rating array of the specific themepark 
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

        newthemeParkRatingInfo.theme_park_review = helper.checkString(newthemeParkRatingInfo.theme_park_review)
    }
    catch(e){
        return res.status(400).json({error:e})
    }
    
    try{
        const user = await userData.getUserByUsername(req.session.user.userName)
        const {theme_park_staff, theme_park_cleanliness, theme_park_crowds, theme_park_diversity, theme_park_review} = newthemeParkRatingInfo
        await themeParkRatingData.createThemeParkRating(user.userName, req.params.id, theme_park_staff, theme_park_cleanliness, theme_park_crowds, theme_park_diversity, theme_park_review)

        //replace this with where you want to render to
        return res.status(200).render("addThemeParkRatingPage")
    }
    catch(e){
        return res.status(404).json({error: e})
    }
})

// get the themeparkid fucntion get validity and send back an array of comments of the specific theme park (return return park id as well)
router.route('/:id/comments')
.get(async (req, res) => {
    // get the themepark by id function and then render the comments
    const themePark3 = req.params.id;

    try {
        const themeParkComment = helper.checkId(themePark3, 'id');
        req.params.id = validatedId;
    } catch (e) {
        return res.status(400).json({error: e});
    }

    try {
        const themePark = await themeParkData.getThemeParkById(req.params.id);
        console.log('Theme Park', themePark);
        const themeParkComments = await commentsData.getComments(req.params.id);
        return res.status(200).render('themeParkCommentPage', {
            themepark: themePark,
            comments: themeParkComments.comments,
        });
    } catch (e) {
        return res.status(400).json({error: e});
    }
})
// get: render the themepark page using the id post: check the validty of the argumetns, create a coment document, and push that comment into the theme park array 
router.route('/:id/comments/addThemeParkComment')
.get(async (req, res) => {
    res.render('addThemeParkCommentPage', {themeParkId: req.params.id})
})
.post(async(req, res) => {
    // add the comment to the the theme park comments
    const themeParkId = req.params.id;
    const { userName, commentBody } = req.body;

    try {
        const validatedId = helper.checkId(themeParkId, 'id');
        const validatedUserName = helper.checkString(userName, 'User Name');
        const validatedCommentBody = helper.checkString(commentBody, 'Comment Body');

        const newComment = await commentsData.createComment(validatedUserName, validatedId, validatedCommentBody, 0);

        return res.status(200).redirect(`/themeparks/${themeParkId}/comments`);
    } catch (e) {
        return res.status(400).render('addThemeParkCommentPage', {error: e});
    }
})

// get the themepark by id, render the page, and send back the array of rides and include the id as well or returning the object is fine
// {themeParkId: req.params.id, rides [ride1,ride2,...]}
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

// render the get addRidePage and send the themepark id as well
router.route('/:id/rides/addRide')
.get(async(req, res) => {
    res.render('addRidePage')
})

// get the themepark id, craete a a ride as a docuement and add array RidesArray which is a collection of arrays and we are trying to push it in there
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
        return res.status(200).render("addRidePage")
    }
    catch(e){
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

        if (ride.themeParkId.toString() !== themeParkId) {
            throw `Ride with ID ${rideId} does not belong to Theme Park with ID ${themeParkId}`;
        }
        
        res.render('ridePage', {ride});
    } catch (e) {
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
        const ride = themePark.rides.find((ride) => ride._id.toString() === rideId);
        
        if (!ride) {
            return res.status(404).json({error: "Ride not found in the theme park"});
        }
        return res.render('rideRatingPage', {ride});
    } catch (e) {
        return res.status(400).json({error:e});
    }
})

// render the addriderating page
router.route('/:id/rides/:rideid/addRating')
.get(async(req, res) => {
    res.render('addRideRatingPage')
})

// create a new riderating document, add it to that specific ride (kinda like nesting it )
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
        await rideRatingData.createRideRating(user.userName, req.params.rideid, ride_waittime, ride_comfortability, ride_enjoyment, ride_review)

        //replace this with where you want to render to
        return res.status(200).render("addRideRatingPage")
    }
    catch(e){
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


// same logic as rride 
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
        return res.status(200).render("addFoodStallPage")
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
        await foodStallRatingData.createFoodStallRating(user.userName, req.params.foodstallid, food_quality, food_wait_time, food_stall_review)

        //replace this with where you want to render to
        return res.status(200).render("addFoodStallRatingPage")
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