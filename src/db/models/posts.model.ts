import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'posts',
  modelName: 'Post',
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
  declare user_id: number;

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

export default Post;
