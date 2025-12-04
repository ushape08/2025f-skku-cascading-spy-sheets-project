import { Injectable, Res } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from 'src/mongo/schemas/tracking.schema';
import { Model } from 'mongoose';
import { GetImageQuery } from './dto/get-image-params.dto';

@Injectable()
export class TrackingService {
  private readonly ID_LENGTH = 16;
  constructor(
    @InjectModel(Tracking.name)
    private readonly trackingModel: Model<TrackingDocument>,
  ) {}

  getImage(imagePath: string): Buffer<ArrayBuffer> {
    const realImagePath = path.join(process.cwd(), imagePath);
    const image = fs.readFileSync(realImagePath);
    return image;
  }

  async recordTrackingLog(params: GetImageQuery) {
    const { id, os, client, font, isFontInstalled, extra } = params;
    return await this.trackingModel.insertOne({
      id,
      os,
      client,
      font,
      isFontInstalled,
      extra,
    });
  }

  generateRandomId(): string {
    return crypto
      .randomBytes(Math.ceil(this.ID_LENGTH / 2))
      .toString('hex')
      .slice(0, this.ID_LENGTH);
  }
}
