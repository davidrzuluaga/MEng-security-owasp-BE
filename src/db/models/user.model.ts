import {
  Table,
  Model,
  Column,
  DataType,
  BeforeSave,
} from "sequelize-typescript";
import bcrypt from "bcrypt-nodejs";

@Table({
  timestamps: false,
  tableName: "users",
  modelName: "User",
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
  })
  declare password: string;

  @Column({
    type: DataType.STRING(100),
  })
  declare role: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare deleted_at: Date;

  @Column({
    type: DataType.INTEGER,
  })
  declare created_at: Date;

  @Column({
    type: DataType.INTEGER,
  })
  declare updated_at: Date;
}
export default User;
