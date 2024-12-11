import {ObjectId} from "mongodb";
// import { themeparks, users } from "./config/mongoCollections";

const checkString = (str) => {
    if (typeof str !== "string") throw "Error: str isn't of type string"
    str = str.trim()
    if (!str) throw "Error: str is an empty string or just spaces"
    return str
}
const checkRating = (num) => {
    if (isNaN(num)) throw "Error: num is NaN"
    num = Number(num)
    if (isNaN(num)) throw "Error: num is not a number"
    if (num < 0 || num > 10) throw "Error: num is out of bounds"
    if (num % 1 !== 0) throw "Error: num isn't an integer"
}
const checkId = (id, idName) => {
  console.log(id)
  console.log(typeof id)
  id = checkString(id, idName)
  if(!ObjectId.isValid(id)) throw `Error: ${idName} is a valid Object id`
  return id
}

const checkState = (state) => {
    state = checkString(state)
    const states = {
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
      }

      const abbreviateStates = Object.keys(states);
      const fullNameStates = Object.values(states);
      
      if (abbreviateStates.includes(state.toUpperCase())) {
        return states[state.toUpperCase()];
    } else if (fullNameStates.includes(state)) {
      return state; 
    } else {
        throw "Error: state doesn't exist";
    }
}
const checkNumber = (num) => {

}
// const checkUser = async (userId) => {
//   userId = checkString(userId)
//   const userCollections = await users();
//   const user = await userCollections.findOne({_id: new ObjectId(userId)})
//   if (user === null) `Error: this is no user with id ${userId}`
//   return user
// }

// const checkThemePark = async (themeparkId) => {
//   themeparkId = checkString(themeparkId)
//   const themeParkCollections = await themeparks();
//   const themePark = await themeParkCollections.findOne({_id: new ObjectId(themeparkId)})
//   if (themePark === null) `Error: this is no theme park with id ${themeparkId}`
//   return themeParkId
// }
export default {checkString, checkState, checkRating, checkId}