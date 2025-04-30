import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { Project } from 'src/modules/projects/entities/project.entity';
import { Bid } from 'src/modules/projects/entities/bid.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import { File } from 'src/modules/files/entities/file.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  role: UserRole;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Project, (project) => project.client)
  clientProjects: Project[];

  @OneToMany(() => Project, (project) => project.freelancer)
  assignedProjects: Project[];

  @OneToMany(() => Bid, (bid) => bid.freelancer)
  bids: Bid[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => File, (file) => file.uploader)
  uploadedFiles: File[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
