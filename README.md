<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://github.com/fjodor-rybakov/discord-nestjs/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://paypal.com/paypalme/fjodorrybakov"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
</p>

## 🧾 Description

This package implements the NestJS module for Firebase admin

## 👨🏻‍💻 Installation <a name="Installation"></a>

```bash
$ npm install -E @nestjs-add-ons/firebase-admin firebase-admin
```

## ▶️ Usage <a name="Usage"></a>

Enable shutdown hooks in bootstrap function to take care of resource release

```typescript
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
}

bootstrap();
```

Just create module in import

```typescript
/* app.module.ts */

import { Module } from '@nestjs/common';
import { FirebaseAdminModule } from '@nestjs-add-ons/firebase-admin';
import { MyService } from './my-service';

@InjectDynamicProviders('dist/**/*.animal.js')
@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        // ...setup options
      }),
    }),
  ],
  providers: [MyService]
})
export class AppModule {}
```

In the service, you can inject firebase application via the `InjectFirebaseAdminApp` decorator

```typescript
/* my-service.ts */

import { Injectable } from '@nestjs/common';
import { App } from 'firebase-admin/app';
import { InjectFirebaseAdminApp } from '@nestjs-add-ons/firebase-admin';

@Injectable()
export class MyService {
  constructor(
    @InjectFirebaseAdminApp()
    private readonly firebaseApp: App
  ) {
  }

  public async sendPushNotification(): Promise<void> {
    await getMessaging(this.firebaseApp).send({
      // notification data
    })
  }
}
```

You can also create multiply firebase applications

```typescript
/* app.module.ts */

import { Module } from '@nestjs/common';
import { FirebaseAdminModule } from '@nestjs-add-ons/firebase-admin';
import { MyServiceForApp1 } from './mmy-service-for-app1';
import { MyServiceForApp2 } from './mmy-service-for-app2';

@InjectDynamicProviders('dist/**/*.animal.js')
@Module({
  imports: [
    FirebaseAdminModule.forRootAsync({
      appName: 'app1',
      useFactory: () => ({
        // ...setup options
      }),
    }),
    FirebaseAdminModule.forRootAsync({
      appName: 'app2',
      useFactory: () => ({
        // ...setup options
      }),
    }),
  ],
  providers: [MyServiceForApp1, MyServiceForApp2]
})
export class AppModule {}
```

```typescript
/* my-service-for-app1.ts */

import { Injectable } from '@nestjs/common';
import { App } from 'firebase-admin/app';
import { InjectFirebaseAdminApp } from '@nestjs-add-ons/firebase-admin';

@Injectable()
export class MyServiceForApp1 {
  constructor(
    @InjectFirebaseAdminApp('app1')
    private readonly firebaseApp: App
  ) {
  }

  public async sendPushNotification(): Promise<void> {
    await getMessaging(this.firebaseApp).send({
      // notification data
    })
  }
}
```

```typescript
/* my-service-for-app2.ts */

import { Injectable } from '@nestjs/common';
import { App } from 'firebase-admin/app';
import { InjectFirebaseAdminApp } from '@nestjs-add-ons/firebase-admin';

@Injectable()
export class MyServiceForApp2 {
  constructor(
    @InjectFirebaseAdminApp('app2')
    private readonly firebaseApp: App
  ) {
  }

  public async sendPushNotification(): Promise<void> {
    await getMessaging(this.firebaseApp).send({
      // notification data
    })
  }
}
```
