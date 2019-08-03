import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const updateUserData = functions.auth.user().onCreate((user) => { // eslint-disable-line import/prefer-default-export
  const { uid } = user;
  const photoURL = user.photoURL || "https://crowdalert.herokuapp.com/static/images/meerkat.svg";
  const displayName = user.displayName || "Anonymous Meerkat";
  // Log: recommended
  console.log(`New User, uid: ${uid}`)
  return Promise.all([
    admin.firestore().doc(`/users/${uid}`).set({
      displayName,
      photoURL,
    }),
    // Legacy operation
    admin.database().ref(`/users/${uid}`).set({
      displayName,
      photoURL,
    }),
  ])
});

export const deleteUserData = functions.auth.user().onDelete((user) => {
  const { uid } = user;
  console.log(`Deleting user, uid: ${uid}`);
  return admin.firestore().doc(`users/${uid}`).update({
    deletedByUser: true,
  });
});
