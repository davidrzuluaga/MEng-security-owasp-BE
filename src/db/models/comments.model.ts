import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';
import Post from './posts.model';

@Table({
  timestamps: true, // Automatically add `createdAt` and `updatedAt` timestamps
  tableName: 'Comments',
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare author_id: number;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare post_id: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  declare timestamp: Date;

  // Relationships
  @BelongsTo(() => User)
  declare author: User;

  @BelongsTo(() => Post)
  declare post: Post;
}

export default Comment;
