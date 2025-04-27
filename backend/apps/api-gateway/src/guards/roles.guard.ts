import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Nếu route không yêu cầu quyền cụ thể, cho phép truy cập
    if (!requiredRoles) {
      return true;
    }
    
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);
    this.logger.debug(`User from request: ${JSON.stringify(user)}`);
    
    // Nếu không có thông tin người dùng trong request, thử lấy từ token
    if (!user) {
      this.logger.debug('No user in request, attempting to extract from token');
      const token = this.extractTokenFromHeader(req);
      if (!token) {
        this.logger.debug('No token found in request');
        return false;
      }
      
      try {
        const payload = this.jwtService.verify(token);
        req.user = { 
          userId: payload.sub,
          role: payload.role 
        };
        this.logger.debug(`User extracted from token: ${JSON.stringify(req.user)}`);
      } catch (error) {
        this.logger.error(`JWT verification error: ${error.message}`);
        return false;
      }
    }
    
    // Kiểm tra xem người dùng có quyền yêu cầu không
    const hasRole = requiredRoles.some((role) => req.user?.role === role);
    this.logger.debug(`User has required role: ${hasRole}`);
    return hasRole;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;
    
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}