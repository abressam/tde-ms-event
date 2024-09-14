import { DeleteEventResDto } from '@app/modules/event/dtos/responses/delete-event-res.dto';
import { GetEventResDto } from '@app/modules/event/dtos/responses/get-event-res.dto'; 
import { PostEventReqDto } from '@app/modules/event/dtos/requests/post-event-req.dto';
import { DeleteEventReqDto } from '@app/modules/event/dtos/requests/delete-event-req.dto';
import { PutEventReqDto } from '@app/modules/event/dtos/requests/put-event-req.dto';

export interface EventControllerInterface {
    getEvent(): Promise<GetEventResDto>;
    postEvent(body: PostEventReqDto,): Promise<GetEventResDto>;
    putEvent(body: PutEventReqDto): Promise<GetEventResDto>;
    deleteEvent(params: DeleteEventReqDto): Promise<DeleteEventResDto>;
}