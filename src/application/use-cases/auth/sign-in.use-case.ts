import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../ports/user-repository.port.js';
import { HashService } from '../../../infrastructure/security/hash.service.js';
import { JwtService } from '../../../infrastructure/security/jwt.service.js';
import { AuthException } from '../../../shared/exceptions/auth.exception.js';
import { SignInInputDto, SignInResponseDto } from '../../../domain/dtos/auth.dto.js';
import { signInSchema } from '../../../presentation/dtos/auth-input.dto.js';

@Injectable()
export class SignInUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly hashService: HashService,
        private readonly jwtService: JwtService,
    ) { }

    async execute(input: SignInInputDto): Promise<SignInResponseDto> {
        const validated = signInSchema.parse(input);

        const user = await this.userRepository.findByEmail(validated.email);

        if (!user) {
            throw AuthException.invalidCredentials();
        }

        const isValidPassword = await this.hashService.verify(user.passwordHash, validated.password);

        if (!isValidPassword) {
            throw AuthException.invalidCredentials();
        }

        const token = await this.jwtService.sign({
            id: user.id,
            email: user.email,
        });

        return { token };
    }
}

