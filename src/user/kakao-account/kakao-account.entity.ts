import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user.entity';

@Entity()
export class KakaoAccountEntity extends BaseEntity {
  @PrimaryColumn({ type: 'long', comment: 'Kakao account user id' })
  id: number;

  @Column({ length: 50, comment: "Kakao account's nickname" })
  profileNickname: string;

  @Column({ length: 255, comment: "Kakao account's nickname" })
  accountEmail: string;

  // [Todo] plusfriends response 확인 후 구체화하기
  // @Column({ comment: "Kakao account's nickname" })
  // plusfriends: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
