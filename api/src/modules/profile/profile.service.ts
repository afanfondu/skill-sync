import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { SkillsService } from '../skills/skills.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly skillsService: SkillsService,
  ) {}

  async create(createProfileDto: CreateProfileDto, profilePicturePath: string) {
    const skills =
      createProfileDto.skillNames &&
      (await Promise.all(
        createProfileDto.skillNames.map((skill) =>
          this.skillsService.findOrCreate(skill),
        ),
      ));

    const profile = this.profileRepository.create({
      userId: createProfileDto.userId,
      bio: createProfileDto.bio,
      profilePicture: profilePicturePath,
      company: createProfileDto.company,
      website: createProfileDto.website,
      title: createProfileDto.title,
      hourlyRate: createProfileDto.hourlyRate,
      skills,
    });

    return this.profileRepository.save(profile);
  }
}
