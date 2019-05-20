/* eslint-disable import/prefer-default-export */
import { Auth } from '../utils/firebaseAdmin';

export const authByIdToken = idToken => Auth.verifyIdToken(idToken)
  .then(decodedToken => decodedToken.uid)
  .then(uid => Auth.getUser(uid));
