import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AppOptions, initializeApp } from 'firebase-admin/app';
import { constructFirebaseAppName } from './utils/construct-firebase-app-name';
import { FirebaseAdminHookService } from './services/firebase-admin-hook.service';
import { FIREBASE_ADMIN_APP_NAME } from './constants/firebase-admin-app-name.constant';

export type ModuleOptions = AppOptions;
export type ExtraModuleOptions = { isGlobal?: boolean; appName?: string };

const extraDefault: ExtraModuleOptions = { isGlobal: false };

export const {
  ConfigurableModuleClass: FirebaseAdminModule,
  MODULE_OPTIONS_TOKEN: FIREBASE_ADMIN_MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<ModuleOptions>()
  .setFactoryMethodName('setupFirebaseOptions')
  .setExtras<ExtraModuleOptions>(extraDefault, (definition, extras) => {
    const { isGlobal, appName } = extras;
    const providerKey = constructFirebaseAppName(appName);

    return {
      ...definition,
      global: isGlobal,
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
