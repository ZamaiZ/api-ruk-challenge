import { Module } from '@nestjs/common';
import { UserResolver } from '../../presentation/graphql/user.resolver.js';
import { GetUserUseCase } from '../../application/use-cases/user/get-user.use-case.js';
import { ListUsersUseCase } from '../../application/use-cases/user/list-users.use-case.js';
import { UserRepository } from '../../infrastructure/persistence/user.repository.js';
import { PrismaService } from '../../infrastructure/persistence/prisma.service.js';
import { JwtService } from '../../infrastructure/security/jwt.service.js';
import { JwtAuthGuard } from '../../infrastructure/security/jwt-auth.guard.js';
import { USER_REPOSITORY } from '../../application/ports/user-repository.port.js';

@Module({
  providers: [
    UserResolver,
    GetUserUseCase,
    ListUsersUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    PrismaService,
    JwtService,
    JwtAuthGuard,
  ],
  exports: [GetUserUseCase, ListUsersUseCase],
})
export class UserModule { }
