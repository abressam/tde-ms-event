import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from '@app/modules/event/models/event.model';
import { EventService } from '@app/modules/event/services/event.service';
import { EventController } from '@app/modules/event/controllers/event.controller';

@Module({
  imports: [SequelizeModule.forFeature([Event])],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
