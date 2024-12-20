import { Module } from '@nestjs/common';
import { constructFirebaseAppName, FirebaseAdminModule } from '../src';
import { NestFactory } from '@nestjs/core';
import { App } from 'firebase-admin/app';

describe('Firebase admin', () => {
  it('should create FirebaseAdminModule and export default firebase app', async () => {
    const someDatabaseUrl = 'some url';

    @Module({
      imports: [
        FirebaseAdminModule.register({
          databaseURL: someDatabaseUrl,
        }),
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);

    app.enableShutdownHooks();

    const firebaseApp = app.get<App>(constructFirebaseAppName());

    expect(firebaseApp).toBeDefined();
    expect(firebaseApp.options).toHaveProperty('databaseURL', someDatabaseUrl);

    await app.close();
  });
});
