<h1 align="center">
Projeto de Arquitetura Cliente-Servidor <br>para um Sistema de Banco de Dados <br><br>TDE<br><br>
</h1>

# 🚀 Introdução

<p align="justify">
Esse projeto possui o objetivo de demonstrar uma arquitetura cliente-servidor, o tema utilizado foi um sistema de eventos.
</p>

# 📝 Sumário

1. [Tecnologias Utilizadas](#tecnologias)
2. [Organização do Projeto](#projeto)
3. [Configuração do Projeto](#config)
4. [Código Fonte](#codigo)
5. [Demonstração Funcional](#funcional)

<div id='tecnologias' />

# 🔧 Tecnologias Utilizadas

* Typescript - NodeJs
* NestJs
* MySQL

<div id='projeto' />

# 📂 Organização do Projeto

Visão geral dos arquivos:

![image](https://github.com/user-attachments/assets/37073cbe-19b2-4aa3-991f-a567b45a7546)

Divisão dos diretórios mais importantes:

![image](https://github.com/user-attachments/assets/62b9aa5f-0a0f-40ef-a130-677c1eab4281)

![image](https://github.com/user-attachments/assets/0506fd30-d8ea-405c-b329-95f4e51dac78)

Cada modulo apresenta rotas que podem ser vistas no swagger do projeto:

![image](https://github.com/user-attachments/assets/3a8d870b-f7f6-4241-a935-fec4a0d8de0e)

<div id='config' />

# Configuração do Projeto

## Conexão com o MySQL

![image](https://github.com/user-attachments/assets/f0f81299-314a-4d89-afc4-d2245d741317)

### Criação do Banco de Dados e Script SQL

![image](https://github.com/user-attachments/assets/eade94c5-4b59-4444-873f-a255021229fc)

Script SQL utilizado:

```
CREATE DATABASE IF NOT EXISTS my_events;
USE my_events;

CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    eventDate DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_registration (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    eventId INT NOT NULL,
    registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (eventId) REFERENCES event(id) ON DELETE CASCADE
);
```

Resultado das tabelas criadas:

![image](https://github.com/user-attachments/assets/a9209437-1f80-4b36-b180-6ca503b27170)

### Conexão entre Cliente e Servidor

O cliente está designado na porta 8080 e se conecta com a porta 3306 do MySQL.

![image](https://github.com/user-attachments/assets/7e600e1a-bb15-494c-b3d0-a0ec069f1b21)

<div id='codigo' />

# Código Fonte

## Configuração do Banco de Dados

### Diretório app/configs

Arquivo .env:

![image](https://github.com/user-attachments/assets/e2be6921-2f36-43b5-bdbd-a63b9d6f1f57)

Arquivo app.config:

![image](https://github.com/user-attachments/assets/fabadff9-91b8-4a5d-acc7-b395b8af1d47)

Arquivo db.config:

![image](https://github.com/user-attachments/assets/b3a2d81c-30de-415e-a6ef-9f049a8bc659)

## Módulos

### Event

#### Controllers

Definição das rotas no Swagger do módulo Event

![image](https://github.com/user-attachments/assets/396d90ba-fd9e-49c8-b175-868aa26f7bbe)

```
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

  @Delete('delete')
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
  async deleteEvent(@Param() params: DeleteEventReqDto, @Request() req: Request) {
    const logger = new Logger(EventController.name);

    try {
      const eventId = params.id;
      const isAdmin = req['isAdmin'];
      logger.log('deleteEvent()');
      return await this.eventService.deleteEvent(eventId, isAdmin);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
```

#### DTOs

![image](https://github.com/user-attachments/assets/f2c8be54-8b94-49b3-837e-a57ace53fa1e)

![image](https://github.com/user-attachments/assets/2cb7e317-c30b-484b-9987-4b8ffde75f56)

![image](https://github.com/user-attachments/assets/198a2027-2ec8-459b-8e13-3ea870b4dd5e)

![image](https://github.com/user-attachments/assets/4481cf76-c85f-4f61-82f6-5a4375f96ead)

![image](https://github.com/user-attachments/assets/0ad5c287-cdb8-4781-9d6c-b2f1bbd2bbf7)

![image](https://github.com/user-attachments/assets/7502bffd-88ad-4d1e-9f34-4ce74b75b88b)


#### Models

![image](https://github.com/user-attachments/assets/ee92ad1a-68b6-42eb-a2d2-41d14a5ae5d3)

#### Services

![image](https://github.com/user-attachments/assets/a9aee81e-60a8-496f-9cf8-236c676ae883)

```
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

  async postEvent(body: PostEventReqDto, isAdmin: boolean): Promise<GetEventResDto> {
    this.validateAuth(isAdmin);

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

  async putEvent(body: PutEventReqDto, isAdmin: boolean): Promise<GetEventResDto> {
    this.validateAuth(isAdmin);

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

  async deleteEvent(eventId: number, isAdmin: boolean): Promise<DeleteEventResDto> {
    this.validateAuth(isAdmin);
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

  private validateAuth(isAdmin: boolean) {
    if (!isAdmin) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}
```

#### Module

![image](https://github.com/user-attachments/assets/818b4580-725e-4ff3-9055-717fafb82832)

### Event-registration

#### Controllers

![image](https://github.com/user-attachments/assets/b047130c-5e79-4f40-bc2f-cb7ca1761259)

```
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
```

#### DTOs

![image](https://github.com/user-attachments/assets/b6ae344e-f5a6-4bc9-8127-c55f5439aa70)

![image](https://github.com/user-attachments/assets/1b1fdcf0-3c16-4d04-b84a-594280ef4a69)

![image](https://github.com/user-attachments/assets/993c2ff5-a472-4418-9d19-adec5a87a06f)

#### Models

![image](https://github.com/user-attachments/assets/265d42f4-2ad0-4cdd-b616-03b34ee1eca4)

#### Services

![image](https://github.com/user-attachments/assets/6441695c-3ddf-436f-8927-57120f583d22)

```
import { EventRegistrationServiceInterface } from '@app/modules/event-registration/services/event.registration.service.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EventRegistrationDto } from '@app/modules/event-registration/dtos/event.registration.dto';
import { EventRegistration } from '@app/modules/event-registration/models/event.registration.model';
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
```

#### Module

![image](https://github.com/user-attachments/assets/1a7bed3c-a95e-4c26-bb01-641b5a575636)

### Session

#### Controllers

![image](https://github.com/user-attachments/assets/75b38512-0d45-4b6d-9507-20374bba903b)

```
import { SessionService } from '@app/modules/session/services/session.service';
import { SessionControllerInterface } from '@app/modules/session/controllers/session.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { PostLoginResDto } from '@app/modules/session/dtos/responses/post-login-res.dto';
import { PostLoginReqDto } from '@app/modules/session/dtos/requests/post-login-req.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpException,
  Logger,
} from '@nestjs/common';

@ApiTags('session')
@Controller('session')
export class SessionController implements SessionControllerInterface {
  constructor(private readonly sessionService: SessionService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Post the login credentials data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the jwt data',
    type: PostLoginResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postLogin(@Body() body: PostLoginReqDto) {
    const logger = new Logger(SessionController.name);

    try {
      logger.log('postLogin()');
      return await this.sessionService.postLogin(body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
```

#### DTOs

![image](https://github.com/user-attachments/assets/ece1278b-60fd-4b7a-8728-507b24e8ee85)

![image](https://github.com/user-attachments/assets/10d1636d-d116-49ee-b673-bc705512aaa6)

![image](https://github.com/user-attachments/assets/2c876757-1877-4202-a15c-24273d9d5e5a)

![image](https://github.com/user-attachments/assets/4652c3f5-9b72-4c55-a755-ad2c43c35680)

#### Middlewares

```
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { checkJsonWebToken } from '@app/modules/session/utils/session.util';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(
    req: Request,
    _res: Response,
    next: (error?: any) => void,
  ): Promise<void> {
    const logger = new Logger(SessionMiddleware.name);

    try {
      const token = req.headers['authorization']?.split(' ').pop();
      const secret = this.configService.get('auth.secret');
      const jwtPayload = checkJsonWebToken(token, secret);

      req['userId'] = jwtPayload['userId'];
      req['isAdmin'] = jwtPayload['isAdmin'];

      next();
    } catch (error) {
      logger.error(error);
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}
```

#### Services

![image](https://github.com/user-attachments/assets/5ed6e8f7-cd66-4ee7-a66c-9653506bc09f)

```
import { SessionServiceInterface } from './session.service.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostLoginResDto } from '@app/modules/session/dtos/responses/post-login-res.dto';
import { PostLoginReqDto } from '@app/modules/session/dtos/requests/post-login-req.dto';
import {
  getJsonWebToken,
  encodePassword,
} from '@app/modules/session/utils/session.util';
import { UserDto } from '@app/modules/user/dtos/user.dto';
import { User } from '@app/modules/user/models/user.model';

@Injectable()
export class SessionService implements SessionServiceInterface {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  async postLogin(body: PostLoginReqDto): Promise<PostLoginResDto> {
    const secret = this.configService.get('auth.secret');
    const salt = this.configService.get('auth.salt');

    const user = await this.userModel.findOne({
      where: {
        email: body?.email,
        password: encodePassword(salt, body?.password),
      },
    });

    this.validateCredentials(user);

    return { jwt: getJsonWebToken(user.id, user.isAdmin, secret) };
  }

  private validateCredentials(user: UserDto) {
    if (!user) {
      throw new HttpException('Invalid session', HttpStatus.UNAUTHORIZED);
    }
  }
}
```

#### Utils

![image](https://github.com/user-attachments/assets/c4d15949-6f7d-4634-b354-0017e33c291d)

#### Module

![image](https://github.com/user-attachments/assets/6b034480-6453-44e8-992a-af8372480242)

### User

#### Controllers

![image](https://github.com/user-attachments/assets/3b883bd3-0912-42e1-a03c-1b5725e3b0cb)

```
import { UserService } from '@app/modules/user/services/user.service';
import { UserControllerInterface } from '@app/modules/user/controllers/user.controller.interface';
import { ErrorDto } from '@app/modules/session/dtos/error.dto';
import { DeleteUserResDto } from '@app/modules/user/dtos/responses/delete-user-res.dto';
import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { PostUserReqDto } from '@app/modules/user/dtos/requests/post-user-req.dto';
import { PutUserReqDto } from '@app/modules/user/dtos/requests/put-user-req.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Request,
  Body,
  HttpCode,
  HttpException,
  Logger,
} from '@nestjs/common';

@ApiTags('user')
@Controller('user')
export class UserController implements UserControllerInterface {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Get the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async getUser(@Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const userId = req['userId'];
      logger.log('getUser()');
      return await this.userService.getUser(userId);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Post('post')
  @HttpCode(200)
  @ApiOperation({ summary: 'Post the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async postUser(@Body() body: PostUserReqDto) {
    const logger = new Logger(UserController.name);

    try {
      logger.log('postUser()');
      return await this.userService.postUser(body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Put('put')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Put the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user data',
    type: GetUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async putUser(@Body() body: PutUserReqDto, @Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const userId = req['userId'];
      logger.log('putUser()');
      return await this.userService.putUser(userId, body);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }

  @Delete('delete')
  @HttpCode(200)
  @ApiBearerAuth('auth')
  @ApiOperation({ summary: 'Delete the user data' })
  @ApiResponse({
    status: 200,
    description: 'Returns a JSON with the user status',
    type: DeleteUserResDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorDto,
  })
  async deleteUser(@Request() req: Request) {
    const logger = new Logger(UserController.name);

    try {
      const userId = req['userId'];
      logger.log('deleteUser()');
      return await this.userService.deleteUser(userId);
    } catch (error) {
      logger.error(error);
      throw new HttpException(error.message, error.getStatus());
    }
  }
}
```

#### DTOs

![image](https://github.com/user-attachments/assets/4886e4bf-59ed-4114-a6bd-93272bcb6864)

![image](https://github.com/user-attachments/assets/65b4fb60-52fb-4b0f-a7f2-56f10d38722d)

![image](https://github.com/user-attachments/assets/9f28c456-ea34-4b81-a79f-029e6c626478)

![image](https://github.com/user-attachments/assets/b26f6c3c-a5db-4725-95b8-36d8539e5cfa)

![image](https://github.com/user-attachments/assets/a88a097f-d8e1-4c95-81bd-7bc0e3f8b50d)

#### Models

![image](https://github.com/user-attachments/assets/548abeb1-a884-4c70-a743-7b635fb3cfbe)

#### Services

![image](https://github.com/user-attachments/assets/d7abe84d-c98a-471b-a683-e5e0fe2aa48a)

```
import { UserServiceInterface } from '@app/modules/user/services/user.service.interface';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DeleteUserResDto } from '@app/modules/user/dtos/responses/delete-user-res.dto';
import { GetUserResDto } from '@app/modules/user/dtos/responses/get-user-res.dto';
import { PutUserReqDto } from '@app/modules/user/dtos/requests/put-user-req.dto';
import { PostUserReqDto } from '@app/modules/user/dtos/requests/post-user-req.dto';
import { UserDto } from '@app/modules/user/dtos/user.dto';
import { User } from '@app/modules/user/models/user.model';
import { encodePassword } from '@app/modules/session/utils/session.util';

@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private readonly configService: ConfigService,
  ) {}

  async getUser(userId: number): Promise<GetUserResDto> {
    const user = await this.userModel.findByPk(userId, {
      attributes: {
        exclude: ['id', 'password'],
      },
    });

    this.validateUser(user);

    return { user };
  }

  async postUser(body: PostUserReqDto): Promise<GetUserResDto> {
    const salt = this.configService.get('auth.salt');

    if (body.password) {
      body.password = encodePassword(salt, body.password);
    }

    const createdUser = await this.userModel.create({
      name: body.name,
      email: body.email,
      password: body.password,
      isAdmin: body.isAdmin
    })

    const { password, ...user } = createdUser.toJSON();

    return {
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
      },
    };
  }

  async putUser(userId: number, body: PutUserReqDto): Promise<GetUserResDto> {
    const salt = this.configService.get('auth.salt');
    const userOld = await this.userModel.findByPk(userId);

    this.validateUser(userOld);

    if (body.password) {
      body.password = encodePassword(salt, body.password);
    }

    const userNew = Object.assign({}, userOld.dataValues, body);

    await this.userModel.update(
      {
        name: userNew.name,
        password: userNew.password,
      },
      {
        where: {
          id: userId,
        },
      },
    );

    return {
      user: {
        name: userNew.name,
        email: userNew.email,
        isAdmin: userNew.is_admin,
      },
    };
  }

  async deleteUser(userId: number): Promise<DeleteUserResDto> {
    const user = await this.userModel.findByPk(userId);

    this.validateUser(user);

    await user.destroy();

    return {
      statusCode: 200,
      message: 'User successfully deleted',
    };
  }

  private validateUser(user: UserDto) {
    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
  }
}
```

#### Module

![image](https://github.com/user-attachments/assets/7cc30959-55c7-4b00-8fdb-a3e746a56651)

### App Module

```
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventModule } from '@app/modules/event/event.module';
import { EventController } from '@app/modules/event/controllers/event.controller';
import { SessionMiddleware } from '@app/modules/session/middlewares/session.middleware';
import { SessionModule } from '@app/modules/session/session.module';
import { EventRegistrationModule } from '@app/modules/event-registration/event.registration.module';
import { EventRegistrationController } from '@app/modules/event-registration/controllers/event.registration.controller';
import { UserModule } from '@app/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import appConfig from '@app/configs/app.config';
import dbConfig from '@app/configs/db.config';

@Module({
  imports: [
    SessionModule,
    UserModule,
    EventModule,
    EventRegistrationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    SequelizeModule.forRoot({
      ...dbConfig,
      synchronize: false,
    }),  
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(
      { path: 'user/get', method: RequestMethod.GET },
      { path: 'user/put', method: RequestMethod.PUT },
      { path: 'user/delete', method: RequestMethod.DELETE },
    );
    consumer.apply(SessionMiddleware).forRoutes(EventController);
    consumer.apply(SessionMiddleware).forRoutes(EventRegistrationController);
  }
}
```

### Main

```
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import {
  HttpException,
  INestApplication,
  ValidationError,
  ValidationPipe,
  Logger,
} from '@nestjs/common';

class App {
  app: INestApplication;
  swaggerConfig: Omit<OpenAPIObject, 'paths'>;

  private logger: Logger;
  private config: ConfigService;

  constructor() {
    this.startSetup();
  }

  async startSetup() {
    try {
      await this.bootstrap();
      await this.swaggerSetup();
      await this.serverSetup();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async bootstrap() {
    this.app = await NestFactory.create(AppModule);

    this.config = this.app.get(ConfigService);
    this.app.enableCors(this.config.get('cors'));

    this.app.use(cookieParser());
    this.app.setGlobalPrefix(this.config.get('app.prefix'));
    this.app.getHttpAdapter().getInstance().disable('x-powered-by');

    this.app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          return new HttpException(
            Object.values(validationErrors[0].constraints).join(', '),
            400,
          );
        },
      }),
    );
  }

  async swaggerSetup() {
    this.swaggerConfig = new DocumentBuilder()
      .setTitle(this.config.get('app.name'))
      .setDescription(this.config.get('app.description'))
      .setVersion(this.config.get('app.version'))
      .addServer(this.config.get('app.prefix'))
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          in: 'header',
        },
        'auth',
      )
      .build();
      
    const document = SwaggerModule.createDocument(
      this.app,
      this.swaggerConfig,
      {
        ignoreGlobalPrefix: true,
      },
    );

    fs.writeFileSync('./swagger.json', JSON.stringify(document));
    SwaggerModule.setup(
      `${this.config.get('app.prefix')}/swagger`,
      this.app,
      document,
    );
  }

  async serverSetup() {
    this.logger = new Logger('NestApplication');

    await this.app.listen(this.config.get('app.port'), async () => {
      Logger.overrideLogger(this.logger);
      this.logger.log(`Listening at ${await this.app.getUrl()}`);
    });
  }
}

export default new App();
```

<div id='funcional' />

# Demonstração Funcional

### Criação de Usuário Administrador

![image](https://github.com/user-attachments/assets/24182dc1-92a2-4e36-bdab-d7568d6d88ff)

![image](https://github.com/user-attachments/assets/231e456c-df2f-4662-8c46-3b6b03c7c2c1)

### Criação de Usuário Comum

![image](https://github.com/user-attachments/assets/e95b07d4-422c-49fc-872d-dc43874c6c82)

![image](https://github.com/user-attachments/assets/b7a41cd1-7bbc-404b-8a72-4d344f31a0b4)

### Resultado da Tabela User

![image](https://github.com/user-attachments/assets/6427740e-396d-4b14-a571-a2d539be57e7)

### GET de um Usuário

![image](https://github.com/user-attachments/assets/5b3b08fc-7875-476a-b962-f145eb46aa28)

### PUT de um Usuário

![image](https://github.com/user-attachments/assets/17bc2170-61f6-47a0-9900-880277b13ee5)

![image](https://github.com/user-attachments/assets/34f19b32-75b7-4e2b-84bf-40a0b6c42bd7)

![image](https://github.com/user-attachments/assets/6b0ee678-b0c3-454f-a10a-d62080d25765)


### Criação de um Evento

-> Resposta de erro:

* Usuários comuns não podem criar eventos

![image](https://github.com/user-attachments/assets/5df6cd62-ab25-4713-98d4-9a4a3e42478f)

![image](https://github.com/user-attachments/assets/618b3ac2-a369-462b-8f85-067492ae1533)

![image](https://github.com/user-attachments/assets/80eb96f8-98ba-48e7-a453-c626a40933a3)

![image](https://github.com/user-attachments/assets/c21cca0a-db94-4643-97b9-47b33cacfaec)

![image](https://github.com/user-attachments/assets/6bcc351d-af73-46a3-8d69-7989ec7c20d3)



