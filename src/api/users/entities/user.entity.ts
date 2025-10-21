import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { registerEnumType } from '@nestjs/graphql';

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

// Register enums with GraphQL
registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role in the system',
});

registerEnumType(RegistrationType, {
  name: 'RegistrationType',
  description: 'User registration type',
});

registerEnumType(MemberType, {
  name: 'MemberType',
  description: 'Member type',
});

registerEnumType(ModelType, {
  name: 'ModelType',
  description: 'Device model type',
});

registerEnumType(GradeType, {
  name: 'GradeType',
  description: 'User grade type',
});

registerEnumType(DeviceStatus, {
  name: 'DeviceStatus',
  description: 'Device status',
});

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

  @Column({ type: 'timestamp', nullable: true })
  last_token_generated_at: Date;
}
