import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TrackingService } from 'src/tracking/tracking.service';

@Controller()
export class PageController {
  private readonly serverDomain;
  constructor(
    private readonly trackingService: TrackingService,
    private readonly configService: ConfigService,
  ) {
    this.serverDomain = this.configService.get('SERVER_DOMAIN');
  }
  @Get('/example')
  @Render('example')
  getExampleHandlebars() {
    return { title: 'Title', message: 'Hello, world!' };
  }

  @Get('/poc-chrome')
  @Render('poc-chrome')
  getPocChrome() {
    const id = this.trackingService.generateRandomId();
    return { id, serverDomain: this.serverDomain };
  }
}
