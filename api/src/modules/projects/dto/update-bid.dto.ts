import { IsEnum, IsNotEmpty } from 'class-validator';
import { BidStatus } from '../enums/bid-status.enum';

export class UpdateBidStatusDto {
  @IsNotEmpty()
  @IsEnum(BidStatus)
  status: BidStatus;
}
