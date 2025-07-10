import { Controller, Post, Get, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { UsersService } from '../services/users/users.service';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('login')
  async login(@Request() req) {
    const user = await this.authService.validateUser(req.body.email, req.body.password);
    if (!user) {
      return { statusCode: 401, message: 'Unauthorized' };
    }
    return this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: number, refreshToken: string }) {
    return this.authService.refreshTokens(body.userId, body.refreshToken);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.authService.generatePasswordResetToken(email);
    return { message: 'Se o e-mail existir, um link foi enviado' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string, newPassword: string }) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('logout')
  async logout(@Body('userId') userId: number) {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logout realizado com sucesso' };
  }

}
