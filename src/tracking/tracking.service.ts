import { Injectable, Res } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';

@Injectable()
export class TrackingService {
  getImage(imagePath: string): Buffer<ArrayBuffer> {
    const realImagePath = path.join(process.cwd(), imagePath);
    const image = fs.readFileSync(realImagePath);
    return image;
  }
}
