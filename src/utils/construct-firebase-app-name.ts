import { FIREBASE_ADMIN_APP } from '../constants/firebase-admin-app.constant';

export const constructFirebaseAppName = (appName?: string) =>
  appName ? `${FIREBASE_ADMIN_APP}_${appName}` : `${FIREBASE_ADMIN_APP}`;
