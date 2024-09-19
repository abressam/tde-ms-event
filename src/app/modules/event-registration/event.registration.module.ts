import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EventRegistrationService } from '@app/modules/event-registration/services/event.registration.service';
import { EventRegistrationController } from '@app/modules/event-registration/controllers/event.registration.controller';
import { EventRegistration } from '@app/modules/event-registration/models/event.registration.model';

@Module({
  imports: [SequelizeModule.forFeature([EventRegistration])],
  providers: [EventRegistrationService],
  controllers: [EventRegistrationController],
})
export class EventRegistrationModule {}
