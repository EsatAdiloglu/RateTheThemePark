import themeParkRoutes from "./themePark.js"
import userRoutes from "./user.js"
import apiRoutes from "./api.js"


const constructorMethod = (app) => {
    app.use('/', userRoutes)
    app.use('/themepark', themeParkRoutes)
    app.use('/api',apiRoutes)
    app.use("*",(req,res) => {
        if (req.session.user){
            return res.status(404).render('error', {signedin: true});
        }
        else{
            return res.status(404).render('error', {signedin: false});
        }
    });
};

export default constructorMethod