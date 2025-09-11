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
import { Access } from '@/decorators/access.decorator';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @UseGuards(AuthGuard)
  @Access('contacts', 'READ')
  @Get('/contacts')
  getContacts(@Query('accountId') accountId: string) {
    return this.service.getContacts(accountId);
  }

  @UseGuards(AuthGuard)
  @Access('conversation', 'READ')
  @Get('/conversations')
  getConversations(@Query('accountId') accountId: string) {
    return this.service.getConversations(accountId);
  }

  @UseGuards(AuthGuard)
  @Access('message', 'CREATE')
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
  @Access('message', 'READ')
  @Get('/messages')
  getMessages(
    @Query('userId') userId: string,
    @Query('with') withId: string,
  ) {
    return this.service.getMessagesBetween(userId, withId);
  }

  @UseGuards(AuthGuard)
  @Access('scheduledmessage', 'CREATE')
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
  @Access('scheduledmessage', 'DELETE')
  @Delete('/scheduled/:id')
  deleteScheduled(@Param('id') id: string) {
    return this.service.deleteScheduledMessage(id);
  }

  @UseGuards(AuthGuard)
  @Access('quickmessage', 'CREATE')
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
  @Access('quickmessage', 'READ')
  @Get('/quick')
  getQuick(@Query('accountId') accountId: string) {
    return this.service.getQuickMessages(accountId);
  }
}
