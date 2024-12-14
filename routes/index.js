import themeParkRoutes from "./themePark.js"
import userRoutes from "./user.js"
import apiRoutes from "./api.js"


const constructorMethod = (app) => {
    app.use('/', userRoutes)
    app.use('/themepark', themeParkRoutes)
    app.use('/api',apiRoutes)
    app.use("*",(req,res) => {
        return res.status(404).json({error: "Not Found"})
    });
};

export default constructorMethod