import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Bid } from './bid.entity';
import { ProjectStatus } from '../enums/project-status.enum';
import { Message } from 'src/modules/messages/entities/message.entity';
import { File } from 'src/modules/files/entities/file.entity';
import { Milestone } from 'src/modules/milestones/entities/milestone.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column()
  category: string;

  @Column({ type: 'date' })
  deadline: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.OPEN,
  })
  status: ProjectStatus;

  @ManyToOne(() => User, (user) => user.clientProjects)
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column()
  clientId: string;

  @ManyToOne(() => User, (user) => user.assignedProjects, { nullable: true })
  @JoinColumn({ name: 'freelancerId' })
  freelancer: User;

  @Column({ nullable: true })
  freelancerId?: string;

  @OneToMany(() => Bid, (bid) => bid.project)
  bids: Bid[];

  @OneToMany(() => Message, (message) => message.project)
  messages: Message[];

  @OneToMany(() => File, (file) => file.project)
  files: File[];

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
