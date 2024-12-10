function numberinstring(str) {
    return /\d/.test(str);
}
function uppercasechar(str){
    return /[A-Z]/.test(str);
}
function special(str){
    return /[^a-zA-Z0-9]/.test(str)
}

export function namefunc(name){
    if (!name) throw "Name undefined or null"
    if (typeof(name) !== 'string') throw "name is not a string"
    name = name.trim();
    if (name.length === 0) throw "Name is empty"
    if (name.length < 3) throw "Name too short"
}
export function usernamefunc(username){
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
export function passwordfunc(password){
    if (!password) throw "Password undefined or null"
    if (typeof(password) !== 'string') throw "Password not string"
    password = password.trim();
    if (password.length === 0) throw "Password is empty"
    if (password.includes(' ')) throw "Password contains a space"
    if (password.length < 8) throw "Password too short"
    if (!numberinstring(password) || !uppercasechar(password) || !special(password)){throw "Invalid password, password needs to have at least one number, one special character, and one uppercase character"}
}
export function confirmpasswordfunc(p1, p2){
    if (p1 !== p2) throw "Passwords are not the same"
}
export function commenthelper(cmt){
    if (!cmt) throw "Comment not there";
    if (typeof(cmt) !== 'string') throw "Comment not a string"
    cmt = cmt.trim();
    if (cmt.length === 0) throw "Comment is empty"
    if (cmt.length < 5) throw "Comment too short";
}
export function rating(r){
    
}