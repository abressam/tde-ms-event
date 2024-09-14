import { DeleteEventResDto } from '@app/modules/event/dtos/responses/delete-event-res.dto';
import { GetEventResDto } from '@app/modules/event/dtos/responses/get-event-res.dto';
import { PostEventReqDto } from '@app/modules/event/dtos/requests/post-event-req.dto';
import { PutEventReqDto } from '@app/modules/event/dtos/requests/put-event-req.dto';

export interface EventServiceInterface {
  getEvent(): Promise<GetEventResDto>;
  postEvent(body: PostEventReqDto, isAdmin: boolean): Promise<GetEventResDto>;
  putEvent(body: PutEventReqDto, isAdmin: boolean): Promise<GetEventResDto>;
  deleteEvent(eventId: number, isAdmin: boolean): Promise<DeleteEventResDto>;
}
