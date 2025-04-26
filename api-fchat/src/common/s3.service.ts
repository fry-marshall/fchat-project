import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucketName: string;
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.SPACE_REGION || 'us-east-1',
      endpoint: process.env.SPACE_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.SPACE_ACCESS_KEY || '',
        secretAccessKey: process.env.SPACE_SECRET_KEY || '',
      },
    });
    this.bucketName = process.env.SPACE_NAME || '';
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      ACL: 'public-read',
      Bucket: this.bucketName,
      Key: `${folder}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return fileName;
  }

  async deleteFile(fileName: string, folder: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `${folder}/${fileName}`,
    });
    await this.s3Client.send(command);
  }
}
