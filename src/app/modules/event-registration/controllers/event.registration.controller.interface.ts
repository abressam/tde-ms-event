import { EventRegistrationDto } from '@app/modules/event-registration/dtos/event.registration.dto';
import { EventRegistration } from '@app/modules/event-registration/models/event.registration.model';
import { GetEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/get-event-registration-res.dto';
import { DeleteEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/delete-event-registration-res.dto';

export interface EventRegistrationControllerInterface {
  getAllUserEvents(req: Request): Promise<GetEventRegistrationResDto>;
  postUserToEvent(body: EventRegistrationDto): Promise<EventRegistration>;
  deleteUserRegistration(body: EventRegistrationDto): Promise<DeleteEventRegistrationResDto>
}
