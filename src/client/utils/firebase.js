import * as firebase from 'firebase';
import { firebaseConfig } from '../config';

// Initiate the firebase app
firebase.initializeApp(firebaseConfig);
/**
 * [database contains a reference to firebase database]
 * @type {[type]}
 */
// TODO: Need this firebase in window on client-side.
if (process.env.BROWSER) {
  window.firebase = firebase;
}
// const database = firebase.database();
export const Auth = firebase.auth();
export const FacebookAuth = new firebase.auth.FacebookAuthProvider();
export const GoogleAuth = new firebase.auth.GoogleAuthProvider();
export const messaging = process.env.BROWSER ? firebase.messaging() : {};
