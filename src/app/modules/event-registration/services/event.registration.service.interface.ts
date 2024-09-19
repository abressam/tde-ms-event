import { EventRegistration } from '@app/modules/event-registration/models/event.registration.model';
import { GetEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/get-event-registration-res.dto';
import { DeleteEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/delete-event-registration-res.dto';

export interface EventRegistrationServiceInterface {
  getAllUserEvents(userId: number): Promise<GetEventRegistrationResDto>;
  postUserToEvent(userId: number, eventId: number): Promise<EventRegistration>;
  deleteUserRegistration(userId: number, eventId: number): Promise<DeleteEventRegistrationResDto>
}
