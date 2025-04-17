import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from '@app/commonn';

@Controller()
@Auth.AuthServiceControllerMethods()
export class AuthController implements Auth.AuthServiceController {
  constructor(private readonly usersService: AuthService) {}

  createUser(createUserDto: Auth.CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  findAllUsers(paginationDto: Auth.PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  findOneUser(findOneUserDto: Auth.FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto.id);
  }

  updateUser(updateUserDto: Auth.UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  removeUser(findOneUserDto: Auth.FindOneUserDto) {
    return this.usersService.remove(findOneUserDto.id);
  }

  login(loginDto: Auth.LoginDto): Promise<Auth.LoginResponse> {
    return this.usersService.login(loginDto);
  }

  refreshToken(
    refreshTokenDto: Auth.RefreshTokenDto,
  ): Promise<Auth.LoginResponse> {
    return this.usersService.refreshToken(refreshTokenDto);
  }
}
