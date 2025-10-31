import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from './jwt.service.js';
import { AuthException } from '../../shared/exceptions/auth.exception.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw AuthException.unauthorized();
        }

        const token = authHeader.substring(7);
        const payload = await this.jwtService.verify(token);

        if (!payload) {
            throw AuthException.invalidToken();
        }

        req.user = payload;
        return true;
    }
}

