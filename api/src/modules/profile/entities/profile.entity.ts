import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Skill } from 'src/modules/skills/entities/skill.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({ name: 'userId' })
  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @ManyToMany(() => Skill, (skill) => skill.profiles)
  skills?: Skill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
