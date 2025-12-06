import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TrackingService } from '../tracking/tracking.service';

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

  @Get('/font-test')
  @Render('font-test')
  getFontTest() {
    const id = this.trackingService.generateRandomId();
    return { id, serverDomain: this.serverDomain };
  }

  @Get('/my-browser-test')
  @Render('my-browser-test')
  getMyBrowserTest() {
    const id = this.trackingService.generateRandomId();
    return { id, serverDomain: this.serverDomain };
  }

  @Get('/my-os-test')
  @Render('my-os-test')
  getMyOsTest() {
    const id = this.trackingService.generateRandomId();
    return { id, serverDomain: this.serverDomain };
  }
}
