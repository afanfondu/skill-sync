import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) {}

  async findOrCreate(skillName: string): Promise<Skill> {
    const existingSkill = await this.skillsRepository.findOneBy({
      name: skillName,
    });
    if (existingSkill) return existingSkill;

    const skill = this.skillsRepository.create({ name: skillName });
    return this.skillsRepository.save(skill);
  }
}
