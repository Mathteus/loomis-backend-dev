import {
  Controller,
  Get,
  UseGuards,
  Query,
  Post,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@/http/auth/auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @UseGuards(AuthGuard)
  @Get('/contacts')
  getContacts(@Query('accountId') accountId: string) {
    return this.service.getContacts(accountId);
  }

  @UseGuards(AuthGuard)
  @Get('/conversations')
  getConversations(@Query('accountId') accountId: string) {
    return this.service.getConversations(accountId);
  }

  @UseGuards(AuthGuard)
  @Post('/message')
  sendMessage(
    @Body()
    body: {
      senderId: string;
      receiverId: string;
      contentType: string;
      contentData: string;
    },
  ) {
    return this.service.sendMessage(body);
  }

  @UseGuards(AuthGuard)
  @Get('/messages')
  getMessages(
    @Query('userId') userId: string,
    @Query('with') withId: string,
  ) {
    return this.service.getMessagesBetween(userId, withId);
  }

  @UseGuards(AuthGuard)
  @Post('/scheduled')
  createScheduled(
    @Body()
    body: {
      senderId: string;
      receiverId: string;
      contentType: string;
      contentData: string;
      scheduleAt: string;
    },
  ) {
    return this.service.createScheduledMessage({
      senderId: body.senderId,
      receiverId: body.receiverId,
      contentType: body.contentType,
      contentData: body.contentData,
      scheduleAt: new Date(body.scheduleAt),
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/scheduled/:id')
  deleteScheduled(@Param('id') id: string) {
    return this.service.deleteScheduledMessage(id);
  }

  @UseGuards(AuthGuard)
  @Post('/quick')
  createQuick(
    @Body()
    body: {
      accountId: string;
      title?: string;
      contentType: string;
      contentData: string;
    },
  ) {
    return this.service.createQuickMessage(body);
  }

  @UseGuards(AuthGuard)
  @Get('/quick')
  getQuick(@Query('accountId') accountId: string) {
    return this.service.getQuickMessages(accountId);
  }
}
