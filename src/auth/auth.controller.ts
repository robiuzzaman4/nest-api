import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  UsePipes,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { Request } from 'express';
import {
  ForgotPasswordDto,
  ForgotPasswordSchema,
} from './dto/forgot-password.dto';
import {
  ResetPasswordDto,
  ResetPasswordSchema,
} from './dto/reset-password.dto';
import {
  ChangePasswordDto,
  ChangePasswordSchema,
} from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request) {
    const userId = req.user['userId'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(ForgotPasswordSchema))
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(ChangePasswordSchema))
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      req.user['userId'],
      changePasswordDto,
    );
  }
}
