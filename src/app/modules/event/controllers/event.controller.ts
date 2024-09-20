import { EventService } from '@app/modules/event/services/event.service';
import { EventControllerInterface } from '@app/modules/event/controllers/event.constroller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { DeleteEventResDto } from '@app/modules/event/dtos/responses/delete-event-res.dto';
import { GetEventResDto } from '@app/modules/event/dtos/responses/get-event-res.dto';
import { PostEventReqDto } from '@app/modules/event/dtos/requests/post-event-req.dto';
import { DeleteEventReqDto } from '@app/modules/event/dtos/requests/delete-event-req.dto';
import { PutEventReqDto } from '@app/modules/event/dtos/requests/put-event-req.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Request,
  Body,
  Param,
  HttpCode,
  HttpException,
  Logger,
} from '@nestjs/common';

@ApiTags('event')
@Controller('event')
export class EventController implements EventControllerInterface {
  constructor(private readonly eventService: EventService) {}

  @Get('get/all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all events data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with all the events data',
    type: GetEventResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getEvent() {
    const logger = new Logger(EventController.name);

    try {
      logger.log('getEvent()');
      return await this.eventService.getEvent();
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Post('post')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Post the event data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the event data',
    type: GetEventResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postEvent(@Body() body: PostEventReqDto, @Request() req: Request) {
    const logger = new Logger(EventController.name);

    try {
      const isAdmin = req['isAdmin'];
      logger.log('postEvent()');
      return await this.eventService.postEvent(body, isAdmin);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
  

  @Put('put')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Put the event data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the event data',
    type: GetEventResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async putEvent(@Body() body: PutEventReqDto, @Request() req: Request) {
    const logger = new Logger(EventController.name);

    try {
      const isAdmin = req['isAdmin'];
      logger.log('putEvent()');
      return await this.eventService.putEvent(body, isAdmin);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Delete the event data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the event status',
    type: DeleteEventResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async deleteEvent(@Param('id') id: string, @Request() req: Request) {
    const logger = new Logger(EventController.name);

    try {
      const eventId = parseInt(id, 10);
      console.log("Valor do eventId: ", eventId);
      const isAdmin = req['isAdmin'];
      logger.log('deleteEvent()');
      return await this.eventService.deleteEvent(eventId, isAdmin);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}