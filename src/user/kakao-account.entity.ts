import {
  Entity,
  Column,
  BaseEntity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export const enum plusfriends {
  ADDED = 'ADDED',
  BLOCKED = 'BLOCKED',
  NONE = 'NONE',
}

@Entity()
export class KakaoAccountEntity extends BaseEntity {
  @PrimaryColumn({ comment: 'Kakao account user id' })
  id: string;

  @Column({ length: 50, comment: "Kakao account's nickname" })
  profileNickname: string;

  @Column({ length: 255, comment: "Kakao account's nickname" })
  accountEmail: string;

  @Column({ comment: 'Did user add our kakao channel' })
  plusfriends: plusfriends;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;
}
