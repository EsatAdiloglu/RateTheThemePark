
let addthemeparkform = document.getElementById('tp'); //a
let nameInput = document.getElementById('theme_park_name');
let streetInput = document.getElementById('theme_park_street');
let cityInput = document.getElementById('theme_park_city');
let stateInput = document.getElementById('theme_park_state');

function validString(string, min) {
    if (typeof(string) === 'undefined') {
        throw   `You must enter input`;
    } else if (typeof(string) !== 'string') {
        throw `Input must be a text value`;
    } else if (string.length() < min ) {
        throw `Input must be at least ${min} characters` 
    }
}

if (addthemeparkform) {
    addthemeparkform.addEventListener('submit', (event) => {
    const errors = [];
    try {
        validString(nameInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validString(streetInput.value, 5);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validString(cityInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validString(stateInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        const existingul = document.getElementById('myul');
        if (existingul) {
            existingul.remove();
        }
        let myUL = document.getElementById('myul');
        myUL.id = 'myul';
        event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addthemeparkform.appendChild(myUL);
    }
  });
}

// let addthemeparkratingform = document.getElementById('tprating') //a
// let staffInput = document.getElementById('theme_park_staff');
// let cleanlinessInput = document.getElementById('theme_park_cleanliness');
// let crowdsInput = document.getElementById('theme_park_crowds');
// let diversityInput = document.getElementById('theme_park_diversity');

// function validRating(rating) {
//     if (typeof(rating) === 'undefined') {
//         throw   `You must enter rating`;
//     } else if (typeof(rating) !== 'integer') {
//         throw `Rating must be a numerical value`;
//     } else if (rating < 1 || rating > 10) {
//         throw `Rating must be between 1-10`; 
//     }
// }

// if (addthemeparkratingform) {
//     addthemeparkratingform.addEventListener('submit', (event) => {
//     const errors = [];
//     try {
//         validRating(staffInput.value, 2);
//     } catch (e) {
//         if (!errors.includes(e)) {
//             errors.push(e);
//         }
//     }
//     try {
//         validRating(cleanlinessInput.value, 5);
//     } catch (e) {
//         if (!errors.includes(e)) {
//             errors.push(e);
//         }
//     }
//     try {
//         validRating(crowdsInput.value, 2);
//     } catch (e) {
//         if (!errors.includes(e)) {
//             errors.push(e);
//         }
//     }
//     try {
//         validRating(diversityInput.value, 2);
//     } catch (e) {
//         if (!errors.includes(e)) {
//             errors.push(e);
//         }
//     }
//     if (errors.length > 0) {
//         const existingul = document.getElementById('myul');
//         if (existingul) {
//             existingul.remove();
//         }
//         let myUL = document.getElementById('myul');
//         myUL.id = 'myul';
//         event.preventDefault();
//               for (let i = 0; i < errors.length; i++) {
//                 let myLi = document.createElement('li');
//                 myLi.classList.add('error');
//                 myLi.innerHTML = errors[i];
//                 myUL.appendChild(myLi);
//               }
//               addthemeparkratingform.appendChild(myUL);
//     }
//   });
// }

function commenthelper(cmt){
    if (!cmt) throw "Comment not there";
    if (typeof(cmt) !== 'string') throw "Comment not a string"
    cmt = cmt.trim();
    if (cmt.length === 0) throw "Comment is empty"
    if (cmt.length < 5) throw "Comment too short";
}
let addthemeparkcommentform = document.getElementById('tpcomment') 
let themeparkcomment = document.getElementById('theme_park_comment') 
if (addthemeparkcommentform){
    addthemeparkcommentform.addEventListener('submit', (event) => {
        const errors = [];
        
        try {
            commenthelper(themeparkcomment.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }

        if (errors.length > 0){
            const existingul = document.getElementById('myul');
            if (existingul)
            {
              existingul.remove();
            }
              let myUL = document.createElement('ul');
              myUL.id = 'myul'
  
              event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addthemeparkcommentform.appendChild(myUL);
        }
    })
}

let addrideform = document.getElementById('addride') //a
let rideNameInput = document.getElementById('ride_name');
if (addrideform) {
    addrideform.addEventListener('submit', (event) => {
    const errors = [];
    try {
        validString(rideNameInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        const existingul = document.getElementById('myul');
        if (existingul) {
            existingul.remove();
        }
        let myUL = document.getElementById('myul');
        myUL.id = 'myul';
        event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addrideform.appendChild(myUL);
    }
  });
}


let addrideratingform = document.getElementById('riderating') //a
let rideWaitTimeInput = document.getElementById('ride_waittime');
let comfortabilityInput = document.getElementById('ride_comfortability');
let enjoymentInput = document.getElementById('ride_enjoyment');

if (addrideratingform) {
    addrideratingform.addEventListener('submit', (event) => {
    const errors = [];
    try {
        validRating(rideWaitTimeInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validRating(comfortabilityInput.value, 5);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validRating(enjoymentInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        const existingul = document.getElementById('myul');
        if (existingul) {
            existingul.remove();
        }
        let myUL = document.getElementById('myul');
        myUL.id = 'myul';
        event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addrideratingform.appendChild(myUL);
    }
  });
}


let addridecommentform = document.getElementById('ridecomment')
let ridecomment = document.getElementById('ride_comment');
if (addridecommentform){
    addridecommentform.addEventListener('submit', (event) => {
        const errors = [];
        
        try {
            commenthelper(ridecomment.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }

        if (errors.length > 0){
            const existingul = document.getElementById('myul');
            if (existingul)
            {
              existingul.remove();
            }
              let myUL = document.createElement('ul');
              myUL.id = 'myul'
  
              event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addridecommentform.appendChild(myUL);
        }
    })
}


let addfoodstallform = document.getElementById('addfoodstall') //a
let foodStallNameInput = document.getElementById('food_stall_name');
let foodServedInput = document.getElementById('foods_served');
if (addfoodstallform) {
    addfoodstallform.addEventListener('submit', (event) => {
    const errors = [];
    try {
        validString(foodStallNameInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validString(foodServedInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        const existingul = document.getElementById('myul');
        if (existingul) {
            existingul.remove();
        }
        let myUL = document.getElementById('myul');
        myUL.id = 'myul';
        event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addfoodstallform.appendChild(myUL);
    }
  });
}

let addfoodstallrating = document.getElementById('foodstallrating'); //a
let foodQualityInput = document.getElementById('food_quality');
let foodWaitTimeInput = document.getElementById('food_wait_time');

if (addfoodstallrating) {
    addfoodstallrating.addEventListener('submit', (event) => {
    const errors = [];
    try {
        validRating(foodQualityInput.value, 2);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    try {
        validRating(foodWaitTimeInput.value, 5);
    } catch (e) {
        if (!errors.includes(e)) {
            errors.push(e);
        }
    }
    if (errors.length > 0) {
        const existingul = document.getElementById('myul');
        if (existingul) {
            existingul.remove();
        }
        let myUL = document.getElementById('myul');
        myUL.id = 'myul';
        event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addfoodstallrating.appendChild(myUL);
    }
  });
}


let addfoodstallcommentform = document.getElementById('foodstallcomment')
let foodstallcomment = document.getElementById('foodstall_comment')
if (addfoodstallcommentform){
    addfoodstallcommentform.addEventListener('submit', (event) => {
        const errors = [];
        
        try {
            commenthelper(foodstallcomment.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }

        if (errors.length > 0){
            const existingul = document.getElementById('myul');
            if (existingul)
            {
              existingul.remove();
            }
              let myUL = document.createElement('ul');
              myUL.id = 'myul'
  
              event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              addfoodstallcommentform.appendChild(myUL);
        }
    })
}

// ---------------------------------- SIGIN ----------------------------------------------------------
function numberinstring(str) {
    return /\d/.test(str);
}
function uppercasechar(str){
    return /[A-Z]/.test(str);
}
function special(str){
return /[^a-zA-Z0-9]/.test(str)
}
function namehelper(name){
    if (!name) throw "Name undefined or null"
    if (typeof(name) !== 'string') throw "name is not a string"
    name = name.trim();
    if (name.length === 0) throw "Name is empty"
    if (name.length < 3) throw "Name too short"
}
function usernamehelper(username){
    if (!username){
        throw "Username undefined or null"
    }
    if (typeof(username) !== "string"){
        throw "Username not string"
    }
    username = username.trim();
    if (username.length === 0){
        throw "Username length is 0"
    }
    if (username.length < 5){
        throw 'Username is not long enough'
    }
    if (numberinstring(username)){
        throw "Username contains numbers. Do not provide numbers"
    }
}
function passwordhelper(password){
    if (!password) throw "Password undefined or null"
    if (typeof(password) !== 'string') throw "Password not string"
    password = password.trim();
    if (password.length === 0) throw "Password is empty"
    if (password.includes(' ')) throw "Password contains a space"
    if (password.length < 8) throw "Password too short"
    if (!numberinstring(password) || !uppercasechar(password) || !special(password)){throw "Invalid password, password needs to have at least one number, one special character, and one uppercase character"}
}
function comparepassword(p1, p2){
    if (p1 !== p2) throw "Passwords are not the same"
}
let signinform = document.getElementById('signin-form');
let signinusername = document.getElementById('check_username');
let signinpassword = document.getElementById('check_password');

if (signinform){
    signinform.addEventListener('submit', (event) => {
        const errors = [];

        try {
            usernamehelper(signinusername.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        try {
            passwordhelper(signinpassword.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }

        if (errors.length > 0){
            const existingul = document.getElementById('myul');
            if (existingul)
            {
              existingul.remove();
            }
              let myUL = document.createElement('ul');
              myUL.id = 'myul'
  
              event.preventDefault();
              for (let i = 0; i < errors.length; i++) {
                let myLi = document.createElement('li');
                myLi.classList.add('error');
                myLi.innerHTML = errors[i];
                myUL.appendChild(myLi);
              }
              signinform.appendChild(myUL);
          }
    })
}
// ---------------------------------- Compare Theme Park --------------------------------------------------
let compareForm = document.getElementById("themeParkCompareForm");
let firstSelect = document.getElementById("firstPark");
let secondSelect = document.getElementById("secondPark");
if (compareForm) {
    compareForm.addEventListener('submit', async (event) => {
        let res = event.preventDefault();
      
        let result = await fetch("/themepark/comparethemeparksresults", 
            {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the appropriate Content-Type
                  },
                body: JSON.stringify({ parkOne : firstSelect.value , parkTwo : secondSelect.value})})
      
          const url = result.url
          window.location.href = url
      })
}


// ---------------------------------- Theme Park Like and Dislike ------------------------------------------
// let tplbutton = document.getElementById("themeparkratinglikes")
// let tpdbutton = document.getElementById("themeparkratingdislikes")

// let rlbutton = document.getElementById("rideratinglikes")
// let rdbutton = document.getElementById("rideratingdislikes")

// let fslbutton = document.getElementById("foodstallratinglikes")
// let fsdbutton = document.getElementById("foodstallratingdislikes")

// let numtplikes = document.getElementById('numtplikes')
// let numtpdislikes = document.getElementById('numtpdislikes')

// let ridenumlikes = document.getElementById('ridenumlikes')
// let ridenumdislikes = document.getElementById('ridenumdislikes')

// let fsnumlikes = document.getElementById('fsnumlikes')
// let fsnumdislikes = document.getElementById('fsnumdislikes')

// if (tplbutton) {
//     tplbutton.addEventListener('click', async () => {
//         const themeparkratingid = document.getElementById('tpitem').dataset.id;
//         console.log(themeparkratingid);
//         //code of what happens when a like button is pressed for theme park rating
//         const themeparkid = window.location.href.split('/')[4];
//         const res = await fetch("/themepark/addlike", 
//             {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ themeparkid: themeparkid, tpratingid: themeparkratingid })
//         });
//         const result = await res.json();
        

//         numtplikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
//         numtpdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`

//     })
// }

// if (tpdbutton) {
//     tpdbutton.addEventListener('click', async () => {
//         const themeparkratingid = document.getElementById('tpitem').dataset.id;
//         //code of what happens when a like button is pressed for theme park rating
//         const themeparkid = window.location.href.split('/')[4];
//         const res = await fetch("/themepark/adddislike", 
//             {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ themeparkid: themeparkid, tpratingid: themeparkratingid })
//         });
//         const result = await res.json();
        
//         numtplikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
//         numtpdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
//     })

// }

const tpratinglikebuttons = document.querySelectorAll('.themeparkratinglikes')
if (tpratinglikebuttons){
    for (const tplbutton of tpratinglikebuttons)
    {
        tplbutton.addEventListener('click', async () => {
            const themeparkratingid = tplbutton.dataset.id;

            const themeparkid = window.location.href.split('/')[4];
            const res = await fetch("/themepark/addlike", 
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ themeparkid: themeparkid, tpratingid: themeparkratingid })
            });
            const result = await res.json();
            
            const parentele = tplbutton.parentElement;

            const numtplikes = parentele.querySelector('.numtplikes');
            const numtpdislikes = parentele.querySelector('.numtpdislikes')
    
            numtplikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
            numtpdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
    
        })
    }
}

const tpratingdislikesbuttons = document.querySelectorAll('.themeparkratingdislikes')
if (tpratingdislikesbuttons){
    for (const tpdbutton of tpratingdislikesbuttons)
    {
        tpdbutton.addEventListener('click', async () => {
            const themeparkratingid = tpdbutton.dataset.id;

            const themeparkid = window.location.href.split('/')[4];
            const res = await fetch("/themepark/adddislike", 
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ themeparkid: themeparkid, tpratingid: themeparkratingid })
            });
            const result = await res.json();
            
            const parentele = tpdbutton.parentElement;

            const numtplikes = parentele.querySelector('.numtplikes');
            const numtpdislikes = parentele.querySelector('.numtpdislikes')
    
            numtplikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
            numtpdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
    
        })
    }
}


const rideratinglikebuttons = document.querySelectorAll('.rideratinglikes')
if (rideratinglikebuttons){
    for (const rlbutton of rideratinglikebuttons)
    {
        rlbutton.addEventListener('click', async () => {
            const rideratingid = rlbutton.dataset.id;

            const rideid = window.location.href.split('/')[4];
            const res = await fetch("/themepark/addridelike", 
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rideid: rideid, rideratingid: rideratingid })
            });
            const result = await res.json();
            
            const parentele = rlbutton.parentElement;

            const numrlikes = parentele.querySelector('.ridenumlikes');
            const numrdislikes = parentele.querySelector('.ridenumdislikes')
    
            numrlikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
            numrdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
    
        })
    }
}

const rideratingdislikesbuttons = document.querySelectorAll('.rideratingdislikes')
if (rideratingdislikesbuttons){
    for (const rdbutton of rideratingdislikesbuttons)
    {
        rdbutton.addEventListener('click', async () => {
            const rideratingid = rdbutton.dataset.id;

            const rideid = window.location.href.split('/')[4];
            const res = await fetch("/themepark/addridedislike", 
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rideid: rideid, rideratingid: rideratingid })
            });
            const result = await res.json();
            
            const parentele = rdbutton.parentElement;

            const numrlikes = parentele.querySelector('.ridenumlikes');
            const numrdislikes = parentele.querySelector('.ridenumdislikes')
    
            numrlikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
            numrdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
        })
    }
}

const foodstalllratinglikesbutton = document.querySelectorAll('.foodstallratinglikes')
if (foodstalllratinglikesbutton){
    for (const fslbutton of foodstalllratinglikesbutton)
    {
        fslbutton.addEventListener('click', async () => {
            const foodstallratingid = fslbutton.dataset.id;

            const foodstallid = window.location.href.split('/')[4];
            const res = await fetch("/themepark/addfslike", 
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ foodstallid: foodstallid, foodstallratingid: foodstallratingid })
            });
            const result = await res.json();
            
            const parentele = fslbutton.parentElement;

            const numfslikes = parentele.querySelector('.fsnumlikes');
            const numfsdislikes = parentele.querySelector('.fsnumdislikes')
    
            numfslikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
            numfsdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
    
        })
    }
}

const foodstallratingdislikesbuttons = document.querySelectorAll('.foodstallratingdislikes')
if (foodstallratingdislikesbuttons){
    for (const fsdbutton of foodstallratingdislikesbuttons)
    {
        fsdbutton.addEventListener('click', async () => {
            const foodstallratingid = fsdbutton.dataset.id;

            const foodstallid = window.location.href.split('/')[4];
            const res = await fetch("/themepark/addfsdislike", 
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ foodstallid: foodstallid, foodstallratingid: foodstallratingid })
            });
            const result = await res.json();
            
            const parentele = fsdbutton.parentElement;

            const numfslikes = parentele.querySelector('.fsnumlikes');
            const numfsdislikes = parentele.querySelector('.fsnumdislikes')
    
            numfslikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`
            numfsdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`
        })
    }
}


// if (fslbutton){
//     fslbutton.addEventListener('click', async() => {
//         const fsid = window.location.href.split('/')[6]
//         const res = await fetch("/themepark/addfslike", 
//             {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ fsid: fsid })
//         });
        
//         const result = await res.json();

//         fsnumlikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`;
//         fsnumdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`;
//     })
// }
// if (fsdbutton){
//     fsdbutton.addEventListener('click', async() => {
//         const fsid = window.location.href.split('/')[6]
//         const res = await fetch("/themepark/addfsdislike", 
//             {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ fsid: fsid })
//         });
        
//         const result = await res.json();
//         fsnumlikes.innerHTML = `<strong>Number of Likes:</strong> ${result.likes}`;
//         fsnumdislikes.innerHTML = `<strong>Number of Dislikes:</strong> ${result.dislikes}`;
//     })
// }
// ---------------------------------- SIGNUP ----------------------------------------------------------
let signupform = document.getElementById('signup-form')
let signupname = document.getElementById('name');
let signupusername = document.getElementById('username')
let signuppassword = document.getElementById('password');
let signupcpassword = document.getElementById('confirmPassword');

if (signupform){
    signupform.addEventListener('submit', (event) => {
        const errors = [];

        try {
            namehelper(signupname.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        try {
            usernamehelper(signupusername.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        try {
            passwordhelper(signuppassword.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        try {
            comparepassword(signuppassword.value, signupcpassword.value)
        } catch (e) {
            if (!errors.includes(e)) {errors.push(e);}
        }
        if (errors.length > 0){
            const existingul = document.getElementById('myul');
            if (existingul){
              existingul.remove();
            }
            let myUL = document.createElement('ul');
            myUL.id = 'myul';

            event.preventDefault();
            for (let i = 0; i < errors.length; i++) {
              let myLi = document.createElement('li');
              myLi.classList.add('error');
              myLi.innerHTML = errors[i];
              myUL.appendChild(myLi);
            }
            signupform.appendChild(myUL);
        }  
    })
}

let themeparkformvalidation = document.getElementById('themeParkForm')
let themeparkinp = document.getElementById('themeParkInput')
let tperror = document.getElementById('tperror')
if (themeparkformvalidation){
    themeparkformvalidation.addEventListener('submit', (event) => 
    {
        tperror.hidden = true;
        if (!themeparkinp.value || themeparkinp.value.trim().length === 0){
            tperror.hidden = false;
        }
    })
}

let themeparklocation = document.getElementById('themeParkLocationForm');
let tpinp = document.getElementById('themeParkLocationInput');
let tplocationerror = document.getElementById("tplocationerror");
if (themeparklocation){
    themeparklocation.addEventListener('submit', (event) => {
        tplocationerror.hidden = true;
        if (!tpinp.value || tpinp.value.trim().length === 0 ){
            tplocationerror.hidden = false;
        }
    })
}