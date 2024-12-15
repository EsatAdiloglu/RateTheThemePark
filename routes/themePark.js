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
import reportsData from '../data/report.js' 
import helper from "../helper.js";
import { ObjectId } from "mongodb";
import xss from "xss";
import { themeparkratings, rideratings } from "../config/mongoCollections.js";

// ------------------------- WORKS
router.route('/')
.get(async (req, res)  => {
    return res.render('homePage', {title: "Rate My Theme Park"})
});

router.route('/comparethemeparks')
.get(async (req, res)  => {
    const allParks = await themeParkData.getAllThemeParks();
    return res.render('compareThemeParksPage', {title: "Compare Theme Parks", parkOne: allParks, parkTwo: allParks});
    //return res.render('compareThemeParksPage', {park: allParks})
})

router.route('/comparethemeparksresults')
.post(async (req, res) => {

    try {
        let parkOneInput = await themeParkData.getThemeParkById(req.body.parkOne);
        let parkTwoInput = await themeParkData.getThemeParkById(req.body.parkTwo);

        return res.redirect(`/themepark/compareThemeParksPage2/${req.body.parkOne}/${req.body.parkTwo}`);
    } catch (e) {

        return res.status(400).json({error: e});
    }
});

router.route('/compareThemeParksPage2/:id1/:id2').get(async(req,res) =>{
    let parkOneInput = await themeParkData.getThemeParkById(req.params.id1);
    let parkTwoInput = await themeParkData.getThemeParkById(req.params.id2);
    return res.render('compareThemeParksPage2',{title: "Compare Theme Parks", parkOne: parkOneInput, parkTwo: parkTwoInput})
})

router.route('/addlike')
.post(async(req, res) => {
    const tpratingcollections = await themeparkratings();
    const tpid = req.body.themeparkid;
    const themepark = await themeParkData.getThemeParkById(tpid);
    const uname = req.session.user.userName
    let tprating;
    let tpratingid;

    for (let i = 0; i < themepark.ratings.length; i++){
        tprating = await themeParkRatingData.getThemeParkRatingById(themepark.ratings[i]);
        if (tprating.userName === uname){
            tpratingid = tprating._id
            break
        }
    }
    if (!tprating.usersLiked.includes(uname)){
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },  
            { $inc: { numUsersLiked: 1 } } 
        )
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },     
            { $push: { usersLiked: uname } } 
          );
    }
    else{
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },  
            { $inc: { numUsersLiked: -1 } } 
        )
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },     
            { $pull: { usersLiked: uname } } 
          );
    }

    if (tprating.usersDisliked.includes(uname)){
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },  
            { $inc: { numUsersDisliked: -1 } } 
        )
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },     
            { $pull: { usersDisliked: uname } } 
          );
    }
    const updated = await themeParkRatingData.getThemeParkRatingById(tpratingid);
    return res.json({likes: updated.numUsersLiked, dislikes: updated.numUsersDisliked})
})

router.route('/adddislike')
.post(async(req, res) => {
    const tpratingcollections = await themeparkratings();
    const tpid = req.body.themeparkid;
    const themepark = await themeParkData.getThemeParkById(tpid);
    const uname = req.session.user.userName
    let tprating;
    let tpratingid;

    for (let i = 0; i < themepark.ratings.length; i++){
        tprating = await themeParkRatingData.getThemeParkRatingById(themepark.ratings[i]);
        if (tprating.userName === uname){
            tpratingid = tprating._id
            break
        }
    }
    if (!tprating.usersDisliked.includes(uname)){
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },  
            { $inc: { numUsersDisliked: 1 } } 
        )
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },     
            { $push: { usersDisliked: uname } } 
          );
    }
    else{
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },  
            { $inc: { numUsersDisliked: -1 } } 
        )
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },     
            { $pull: { usersDisliked: uname } } 
          );
    }

    if (tprating.usersLiked.includes(uname)){
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },  
            { $inc: { numUsersLiked: -1 } } 
        )
        await tpratingcollections.updateOne(
            { _id: new ObjectId(tprating._id) },     
            { $pull: { usersLiked: uname } } 
          );
    }

    const updated = await themeParkRatingData.getThemeParkRatingById(tpratingid);
    return res.json({likes: updated.numUsersLiked, dislikes: updated.numUsersDisliked})
})

router.route('/addridelike')
.post(async(req, res) => {
    const rideid = req.body.rideid;
    

    const rideratingcollections = await rideratings();

    const ride = await rideData.getRideById(rideid)
    const uname = req.session.user.userName;
    
    let riderating;
    let rideratingid;

    for (let i = 0; i < ride.ratings.length; i++){
        riderating = await rideRatingData.getRideRatingById(ride.ratings[i])
        if (riderating.userName === uname){
            rideratingid = riderating._id;
        }
    }
    
    if (!riderating.usersLiked.includes(uname)){
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },  
            { $inc: { numUsersLiked: 1 } } 
        )
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },     
            { $push: { usersLiked: uname } } 
          );
    }
    else{
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },  
            { $inc: { numUsersLiked: -1 } } 
        )
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },     
            { $pull: { usersLiked: uname } } 
          );
    }
    if (riderating.usersDisliked.includes(uname)){
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },  
            { $inc: { numUsersDisliked: -1 } } 
        )
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },     
            { $pull: { usersDisliked: uname } } 
          );
    }

    const updated = await rideRatingData.getRideRatingById(rideratingid)
    return res.json({likes: updated.numUsersLiked, dislikes: updated.numUsersDisliked})
})

router.route('/addridedislike')
.post(async(req, res) => {
    const rideid = req.body.rideid;
    

    const rideratingcollections = await rideratings();

    const ride = await rideData.getRideById(rideid)
    const uname = req.session.user.userName;
    
    let riderating;
    let rideratingid;

    for (let i = 0; i < ride.ratings.length; i++){
        riderating = await rideRatingData.getRideRatingById(ride.ratings[i])
        if (riderating.userName === uname){
            rideratingid = riderating._id;
        }
    }
    
    if (!riderating.usersDisliked.includes(uname)){
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },  
            { $inc: { numUsersDisliked: 1 } } 
        )
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },     
            { $push: { usersDisliked: uname } } 
          );
    }
    else{
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },  
            { $inc: { numUsersDisliked: -1 } } 
        )
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },     
            { $pull: { usersDisliked: uname } } 
          );
    }
    if (riderating.usersLiked.includes(uname)){
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },  
            { $inc: { numUsersLiked: -1 } } 
        )
        await rideratingcollections.updateOne(
            { _id: new ObjectId(riderating._id) },     
            { $pull: { usersLiked: uname } } 
          );
    }

    const updated = await rideRatingData.getRideRatingById(rideratingid)
    return res.json({likes: updated.numUsersLiked, dislikes: updated.numUsersDisliked})
})

// ------------------------- WORKS
router.route('/addthemepark')
.get(async (req, res) => {
    res.render('addThemeParkPage', {title:`Add A Theme Park`})
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

        newThemeParkInfo.theme_park_name = xss(newThemeParkInfo.theme_park_name)
        newThemeParkInfo.theme_park_street = xss(newThemeParkInfo.theme_park_street)
        newThemeParkInfo.theme_park_city = xss(newThemeParkInfo.theme_park_city)
        newThemeParkInfo.theme_park_state = xss(newThemeParkInfo.theme_park_state)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        const result = await themeParkData.createThemePark(
            newThemeParkInfo.theme_park_name,
            newThemeParkInfo.theme_park_street,
            newThemeParkInfo.theme_park_city,
            'United States of America',
            newThemeParkInfo.theme_park_state
        );
        return res.status(200).redirect(`/themepark/${result._id}`) // returned as a json so far
    }
    catch (e) {
        return res.status(404).json({error: `${e}`});
    }
});

// ------------------------- WORKS
router.route('/listofthemeparks')
.get(async(req, res) => {
    if (req.session.user.lastsearched){

        return res.status(200).render('listOfThemeParks', {title:"Theme Parks Found", parks: req.session.user.lastsearched})
    }
})
.post(async (req, res) => {
    let themeParkInput = req.body.themeParkInput
    try{
        themeParkInput = helper.checkString(themeParkInput)
        themeParkInput = xss(themeParkInput)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try {

        
        const newThemePark = await themeParkData.getThemeParksByName(themeParkInput);

        req.session.user.lastsearched = newThemePark
        return res.status(200).render("listOfThemeParks", {title:"Theme Parks Found", parks: newThemePark})

    } catch (e) {
        return res.status(400).json({error: e});
    }
});

router.route('/listofthemeparkslocation')
.post(async (req, res) => {
    try {
         const themeParkLocationInput = req.body.themeParkLocationInput;
        //  console.log(themeParkInput);

        const newThemePark = await themeParkData.getThemeParksByLocation(themeParkLocationInput);
        return res.status(200).render("listOfThemeParksLocations", {title:"Theme Parks Found", parks: newThemePark})

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
        req.params.id = xss(req.params.id)

    } catch(e){
        return res.status(400).json({error: `${e}`})
    }
    
    try{ 
        const themePark = await themeParkData.getThemeParkById(req.params.id)
        return res.status(200).render('themeParkPage', {title:`${themePark.themeParkName}`,themepark: themePark})
    }
    catch(e){
        return res.status(404).json({error: `${e}`})
    }
    
})

// ------------------------- WORKS
router.route('/:id/ratings')
.get(async (req, res) => {
    const themePark2 = req.params.id;
        try {
            const themeParkRating = helper.checkId(themePark2,"id");
            req.params.id = themeParkRating;
            req.params.id = xss(req.params.id)
        } catch (e) {
            return res.status(400).json({error: `${e}`});
        }
    
        // Fetch theme park and render ratings page
        try {
            const themePark = await themeParkData.getThemeParkById(req.params.id);
            const ratingsData = await themeParkRatingData.getThemeParkRatings(req.params.id);
            const averages = await themeParkRatingData.getAverageThemeParkRatings(req.params.id);

            return res.status(200).render('themeParkRatingPage', {
                tpid: req.params.id,
                title: `Ratings for ${themePark.themeParkName}`,
                themepark: themePark2,
                ratings: ratingsData.ratings,
                averages: averages,
                script_partial: 'themeParkRating_script'
            });
        } catch (e) {
            console.log(e)
            return res.status(404).json({error: `${e}`});
        }
})

// ------------------------- Works
router.route('/:id/comments')
.get(async (req, res) => {
    // get the themepark by id function and then render the comments
    const themeParkId = req.params.id;

    try{
        const validatedId = helper.checkId(themeParkId, 'theme park id');
        req.params.id = xss(validatedId)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try {
        const validatedId = req.params.id
        const themePark = await themeParkData.getThemeParkById(validatedId);
        const themeParkComments = (await commentsData.getComments(validatedId, req.session.user.userName)).comments;
        return res.status(200).render('themeParkCommentPage', {
            _id: req.params.id,
            comments: themeParkComments,
            themeParkName: themePark.themeParkName,
            script_partial: "comment_script",
            title: `Comments on ${themePark.themeParkName}`
        });
    } catch (e) {
        console.log(e)
        return res.status(404).json({error: `${e}`});
    }
})
// -------------------------------------E OF COMMENTS---------------------------------------------

// ------------------------- Works
router.route('/:id/rides')
.get(async (req, res) => {
    // get the themepark by id function and render the ride page
    try{
        req.params.id = helper.checkId(req.params.id,"id")
        req.params.id = xss(req.params.id)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        //const themePark = themeParkData.getThemeParkById(req.params.id)
        const ridesarray = (await rideData.getRidesByThemePark(req.params.id)).rides;
        return res.status(200).render('themeParkRidesPage', {title:"Theme Park Rides", tpid: req.params.id, rides: ridesarray})
    }
    catch(e){
        console.log(e);
        return res.status(404).json({error: `${e}`})
    }
})

// render the get addRidePage and send the themepark id as well
router.route('/:id/rides/addRide')
.get(async(req, res) => {
    // get the themeparkid for the route
    try{
        req.params.id = helper.checkId(req.params.id, "Theme Park Id")
        req.params.id = xss(req.params.id)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    res.render('addRidePage', {title:"Add a ride", _id: req.params.id})
})

// get the themepark id, craete a a ride as a docuement and add array RidesArray which is a collection of arrays and we are trying to push it in there
.post(async (req, res) => {
    //adds a ride
    const newRideInfo = req.body
    if(!newRideInfo || Object.keys(newRideInfo) < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkId(req.params.id, "Theme Park Id")
        newRideInfo.ride_name = helper.checkString(newRideInfo.ride_name)

        req.params.id = xss(req.params.id)
        newRideInfo.ride_name = xss(newRideInfo.ride_name)
        
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        await rideData.createRide(req.params.id, newRideInfo.ride_name)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/rides`)
    }
    catch(e){
        console.log(e);
        return res.status(404).json({error: `${e}`})
    }
})

// NESTED stuff, render the ridePage for the get, get the themepark by id, get the indivdiual ride of themepark (ride id req.params.id and return specific ride object ) for the ride page 
// validate that rideid is in theme park
// access ride collections to get the speific ride  `
// COMPLETED FOR NOW
router.route('/:id/rides/:rideid')
.get(async(req, res) => {
    // res.render('ridePage')
    try{
        req.params.id = helper.checkId(req.params.id, "Theme Park Id")
        req.params.rideid = helper.checkId(req.params.rideid, "Ride Id")

        req.params.id = xss(req.params.id)
        req.params.rideid = xss(req.params.rideid)
    }
    catch(e){
        return res.json(400).json({error: `${e}`})
    }

    try {
        const ride = await rideData.getRideById(req.params.rideid);
        // if (ride.themeParkId.toString() !== themeParkId) {
        //     throw `Ride with ID ${rideId} does not belong to Theme Park with ID ${themeParkId}`;
        // }
        
        res.render('ridePage', {title:`${ride.rideName}`,tpid: req.params.id, ride: ride});
    } catch (e) {
        console.log(e);
        res.status(400).json({error: `${e}`});
    }
})

// get the themepark id, get the rides id indivudial ride idea, return the array of ratings for the specific rides 
// validate thaat ride is in themepark
// access riderating collections, and get the ratings that have the same rideid
router.route('/:id/rides/:rideid/ratings')
.get(async(req, res) => {
    try {
        req.params.id = helper.checkId(req.params.id, "theme park ID");
        req.params.rideid = helper.checkId(req.params.rideid, "ride ID");

        req.params.id = xss(req.params.id)
        req.params.rideid = xss(req.params.rideid)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        const themePark = await themeParkData.getThemeParkById(req.params.id);
        const ride = await rideData.getRideById(req.params.rideid)
        
        if (!themePark.rides.some((r) => r === ride._id.toString())) {
            return res.status(404).json({error: `The ride ${ride.rideName} not found in the theme park ${themePark.themeParkName}`});
        }

        const ridesratings = (await rideRatingData.getRideRatingsByRide(req.params.rideid)).ratings;
        const averages = await rideRatingData.getAverageRideRatings(req.params.rideid);

        //console.log(ridesratings)
        return res.render('rideRatingPage', {
            tpid: req.params.id, 
            rpid: req.params.rideid, 
            ratings: ridesratings, 
            title: `Ratings for ${ride.rideName}`,
            averages: averages,
            script_partial: 'rideRating_script'
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: `${e}`});
    }
})


// render the rideComment page, and return the commens of the specific ride 
//-------------HOPEFULLY WORKS
router.route('/:id/rides/:rideid/comments').get(async(req, res) => {
    try{
        req.params.id = helper.checkId(req.params.id, "theme park id")
        req.params.rideid = helper.checkId(req.params.rideid, "ride id")

        req.params.id = xss(req.params.id)
        req.params.rideid = xss(req.params.rideid)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        const themepark = await themeParkData.getThemeParkById(req.params.id)
        const ride = await rideData.getRideById(req.params.rideid)
        if(!themepark.rides.some((r) => r === ride._id.toString())) throw `Error: the ride ${ride.rideName} doesn't exist in theme park ${themepark.themeParkName}` 
        const rideComments  = (await commentsData.getComments(ride._id.toString())).comments
        return res.status(200).render('rideCommentPage', 
            {
            _rideId: ride._id.toString(), 
            comments: rideComments,
            rideName: ride.rideName,
            title: `Comments on ${ride.rideName}`,
            script_partial: "comment_script"
        })
    }
    catch(e){
        return res.status(404).json({error: `${e}`})
    }

})

// -------------------------------------- FOOD STALLS --------------------------------------
// same logic as rride 
router.route('/:id/foodstalls')
.get(async (req, res) => {
    // get the themepark by id function and render the foodstall page
    try {
        req.params.id = helper.checkId(req.params.id,"id");

        req.params.id = xss(req.params.id)
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }

    try {
        const foodstallarray = (await foodStallData.getFoodStallsByThemePark(req.params.id)).foodStalls;
        return res.status(200).render('themeParkFoodStallsPage', {title:"Theme Park Food Stalls",tpid: req.params.id, foodStalls: foodstallarray});
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: `${e}`});
    }
});

// CURRENTLY ON THIS
router.route('/:id/foodstalls/addfoodstall')
.get(async(req, res) => {
    try {
        req.params.id = helper.checkId(req.params.id,"id");

        req.params.id = xss(req.params.id)
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }

    return res.render('addFoodStallPage', {title:"Add A Food Stall",_id: req.params.id})
})
.post(async (req, res) => {
    const newFoodStallInfo = req.body
    if(!newFoodStallInfo || Object.keys(newFoodStallInfo) < 1) return res.status(400).json({error: "The request body is empty"})
    try{
        req.params.id = helper.checkString(req.params.id);
        newFoodStallInfo.food_stall_name = helper.checkString(newFoodStallInfo.food_stall_name)

        req.params.id = xss(req.params.id)
        newFoodStallInfo.food_stall_name = xss(newFoodStallInfo.food_stall_name)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }

    try{
        await foodStallData.createFoodStall(req.params.id, newFoodStallInfo.food_stall_name, newFoodStallInfo.foods_served)

        //replace this with where you want to render to
        return res.status(200).redirect(`/themepark/${req.params.id}/foodstalls`)  
    }
    catch(e){
        console.log(e);
        return res.status(404).json({error: `${e}`})
    }
})


router.route('/:id/foodstalls/:foodstallid')
.get(async(req, res) => {
    try {
        req.params.id = helper.checkId(req.params.id,"Theme Park ID");
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "Food Stall ID");

        req.params.id = xss(req.params.id)
        req.params.foodstallid = xss(req.params.foodstallid)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid);
        if(!themepark.foodStalls.some((f) => f === foodstall._id.toString())) throw `Error: the foodstall ${foodstall.foodStallName} doesn't exist in the themepark ${themepark.themeParkName}`

        return res.render('foodStallPage', {title:`${foodstall.foodStallName}`,tpid: req.params.id, foodstall: foodstall});
    }
    catch (e) {
        console.log(e);
        return res.status(404).json({error: `${e}`});
    }
})

router.route('/:id/foodstalls/:foodstallid/ratings')
.get(async(req, res) => {
    try{
        req.params.id = helper.checkId(req.params.id, "Theme Park Id")
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "Food Stall Id")

        req.params.id = xss(req.params.id)
        req.params.foodstallid = xss(req.params.foodstallid)
    }
    catch(e){
        return res.status(400).json({error: `${e}`})
    }
    try{
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const foodStall = await foodStallData.getFoodStallById(req.params.foodstallid);
        if(!themepark.foodStalls.some((f) => f === foodStall._id.toString())) throw `Error: the foodstall ${foodstall.foodStallName} doesn't exist in the themepark ${themepark.themeParkName}`

        const foodStallRatings = (await foodStallRatingData.getFoodStallRatings(req.params.foodstallid)).ratings;
        const averages = await foodStallRatingData.getAverageFoodStallRatings(req.params.foodstallid)
        
        return res.render('foodStallRatingPage',{
            fpid: req.params.foodstallid,
            ratings: foodStallRatings,
            title: `Ratings for ${foodStall.foodStallName}`,
            averages: averages,
            script_partial: 'foodStallRating_script'
        })
    }
    catch(e){
        return res.status(404).json({error: `${e}`})
    }
    
})


router.route('/:id/foodstalls/:foodstallid/comments')
.get(async(req, res) => {
    try{
        req.params.id = helper.checkId(req.params.id, "theme park id");
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodstall id");

        req.params.id = xss(req.params.id)
        req.params.foodstallid = xss(req.params.foodstallid)
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }
    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id) 
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid)
        if (!themepark.foodStalls.some((f) => f === foodstall._id.toString())) throw `Error: the foodstall ${foodstall.foodStallName} doesn't exist in theme park ${themepark.themeParkName}`
        const foodstallComments = (await commentsData.getComments(foodstall._id.toString())).comments
        return res.status(200).render('foodStallCommentPage', 
            {
                _foodstallId: foodstall._id.toString(), 
                comments: foodstallComments,
                foodStallName: foodstall.foodStallName,
                title: `Comments on ${foodstall.foodStallName}`,
                script_partial: "comment_script"
            })
    } catch (e) {
        return res.status(404).json({error: `${e}`})
    } 
})
// -------------------------------------E OF FOOD STALL---------------------------------------------
// ------------------------------------REPORTS ----------------------------------------------------------
router.route('/:id/reports')
.get(async (req, res) => {
    const themeParkId = req.params.id;

    try {
        const validatedId = helper.checkId(themeParkId, 'theme park id');
        req.params.id = xss(validatedId);
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }

    try {
        const validatedId = req.params.id;
        const themePark = await themeParkData.getThemeParkById(validatedId);
        const themeParkReports = (await reportsData.getReports(validatedId)).reports;
        
        return res.status(200).render('themeParkReportPage', {
            _id: req.params.id,
            themepark: themePark.themeParkName,
            reports: themeParkReports,
            script_partial: "themeParkReport_script",
            title: `${themePark.themeParkName} - Reports`
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: `${e}`});
    }
});

router.route('/:id/rides/:rideid/reports')
.get(async (req, res) => {
    try {
        req.params.id = helper.checkId(req.params.id, "theme park id");
        req.params.rideid = helper.checkId(req.params.rideid, "ride id");

        req.params.id = xss(req.params.id);
        req.params.rideid = xss(req.params.rideid);
    } catch (e) {
        return res.status(400).json({ error: `${e}` });
    }

    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const ride = await rideData.getRideById(req.params.rideid);

        if (!themepark.rides.some((r) => r === ride._id.toString())) {
            throw `Error: The ride ${ride.rideName} doesn't exist in theme park ${themepark.themeParkName}`;
        }

        const rideReports = (await reportsData.getReports(ride._id.toString())).reports;

        const themeId = themepark._id.toString();
        const rideId = ride._id.toString();

        return res.status(200).render('rideReportPage', {
            themeId: themeId,
            rideId: rideId,
            rideName: ride.rideName,
            reports: rideReports,
            script_partial: "rideReport_script",
            title: `Reports for ${ride.rideName}`
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({ error: `${e}` });
    }
});

router.route('/:id/rides/:rideid/addReport')
.get(async (req, res) => {
    try {
        req.params.id = helper.checkId(req.params.id, "theme park id");
        req.params.rideid = helper.checkId(req.params.rideid, "ride id");

        req.params.id = xss(req.params.id);
        req.params.rideid = xss(req.params.rideid);
    } catch (e) {
        return res.status(400).json({ error: `${e}` });
    }

    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const ride = await rideData.getRideById(req.params.rideid);

        if (!themepark.rides.some((r) => r === ride._id.toString())) {
            throw `Error: The ride ${ride.rideName} doesn't exist in theme park ${themepark.themeParkName}`;
        }

        return res.render('addRideReportPage', {
            themeId: themepark._id.toString(),
            rideId: ride._id.toString(),
            rideName: ride.rideName,
            title: `Report Ride - ${ride.rideName}`
        });
    } catch (e) {
        return res.status(404).json({error: `${e}`});
    }
})

.post(async (req, res) => {
    const reportInfo = req.body;

    if (!reportInfo || Object.keys(reportInfo).length === 0) {
        return res.status(400).json({error: "The request body is empty"});
    }

    let userName = undefined;
    let reportReason = undefined;

    try {
        console.log("Report Info:", req.body);
        req.params.rideid = helper.checkId(req.params.rideid, "ride id");
        req.params.id = helper.checkId(req.params.id, "theme park id");

        console.log("Session User:", req.session.user);
        userName = helper.checkString(req.session.user.userName, "user name");
        reportReason = helper.checkString(reportInfo.report_reason, "report reason");

        req.params.id = xss(req.params.id);
        req.params.rideid = xss(req.params.rideid);
        userName = xss(userName);
        reportReason = xss(reportReason);
    } catch (e) {
        console.log(e);
        return res.status(400).json({error: `${e}`});
    }

    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const ride = await rideData.getRideById(req.params.rideid);

        if (!themepark.rides.some((r) => r === ride._id.toString())) {
            throw `Error: The ride ${ride.rideName} doesn't exist in theme park ${themepark.themeParkName}`;
        }

        console.log("Inputs to createReport:", {
            userName,
            rideId: ride._id.toString(),
            reportReason
        });

        await reportsData.createReport(userName, ride._id.toString(), reportReason, 1);

        // return res.status(200).redirect(`/themepark/${themepark._id.toString()}/rides/${ride._id.toString()}/reports`);
        return res.status(200).redirect(`/themepark/${themepark._id.toString()}/rides/${ride._id.toString()}/reportSuccess`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({error: "Failed to submit the report"});
    }
});

router.route('/:id/rides/:rideid/reportSuccess')
.get((req, res) => {
    res.render('reportSuccessPage', {title: 'Report Successfully Submitted'});
});

router.route('/:id/foodstalls/:foodstallid/reports')
.get(async(req, res) => {
    try {
        req.params.id = helper.checkId(req.params.id, "theme park id");
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodstall id");

        req.params.id = xss(req.params.id);
        req.params.foodstallid = xss(req.params.foodstallid);
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }

    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid);

        if (!themepark.foodStalls.some((f) => f === foodstall._id.toString())) {
            throw `Error: The food stall ${foodstall.foodStallName} doesn't exist in theme park ${themepark.themeParkName}`;
        }

        const foodstallReports = (await reportsData.getReports(foodstall._id.toString())).reports;

        return res.status(200).render('foodStallReportPage', {
            themeId: themepark._id.toString(),
            foodstallId: foodstall._id.toString(),
            foodstallName: foodstall.foodStallName,
            reports: foodstallReports,
            script_partial: "foodStallReport_script",
            title: `Reports for ${foodstall.foodStallName}`
        });
    } catch (e) {
        console.log(e);
        return res.status(404).json({error: `${e}`});
    }
})
.post(async(req, res) => {
    const newFoodStallReportInfo = req.body;
    if (!newFoodStallReportInfo || Object.keys(newFoodStallReportInfo).length < 1) {
        return res.status(400).json({error: "The request body is empty"});
    }

    let userName = undefined;
    let foodstallReportReason = undefined;

    try {
        req.params.foodstallid = helper.checkId(req.params.foodstallid, "foodstall id");
        req.params.id = helper.checkId(req.params.id, "theme park id");
        userName = helper.checkString(req.session.user.userName);
        foodstallReportReason = helper.checkString(newFoodStallReportInfo.foodstall_report);

        req.params.id = xss(req.params.id);
        req.params.foodstallid = xss(req.params.foodstallid);
        userName = xss(userName);
        foodstallReportReason = xss(foodstallReportReason);
    } catch (e) {
        return res.status(400).json({error: `${e}`});
    }

    try {
        const themepark = await themeParkData.getThemeParkById(req.params.id);
        const foodstall = await foodStallData.getFoodStallById(req.params.foodstallid);

        if (!themepark.foodStalls.some((f) => f === foodstall._id.toString())) {
            throw `Error: The food stall ${foodstall.foodStallName} doesn't exist in theme park ${themepark.themeParkName}`;
        }

        await reportsData.createReport(userName, foodstall._id.toString(), foodstallReportReason, "Food Stall"); 
        return res.status(200).redirect(`/themepark/${themepark._id.toString()}/foodstalls/${foodstall._id.toString()}/reports`);
    } catch (e) {
        return res.status(404).json({error: `${e}`});
    }
});

export default router;