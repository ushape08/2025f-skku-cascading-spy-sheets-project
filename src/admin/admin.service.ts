import { Injectable } from '@nestjs/common';
import { GetTrackingLogsParamsDto } from './dto/get-tracking-logs-params.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tracking, TrackingDocument } from '../mongo/schemas/tracking.schema';
import { FilterQuery, Model } from 'mongoose';
import { GetTrackingLogByIdResponseDto } from './dto/get-tracking-log-by-id-response.dto';
import { CompareTrackingLogsResponseDto } from './dto/compare-tracking-logs-response.dto';

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

  async compareTrackingLogs(
    id1: string,
    id2: string,
  ): Promise<CompareTrackingLogsResponseDto> {
    const tracking1 = await this.getTrakcingLogById(id1);
    const tracking2 = await this.getTrakcingLogById(id2);

    let total = 0,
      isSame = 0;
    /*
     * 값 비교 정책: 둘 중에 한 곳에만 정의된 값이면 별도 검증 없이 넘어가며, 둘 다 데이터가 있는 경우에만 값이 동등한지 비교한다.
     */

    if (tracking1.os && tracking2.os) {
      total++;
      if (tracking1.os === tracking2.os) isSame++;
    }
    if (tracking1.client && tracking2.client) {
      total++;
      if (tracking1.client === tracking2.client) isSame++;
    }
    tracking1.fonts.forEach(({ font, isInstalled }) => {
      // O(n) linear search라 조금 비효율적이긴 한데, 실험용으로 구현한 것이니 나중에 성능이 이슈가 될 때 개선할 것
      const matchedFont = tracking2.fonts.find(
        ({ font: font2 }) => font === font2,
      );
      if (matchedFont) {
        total++;
        if (isInstalled === matchedFont.isInstalled) isSame++;
      }
    });
    if (tracking1.extra && tracking2.extra) {
      total++;
      if (tracking1.extra === tracking2.extra) isSame++;
    }

    return {
      similarity: total ? isSame / total : null,
      tracking1,
      tracking2,
    };
  }
}
