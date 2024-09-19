import { EventRegistration } from '@app/modules/event-registration/models/event.registration.model';
import { Event } from '@app/modules/event/models/event.model';
import { DataType, Table, Column, Model, BelongsToMany } from 'sequelize-typescript';

@Table({
  tableName: 'User',
  timestamps: false,
})
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isAdmin: boolean;

  @BelongsToMany(() => Event, () => EventRegistration)
  events: Event[];
}
