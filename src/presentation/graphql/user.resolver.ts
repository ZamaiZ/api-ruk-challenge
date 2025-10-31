import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GetUserUseCase } from '../../application/use-cases/user/get-user.use-case.js';
import { ListUsersUseCase } from '../../application/use-cases/user/list-users.use-case.js';
import { JwtAuthGuard } from '../../infrastructure/security/jwt-auth.guard.js';
import { JwtPayloadDto } from '../../domain/dtos/user.dto.js';

@Resolver()
export class UserResolver {
    constructor(
        private readonly getUserUseCase: GetUserUseCase,
        private readonly listUsersUseCase: ListUsersUseCase,
    ) { }

    @Query()
    @UseGuards(JwtAuthGuard)
    async getUser(@Context() context: { req: { user: JwtPayloadDto } }) {
        const userId = context.req.user.id;
        return this.getUserUseCase.execute(userId);
    }

    @Query()
    @UseGuards(JwtAuthGuard)
    async listUsers(
        @Args('page', { nullable: true }) page?: number,
        @Args('pageSize', { nullable: true }) pageSize?: number,
        @Args('search', { nullable: true }) search?: string,
    ) {
        return this.listUsersUseCase.execute(page, pageSize, search);
    }
}

