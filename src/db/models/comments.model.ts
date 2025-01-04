import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Post from './posts.model';

@Table({
  timestamps: false,
  tableName: 'comments',
  modelName: 'Comment',
})
class Comment extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare content: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare author_name: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare post_id: number;

  @BelongsTo(() => Post)
  declare post: Post;
}

export default Comment;
