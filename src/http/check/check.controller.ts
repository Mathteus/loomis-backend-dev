import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('check')
export class CheckController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check() {
    return true;
  }
}
