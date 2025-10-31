import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SignUpUseCase } from '../../application/use-cases/auth/sign-up.use-case.js';
import { SignInUseCase } from '../../application/use-cases/auth/sign-in.use-case.js';
import { SignUpInputDto, SignInInputDto } from '../../domain/dtos/auth.dto.js';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
        private readonly signInUseCase: SignInUseCase,
    ) { }

    @Mutation()
    async signUp(@Args('input') input: SignUpInputDto) {
        return this.signUpUseCase.execute(input);
    }

    @Mutation()
    async signIn(@Args('input') input: SignInInputDto) {
        return this.signInUseCase.execute(input);
    }
}

