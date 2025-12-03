import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class PageController {
  @Get('/example')
  @Render('example')
  getExampleHandlebars() {
    return { title: 'Title', message: 'Hello, world!' };
  }
}
