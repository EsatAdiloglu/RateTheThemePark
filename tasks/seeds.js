// import {dbConnection, closeConnection} from '../config/mongoConnections.js';
// import themeparksfunc from '../data/themePark.js'
// import ridefunc from "../data/ride.js"
// import userfunc from "../data/user.js"
// // import themeparksratingfunc from "../data/themeParkRating.js"
// import foodstallfunc from "../data/foodStall.js";
// import commentfunc from "../data/comment.js";
// // import {games} from '../data/games.js';

// const db = await dbConnection();
// await db.dropDatabase();

// let themepark1 = undefined;
// let themepark2 = undefined;
// let themepark3 = undefined;
// let ride1 = undefined;
// let ride2 = undefined;
// let user1 = undefined; 
// let user2 = undefined;
// let rating1 = undefined
// let foodstall1 = undefined;
// let foodstall2 = undefined;

// try{
//     //1
//     themepark1 = await themeparksfunc.createThemePark("Disneyland", "1313 DisneyLand Drive", "Anaheim", "United States", "CA")
// }
// catch(e){
//     console.log(e);
// }
// try{

//     themepark2 = await themeparksfunc.createThemePark("Adventure City", "1238 South Beach Blvd", "San Francsico", "United States", "CA")
// }
// catch(e){
//     console.log(e);
// }
// try{
//     themepark3 = await themeparksfunc.createThemePark("Adventureland", "I-80 & Highway 65", "Altoona", "United States", "IA")
// }
// catch(e){
//     console.log(e);
// }
// try{
//     ride1 = await ridefunc.createRide(themepark1._id, "The Haunted Mansion")
// }
// catch(e){
//     console.log(e)
// }
// try{
//     ride2 = await ridefunc.createRide(themepark1._id, "Splash Mountain")
// }
// catch(e){
//     console.log(e)
// }

// try {
//     user1 = await userfunc.createUser("John Doe", "JohnDoe1", "thisisnotasecurepassword");
// } catch (e) {
//     console.log(e) 
// }

// try {
//     user2 = await userfunc.createUser("Jane Smith", "JaneSmith1", "anotherpassword123");
// } catch (e) {
//     console.log(e) 
// }
// // try{
// //     rating1 = await themeparksratingfunc.createThemeParkRating(user1._id, themepark2._id, 5, 10, 2, 6, "hello world")
// // }
// // catch(e){
// //     console.log(e)
// // }
// try{
//     foodstall1 = await foodstallfunc.createFoodStall(
//         themepark1._id,
//         "Alien Pizza Planet"
//     );
// } catch (e) {
//     console.log(e)
// }

// try{
//     foodstall2 = await foodstallfunc.createFoodStall(
//         themepark1._id,
//         "Turkey Leg Stand" 
//     );
// } catch (e) {
//     console.log(e);
// }

// console.log('Done seeding database');
// await closeConnection();

import {dbConnection, closeConnection} from '../config/mongoConnections.js';
import themeparksfunc from '../data/themePark.js';
import ridefunc from '../data/ride.js';
import userfunc from '../data/user.js';
import foodstallfunc from '../data/foodStall.js';
import commentfunc from '../data/comment.js';

const db = await dbConnection();
await db.dropDatabase();

try {
    console.log('Seeding theme parks');
    const park1 = await themeparksfunc.createThemePark(
        'Disneyland',
        'A world-renowned theme park with magical attractions.',
        'Anaheim',
        'California',
        ['Rides', 'Food', 'Parades']
    );

    const park2 = await themeparksfunc.createThemePark(
        'Universal Studios Hollywood',
        'A theme park and film studio with thrilling attractions.',
        'Los Angeles',
        'California',
        ['Rides', 'Shows', 'Food']
    );

    const park3 = await themeparksfunc.createThemePark(
        'Six Flags Magic Mountain',
        'Known for its thrilling roller coasters and rides.',
        'Valencia',
        'California',
        ['Rides', 'Shows']
    );

    console.log('Theme parks done.');

    console.log('Seeding rides');
    await ridefunc.createRide(park1._id, 'Space Mountain', 'A thrilling indoor roller coaster.', 4.8);
    await ridefunc.createRide(park1._id, 'Pirates of the Caribbean', 'A boat ride through pirate adventures.', 4.6);
    await ridefunc.createRide(park2._id, 'Jurassic World', 'A dinosaur-themed water ride.', 4.9);
    await ridefunc.createRide(park3._id, 'Twisted Colossus', 'A high-speed hybrid roller coaster.', 4.9);

    console.log('Rides done.');

    console.log('Seeding food stalls');
    await foodstallfunc.createFoodStall(park1._id, "Mickey's Diner", 'American', 4.5);
    await foodstallfunc.createFoodStall(park2._id, 'The Three Broomsticks', 'British', 4.8);
    await foodstallfunc.createFoodStall(park3._id, 'Johnny Rockets', 'American', 4.2);

    console.log('Food stalls seeded successfully.');

    console.log('Seeding users');
    const user1 = await userfunc.createUser('John Doe', 'johndoe@example.com', 'Password123!');
    const user2 = await userfunc.createUser('Jane Smith', 'janesmith@example.com', 'SecurePass456!');
    const user3 = await userfunc.createUser('Alice Wonderland', 'alice@example.com', 'Wonderland789!');

    console.log('Users done.');

    console.log('Seeding comments');
    await commentfunc.createComment(user1._id, park1._id, 'This was the worst ride experience I have ever been on.');
    await commentfunc.createComment(user2._id, park2._id, 'The rides were amazing, and the food was great!');
    await commentfunc.createComment(user3._id, park3._id, 'Loved the roller coaster, it was fun and exciting!');

    console.log('Comments done.');

    console.log('Done seeding database');
} catch (e) {
    console.log(e);
}

console.log('Closing database connection.');
await closeConnection();
