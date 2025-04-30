import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { Bid } from './entities/bid.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidStatusDto } from './dto/update-bid.dto';
import { BidStatus } from './enums/bid-status.enum';
import { ProjectStatus } from './enums/project-status.enum';
import { UserRole } from '../users/enums/user-role.enum';
import { JwtUserPayload } from '../auth/types/jwt-user-payload';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(Bid) private bidRepository: Repository<Bid>,
  ) {}

  async createProject(
    dto: CreateProjectDto,
    user: JwtUserPayload,
  ): Promise<Project> {
    if (user.role !== UserRole.Client)
      throw new ForbiddenException('Only clients can create projects');

    const project = this.projectRepository.create({
      ...dto,
      clientId: user.sub,
    });

    return this.projectRepository.save(project);
  }

  async findAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['client', 'freelancer', 'bids', 'bids.freelancer'],
    });
  }

  async findProjectsByClientId(clientId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { clientId },
      relations: ['bids', 'bids.freelancer', 'freelancer'],
    });
  }

  async findProjectsByFreelancerId(freelancerId: string): Promise<Project[]> {
    return this.projectRepository.find({
      where: { freelancerId },
      relations: ['client', 'milestones'],
    });
  }

  async findProjectById(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'freelancer', 'bids', 'bids.freelancer'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async updateProject(
    id: string,
    dto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.findProjectById(id);

    if (project.clientId !== userId) {
      throw new ForbiddenException('You can only update your own projects');
    }

    if (dto.freelancerId && project.status === ProjectStatus.OPEN) {
      dto.status = ProjectStatus.IN_PROGRESS;

      await this.bidRepository.update(
        { projectId: id, freelancerId: dto.freelancerId },
        { status: BidStatus.ACCEPTED },
      );

      await this.bidRepository.update(
        {
          projectId: id,
          freelancerId: dto.freelancerId,
          status: BidStatus.PENDING,
        },
        { status: BidStatus.REJECTED },
      );
    }

    await this.projectRepository.update(id, dto);
    return this.findProjectById(id);
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const project = await this.findProjectById(id);

    if (project.clientId !== userId) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    if (project.status !== ProjectStatus.OPEN) {
      throw new ForbiddenException(
        'Cannot delete a project that is in progress or completed',
      );
    }

    await this.projectRepository.delete(id);
  }

  async createBid(dto: CreateBidDto, user: JwtUserPayload): Promise<Bid> {
    if (user.role !== UserRole.Freelancer) {
      throw new ForbiddenException('Only freelancers can create bids');
    }

    const project = await this.findProjectById(dto.projectId);

    if (project.status !== ProjectStatus.OPEN) {
      throw new ForbiddenException('Cannot bid on a closed project');
    }

    const existingBid = await this.bidRepository.findOne({
      where: { projectId: dto.projectId, freelancerId: user.sub },
    });

    if (existingBid) {
      throw new ForbiddenException(
        'You have already placed a bid on this project',
      );
    }

    const bid = this.bidRepository.create({
      ...dto,
      freelancerId: user.sub,
      project,
    });

    return this.bidRepository.save(bid);
  }

  async findBidsByProjectId(projectId: string): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { projectId },
      relations: ['freelancer'],
    });
  }

  async findBidsByFreelancerId(freelancerId: string): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { freelancerId },
      relations: ['project'],
    });
  }

  async findBidById(id: string): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['freelancer', 'project'],
    });

    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }

    return bid;
  }

  async updateBidStatus(
    id: string,
    dto: UpdateBidStatusDto,
    userId: string,
  ): Promise<Bid> {
    const bid = await this.findBidById(id);
    const project = await this.findProjectById(bid.projectId);

    if (project.clientId !== userId) {
      throw new ForbiddenException(
        'Only the project client can update bid status',
      );
    }

    if (dto.status === BidStatus.ACCEPTED) {
      const acceptedBid = await this.bidRepository.findOne({
        where: { projectId: bid.projectId, status: BidStatus.ACCEPTED },
      });

      if (acceptedBid) {
        throw new ForbiddenException(
          'This project already has an accepted bid',
        );
      }

      await this.projectRepository.update(bid.projectId, {
        freelancerId: bid.freelancerId,
        status: ProjectStatus.IN_PROGRESS,
      });

      await this.bidRepository.update(
        { projectId: bid.projectId, id: id, status: BidStatus.PENDING },
        { status: BidStatus.REJECTED },
      );
    }

    await this.bidRepository.update(id, { status: dto.status });
    return this.findBidById(id);
  }
}
