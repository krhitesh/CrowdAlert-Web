/* eslint-disable import/prefer-default-export */
import * as admin from 'firebase-admin';

const serviceAccount = {
  private_key: process.env.DJANGO_FIREBASE_private_key,
  auth_uri: process.env.DJANGO_FIREBASE_auth_uri,
  client_email: process.env.DJANGO_FIREBASE_client_email,
  FCM_SENDER_TOKEN: process.env.DJANGO_FIREBASE_FCM_SENDER_TOKEN,
  token_uri: process.env.DJANGO_FIREBASE_token_uri,
  client_x509_cert_url: process.env.DJANGO_FIREBASE_client_x509_cert_url,
  type: process.env.DJANGO_FIREBASE_type,
  auth_provider_x509_cert_url: process.env.DJANGO_FIREBASE_client_x509_cert_url,
  project_id: process.env.DJANGO_FIREBASE_project_id,
  private_key_id: process.env.DJANGO_FIREBASE_private_key_id,
  client_id: process.env.DJANGO_FIREBASE_client_id,
};

let firebase = null;

try {
  firebase = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
    },
    'RendererServer',
  );
} catch (e) {
  console.log('Failed to initialise admin SDK on renderer server.', e);
}

export const Auth = firebase.auth();
