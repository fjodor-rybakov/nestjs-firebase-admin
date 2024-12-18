import { Inject } from '@nestjs/common';
import { constructFirebaseAppName } from '../utils/construct-firebase-app-name';

export const InjectFirebaseAdminApp = (appName?: string) =>
  Inject(constructFirebaseAppName(appName));
