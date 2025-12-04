import { Injectable } from '@nestjs/common';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from '../mongo/schemas/tracking.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Tracking.name)
    private readonly trackingModel: Model<TrackingDocument>,
  ) {}
  async getTrackingLogs(params: GetTrackingLogsParamsDto) {
    const { id, os, client, font, isFontInstalled, from, to, extra } = params;

    const filter: FilterQuery<TrackingDocument> = {};

    if (id) filter.id = id;
    if (os) filter.os = os;
    if (client) filter.client = client;
    if (font) filter.font = font;
    if (isFontInstalled) filter.isFontInstalled = isFontInstalled;
    if (extra) filter.extra = extra;

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const results = await this.trackingModel.find(filter);

    return {
      total: results.length,
      results,
    };
  }
}
