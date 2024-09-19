import { EventRegistrationServiceInterface } from '@app/modules/event-registration/services/event.registration.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventRegistrationDto } from '@app/modules/event-registration/dtos/event.registration.dto';
import { EventRegistration } from '@app/modules/event-registration/model/event.registration.model';
import { GetEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/get-event-registration-res.dto';
import { DeleteEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/delete-event-registration-res.dto';
import { User } from '@app/modules/user/models/user.model';
import { Event } from '@app/modules/event/models/event.model';

@Injectable()
export class EventRegistrationService implements EventRegistrationServiceInterface {
  constructor(
    @InjectModel(EventRegistration)
    private eventRegistrationModel: typeof EventRegistration,
  ) {}

  async getAllUserEvents(userId: number): Promise<GetEventRegistrationResDto> {
    const userEvents = await this.eventRegistrationModel.findAll(
        { where: { userId: userId } }
    );

    this.validateEvent(userEvents[0]);

    return { 
        eventRegister: userEvents.map((events) => {
          return events;
        })
    };
  }

  async postUserToEvent(userId: number, eventId: number): Promise<EventRegistration> {
    const user = await User.findByPk(userId);
    const event = await Event.findByPk(eventId);

    if (!user || !event) {
        throw new Error('User or Event not found');
    }

    const registration = await this.eventRegistrationModel.create({
        userId,
        eventId,
    });

    return registration;
  }

  async deleteUserRegistration(userId: number, eventId: number): Promise<DeleteEventRegistrationResDto> {
    const registration = await this.eventRegistrationModel.findOne({
        where: { userId, eventId },
      });
  
    if (!registration) {
    throw new Error('Registration not found');
    }

    await registration.destroy();

    return {
      statusCode: 200,
      message: 'User successfully deleted',
    };
  }

  private validateEvent(event: EventRegistrationDto) {
    if (!event) {
      throw new HttpException('No event found', HttpStatus.NOT_FOUND);
    }
  }

}
