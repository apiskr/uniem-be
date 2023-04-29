import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

const enum grade {
  first = 1,
  second = 2,
  third = 3,
  fourth = 4,
  fifth = 5,
}
@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 50, comment: "User's major" })
  major?: string;

  @Column()
  grade?: grade;

  @Column({ type: 'int', comment: "User's point" })
  point: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "User's fields of confidence",
  })
  fieldsOfConfidence?: string;

  @Column({ comment: "User's refreshToken" })
  refreshToken?: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;
}
