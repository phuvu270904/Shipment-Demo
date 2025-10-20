import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import UserRepository from '../users/repositories/user.repository';
import {
  UserEntity,
  RegistrationType,
  UserRole,
} from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { getAuth } from '../../config/firebase.config';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByIdAddress(
      registerDto.idAddress,
    );
    if (existingUser) {
      throw new ConflictException('User with this id already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      nickname: registerDto.nickname,
      idAddress: registerDto.idAddress,
      password: hashedPassword,
      phone: registerDto.phone,
      dob: registerDto.dob,
      role: registerDto.role ? registerDto.role : UserRole.USER,
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

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userRepository.findByIdAddress(loginDto.idAddress);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
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

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshTokenDto.refresh_token, {
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
