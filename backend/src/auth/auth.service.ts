import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../assessment/entities/user.entity'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleProfile: {
    email: string;
    name: string;
    googleId: string;
  }): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { email: googleProfile.email } });
    if (!user) {
      user = this.usersRepository.create({
        email: googleProfile.email,
        name: googleProfile.name,
        googleId: googleProfile.googleId,
      });
      await this.usersRepository.save(user);
    }
    return user;
  }

  async loginWithGoogle(user: User) {
    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
