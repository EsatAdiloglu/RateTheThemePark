import {Router} from "express"
const router = Router();
import themeParkData from "../data/themePark.js"; 


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
    res.render('themeParkPage', {themepark: themepark})
})

router.route('/:id/ratings')
.get(async (req, res) => {
    // get the themepark by id function, and then render the ratings page
    res.render('themeParkPage', {themepark: themepark})
})
router.route('/:id/ratings/addThemeParkRating')
.get(async (req, res) => {
    // renders the THEME PARK ADD RATING PAGE 
    res.render('addThemeParkRatingPage')
})
.post(async(req, res) => {
    // add the rating to the theme park ratings
})

router.route('/:id/comments')
.get(async (req, res) => {
    // get the themepark by id function and then render the comments
    res.render('themeParkCommentPage', {themepark: themepark})
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
    res.render('themeParkRidesPage', {themepark: themepark})
})
router.route('/:id/rides/addRide')
.get(async(req, res) => {
    res.render('addRidePage')
})
.post((req, res) => {
    //add ride
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
})
.post(async(req, res) => {

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
    res.render('themeParkFoodStallsPage', {themepark: themepark})
})
router.route('/:id/foodstalls/addfoodstall')
.get(async(req, res) => {})
.post((req, res) => {})

router.route('/:id/foodstalls/:foodstallid')
.get(async(req, res) => {})
router.route('/:id/foodstalls/:foodstallid/ratings')
.get(async(req, res) => {})
router.route('/:id/foodstalls/:foodstallid/addRating')
.get(async(req, res) => {})
.post(async(req, res) => {})

router.route('/:id/foodstalls/:foodstallid/comments').get(async(req, res) => {})
router.route('/:id/foodstalls/:foodstallid/addComment')
.get(async(req, res) => {})
.post(async(req, res) => {})

export default router;