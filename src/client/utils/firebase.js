import firebase from 'firebase';
import 'firebase/messaging';
import { firebaseConfig } from '../config';

// Initiate the firebase app
firebase.initializeApp(firebaseConfig);
/**
 * [database contains a reference to firebase database]
 * @type {[type]}
 */
// window.firebase = firebase;
if (global.self === undefined) {
  global.self = {};
}
if (global.navigator === undefined) {
  global.navigator = {};
}
if (global.window === undefined) {
  global.window = {};
}
if (global.document === undefined) {
  global.document = undefined;
}
// const database = firebase.database();
export const Auth = firebase.auth();
export const FacebookAuth = new firebase.auth.FacebookAuthProvider();
export const GoogleAuth = new firebase.auth.GoogleAuthProvider();
export const messaging = firebase.messaging();
