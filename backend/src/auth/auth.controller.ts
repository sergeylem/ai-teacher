// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Starts the OAuth2 login flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken, user } = await this.authService.loginWithGoogle(req.user as any);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`;

    return res.redirect(redirectUrl);
  }
}
