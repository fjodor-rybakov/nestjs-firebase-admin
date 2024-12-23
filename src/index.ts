import { InjectFirebaseAdminApp } from './decorators/inject-firebase-admin-app.decorator';
import {
  ExtraModuleOptions,
  FirebaseAdminModule,
} from './firebase-admin.module';
import { ModuleOptions } from './firebase-admin.module-definition';
import { constructFirebaseAppName } from './utils/construct-firebase-app-name';

// Modules
export { FirebaseAdminModule };

// Decorators
export { InjectFirebaseAdminApp };

// Utils
export { constructFirebaseAppName };

// Types
export type { ExtraModuleOptions, ModuleOptions };
