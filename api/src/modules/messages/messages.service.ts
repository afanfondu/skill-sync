import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private projectsService: ProjectsService,
  ) {}

  async createMessage(dto: CreateMessageDto, userId: string): Promise<Message> {
    const project = await this.projectsService.findProjectById(dto.projectId);

    if (project.clientId !== userId && project.freelancerId !== userId) {
      throw new ForbiddenException('You are not part of this project');
    }

    if (
      project.clientId !== dto.receiverId &&
      project.freelancerId !== dto.receiverId
    ) {
      throw new ForbiddenException('Receiver is not part of this project');
    }

    const message = this.messageRepository.create({
      ...dto,
      senderId: userId,
    });

    return this.messageRepository.save(message);
  }

  async findProjectMessages(
    projectId: string,
    userId: string,
  ): Promise<Message[]> {
    const project = await this.projectsService.findProjectById(projectId);

    if (project.clientId !== userId && project.freelancerId !== userId) {
      throw new ForbiddenException('You are not part of this project');
    }

    return this.messageRepository.find({
      where: { projectId },
      relations: ['sender', 'receiver'],
      order: { createdAt: 'ASC' },
    });
  }

  async findUserMessages(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: [{ senderId: userId }, { receiverId: userId }],
      relations: ['sender', 'receiver', 'project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadCount(userId: string): Promise<number> {
    return this.messageRepository.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver', 'project'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async markAllAsRead(projectId: string, userId: string): Promise<void> {
    const project = await this.projectsService.findProjectById(projectId);

    if (project.clientId !== userId && project.freelancerId !== userId) {
      throw new ForbiddenException('You are not part of this project');
    }

    await this.messageRepository.update(
      { projectId, receiverId: userId, read: false },
      { read: true },
    );
  }
}
