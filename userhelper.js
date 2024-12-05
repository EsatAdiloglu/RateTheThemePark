function numberinstring(str) {
    return /\d/.test(str);
}
function uppercasechar(str){
    return /[A-Z]/.test(str);
}
function special(str){
    return /[^a-zA-Z0-9]/.test(str)
}

export function namefunc(fname){
    if (typeof(fname) !== "string"){throw 'name not string'}
    fname = fname.trim();
    if (fname.length === 0){
        throw "name empty";
    }
    if (fname.length < 2 || fname.length > 25)
        {throw 'length out of bounds'}
    if (numberinstring(fname)){throw "firstname contains numbers"}
}
export function usernamefunc(userId){
    if (typeof(userId) !== "string"){throw 'userId not string'}
    userId = userId.trim().toLowerCase();
    if (userId.length === 0){throw "userId empty"}
    if (userId.length < 5 || userId.length > 10){throw 'userId length out of bounds'}
    if (numberinstring(userId)){throw "userid contains numbers"}
}
export function passwordfunc(password){
    if (typeof(password) !== "string"){throw 'password not string'}
    password = password.trim()
    if (password.length === 0){throw "password empty"}
    if (password.includes(" ")){
      throw "invalid password contains a space"
    }
    if (password.length < 8){
        throw "password length less than 8"
    }
    if (!numberinstring(password) || !uppercasechar(password) || !special(password)){
        throw "invalid password"
      }
}
export function confirmpasswordfunc(p, p1){
    if (p !== p1){throw "Passwords are not matching"}
}