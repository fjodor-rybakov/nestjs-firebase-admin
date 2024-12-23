import {
  FIREBASE_ADMIN_ASYNC_OPTIONS_TYPE,
  FIREBASE_ADMIN_OPTIONS_TYPE,
  FirebaseAdminCoreModule,
} from './firebase-admin.module-definition';
import { DynamicModule, Module } from '@nestjs/common';
import { constructFirebaseAppName } from './utils/construct-firebase-app-name';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { constructCoreFirebaseAppName } from './utils/construct-core-firebase-app-name';

export type ExtraModuleOptions = {
  isGlobal?: boolean;
  appName?: string;
};

@Module({})
export class FirebaseAdminModule {
  static forRoot(
    options: typeof FIREBASE_ADMIN_OPTIONS_TYPE & ExtraModuleOptions,
  ): DynamicModule {
    const providers = FirebaseAdminModule.createProviders([options.appName]);

    return {
      module: FirebaseAdminModule,
      global: options.isGlobal,
      imports: [FirebaseAdminCoreModule.register(options)],
      providers,
      exports: providers,
    };
  }

  static forRootAsync(
    options: typeof FIREBASE_ADMIN_ASYNC_OPTIONS_TYPE & ExtraModuleOptions,
  ): DynamicModule {
    const providers = FirebaseAdminModule.createProviders([options.appName]);

    return {
      module: FirebaseAdminModule,
      global: options.isGlobal,
      imports: [FirebaseAdminCoreModule.registerAsync(options)],
      providers: providers,
      exports: providers,
    };
  }

  static forFeature(appNames: string[] = []): DynamicModule {
    const providers = FirebaseAdminModule.createProviders(appNames);

    return {
      module: FirebaseAdminModule,
      providers,
      exports: providers,
    };
  }

  private static createProviders(appNames: string[] = []): Provider[] {
    if (appNames.length === 0) {
      const providerKey = constructFirebaseAppName();

      return [
        {
          provide: providerKey,
          useExisting: constructCoreFirebaseAppName(providerKey),
        },
      ];
    }

    return appNames.map((appName) => {
      const providerKey = constructFirebaseAppName(appName);

      return {
        provide: providerKey,
        useExisting: constructCoreFirebaseAppName(providerKey),
      };
    });
  }
}
