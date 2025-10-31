import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../ports/user-repository.port.js';
import { HashService } from '../../../infrastructure/security/hash.service.js';
import { AuthException } from '../../../shared/exceptions/auth.exception.js';
import { SignUpInputDto, SignUpResponseDto } from '../../../domain/dtos/auth.dto.js';
import { signUpSchema } from '../../../presentation/dtos/auth-input.dto.js';

@Injectable()
export class SignUpUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
        private readonly hashService: HashService,
    ) { }

    async execute(input: SignUpInputDto): Promise<SignUpResponseDto> {
        const validated = signUpSchema.parse(input);

        const existingUser = await this.userRepository.findByEmail(validated.email);

        if (existingUser) {
            throw AuthException.emailAlreadyExists();
        }

        const passwordHash = await this.hashService.hash(validated.password);

        const user = await this.userRepository.create({
            name: validated.name,
            email: validated.email,
            passwordHash,
            telephones: validated.telephones.map((tel) => ({
                number: tel.number,
                areaCode: tel.area_code,
            })),
        });

        return {
            id: user.id,
            created_at: user.createdAt.toISOString(),
            modified_at: user.updatedAt.toISOString(),
        };
    }
}

