import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 50, comment: "User's major" })
  major: string;

  @Column({ type: 'tinyint', comment: "User's grade" })
  grade: number;

  @Column({ type: 'int', comment: "User's point" })
  point: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "User's fields of confidence",
  })
  fieldsOfConfidence?: string;

  @Column({ comment: "User's refreshToken" })
  refreshToken: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;
}
