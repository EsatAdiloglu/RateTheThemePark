import {dbConnection, closeConnection} from "../config/mongoConnections.js";
import themeparksfunc from "../data/themePark.js";
import ridefunc from "../data/ride.js";
import userfunc from "../data/user.js";
import foodstallfunc from "../data/foodStall.js";
import commentfunc from "../data/comment.js";
import foodstallratingfunc from "../data/foodStallRating.js";
import rideratingfunc from "../data/rideRating.js";
import themeparkratingfuc from "../data/foodStallRating.js";

const db = await dbConnection();
await db.dropDatabase();

try {
    console.log("Seeding theme parks");
    const park1 = await themeparksfunc.createThemePark("Disneyland","1313 Disneyland Dr","Anaheim","United States", "CA");
    const park2 = await themeparksfunc.createThemePark("Universal Studios Hollywood","100 Universal City Plaza","Los Angeles","United States", "CA");
    const park3 = await themeparksfunc.createThemePark("Six Flags Magic Mountain","26101 Magic Mountain Pkwy","Valencia","United States", "CA");
    const park4 = await themeparksfunc.createThemePark("Adventure Landing", "1944 Beach Blvd", "Jacksonville Beach", "United States", "FL");
    const park5 = await themeparksfunc.createThemePark("Adventure Park USA", "11113 W Baldwin Rd", "New Market", "United States", "MD");
    const park6 = await themeparksfunc.createThemePark("Adventuredome", "2880 S Las Vegas Blvd", "Las Vegas", "United States", "NV");
    const park7 = await themeparksfunc.createThemePark("Adventureland", "305 34th Ave NW", "Altoona", "United States", "IA");
    const park8 = await themeparksfunc.createThemePark("Adventureland", "2245 Broad Hollow Rd", "Farmingdale", "United States", "NY");
    const park9 = await themeparksfunc.createThemePark("Barry Island Pleasure Park", "Barry Island", "United States", "WI");
    const park10 = await themeparksfunc.createThemePark("Alabama Adventure", "4599 Splash Adventure Pkwy", "Bessemer", "United States", "AL");
    const park11 = await themeparksfunc.createThemePark("Albion Boro Park", "106 E State St", "Albion", "United States", "PA");
    const park12 = await themeparksfunc.createThemePark("Alpine Slide at Magic Mountain", "800 Wildrose Ln", "Big Bear Lake", "United States", "CA");
    const park13 = await themeparksfunc.createThemePark("American Adventures", "250 Cobb Pkwy N", "Marietta", "United States", "GA");

    console.log("Theme parks done.");

    console.log("Seeding rides");
    const ride1 = await ridefunc.createRide(park1._id, "Space Mountain", "A thrilling indoor roller coaster.", 4.8);
    const ride2 = await ridefunc.createRide(park1._id, "Pirates of the Caribbean", "A boat ride through pirate adventures.", 4.6);
    const ride3 = await ridefunc.createRide(park2._id, "Jurassic World", "A dinosaur-themed water ride.", 4.9);
    const ride4 = await ridefunc.createRide(park3._id, "Twisted Colossus", "A high-speed hybrid roller coaster.", 4.9);

    console.log("Rides done.");

    console.log("Seeding food stalls");
    const foodStall1 = await foodstallfunc.createFoodStall(park1._id, "Mickey's Diner", "American", 4.5);
    const foodStall2 = await foodstallfunc.createFoodStall(park2._id, "The Three Broomsticks", "British", 4.8);
    const foodStall3 = await foodstallfunc.createFoodStall(park3._id, "Johnny Rockets", "American", 4.2);

    console.log("Food stalls seeded successfully.");

    console.log("Seeding users");
    const user1 = await userfunc.createUser("John Doe", "johndoe", "Password123!");
    const user2 = await userfunc.createUser("Jane Smith", "janesmith", "SecurePass456!");
    const user3 = await userfunc.createUser("Alice Wonderland", "alicewonder", "Wonderland789!");

    console.log("Users done.");

    console.log("Seeding comments");

    await commentfunc.createComment(user1.userName, park1._id, "This was the worst ride experience I have ever been on.", 0);
    await commentfunc.createComment(user2.userName, park2._id, "The rides were amazing, and the food was great!", 0);
    await commentfunc.createComment(user3.userName, park3._id, "Loved the roller coaster, it was fun and exciting!", 0);

    console.log("Comments done.");

    console.log("Seeding food stall ratings");

    await foodstallratingfunc.createFoodStallRating(user1.userName,foodStall1._id, 5, 4, "Fantastic food and quick service!");
    await foodstallratingfunc.createFoodStallRating(user2.userName,foodStall2._id,4,5, "Excellent food and ambiance.");
    await foodstallratingfunc.createFoodStallRating(user3.userName,foodStall3._id,3, 4, "Good food but slightly overpriced.");

    console.log("Food stall ratings done.");

    console.log("Seeding ride ratings");
    
    await rideratingfunc.createRideRating(user1.userName,ride1._id,4, 5, 5, "An absolutely thrilling experience!");
    await rideratingfunc.createRideRating(user2.userName,ride2._id,5,4,4, "Very immersive and fun!");
    await rideratingfunc.createRideRating(user3.userName,ride4._id,3, 4, 5, "Loved the adrenaline rush!");

    console.log("Ride ratings done.");

    console.log("Seeding theme park ratings");

    await themeparkratingfuc.createThemeParkRating(user1.userName,park1._id,5, 4, 3, 5, "Amazing park with friendly staff!");
    await themeparkratingfuc.createThemeParkRating(user2.userName,park2._id,4, 5, 4, 4, "Great experience, very clean and well-maintained!");
    await themeparkratingfuc.createThemeParkRating(user3.userName,park3._id,3, 3,4, 3,"Fun rides, but could improve staff friendliness.");

    console.log("Theme park ratings done.");

    console.log("Done seeding database");
} catch (e) {
    console.log(e);
}

console.log("Closing database connection.");
await closeConnection();