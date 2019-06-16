import { Auth } from '../utils/firebaseAdmin';
import { updateUserAuthenticationData } from '../client/containers/Auth/actions';

const authByIdToken = idToken => Auth.verifyIdToken(idToken)
  .then(decodedToken => decodedToken.uid)
  .then(uid => Auth.getUser(uid));

export const handleNoUser = ({ dispatch }) => {
  dispatch(updateUserAuthenticationData({
    loggedIn: false,
    user: null,
  }));
  console.log('RendererServer: NOT Logged IN');
};

export const performAuthentication = ({ dispatch }, token) => {
  return authByIdToken(token)
    .then((user) => {
      if (user) {
        const {
          displayName,
          email,
          emailVerified,
          uid,
          providerData,
        } = user;
        const photoURL = user.photoURL || 'https://crowdalert.herokuapp.com/static/images/meerkat.svg';

        dispatch(updateUserAuthenticationData({
          loggedIn: true,
          user: {
            displayName,
            email,
            emailVerified,
            photoURL,
            uid,
            providerData,
          },
        }));
        console.log('RendererServer: Logged IN');
      } else {
        handleNoUser({ dispatch });
      }
    })
    .catch((err) => {
      if (err.code === 'auth/id-token-expired') {
        console.log('RendererServer: Token has been expired. User is NOT Logged IN');
      } else {
        console.log('User authentication failed on rendered server', err);
      }

      handleNoUser({ dispatch });
    });
};
