import {Router} from "express"
const router = Router();
import themeParkData from "../data/themePark.js"; 


//.get 
router.route('/').get(async (req, res)  => {
    return res.render('homePage', {title: "Rate My Theme Park"})
});

//post request

router.route('/addthemepark').get(async (req, res) => {
    res.render('addThemeParkPage')
})

//post request
//.post
router.route('/listofthemeparks').post(async (req, res) => {
    try {
         const themeParkInput = req.body.themeParkInput;
         console.log(themeParkInput);

        const newThemePark = await themeParkData.getThemeParksByName(themeParkInput);
        res.render("listOfThemeParks", { parks: newThemePark })

    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default router;