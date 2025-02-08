import { Table, Model, Column, DataType, HasMany } from "sequelize-typescript";
import Comment from "./comments.model";

@Table({
  timestamps: true,
  tableName: "posts",
  modelName: "Post",
})
class Post extends Model {
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
  declare title: string;

  @Column({
    type: DataType.STRING,
  })
  declare post: string;

  @Column({
    type: DataType.INTEGER,
  })
  declare author_name: string;

  @HasMany(() => Comment)
  declare comments: Comment[];
}

export default Post;
