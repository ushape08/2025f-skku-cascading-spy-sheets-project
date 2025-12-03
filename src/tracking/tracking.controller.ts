import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import express from 'express';
import type { GetImageQuery } from './dto/get-image-params.dto';

@Controller()
export class TrackingController {
  constructor(private readonly imageService: TrackingService) {}

  @Get('/image')
  getTrackingPixel(
    @Req() getImageQuery: GetImageQuery,
    @Res() res: express.Response,
  ) {
    // TODO: store the values to somewhere
    const { id, os, client } = getImageQuery;
    const image = this.imageService.getImage('public/tracking.png');
    res.setHeader('Content-type', 'image/png');
    return res.status(200).send(image);
  }
}
