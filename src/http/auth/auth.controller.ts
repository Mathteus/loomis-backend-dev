import { AuthService } from '@/http/auth/auth.service';
import {
  AccountForgetPassword,
  AccountRefreshToken,
  AccountSignInDto,
  AccountSingUpDto,
} from '@/application/dto/user';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Protected } from '@/decorators/protected.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/decorators/curent-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Signup',
    description: 'Registra uma nova conta na plataforma Loomis',
  })
  @ApiBody({
    type: AccountSingUpDto,
    description: 'Deve ser enviado email válido e senha conseguir logar!',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta criada com successo!',
    example: {
      username: 'Matheus Henrique',
      password: 'A54faf4g4gdsgds4s%#@',
      email: 'Matheus.Henrique@email.com',
      companyType: 'SERVICE_COMPANY',
      companyname: 'Shosans',
      companyCNPJ: '84.172.252/0001-98',
      companyCustomers: '100+',
      companyEmployees: '21_50',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conta Já existe no sistema!',
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autorizado!',
  })
  @ApiResponse({
    status: 400,
    description: 'Ocorreu um erro interno, vindo do frontend!',
    example: {
      email: 'dev.thux&mail,com',
      password: 'A54faf4g4gdsgds4s%#@',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro inesperado no servidor!',
  })
  @Protected()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: AccountSingUpDto) {
    return await this.authService.signup(body);
  }

  @ApiOperation({
    summary: 'Signin',
    description:
      'Ganha token JWT de acesso, usando uma conta da plataforma Loomis',
  })
  @ApiBody({
    type: AccountSignInDto,
    description: 'Deve ser enviado email válido e senha conseguir logar!',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Conta criada com successo!',
    example: {
      email: 'dev.thux@mail.com',
      password: 'A54faf4g4gdsgds4s%#@',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Usuário não autorizado!',
  })
  @ApiResponse({
    status: 400,
    description: 'Ocorreu um erro interno, vindo do frontend!',
    example: {
      email: 'dev.thux&mail,com',
      password: 'A54faf4g4gdsgds4s%#@',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro inesperado no servidor!',
  })
  @Protected()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() body: AccountSignInDto) {
    return this.authService.signin(body);
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@CurrentUser() account: AccountRefreshToken) {
    return await this.authService.refreshTokens(account.refreshToken);
  }

  @Protected()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Query('code') code: string,
    @Body('email') account: AccountForgetPassword,
  ) {
    return await this.authService.forgetPassword({
      email: account.email,
      code,
    });
  }

  @Protected()
  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  verifyCodeRecovery(
    @CurrentUser() userId: string,
    @Body() body: { code: string },
  ) {
    return this.authService.verifyCodeRecovery(userId, body.code);
  }

  @Protected()
  @Patch('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @CurrentUser() userId: string,
    @Body() body: { newPassword: string },
  ) {
    return this.authService.resetPassword(userId, body.newPassword);
  }
}
