import { Injectable, Res } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import express from 'express';

@Injectable()
export class ImageService {
  getImage(imagePath: string): Buffer<ArrayBuffer> {
    const realImagePath = path.join(process.cwd(), imagePath);
    const image = fs.readFileSync(realImagePath);
    return image;
  }
}
