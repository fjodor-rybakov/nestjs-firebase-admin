import { BeforeApplicationShutdown, Inject, Injectable } from '@nestjs/common';
import { deleteApp, getApp } from 'firebase-admin/app';
import { FIREBASE_ADMIN_APP_NAME } from '../constants/firebase-admin-app-name.constant';

@Injectable()
export class FirebaseAdminHookService implements BeforeApplicationShutdown {
  constructor(
    @Inject(FIREBASE_ADMIN_APP_NAME)
    private readonly appName: string,
  ) {}

  public async beforeApplicationShutdown(): Promise<void> {
    const app = getApp(this.appName);

    if (app) {
      await deleteApp(app);
    }
  }
}
