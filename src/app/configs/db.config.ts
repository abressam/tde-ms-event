import { EventRegistration } from '@app/modules/event-registration/model/event.registration.model';
import { Event } from '@app/modules/event/models/event.model';
import { User } from '@app/modules/user/models/user.model';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

const dbConfig: SequelizeModuleOptions = {
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10) || 3306,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  autoLoadModels: true,
  synchronize: true,
  logging: false,
  models: [User, Event, EventRegistration],
};

export const initializeAssociations = (sequelize: Sequelize) => {
  User.belongsToMany(Event, { through: EventRegistration });
  Event.belongsToMany(User, { through: EventRegistration });
};

export default dbConfig;
