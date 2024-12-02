import {dbConnection, closeConnection} from '../config/mongoConnections.js';
import themeparksfunc from '../data/helper.js'
// import {games} from '../data/games.js';

const db = await dbConnection();
await db.dropDatabase();

let themepark1 = undefined;
let themepark2 = undefined;
let themepark3 = undefined;

try{
    //1
    themepark1 = await themeparksfunc.createThemePark("Disneyland", "1313 DisneyLand Drive", "Anaheim", "California", "United States")
}
catch(e){
    console.log(e);
}
try{

    themepark2 = await themeparksfunc.createThemePark("Adventure City", "1238 South Beach Blvd", "San Francsico", "California", "United States")
}
catch(e){
    console.log(e);
}
try{
    themepark3 = await themeparksfunc.createThemePark("Adventureland", "I-80 & Highway 65", "Altoona", "Iowa", "United States")
}
catch(e){
    console.log(e);
}


console.log('Done seeding database');
await closeConnection();