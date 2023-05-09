import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';
import { ADDED_KAKAO_PLUS_FLRIEND, ENTITY, GRADE } from 'src/constants/entity';

// [Todo] 대학교 정보 관리하기
@Entity(ENTITY.USER)
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, comment: "User's nickname" })
  nickname: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    comment: "User's major",
  })
  major: string;

  @Column({ nullable: true })
  grade: GRADE;

  @Column({ type: 'int', nullable: true, comment: "User's point" })
  point: number;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: "User's fields of confidence",
  })
  fieldsOfConfidence: string;

  @Column({ nullable: true, comment: "User's refreshToken" })
  refreshToken: string;

  @Column({ comment: "User's kakao account id" })
  kakaoUserId: string;

  @Column({ length: 255, comment: "Kakao account's nickname" })
  kakaoAccountEmail: string;

  @Column({ comment: 'Whether the user added a Kakao channel or not' })
  addedKakaoPlusfriend: ADDED_KAKAO_PLUS_FLRIEND;

  @CreateDateColumn({ name: 'create_at', comment: '생성일' })
  createdAt: Date;
}
