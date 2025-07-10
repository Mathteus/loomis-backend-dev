import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string) {
    return this.prisma.find(user => user.email === email);
  }

  async updatePassword(userId: number, newPassword: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateRefreshToken(userId: number, hashedToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async removeRefreshToken(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
