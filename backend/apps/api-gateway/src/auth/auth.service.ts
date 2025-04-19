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

  login(loginDto: Auth.LoginDto): Promise<Auth.LoginResponse> {
    return lastValueFrom(this.usersService.login(loginDto)).then((response) => {
      if (!response) {
        throw new Error('Login response is undefined');
      }
      return response;
    });
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
}
