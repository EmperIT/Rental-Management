import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Auth } from '@app/commonn';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE } from './constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  private usersService: Auth.AuthServiceClient;

  constructor(@Inject(AUTH_SERVICE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<Auth.AuthServiceClient>(
      Auth.AUTH_SERVICE_NAME,
    );
  }

  create(createUserDto: Auth.CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  findAll(paginationDto: Auth.PaginationDto) {
    return this.usersService.findAllUsers(paginationDto);
  }

  findOne(id: string) {
    return this.usersService.findOneUser({ id });
  }

  update(id: string, updateUserDto: Auth.UpdateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...updateData } = updateUserDto;
    return this.usersService.updateUser({ id, ...updateData });
  }

  remove(id: string) {
    return this.usersService.removeUser({ id });
  }

  async login(loginDto: Auth.LoginDto): Promise<Auth.LoginResponse & { role: string }> {
    const response = await lastValueFrom(this.usersService.login(loginDto));
    if (!response) {
      throw new Error('Login response is undefined');
    }
    
    // Lấy thông tin người dùng từ ID trong JWT token
    const tokenPayload = this.decodeToken(response.accessToken);
    if (!tokenPayload || !tokenPayload.sub) {
      throw new Error('Invalid token payload');
    }
    
    // Lấy thông tin người dùng để lấy role
    const userInfo = await lastValueFrom(this.usersService.findOneUser({ id: tokenPayload.sub }));
    if (!userInfo) {
      throw new Error('User not found');
    }

    // Trả về response kèm theo role
    return {
      ...response,
      role: userInfo.role
    };
  }

  refreshToken(
    refreshTokenDto: Auth.RefreshTokenDto,
  ): Promise<Auth.LoginResponse> {
    return lastValueFrom(this.usersService.refreshToken(refreshTokenDto)).then(
      (response) => {
        if (!response) {
          throw new Error('Refresh token response is undefined');
        }
        return response;
      },
    );
  }

  private decodeToken(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch (error) {
      return null;
    }
  }
}
