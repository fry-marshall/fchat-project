import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccount = require(
      path.resolve(__dirname, '../../firebase-sdk.json'),
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  async sendNotification(token: string, body: { title: string; body: string }) {
    const value = await admin.messaging().send({
      token,
      notification: body,
    });
    console.log("value", value)
  }
}
