import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'defaultSecret',
    });
  }

  validate(payload: any) {
    // Payload chứa thông tin từ JWT, ví dụ: { sub: userId, role: role }
    if (!payload.sub) {
      throw new UnauthorizedException('Invalid JWT payload');
    }
    return { userId: payload.sub, role: payload.role }; // Trả về thông tin user để sử dụng trong request
  }
}