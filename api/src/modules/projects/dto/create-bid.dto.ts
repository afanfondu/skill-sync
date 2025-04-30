import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateBidDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  deliveryDays: number;

  @IsNotEmpty()
  @IsString()
  proposal: string;

  @IsNotEmpty()
  @IsString()
  projectId: string;
}
