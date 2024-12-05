import {Router} from "express"
const router = Router();
import { namefunc, usernamefunc, passwordfunc, confirmpasswordfunc } from "../userhelper.js";

//.get 
router.route('/').get(async (req, res)  => {
    return res.status(400).json({error: "Invalid route get / for users"})
});

router
    .route('/signupuser')
    .get(async(req, res) => {
    return res.render('signUp')})
    .post(async(req, res) => {

        const missing = []
        let {name, username, password, confirmPassword} = req.body

        function addmissing(field, name) 
        {
          if (!field || field.trim().length === 0) {
              missing.push(name);
          }
        }

        const inputFields = [
            {field: name, value: "Name"},
            {field: username, value: "Username"},
            {field: password, value: "Password"},
            {field: confirmPassword, value: "Confirm Password"}
        ]
        for (let i = 0 ; i < inputFields.length; i++){
            addmissing(inputFields[i].field, inputFields[i].name)
        }
        if (missing.length > 0){
            return res.status(400).render('signUp', {missing:true, missings: missing})
        }

        const errors = [];

        name = name.trim();
        username = username.trim().toLowerCase();
        password = password.trim();
        confirmPassword = confirmPassword.trim();

        try {
            namefunc(name);
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        try{
            usernamefunc(username);
        }
        catch(e){
            if (!errors.includes(e)) {errors.push(e);}
        }
        try{
            passwordfunc(password)
        }
        catch(e){
            if (!errors.includes(e)) {errors.push(e);}
        }
        try {
            confirmpasswordfunc(password, confirmPassword)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }

        // NEED TO MAKE SIGNUPUSER FUNCTION
        try {
            const user = await signUpUser(name,username,password)
            if (user.registrationCompleted){
              return res.redirect('/signinuser')
            } 
          } 
          catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
          }
          if (errors.length > 0){
            return res.status(400).render('signUp', {error: true, errors: errors})
          }
          else{
            return res.status(500).json({error: "Internal server error"})
          }


    })
router
    .route('/signinuser')
    .get(async(req, res) => {
    return res.render('signIn')})
    .post(async(req, res) => {
        let {check_username, check_password} = req.body;

        const missing = []

        if (!check_username){
            missing.push("Username missing")
        }
        if (!check_password){
            missing.push('Password is missing')
        }
        if (missing.length > 0){
            return res.status(400).render('signIn', {missing:true, missings: missing})
        }

        username = username.trim().toLowerCase();
        password = password.trim();

        const errors = [];

        try {
            usernamefunc(username)
        } 
        catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        try {
            passwordfunc(password)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}       
        }

        //IMPLEMENT SIGNINUSER FUNCTION
        try {
        const user = await signInUser(username, password);
        } 
        catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }    
        if (errors.length > 0){
        return res.status(400).render('signIn', {error: true, errors: errors})
        }


        try {
        const user = await signInUser(username, password);
        req.session.user = user; //SET THE SESSION HERE
        return res.redirect('/themepark')
        }
        catch (e) {
        return res.status(400).render('signIn', {invalid: true, invalidmsg: "Invalid userId and/or password"})
        }


    })

export default router;