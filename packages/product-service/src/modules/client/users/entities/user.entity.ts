import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntities } from "../../../../base/base.entities";

export enum UserDeletedEnum {
  Init = 0,
  Deleted = 1,
}

export enum UserVerifiedEnum {
  Init = 0,
  Verified = 1,
}

@Entity("User")
export class User extends BaseEntities {
  @PrimaryGeneratedColumn({ type: "int" })
  userId: number;

  @Column({ type: "varchar", length: 256 })
  username: string;

  @Column({ type: "varchar", length: 256 })
  email: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  phoneNumber: string;

  @Column({ type: "varchar" })
  fullName: string;

  @Column({ type: "date" })
  dob: Date;

  @Column({ name: "status", type: "tinyint" })
  status: number;

  @Column({ type: "tinyint" })
  isEmailVerified: number;

  @Column({ type: "tinyint" })
  isPhoneVerified: number;

  @Column({ type: "varchar" })
  affiliate: string;

  @Column({ type: "varchar", nullable: true })
  refAffiliate: string;
}
