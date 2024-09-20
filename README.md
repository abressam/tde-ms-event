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

#### Models

#### Services

#### Module

### Event-registration

#### Controllers

#### DTOs

#### Models

#### Services

#### Module

### Session

#### Controllers

#### DTOs

#### Models

#### Services

#### Module

### User

#### Controllers

#### DTOs

#### Models

#### Services

#### Module


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



