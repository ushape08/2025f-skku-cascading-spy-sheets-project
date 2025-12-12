import { Controller, Get, Query, Res } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import express from 'express';
import type { GetImageQuery } from './dto/get-image-params.dto';

@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('/image')
  async getTrackingPixel(
    @Query() getImageQuery: GetImageQuery,
    @Res() res: express.Response,
  ) {
    const { id, os, client } = getImageQuery;
    const now = Date.now();
    console.log(
      `[${id}] Image Request (timestamp: ${now}, ${JSON.stringify(getImageQuery)})`,
    );
    // id, os, client 모두 갖춰야만 기록
    if (id && os && client)
      await this.trackingService.recordTrackingLog(getImageQuery);

    const image = this.trackingService.getImage('public/tracking.png');
    res.setHeader('Content-type', 'image/png');
    return res.status(200).send(image);
  }
}
