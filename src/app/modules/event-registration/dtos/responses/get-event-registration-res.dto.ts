import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject } from 'class-validator';
import { EventRegistrationDto } from '@app/modules/event-registration/dtos/event.registration.dto';

export class GetEventRegistrationResDto {
  @ApiProperty()
  @IsNotEmptyObject({ nullable: false })
  eventRegister: EventRegistrationDto[];
}
