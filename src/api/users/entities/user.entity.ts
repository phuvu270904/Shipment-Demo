import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum RegistrationType {
  KAKAO = 'kakao',
  GOOGLE = 'google',
  APPLE = 'apple',
  GENERAL = 'general',
}

export enum MemberType {
  PAID = 'paid',
  FREE = 'free',
}

export enum ModelType {
  IOS = 'ios',
  ANDROID = 'android',
}

export enum GradeType {
  BOSS = 'boss',
  STAFF = 'staff',
}

// Device status enum
export enum DeviceStatus {
  ACTIVE = 'active',
  LOGGED_OUT = 'logged_out',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  idAddress: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: RegistrationType,
    default: RegistrationType.GENERAL,
  })
  registration_type: RegistrationType;

  @CreateDateColumn()
  registration_date: Date;

  @Column({ nullable: true, type: 'timestamp' })
  last_access: Date;

  @Column({ type: 'text', nullable: true })
  metadata: string;

  @Column({ nullable: true })
  fcm_token: string;
}
