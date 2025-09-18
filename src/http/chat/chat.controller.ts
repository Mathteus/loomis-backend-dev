// import {
//   Controller,
//   Get,
//   UseGuards,
//   Query,
//   Post,
//   Body,
//   Delete,
//   Param,
//   Put,
// } from '@nestjs/common';
// import { AuthGuard } from '@/http/auth/auth.guard';
// import { Access } from '@/decorators/access.decorator';
// import { ChatService } from './chat.service';

// @Controller('chat')
// export class ChatController {
//   constructor(private readonly service: ChatService) {}

//   @UseGuards(AuthGuard)
//   @Access('contacts', 'READ')
//   @Get('/contacts')
//   getContacts(@Query('accountId') accountId: string) {
//     return this.service.getContacts(accountId);
//   }

//   @UseGuards(AuthGuard)
//   @Access('conversation', 'READ')
//   @Get('/conversations')
//   getConversations(@Query('accountId') accountId: string) {
//     return this.service.getConversations(accountId);
//   }

//   @UseGuards(AuthGuard)
//   @Access('message', 'CREATE')
//   @Post('/message')
//   sendMessage(
//     @Body()
//     body: {
//       senderId: string;
//       receiverId: string;
//       contentType: string;
//       contentData: string;
//     },
//   ) {
//     return this.service.sendMessage(body);
//   }

//   @UseGuards(AuthGuard)
//   @Access('message', 'READ')
//   @Get('/messages')
//   getMessages(@Query('userId') userId: string, @Query('with') withId: string) {
//     return this.service.getMessagesBetween(userId, withId);
//   }

//   @UseGuards(AuthGuard)
//   @Access('scheduledmessage', 'CREATE')
//   @Post('/scheduled')
//   createScheduled(
//     @Body()
//     body: {
//       senderId: string;
//       receiverId: string;
//       contentType: string;
//       contentData: string;
//       scheduleAt: string;
//     },
//   ) {
//     return this.service.createScheduledMessage({
//       senderId: body.senderId,
//       receiverId: body.receiverId,
//       contentType: body.contentType,
//       contentData: body.contentData,
//       scheduleAt: new Date(body.scheduleAt),
//     });
//   }

//   @UseGuards(AuthGuard)
//   @Access('scheduledmessage', 'DELETE')
//   @Delete('/scheduled/:id')
//   deleteScheduled(@Param('id') id: string) {
//     return this.service.deleteScheduledMessage(id);
//   }

//   @UseGuards(AuthGuard)
//   @Access('quickmessage', 'CREATE')
//   @Post('/quick')
//   createQuick(
//     @Body()
//     body: {
//       accountId: string;
//       title?: string;
//       contentType: string;
//       contentData: string;
//     },
//   ) {
//     return this.service.createQuickMessage(body);
//   }

//   @UseGuards(AuthGuard)
//   @Access('quickmessage', 'READ')
//   @Get('/quick')
//   getQuick(@Query('accountId') accountId: string) {
//     return this.service.getQuickMessages(accountId);
//   }

//   // Contacts - CRUD and helpers
//   @UseGuards(AuthGuard)
//   @Access('contacts', 'CREATE')
//   @Post('/contacts')
//   createContact(
//     @Body()
//     body: {
//       accountId: string;
//       username: string;
//       avatar?: string;
//       phone: string;
//       email: string;
//       document_rg: string;
//       document_cpf: string;
//       birthday: string;
//       genere: 'MASCULINE' | 'FEMININE';
//       city: string;
//       state: string;
//       role?: 'CLIENT' | 'COLLABORATOR';
//     },
//   ) {
//     return this.service.createContact(body);
//   }

//   @UseGuards(AuthGuard)
//   @Access('contacts', 'UPDATE')
//   @Put('/contacts/:id')
//   updateContact(
//     @Param('id') id: string,
//     @Body()
//     body: {
//       username: string;
//       avatar?: string;
//       phone: string;
//       email: string;
//       document_rg: string;
//       document_cpf: string;
//       birthday: string;
//       genere: 'MASCULINE' | 'FEMININE';
//       city: string;
//       state: string;
//       role?: 'CLIENT' | 'COLLABORATOR';
//     },
//   ) {
//     return this.service.updateContact(id, body);
//   }

//   @UseGuards(AuthGuard)
//   @Access('contacts', 'DELETE')
//   @Delete('/contacts/:id')
//   deleteContact(@Param('id') id: string) {
//     return this.service.deleteContact(id);
//   }

//   @UseGuards(AuthGuard)
//   @Access('contacts', 'READ')
//   @Get('/contacts/records')
//   getContactsRecords(@Query('accountId') accountId: string) {
//     return this.service.getContactsRecordsByAccount(accountId);
//   }

//   @UseGuards(AuthGuard)
//   @Access('contacts', 'READ')
//   @Get('/contacts/filter')
//   filterContacts(
//     @Query('accountId') accountId: string,
//     @Query('q') q?: string,
//   ) {
//     return this.service.filterContactsByAccount(accountId, q);
//   }

//   @UseGuards(AuthGuard)
//   @Access('contacts', 'READ')
//   @Get('/contacts/:id')
//   getContactById(@Param('id') id: string) {
//     return this.service.getContactById(id);
//   }
// }
