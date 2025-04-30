import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtUserPayload } from '../auth/types/jwt-user-payload';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.messagesService.createMessage(createMessageDto, user.sub);
  }

  @Get('project/:projectId')
  findProjectMessages(
    @Param('projectId') projectId: string,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.messagesService.findProjectMessages(projectId, user.sub);
  }

  @Get('unread')
  findUnreadCount(@CurrentUser() user: User) {
    return this.messagesService.findUnreadCount(user.id);
  }

  @Get('my-messages')
  findMyMessages(@CurrentUser() user: User) {
    return this.messagesService.findUserMessages(user.id);
  }

  @Post('project/:projectId/mark-all-read')
  markAllAsRead(
    @Param('projectId') projectId: string,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.messagesService.markAllAsRead(projectId, user.sub);
  }
}
