import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AppOptions, initializeApp } from 'firebase-admin/app';
import { constructFirebaseAppName } from './utils/construct-firebase-app-name';
import { FirebaseAdminHookService } from './services/firebase-admin-hook.service';
import { FIREBASE_ADMIN_APP_NAME } from './constants/firebase-admin-app-name.constant';
import { constructCoreFirebaseAppName } from './utils/construct-core-firebase-app-name';

export type ModuleOptions = AppOptions;
type ExtraModuleOptions = { appName?: string };

const extraDefault: ExtraModuleOptions = {};

export const {
  ConfigurableModuleClass: FirebaseAdminCoreModule,
  MODULE_OPTIONS_TOKEN: FIREBASE_ADMIN_MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE: FIREBASE_ADMIN_OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE: FIREBASE_ADMIN_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<ModuleOptions>()
  .setFactoryMethodName('setupFirebaseOptions')
  .setExtras<ExtraModuleOptions>(extraDefault, (definition, extras) => {
    const { appName } = extras;
    const providerKey = constructCoreFirebaseAppName(
      constructFirebaseAppName(appName),
    );

    return {
      ...definition,
      global: true,
      providers: (definition.providers || []).concat([
        {
          provide: providerKey,
          useFactory: (options) => initializeApp(options, appName),
          inject: [FIREBASE_ADMIN_MODULE_OPTIONS_TOKEN],
        },
        { provide: FIREBASE_ADMIN_APP_NAME, useValue: appName },
        FirebaseAdminHookService,
      ]),
      exports: (definition.exports || []).concat(providerKey),
    };
  })
  .build();
