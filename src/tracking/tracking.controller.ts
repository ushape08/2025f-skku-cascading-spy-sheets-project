import { Controller, Get, Query, Res } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import express from 'express';
import type { GetImageQuery } from './dto/get-image-params.dto';

@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('/image')
  getTrackingPixel(
    @Query() getImageQuery: GetImageQuery,
    @Res() res: express.Response,
  ) {
    // TODO: store the values to somewhere
    const { id, os, client, extra } = getImageQuery;
    const now = Date.now();
    console.log(
      `[${id}] Image Request (id: ${id}, OS: ${os}, Client: ${client}, Extra: ${extra}, timestamp: ${now})`,
    );
    const image = this.trackingService.getImage('public/tracking.png');
    res.setHeader('Content-type', 'image/png');
    return res.status(200).send(image);
  }
}
