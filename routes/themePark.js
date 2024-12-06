import {Router} from "express"
const router = Router();
import themeParkData from "../data/themePark.js"; 

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

    // need to validate fields before sending, need to validate in clientside as well
})

router.route('/listofthemeparks')
.post(async (req, res) => {
    try {
        const themeParkInput = req.body.themeParkInput;
        
        // need to validate fields before sending, need to validate in clientside as well
        const newThemePark = await themeParkData.getThemeParksByName(themeParkInput);
        res.render("listOfThemeParks", { parks: newThemePark })

    } catch (e) {
        res.status(400).json({error: e});
    }
});

router.route('/:id')
.get(async (req, res) => {
    // Renders the invididual themePark page 
    // check the validity of the id
    // Get the themepark by id function
    // send the whole object data as part of the render
    res.render('themeParkPage')
})

router.route('/:id/ratings')
.get(async (req, res) => {
    // get the themepark by id function, and then render the ratings page
    // check the validity of the id
    // give back the ratings of the specific theme park
    // return an array of ratings 
    res.render('themeParkRatingPage')
})
router.route('/:id/ratings/addThemeParkRating')
.get(async (req, res) => {
    // renders the THEME PARK ADD RATING PAGE 
    res.render('addThemeParkRatingPage')
})
.post(async(req, res) => {
    // add the rating to the theme park ratings
    // check all the fields, need to the check the valids clientside as well
})

router.route('/:id/comments')
.get(async (req, res) => {
    // get the themepark by id function and then render the comments
    // check the validity of the id
    // send back an array of comments of the theme park
    res.render('themeParkCommentPage')
})
router.route('/:id/comments/addThemeParkComment')
.get(async (req, res) => {
    res.render('addThemeParkCommentPage')
})
.post(async(req, res) => {
    // add the comment to the the theme park comments
    // check the validity of the arguments, need to check clientside as well
})

router.route('/:id/rides')
.get(async (req, res) => {
    // get the themepark by id function and render the ride page, send back an array with all the rides, especially with their id's
    res.render('themeParkRidesPage')
})
router.route('/:id/rides/addRide')
.get(async(req, res) => {
    // get the themeparkid for the route
    res.render('addRidePage')
})
.post((req, res) => {
    // get the themeparkid for the route
    // create the ride as a document and add it to the themepark
    //add ride to that specific themepark
    // check id for validity
    // check for input validation
})

router.route('/:id/rides/:rideid')
.get(async(req, res) => {
    // get the themepark by id, as well the ride, return the ride
    res.render('ridePage')
})
router.route('/:id/rides/:rideid/ratings')
.get(async(req, res) => {
    // get the themepark by id, get the ride and ratings and return an array
    res.render('rideRatingPage')
})
router.route('/:id/rides/:rideid/addRating')
.get(async(req, res) => {
    res.render('addRideRatingPage')
})
.post(async(req, res) => {
    // add the rating for the specific ride
    // create the rating document
    // add it to the ride
    // check for validation
    // check for valid ids
})
router.route('/:id/rides/:rideid/comments')
.get(async(req, res) => 
{
    // get the ride and comments and return an array
    res.render('rideCommentPage')
})
router.route('/:id/rides/:rideid/addComment')
.get(async(req, res) => {
    res.render('addRideCommentPage')
})
.post(async(req, res) => {
    // add the comment for the specific ride
    // create the comment document
    // add it to the ride
    // check for validation
    // check for valid ids
})

router.route('/:id/foodstalls')
.get(async (req, res) => {
    // get the themepark by id function and render the foodstall page
    res.render('themeParkFoodStallsPage')
})
router.route('/:id/foodstalls/addfoodstall')
.get(async(req, res) => {
    // get the themepark addfood stall page
})
.post((req, res) => {
    // add the foodstall to the specific themepark
    // create the foodstall document and add it
})

router.route('/:id/foodstalls/:foodstallid')
.get(async(req, res) => {
    // get the specific foodstall
})
router.route('/:id/foodstalls/:foodstallid/ratings')
.get(async(req, res) => {
    // get the specific ratings for the food stall
    // return the array
})
router.route('/:id/foodstalls/:foodstallid/addRating')
.get(async(req, res) => {
    // get the addRating page
})
.post(async(req, res) => {
    // create the rating
})

router.route('/:id/foodstalls/:foodstallid/comments')
.get(async(req, res) => {
    // get the comments page, return an array on comments
})
router.route('/:id/foodstalls/:foodstallid/addComment')
.get(async(req, res) => {
    // get the addComment page
})
.post(async(req, res) => {
    // add the comment to the specific food stall
})

export default router;