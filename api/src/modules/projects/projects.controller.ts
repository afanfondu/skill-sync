import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { UpdateBidStatusDto } from './dto/update-bid.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { JwtUserPayload } from '../auth/types/jwt-user-payload';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.Client)
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectsService.createProject(createProjectDto, user);
  }

  @Get()
  findAll() {
    return this.projectsService.findAllProjects();
  }

  @Get('client')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Client)
  findClientProjects(@CurrentUser() user: JwtUserPayload) {
    return this.projectsService.findProjectsByClientId(user.sub);
  }

  @Get('freelancer')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Freelancer)
  findFreelancerProjects(@CurrentUser() user: JwtUserPayload) {
    return this.projectsService.findProjectsByFreelancerId(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findProjectById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Client)
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto, user.sub);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Client)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: JwtUserPayload) {
    return this.projectsService.deleteProject(id, user.sub);
  }

  @Post('bids')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Freelancer)
  createBid(
    @Body() createBidDto: CreateBidDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectsService.createBid(createBidDto, user);
  }

  @Get(':id/bids')
  findBidsByProject(@Param('id') id: string) {
    return this.projectsService.findBidsByProjectId(id);
  }

  @Get('bids/freelancer')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Freelancer)
  findFreelancerBids(@CurrentUser() user: JwtUserPayload) {
    return this.projectsService.findBidsByFreelancerId(user.sub);
  }

  @Patch('bids/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.Client)
  updateBidStatus(
    @Param('id') id: string,
    @Body() updateBidStatusDto: UpdateBidStatusDto,
    @CurrentUser() user: JwtUserPayload,
  ) {
    return this.projectsService.updateBidStatus(
      id,
      updateBidStatusDto,
      user.sub,
    );
  }
}
