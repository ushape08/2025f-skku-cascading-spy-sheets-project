import { Injectable, Res } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class TrackingService {
  private readonly ID_LENGTH = 16;

  getImage(imagePath: string): Buffer<ArrayBuffer> {
    const realImagePath = path.join(process.cwd(), imagePath);
    const image = fs.readFileSync(realImagePath);
    return image;
  }

  generateRandomId(): string {
    return crypto
      .randomBytes(Math.ceil(this.ID_LENGTH / 2))
      .toString('hex')
      .slice(0, this.ID_LENGTH);
  }
}
