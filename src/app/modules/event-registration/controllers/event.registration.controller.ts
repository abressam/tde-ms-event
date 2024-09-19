import { EventRegistrationService } from '@app/modules/event-registration/services/event.registration.service';
import { EventRegistrationControllerInterface } from '@app/modules/event-registration/controllers/event.registration.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { EventRegistrationDto } from '@app/modules/event-registration/dtos/event.registration.dto';
import { EventRegistration } from '@app/modules/event-registration/models/event.registration.model';
import { GetEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/get-event-registration-res.dto';
import { DeleteEventRegistrationResDto } from '@app/modules/event-registration/dtos/responses/delete-event-registration-res.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Delete,
  Request,
  Body,
  HttpCode,
  HttpException,
  Logger,
} from '@nestjs/common';

@ApiTags('event-registration')
@Controller('event-registration')
export class EventRegistrationController implements EventRegistrationControllerInterface {
  constructor(private readonly eventRegistrationService: EventRegistrationService) {}

  @Get('get')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get the event registration data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the event registration data',
    type: GetEventRegistrationResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getAllUserEvents(@Request() req: Request) {
    const logger = new Logger(EventRegistrationController.name);

    try {
      const userId = req['userId'];
      logger.log('getAllUserEvents()');
      return await this.eventRegistrationService.getAllUserEvents(userId);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Post('post')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Post the event registration data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the event registration data',
    type: EventRegistration,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postUserToEvent(@Body() body: EventRegistrationDto) {
    const logger = new Logger(EventRegistrationController.name);

    try {
      const { userId, eventId } = body;
      logger.log('postUserToEvent()');
      return await this.eventRegistrationService.postUserToEvent(userId, eventId);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Delete the event registration data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the event registration status',
    type: DeleteEventRegistrationResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async deleteUserRegistration(@Body() body: EventRegistrationDto) {
    const logger = new Logger(EventRegistrationController.name);

    try {
      const { userId, eventId } = body;
      logger.log('deleteUserRegistration()');
      return await this.eventRegistrationService.deleteUserRegistration(userId, eventId);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
