import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterReqDto } from './dto/request/register-req.dto';
import { LoginReqDto } from './dto/request/login-req.dto';
import UserRepository from '../users/repositories/user.repository';
import {
  UserEntity,
  RegistrationType,
  UserRole,
} from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RefreshTokenReqDto } from './dto/request/refresh-token-req.dto';
import { getAuth } from '../../config/firebase.config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(RegisterReqDto: RegisterReqDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByIdAddress(
      RegisterReqDto.idAddress,
    );
    if (existingUser) {
      throw new ConflictException('User with this id already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(RegisterReqDto.password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      nickname: RegisterReqDto.nickname,
      idAddress: RegisterReqDto.idAddress,
      password: hashedPassword,
      phone: RegisterReqDto.phone,
      dob: RegisterReqDto.dob,
      role: Object.values(UserRole).includes(RegisterReqDto.role as UserRole)
        ? (RegisterReqDto.role as UserRole)
        : UserRole.USER,
      registration_type: RegistrationType.GENERAL,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      user: {
        id: savedUser.id,
        nickname: savedUser.nickname,
        idAddress: savedUser.idAddress,
      },
    };
  }

  async login(LoginReqDto: LoginReqDto) {
    // Find user by email
    const user = await this.userRepository.findByIdAddress(LoginReqDto.idAddress);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      LoginReqDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last access
    user.last_access = new Date();
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        nickname: user.nickname,
        idAddress: user.idAddress,
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  private generateTokens(user: UserEntity) {
    const payload = {
      id: user.id,
      username: user.nickname,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '7d',
      }),
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async refreshToken(RefreshTokenReqDto: RefreshTokenReqDto) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(RefreshTokenReqDto.refresh_token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      // Find the user from the token payload
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const payloadAccessToken = {
        id: user.id,
        username: user.nickname,
        role: user.role,
      };
      const newAccessToken = this.jwtService.sign(payloadAccessToken);

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      // Check if the error is specifically a token expiration error
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          message: 'Refresh token expired',
          code: 'TOKEN_EXPIRED',
        });
      }
      // For other JWT or verification errors
      throw new UnauthorizedException({
        message: 'Invalid refresh token',
        code: 'INVALID_TOKEN',
      });
    }
  }
}
