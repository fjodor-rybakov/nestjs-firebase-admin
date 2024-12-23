import { Injectable, Module } from '@nestjs/common';
import {
  constructFirebaseAppName,
  FirebaseAdminModule,
  InjectFirebaseAdminApp,
} from '../src';
import { NestFactory } from '@nestjs/core';
import { App } from 'firebase-admin/app';

describe('Firebase admin', () => {
  it('should create FirebaseAdminModule and export default firebase app', async () => {
    const someDatabaseUrl = 'some url';

    @Injectable()
    class TestService {
      constructor(
        @InjectFirebaseAdminApp()
        private readonly firebaseApp: App,
      ) {
        expect(firebaseApp).toBeDefined();
        expect(firebaseApp.options).toHaveProperty(
          'databaseURL',
          someDatabaseUrl,
        );
      }
    }

    @Module({
      imports: [FirebaseAdminModule.forFeature()],
      providers: [TestService],
    })
    class TestModule {}

    @Module({
      imports: [
        FirebaseAdminModule.forRoot({
          databaseURL: someDatabaseUrl,
        }),
        TestModule,
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

  it('should create FirebaseAdminModule and export "test_app" firebase app', async () => {
    const someDatabaseUrl = 'some url';

    @Injectable()
    class TestService {
      constructor(
        @InjectFirebaseAdminApp('test_app')
        private readonly firebaseApp: App,
      ) {
        expect(firebaseApp).toBeDefined();
        expect(firebaseApp.options).toHaveProperty(
          'databaseURL',
          someDatabaseUrl,
        );
      }
    }

    @Module({
      imports: [FirebaseAdminModule.forFeature(['test_app'])],
      providers: [TestService],
    })
    class TestModule {}

    @Module({
      imports: [
        FirebaseAdminModule.forRoot({
          appName: 'test_app',
          databaseURL: someDatabaseUrl,
        }),
        TestModule,
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);

    app.enableShutdownHooks();

    const firebaseApp = app.get<App>(constructFirebaseAppName('test_app'));

    expect(firebaseApp).toBeDefined();
    expect(firebaseApp.options).toHaveProperty('databaseURL', someDatabaseUrl);

    await app.close();
  });

  it('should create global FirebaseAdminModule and export "test_app" firebase app', async () => {
    const someDatabaseUrl = 'some url';

    @Injectable()
    class TestService {
      constructor(
        @InjectFirebaseAdminApp('test_app')
        private readonly firebaseApp: App,
      ) {
        expect(firebaseApp).toBeDefined();
        expect(firebaseApp.options).toHaveProperty(
          'databaseURL',
          someDatabaseUrl,
        );
      }
    }

    @Module({
      providers: [TestService],
    })
    class TestModule {}

    @Module({
      imports: [
        FirebaseAdminModule.forRoot({
          isGlobal: true,
          appName: 'test_app',
          databaseURL: someDatabaseUrl,
        }),
        TestModule,
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);

    app.enableShutdownHooks();

    const firebaseApp = app.get<App>(constructFirebaseAppName('test_app'));

    expect(firebaseApp).toBeDefined();
    expect(firebaseApp.options).toHaveProperty('databaseURL', someDatabaseUrl);

    await app.close();
  });

  it('should create FirebaseAdminModule and export "test_app" and "test_app_second" firebase app', async () => {
    const someDatabaseUrl = 'some url';

    @Injectable()
    class TestService {
      constructor(
        @InjectFirebaseAdminApp('test_app')
        private readonly firebaseApp: App,
        @InjectFirebaseAdminApp('test_app_second')
        private readonly firebaseSecondApp: App,
      ) {
        expect(firebaseApp).toBeDefined();
        expect(firebaseApp.name).toStrictEqual('test_app');
        expect(firebaseApp.options).toHaveProperty(
          'databaseURL',
          someDatabaseUrl,
        );
        expect(firebaseSecondApp).toBeDefined();
        expect(firebaseSecondApp.name).toStrictEqual('test_app_second');
        expect(firebaseSecondApp.options).toHaveProperty(
          'databaseURL',
          someDatabaseUrl,
        );
      }
    }

    @Module({
      imports: [
        FirebaseAdminModule.forFeature(['test_app', 'test_app_second']),
      ],
      providers: [TestService],
    })
    class TestModule {}

    @Module({
      imports: [
        FirebaseAdminModule.forRoot({
          appName: 'test_app',
          databaseURL: someDatabaseUrl,
        }),
        FirebaseAdminModule.forRoot({
          appName: 'test_app_second',
          databaseURL: someDatabaseUrl,
        }),
        TestModule,
      ],
    })
    class AppModule {}

    const app = await NestFactory.createApplicationContext(AppModule);

    app.enableShutdownHooks();

    const firebaseApp = app.get<App>(constructFirebaseAppName('test_app'));

    expect(firebaseApp).toBeDefined();
    expect(firebaseApp.name).toStrictEqual('test_app');
    expect(firebaseApp.options).toHaveProperty('databaseURL', someDatabaseUrl);

    const firebaseSecondApp = app.get<App>(
      constructFirebaseAppName('test_app_second'),
    );

    expect(firebaseSecondApp).toBeDefined();
    expect(firebaseSecondApp.name).toStrictEqual('test_app_second');
    expect(firebaseSecondApp.options).toHaveProperty(
      'databaseURL',
      someDatabaseUrl,
    );

    await app.close();
  });
});
