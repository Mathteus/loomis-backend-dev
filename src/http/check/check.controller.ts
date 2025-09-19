import { Public } from '@/decorators/public.decorator';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('check')
export class CheckController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @Public()
  check() {
    return true;
  }
}
