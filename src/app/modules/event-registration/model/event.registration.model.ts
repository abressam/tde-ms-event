import { DataType, Table, Column, Model, ForeignKey } from 'sequelize-typescript';
import { User } from '@app/modules/user/models/user.model'; 
import { Event } from '@app/modules/event/models/event.model'; 

@Table({
  tableName: 'EventRegistration',
  timestamps: false,
})
export class EventRegistration extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @ForeignKey(() => Event)
  @Column({ type: DataType.INTEGER, allowNull: false })
  eventId: number;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  registeredAt: Date;
}
