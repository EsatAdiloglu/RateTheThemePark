import {Router} from "express"
const router = Router();
import themeParkData from "../data/themePark.js"; 


//.get 
router.route('/').get(async (req, res)  => {
    try {
        const {name} = req.query; 
        if (!name) throw "Error: You must provide a theme park name to search";

        const parks = await themeParkData.getThemeParksByName(name);

        if (parks.length === 0) {
            return res.status(404).json({ message: `No theme parks found with name '${name}'` });
        }

        res.status(200).json(parks); 
    } catch (e) {
        res.status(400).json({error: e});
    }
});

//.post
router.route('/listofthemeparks').post(async (req, res) => {
    try {
         const themeParkInput = req.body.themeParkInput;

        //  const {name} = req.body;
        // if (!name) throw "Error: You must provide a theme park name to search.";

        if (!name || !streetaddress || !city || !country || !state) {
            throw "Error: Missing required fields. Ensure all fields (name, streetaddress, city, country, state) are provided.";
        }
    
        const newThemePark = await getThemeParksByName(themeParkInput);

        // const parks = await themeParkData.getThemeParksByName(name);
        
        // if (parks.length === 0) {
        //     return res.status(404).render("listOfThemeParks", { message: `No theme parks found with name '${name}'`});
        // }

        res.status(200).render("listOfThemeParks", { parks }) 
    } catch (e) {
        res.status(400).json({error: e});
    }
});

export default router;