import { Injectable } from '@nestjs/common';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from '../mongo/schemas/tracking.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetTrackingLogByIdResponseDto } from './dto/get-tracking-log-by-id-response.dto';

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

  async getTrakcingLogById(id: string): Promise<GetTrackingLogByIdResponseDto> {
    const trackingLog = new GetTrackingLogByIdResponseDto(id);
    const results = await this.trackingModel
      .find({ id })
      .sort({ createdAt: 1 });

    // 해당 id에 대한 tracking log를 시간 순으로 조회하면서 가장 나중에 쌓인 데이터가 이전 데이터를 덮어쓰도록 함
    results.forEach(({ os, client, font, isFontInstalled, extra }) => {
      if (os) trackingLog.os = os;
      if (client) trackingLog.client = client;
      if (font && isFontInstalled !== undefined) {
        trackingLog.fonts.push({ font, isInstalled: isFontInstalled });
      }
      if (extra) trackingLog.extra = extra;
    });

    return trackingLog;
  }
}
