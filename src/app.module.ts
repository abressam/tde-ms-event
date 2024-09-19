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