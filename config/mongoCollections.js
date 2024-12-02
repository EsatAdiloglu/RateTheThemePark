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
export const themepark = getCollectionFn('themepark');
export const ride = getCollectionFn('ride'); 
export const foodstall = getCollectionFn('foodstall');
export const themeparkrating = getCollectionFn('themeparkrating');
export const riderating = getCollectionFn('riderating');
export const foodstallrating = getCollectionFn('foodstallrating');
export const comment = getCollectionFn('comment'); 
export const report = getCollectionFn('report');
