import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from 'src/modules/users/enums/user-role.enum';

export class CreateProfileDto {
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.role === UserRole.Client)
  company?: string;

  @IsOptional()
  @IsUrl()
  @ValidateIf((o) => o.role === UserRole.Client)
  website?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => o.role === UserRole.Freelancer)
  title?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ValidateIf((o) => o.role === UserRole.Freelancer)
  hourlyRate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ValidateIf((o) => o.role === UserRole.Freelancer)
  skillNames?: string[];

  @IsString()
  role: UserRole;
}
