let addthemeparkform = document.getElementById('tp'); //a
let addthemeparkratingform = document.getElementById('tprating') //a

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
let addrideratingform = document.getElementById('riderating') //a


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
let addfoodstallrating = document.getElementById('foodstallrating'); //a


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
            comparepassword(signupcpassword.value)
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
