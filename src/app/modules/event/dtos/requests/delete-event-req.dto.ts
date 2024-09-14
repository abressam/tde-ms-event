import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class DeleteEventReqDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}