import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Note: You will need to change the code below to have the collection required by the assignment!
export const users = getCollectionFn('users');
export const themeparks = getCollectionFn('themepark');
export const rides = getCollectionFn('ride'); 
export const foodstalls = getCollectionFn('foodstall');
export const themeparkratings = getCollectionFn('themeparkrating');
export const rideratings = getCollectionFn('riderating');
export const foodstallratings = getCollectionFn('foodstallrating');
export const comments = getCollectionFn('comment'); 
export const reports = getCollectionFn('report');

//testing 1 2 