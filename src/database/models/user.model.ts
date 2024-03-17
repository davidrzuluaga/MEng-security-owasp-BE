import {
  Table,
  Model,
  Column,
  DataType,
  BeforeSave,
} from "sequelize-typescript";
import bcrypt from "bcrypt-nodejs";

@Table({
  timestamps: true,
  tableName: "Users",
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
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
  })
  declare role: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  declare deleted: Boolean;

  @BeforeSave
  static hashPassword(user: User) {
    if (user.changed("password")) {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    }
  }
}

export default User;
