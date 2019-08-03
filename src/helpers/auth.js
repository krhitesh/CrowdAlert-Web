import { Auth } from '../utils/firebaseAdmin';
import { updateUserAuthenticationData } from '../client/containers/Auth/actions';
import { userGetInfoSSR } from '../client/containers/User/actions';

/*
Use firebase Admin SDK on server to verify the retrieved ID token. If that ID token is
valid, fetch the user then dispatch appropriate redux action with that user data.
*/

const authByIdToken = idToken => Auth.verifyIdToken(idToken)
  .then(decodedToken => decodedToken.uid)
  .then(uid => Auth.getUser(uid));

export const handleNoUser = ({ dispatch }) => {
  dispatch(updateUserAuthenticationData({
    loggedIn: false,
    user: null,
  }));
  console.log('handleNoUser/RendererServer: NOT Logged IN');
};

export default ({ dispatch, getState }, token) => {
  if (!token || token === '' || typeof token !== 'string') {
    return handleNoUser({ dispatch });
  }

  return authByIdToken(token)
    .then(async (user) => {
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
        console.log('authByIdToken.then/RendererServer: Logged IN');

        await dispatch(userGetInfoSSR({ key: 'home_location' }, token));
      } else {
        handleNoUser({ dispatch });
      }
    })
    .catch((err) => {
      if (err.code === 'auth/id-token-expired') {
        console.log('authByIdToken.catch/RendererServer: Token has been expired. User is NOT Logged IN');
      } else {
        console.log('authByIdToken.catch/User authentication failed on rendered server', err);
      }

      handleNoUser({ dispatch });
    });
};
