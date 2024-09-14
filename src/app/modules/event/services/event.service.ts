import { EventServiceInterface } from '@app/modules/event/services/event.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeleteEventResDto } from '@app/modules/event/dtos/responses/delete-event-res.dto';
import { GetEventResDto } from '@app/modules/event/dtos/responses/get-event-res.dto';
import { PutEventReqDto } from '@app/modules/event/dtos/requests/put-event-req.dto';
import { PostEventReqDto } from '@app/modules/event/dtos/requests/post-event-req.dto';
import { EventDto } from '@app/modules/event/dtos/event.dto';
import { Event } from '@app/modules/event/models/event.model';

@Injectable()
export class EventService implements EventServiceInterface {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,
  ) {}

  async getEvent(): Promise<GetEventResDto> {
    const events = await this.eventModel.findAll();

    this.validateEvent(events[0]);

    return { 
      event: events.map((event) => {
        return event;
      })
     };
  }

  async postEvent(body: PostEventReqDto): Promise<GetEventResDto> {

    await this.checkEventExists(body.name);

    return { 
      event: [{
        name: body.name,
        eventDate: body.eventDate,
        location: body.location,
        description: body.description
      }]
    };
  }

  async putEvent(body: PutEventReqDto): Promise<GetEventResDto> {
    const eventOld = await this.eventModel.findByPk(body.id);
    this.validateEvent(eventOld);

    const eventNew = Object.assign({}, eventOld.dataValues, body);

    await this.eventModel.update(
      {
        name: eventNew.name,
        eventDate: eventNew.eventDate,
        location: eventNew.location,
        description: eventNew.description
      },
      {
        where: {
          id: body.id,
        },
      },
    );

    return {
      event: [{
        name: eventNew.name,
        eventDate: eventNew.eventDate,
        location: eventNew.location,
        description: eventNew.description
      }],
    };
  }

  async deleteEvent(eventId: number): Promise<DeleteEventResDto> {
    const event = await this.eventModel.findByPk(eventId);

    this.validateEvent(event);

    await event.destroy();

    return {
      statusCode: 200,
      message: 'Event successfully deleted',
    };
  }

  private validateEvent(event: EventDto) {
    if (!event) {
      throw new HttpException('No event found', HttpStatus.NOT_FOUND);
    }
  }

  private async checkEventExists(name: string) {
    const existingEvent = await this.eventModel.findOne({
      where: { name: name}
    })

    if (existingEvent) {
      throw new HttpException('Event alreay registered', HttpStatus.BAD_REQUEST);
    }
  }
}
