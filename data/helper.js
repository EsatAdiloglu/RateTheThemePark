import {ObjectId} from "mongodb";

const checkString = (str) => {
    if (typeof str !== "string") throw "Error: str isn't of type string"
    str = str.trim()
    if (!str) throw "Error: str is an empty string or just spaces"
    return str
}
const checkRating = (num) => {
    if (typeof num !== "number") throw "Error: num isn't of type number"
    if (isNaN(num)) throw "Error: num is NaN"
    if (num < 0 || num > 10) throw "Error: num is out of bounds"
    if (num % 1 !== 0) throw "Error: num isn't an integer"
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
      if(states.hasOwnProperty(state)){
        return states[state]
      }
      else{
        throw "Error: state doesn't exist"
      }
}

export default {checkString, checkState, checkRating}