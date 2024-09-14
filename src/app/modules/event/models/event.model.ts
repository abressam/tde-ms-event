import { DataType, Table, Column, Model } from 'sequelize-typescript';

@Table({
  tableName: 'Event',
  timestamps: true,
})
export class Event extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  eventDate: string;

  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;
}
