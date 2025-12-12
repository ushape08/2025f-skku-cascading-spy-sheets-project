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

    /*
     * 사용자 환경에 대한 CSS-based conditional image loading은 브라우저/OS 등에 맞춰서 동작하기 때문에,
     * 브라우저나 OS가 달라지면 해당 조건 판단이 동작하지 않아 특정 조건은 true/false가 다 올 수도 있음. 이런 경우는 해당 브라우저/OS가 아니라고 판단하고 넘겨야 함
     *
     * 1. 서버에서 mongoDB에서 특정 id로 된 tracking log를 모두 조회
     * 2. client를 기준으로 os 종류가 2개 이상 조회되는 client는 후보에서 제외하고, os가 하나인 client만 남김
     * 3. 필터링 결과가 여러 개라면, 이 중에 가장 최신인 데이터를 따름
     */

    const results = await this.trackingModel
      .find({ id })
      .sort({ createdAt: 1 });

    // 2번 필터링을 위한 코드
    const osGroupedByClient: Map<string, string[]> = new Map();

    results.forEach(({ os, client }) => {
      if (os && client) {
        if (!osGroupedByClient.has(client)) osGroupedByClient.set(client, []);
        const osList = osGroupedByClient.get(client)!;
        // 특정 client 조건에 대해 OS 목록을 조회함 => 2개 이상 있으면 해당 client는 아닐거라는 증거
        if (!osList.find((o) => o === os)) osList.push(os);
      }
    });

    // JavaScript에서 Map은 insertion order대로 key를 순회할 수 있으므로, 가장 마지막에 확인한 게 가장 최근임이 보장됨
    osGroupedByClient.forEach((osList, client) => {
      if (osList.length === 1) {
        trackingLog.client = client;
        trackingLog.os = osList[0];
      }
    });

    // 특정된 os-client에 대해서 font, extra 정보를 취합
    results
      .filter(
        ({ os, client }) =>
          trackingLog.os === os && trackingLog.client === client,
      )
      .forEach(({ font, isFontInstalled, extra }) => {
        if (font && isFontInstalled != undefined) {
          // O(n^2)
          const matchedFontLog = trackingLog.fonts.find(
            ({ font: f }) => f === font,
          );
          // 만약 한 font에 대해서 여러 기록이 있으면, 가장 최근 데이터가 덮어쓰도록 처리함
          if (matchedFontLog) matchedFontLog.isInstalled = isFontInstalled;
          else trackingLog.fonts.push({ font, isInstalled: isFontInstalled });
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
