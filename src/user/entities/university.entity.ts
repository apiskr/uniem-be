import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm';
import { ENTITY } from 'src/constants/entity';

@Entity(ENTITY.UNIVERSITY)
export class UniversityEntity extends BaseEntity {
  @PrimaryColumn({ comment: "University's code" })
  code: number;

  @Column({ length: 50, comment: "University's name" })
  name: string;
}
