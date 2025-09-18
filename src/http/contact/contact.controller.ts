import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '@/decorators/curent-user.decorator';
import { IJwtPayload } from '@/common/jwt/jwt.service';
import {
  CreateContact,
  DeleteContact,
  GetContactsByFilterDto,
  UpdateContact,
} from '@/application/dto/contacts';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createContact(
    @CurrentUser() user: IJwtPayload,
    @Body() contact: CreateContact,
    @Query('page') page: number,
  ) {
    return await this.contactService.createContact({
      contact,
      accountId: user.sub,
      page,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getContactsByAccount(
    @CurrentUser() user: IJwtPayload,
    @Query('page') page: number,
  ) {
    return await this.contactService.getContactsByAccount({
      accountId: user.sub,
      page,
    });
  }

  @Get('/employees')
  @UseGuards(AuthGuard)
  async getContactEmployees() {
    return await this.contactService.getContactEmployees();
  }

  @Get(':contactId')
  @UseGuards(AuthGuard)
  async getContactById(
    @Param('contactId') contactId: string,
    @Query('page') page: number,
  ) {
    return await this.contactService.getContactById({
      contactId,
      page,
    });
  }

  @Patch(':contactId')
  @UseGuards(AuthGuard)
  async updateContact(
    @CurrentUser() user: IJwtPayload,
    @Param('contactId') contactId: string,
    @Body() body: UpdateContact,
    @Query('page') page: number,
  ) {
    return await this.contactService.updateContact({
      contactId,
      toUpdate: body,
      accountId: user.sub,
      page,
    });
  }

  @Delete(':contactId')
  @UseGuards(AuthGuard)
  async deleteContact(
    @CurrentUser() user: IJwtPayload,
    @Param('contactId') contactId: string,
    @Body() body?: DeleteContact,
  ) {
    return await this.contactService.deleteContact({
      contactId,
      accountId: body?.accountId,
      jwtId: user.sub,
    });
  }

  @Get('/filter')
  @UseGuards(AuthGuard)
  async getContactsByFilter(
    @CurrentUser() user: IJwtPayload,
    @Body() body: GetContactsByFilterDto,
    @Query('page') page: number,
  ) {
    return await this.contactService.getContactsByFilter({
      accountId: user.sub,
      query: body.query,
      page,
    });
  }
}
