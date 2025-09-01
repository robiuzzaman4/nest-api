import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { crypto } from 'crypto';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByPhone(phone);
    if (!user) {
      return null;
    }

    const isValid = await this.usersService.isUserActiveAndNotDeleted(user._id);
    if (!isValid) {
      return null;
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (user && isPasswordMatching) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user._id, role: user.role },
        {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        { sub: user._id, role: user.role },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        },
      ),
    ]);
    return { access_token, refresh_token };
  }

  // The refreshTokens method has been removed as the refresh token hash is no longer stored.

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.getUserByPhone(forgotPasswordDto.phone);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersService.updateUser(id: user._id, { resetPasswordToken: resetToken, resetPasswordExpires: resetPasswordExpires });

    // In a real application, you would send this token via email or SMS.
    // For this example, we'll just return it.
    return { message: 'Password reset token generated.', resetToken };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByResetToken(resetPasswordDto.token);
    if (!user) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const newPasswordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    await this.usersService.resetPassword(user._id, newPasswordHash);

    return { message: 'Password has been reset successfully.' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findByPhone(changePasswordDto.phone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordMatching = await bcrypt.compare(changePasswordDto.oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid old password.');
    }

    const newPasswordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.update(userId, { password: newPasswordHash });

    return { message: 'Password has been changed successfully.' };
  }
}
