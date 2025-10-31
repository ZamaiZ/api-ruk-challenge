import { Module } from '@nestjs/common';
import { AuthResolver } from '../../presentation/graphql/auth.resolver.js';
import { SignUpUseCase } from '../../application/use-cases/auth/sign-up.use-case.js';
import { SignInUseCase } from '../../application/use-cases/auth/sign-in.use-case.js';
import { UserRepository } from '../../infrastructure/persistence/user.repository.js';
import { PrismaService } from '../../infrastructure/persistence/prisma.service.js';
import { HashService } from '../../infrastructure/security/hash.service.js';
import { JwtService } from '../../infrastructure/security/jwt.service.js';
import { USER_REPOSITORY } from '../../application/ports/user-repository.port.js';

@Module({
  providers: [
    AuthResolver,
    SignUpUseCase,
    SignInUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    PrismaService,
    HashService,
    JwtService,
  ],
  exports: [SignUpUseCase, SignInUseCase],
})
export class AuthModule { }
