import * as firebase from 'firebase';
import { firebaseConfig } from '../config';

// Initiate the firebase app
firebase.initializeApp(firebaseConfig);
/**
 * [database contains a reference to firebase database]
 * @type {[type]}
 */
if (typeof window !== 'undefined') {
  window.firebase = firebase;
}

export const Auth = firebase.auth();
export const FacebookAuth = new firebase.auth.FacebookAuthProvider();
export const GoogleAuth = new firebase.auth.GoogleAuthProvider();
export const messaging = process.env.BROWSER ? firebase.messaging() : {};
