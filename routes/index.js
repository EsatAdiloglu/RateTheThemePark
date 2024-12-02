import commentRoutes from "./comment.js"
import foodStallRoutes from "./foodStall.js"
import foodStallRatingRoutes from "./foodStallRating.js"
import reportRoutes from "./report.js"
import rideRoutes from "./ride.js"
import rideRatingRoutes from "./rideRating.js"
import themeParkRoutes from "./themePark.js"
import themeParkRoutesRating from "./themeParkRating.js"
import userRoutes from "./user.js"


const constructorMethod = (app) => {
    app.use('/comment', commentRoutes)
    app.use('/foodStall', foodStallRoutes)
    app.use('/foodStallRating', foodStallRatingRoutes)
    app.use('/report', reportRoutes)
    app.use('/ride', rideRoutes)
    app.use('/rideRating', rideRatingRoutes)
    app.use('/themepark', themeParkRoutes)
    app.use('/themeParkRoutes', themeParkRoutesRating)
    app.use('/user', userRoutes)
    

    app.use("*",(req,res) => {
        return res.status(404).json({error: "Not Found"})
    });
};

export default constructorMethod