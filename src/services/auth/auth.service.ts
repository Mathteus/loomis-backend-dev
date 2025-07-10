import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../shared/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

async login(user: any) {
  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    ),
    this.jwtService.signAsync(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    ),
  ]);

  const hashedRefresh = await bcrypt.hash(refreshToken, 10);
  await this.usersService.updateRefreshToken(user.id, hashedRefresh);

  return { accessToken, refreshToken };
}

async generatePasswordResetToken(email: string) {
  const user = await this.usersService.findByEmail(email);
  if (!user) return;

  const token = this.jwtService.sign(
    { email: user.email, sub: user.id },
    {
      secret: process.env.JWT_RESET_SECRET || 'jwtResetSecret',
      expiresIn: '15m',
    },
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await this.emailService.sendMail(
    user.email,
    'Recuperação de Senha',
    `<p>Olá,</p>
     <p>Você solicitou a redefinição de senha. Clique no link abaixo para continuar:</p>
     <a href="${resetLink}">${resetLink}</a>
     <p>Se você não solicitou isso, ignore este e-mail.</p>`
  );
}

async refreshTokens(userId: number, refreshToken: string) {
  const user = await this.usersService.findById(userId);
  if (!user || !user.refreshToken) throw new ForbiddenException('Acesso negado');

  const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!tokenMatches) throw new ForbiddenException('Token inválido');

  return this.login(user); // Gera novos tokens e atualiza refreshToken no banco
}


  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET,
      });

      const hashed = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(payload.sub, hashed);

      return { message: 'Senha redefinida com sucesso' };
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
