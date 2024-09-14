import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { EventDto } from '@app/modules/event/dtos/event.dto';

export class GetEventResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
  event: EventDto[];
}
