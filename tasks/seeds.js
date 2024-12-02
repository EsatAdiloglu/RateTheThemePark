import {dbConnection, closeConnection} from '../config/mongoConnections.js';
import themeparksfunc from '../data/themePark.js'
import ridefunc from "../data/ride.js"
import userfunc from "../data/user.js"
// import {games} from '../data/games.js';

const db = await dbConnection();
await db.dropDatabase();

let themepark1 = undefined;
let themepark2 = undefined;
let themepark3 = undefined;
let ride1 = undefined;
let ride2 = undefined;
let user1 = undefined; 
let user2 = undefined;

try{
    //1
    themepark1 = await themeparksfunc.createThemePark("Disneyland", "1313 DisneyLand Drive", "Anaheim", "United States", "CA")
}
catch(e){
    console.log(e);
}
try{

    themepark2 = await themeparksfunc.createThemePark("Adventure City", "1238 South Beach Blvd", "San Francsico", "United States", "CA")
}
catch(e){
    console.log(e);
}
try{
    themepark3 = await themeparksfunc.createThemePark("Adventureland", "I-80 & Highway 65", "Altoona", "United States", "IA")
}
catch(e){
    console.log(e);
}
try{
    ride1 = await ridefunc.createRide(themepark1._id, "The Haunted Mansion")
}
catch(e){
    console.log(e)
}
try{
    ride2 = await ridefunc.createRide(themepark1._id, "Splash Mountain")
}
catch(e){
    console.log(e)
}

try {
    user1 = await userfunc.createUser("John Doe", "JohnDoe1", "thisisnotasecurepassword");
} catch (e) {
    console.log(e) 
}

try {
    user2 = await userfunc.createUser("Jane Smith", "JaneSmith1", "anotherpassword123");
} catch (e) {
    console.log(e) 
}

console.log('Done seeding database');
await closeConnection();