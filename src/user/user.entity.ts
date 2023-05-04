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
// [Todo] nickname을 카카오 엔티티가 아닌 여기서 관리하기
@Entity()
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    comment: "User's major",
  })
  major: string;

  @Column({ nullable: true })
  grade: grade;

  @Column({ type: 'int', nullable: true, comment: "User's point" })
  point: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "User's fields of confidence",
  })
  fieldsOfConfidence: string;

  @Column({ nullable: true, comment: "User's refreshToken" })
  refreshToken?: string;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;
}
